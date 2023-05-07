<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partner;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Mail;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use Illuminate\Support\Facades\DB;

class PartnerController extends Controller
{
    public function addPartner(Request $request)
    {
        $partner = new Partner;

        $partner->name = $request->input('name');
        $partner->description = $request->input('description');
        $partner->address = $request->input('address');
        $partner->contact_person = $request->input('contact_person');
        $partner->contact_number = $request->input('contact_number');
        $partner->email = $request->input('email');

        // Remove articles in the company name
        $companyName = preg_replace('/\b(a|an|and|the|of|in)\b/i', '', $partner->name);
        $companyInitials = '';
        foreach (explode(' ', $companyName) as $word) {
            $companyInitials .= strtoupper(substr($word, 0, 1));
        }
        $currentYear = date('y');
        $randomString = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 10);
        $id = substr("CICT-EXT-PARTNER-{$currentYear}{$companyInitials}{$randomString}", 0, 27);

        $partner->id = $id;

        // Create folder for partner
        $partnerFolderPath = 'partners/' . $id;
        if (!File::exists($partnerFolderPath)) {
            File::makeDirectory($partnerFolderPath, 0755, true);

            // Create moa folder
            $moaFolderPath = $partnerFolderPath . '/moa';
            if (!File::exists($moaFolderPath)) {
                File::makeDirectory($moaFolderPath, 0755, true);
            }

            // Create programs folder
            $programsFolderPath = $partnerFolderPath . '/programs';
            if (!File::exists($programsFolderPath)) {
                File::makeDirectory($programsFolderPath, 0755, true);
            }
        }

        // Upload logo if provided
        if ($request->hasFile('logo')) {
            $logoFile = $request->file('logo');
            $partnerFolderPath = 'partners/' . $id;
            $logoFile->move($partnerFolderPath, 'logo.webp');
        }

        $partner->save();

