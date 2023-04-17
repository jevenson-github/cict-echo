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

class PartnerController extends Controller
{
    public function addPartner(Request $request)
    {
        $partner = new Partner;

        $partner->company_name = $request->input('company_name');
        $partner->description = $request->input('description');
        $partner->address = $request->input('address');
        $partner->contact_person = $request->input('contact_person');
        $partner->contact_number = $request->input('contact_number');
        $partner->email = $request->input('email');

        // Remove articles in the company name
        $companyName = preg_replace('/\b(a|an|and|the|of|in)\b/i', '', $partner->company_name);
        $companyInitials = '';
        foreach (explode(' ', $companyName) as $word) {
            $companyInitials .= strtoupper(substr($word, 0, 1));
        }
        $currentYear = date('y');
        $randomString = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 10);
        $id = substr("CICT-EXT-PARTNER-{$currentYear}{$companyInitials}{$randomString}", 0, 27);

        $partner->id = $id;
        $partner->start_date = $request->input('start_date');
        $partner->end_date = $request->input('end_date');

        // Create folder for partner
        $partnerFolderPath = storage_path('app/public/partners/' . $id);
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
            $logoFileName = 'logo.webp';
            $logoQuality = 100;
            $logoFilePath = $partnerFolderPath . '/' . $logoFileName;
            Image::make($logoFile)
                ->encode('webp', $logoQuality)
                ->save($logoFilePath);
            $partner->logo = $logoFileName;
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
        $partner->company_name = $request->input('company_name') ?? $partner->company_name;
        $partner->description = $request->input('description') ?? $partner->description;
        $partner->address = $request->input('address') ?? $partner->address;
        $partner->contact_person = $request->input('contact_person') ?? $partner->contact_person;
        $partner->contact_number = $request->input('contact_number') ?? $partner->contact_number;
        $partner->email = $request->input('email') ?? $partner->email;


        // Update logo if provided
        if ($request->hasFile('logo')) {
            $logoFile = $request->file('logo');
            $logoFileName = 'logo.webp';
            $logoQuality = 100;
            $logoFilePath = storage_path('app/public/partners/' . $partner->id . '/' . $logoFileName);
            Image::make($logoFile)
                ->encode('webp', $logoQuality)
                ->save($logoFilePath);
            $partner->logo = $logoFileName;
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
            $partnerFolderPath = 'storage/partners/' . $id;
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

        $partnerFolderPath = storage_path('app/public/partners/' . $id);

        if (File::exists($partnerFolderPath)) {
            File::deleteDirectory($partnerFolderPath);
        }

        $partner->delete();

        return response()->json(['message' => 'Partner deleted successfully'], 200);
    }

    public function indexPartner()
    {
        $partners = Partner::all();

        return response()->json(['partners' => $partners]);
    }

    public function getPartner($id)
    {
        $partner = Partner::find($id);

        if (!$partner) {
            return response()->json(['message' => 'Partner not found'], 404);
        }

        return response()->json(['partner' => $partner]);
    }
}