        // Return JSON response
        return response()->json([
            'message' => 'Partner created successfully',
        ], 201);
    }

    public function updateInfo(Request $request, $id)
    {
        // Find the partner by ID
        $partner = Partner::find($id);

        // If the partner does not exist, return error response
        if (!$partner) {
            return response()->json(['message' => 'Partner not found'], 404);
        }

        // Update partner info
        $partner->name = $request->input('name') ?? $partner->name;
        $partner->description = $request->input('description') ?? $partner->description;
        $partner->address = $request->input('address') ?? $partner->address;
        $partner->contact_person = $request->input('contact_person') ?? $partner->contact_person;
        $partner->contact_number = $request->input('contact_number') ?? $partner->contact_number;
        $partner->email = $request->input('email') ?? $partner->email;

        // Update logo if provided
        if ($request->hasFile('logo')) {
            $logoFile = $request->file('logo');
            $partnerFolderPath = 'partners/' . $id;
            $logoFile->move($partnerFolderPath, 'logo.webp');
        }

        $partner->save();

        // Return success response
        return response()->json([
            'message' => 'Partner information updated successfully',
        ], 200);
    }

    public function issueMoa(Request $request, $id)
    {
        $partner = Partner::find($id);

        if (!$partner) {
            return response()->json(['message' => 'Partner not found'], 404);
        }

        if ($request->hasFile('moa_file') && $request->has('start_date') && $request->has('end_date')) {
            $moaFile = $request->file('moa_file');
            $moaFileId = substr($id, 17);
            $moaStartDate = date('ymd', strtotime($request->input('start_date')));
            $moaEndDate = date('ymd', strtotime($request->input('end_date')));
            $moaFileName = "CICT-EXT-MOA-{$moaFileId}-{$moaStartDate}-{$moaEndDate}.{$moaFile->getClientOriginalExtension()}";
            $partnerFolderPath = 'partners/' . $id;
            $moaFilePath = $partnerFolderPath . '/moa/';
            $moaFile->move($moaFilePath, $moaFileName);
            $partner->moa_file = $moaFileName;

            $today = Carbon::now()->setTime(0, 0, 0);
            $startDate = Carbon::createFromFormat('Y-m-d', $request->input('start_date'))->setTime(0, 0, 0);
            $endDate = Carbon::createFromFormat('Y-m-d', $request->input('end_date'))->setTime(0, 0, 0);

            if ($endDate->lt($today)) {
                $partner->status = 'expired';
            } else if ($startDate->gt($today)) {
                $partner->status = 'upcoming';
            } else if ($endDate->gt($today)) {
                $partner->status = 'active';

                // Notify partner through email
                Mail::send('emails.notify_moaStarted', ['partner' => $partner], function ($message) use ($partner) {
                    $message->to($partner->email)->subject('MOA Start Notification');
                });
            }

            $partner->start_date = $request->input('start_date');
            $partner->end_date = $request->input('end_date');
            $partner->save();

            return response()->json(['message' => 'MOA file uploaded successfully'], 200);
        }

        return response()->json(['message' => 'Invalid request parameters'], 400);
    }

    public function terminatePartner($id)
    {
        $partner = Partner::find($id);

        if ($partner) {
            if ($partner->status == 'active') {
                $partner->status = 'terminated';
                $partner->save();

                // send termination email
                Mail::send('emails.notify_terminatePartner', ['partner' => $partner], function ($message) use ($partner) {
                    $message->to($partner->email)->subject('MOA Termination Notification');
                });

                return response()->json(['message' => 'MOA terminated successfully.']);
            } else {
                return response()->json(['error' => 'MOA can only be terminated if it is active.']);
            }
        } else {
            return response()->json(['error' => 'Partner not found.']);
        }
    }

    public function deletePartner($id)
    {
        $partner = Partner::find($id);

        if (!$partner) {
            return response()->json(['message' => 'Partner not found'], 404);
        }

        if ($partner->status !== 'draft') {
            return response()->json(['message' => 'Partner must be in draft status to be deleted'], 403);
        }

        $partnerFolderPath = 'partners/' . $id;

        if (File::exists($partnerFolderPath)) {
            File::deleteDirectory($partnerFolderPath);
        }

        $partner->delete();

        return response()->json(['message' => 'Partner deleted successfully'], 200);
    }

    public function indexPartner()
    {
        $partners = Partner::all();

        // return response()->json(['partners' => $partners]);

        return response()->json($partners, 200);
    }

    public function getPartner($id)
    {
        $partner = DB::table('partners')
            ->where('id', '=', $id)
            ->first();

        if (!$partner) {
            return response()->json(['message' => 'Partner not found'], 404);
        }

        $programs = DB::table('programs')
            ->join('partners', 'partners.id', '=', 'programs.partner')
            ->select('programs.id', 'programs.title', 'programs.status', 'programs.initiative')
            ->where('partners.id', '=', $id)
            ->get();

        $response['partner']=[$partner];
        $response['programs']=$programs;

        return response()->json($response, 200);
    }


    public function activePartner()
    {
        $partner = DB::table('partners')->where('status', '=', 'active')->get();
        return response()->json($partner, 200);
    }

    public function getMoaFiles(Request $request, $id)
    {
        $baseUrl = $request->getSchemeAndHttpHost();
        $directory = public_path('partners/' . $id . '/moa');
        $files = [];
        $latestMoaFile = null;

        if (file_exists($directory) && is_dir($directory)) {
            $fileNames = scandir($directory);

            foreach ($fileNames as $fileName) {
                if ($fileName !== '.' && $fileName !== '..') {
                    $fileLocation = $baseUrl . '/partners/' . $id . '/moa/' . $fileName;

                    $startDateString = substr($fileName, 24, 6);
                    $endDateString = substr($fileName, 31, 6);

                    $startDate = Carbon::createFromFormat('ymd', $startDateString)->format('F d, Y');
                    $endDate = Carbon::createFromFormat('ymd', $endDateString)->format('F d, Y');

                    $fileData = [
                        'location' => $fileLocation,
                        'name' => $fileName,
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                    ];

                    // Check if the file name matches the moa_file value in the partners table
                    $partner = Partner::find($id);
                    if ($partner && $partner->moa_file === $fileName) {
                        $fileData['latest'] = true;
                        $latestMoaFile = $fileData;
                    } else {
                        $fileData['latest'] = false;
                    }

                    $files[] = $fileData;
                }
            }
        }

        // Sort the files in descending order based on their start_date
        usort($files, function ($a, $b) {
            return strtotime($b['start_date']) - strtotime($a['start_date']);
        });

        // Place the latest MOA file on the first position
        if ($latestMoaFile) {
            $files = array_filter($files, function ($file) use ($latestMoaFile) {
                return $file['name'] !== $latestMoaFile['name'];
            });
            array_unshift($files, $latestMoaFile);
        }

        return response()->json($files);
    }

    public function getExpiringPartners()
    {
        $endDate = Carbon::now()->addDays(30)->format('Y-m-d');

        $partners = Partner::whereDate('end_date', '<=', $endDate)
            ->select('id', 'name', 'end_date')
            ->get();

        return response()->json($partners);
    }
}
