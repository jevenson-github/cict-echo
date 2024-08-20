<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partner;
use App\Models\Program;
use App\Models\Members;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

use Illuminate\Support\Facades\DB;
use Dompdf\Dompdf;
use PDF;


class ProgramController extends Controller
{
    public function createProgram(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'partner' => 'required',
        ]);

        $partner = Partner::find($request->input('partner'));

        if (!$partner) {
            return response()->json(['message' => 'Partner not found'], 404);
        }

        // Remove articles in the company name
        $companyName = preg_replace('/\b(a|an|and|the|of|in)\b/i', '', $partner->name);
        $companyInitials = '';
        foreach (explode(' ', $companyName) as $word) {
            $companyInitials .= strtoupper(substr($word, 0, 1));
        }
        $currentYear = date('y');
        $randomString = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 10);
        $id = substr("CICT-EXT-PROGRAM-{$currentYear}{$companyInitials}{$randomString}", 0, 27);

        // Create folder for partner programs
        $partnerFolderPath = storage_path('app/public/partners/' . $request->input('partner') . '/programs/' . $id);
        if (!File::exists($partnerFolderPath)) {
            File::makeDirectory($partnerFolderPath, 0755, true);
        }

        // Create subfolders
        $certificateFolderPath = $partnerFolderPath . '/certificate';
        $attendanceFolderPath = $partnerFolderPath . '/attendance';
        $invitationFolderPath = $partnerFolderPath . '/invitation';

        if (!File::exists($certificateFolderPath)) {
            File::makeDirectory($certificateFolderPath, 0755, true);
        }

        if (!File::exists($attendanceFolderPath)) {
            File::makeDirectory($attendanceFolderPath, 0755, true);
        }

        if (!File::exists($invitationFolderPath)) {
            File::makeDirectory($invitationFolderPath, 0755, true);
        }

        $program = new Program();
        $program->id = $id;
        $program->title = $request->input('title');
        $program->start_date = $request->input('start_date');
        $program->end_date = $request->input('end_date');
        $program->location = $request->input('location');
        $program->details = $request->input('details');
        $program->lead = $request->input('lead');
        $program->partner = $request->input('partner');
        $program->participants = $request->input('participants');
        $program->flow = $request->input('flow');
        $program->additional_details = $request->input('additional_details');
        $program->status = 'draft';

        $program->save();

        return response()->json(['message' => 'Program created successfully'], 201);
    }

    public function updateProgram(Request $request, $id)
    {
        $program = Program::find($id);

        if (!$program) {
            return response()->json(['message' => 'Program not found', '' => $id], 404);
        }

        $program->title = $request->input('title', $program->title);
        $program->initiative = $request->input('initiative', $program->initiative);
        $program->start_date = $request->input('start_date', $program->start_date);
        $program->end_date = $request->input('end_date', $program->end_date);
        $program->location = $request->input('location', $program->location);
        $program->details = $request->input('details', $program->details);
        $program->lead = $request->input('lead', $program->lead);
        $program->partner = $request->input('partner', $program->partner);
        $program->participants = $request->input('participants', $program->participants);
        $program->flow = $request->input('flow', $program->flow);
        $program->additional_details = $request->input('additional_details', $program->additional_details);

        $program->save();

        return response()->json(['message' => 'Program updated successfully'], 200);
    }

    //     public function updateProgram(Request $request, $id)
    // {
    //     $program = Program::find($id);

    //     if (!$program) {
    //         return response()->json(['message' => 'Program not found', '' => $id], 404);
    //     }

    //     $program->title = $request->input('title', $program->title);
    //     $program->initiative = $request->input('initiative', $program->initiative);
    //     $program->start_date = $request->input('start_date', $program->start_date);
    //     $program->end_date = $request->input('end_date', $program->end_date);
    //     $program->location = $request->input('location', $program->location);
    //     $program->details = $request->input('details', $program->details);
    //     $program->lead = $request->input('lead', $program->lead);
    //     $program->partner = $request->input('partner', $program->partner);
    //     $program->participants = $request->input('participants', $program->participants);
    //     $program->flow = $request->input('flow', $program->flow);
    //     $program->additional_details = $request->input('additional_details', $program->additional_details);

    //     $program->save();

    //     // Delete previously selected members for the given program
    //     Members::where('program', $program->id)->delete();

    //     // Insert newly selected members
    //     $members = $request->input('members', []);
    //     foreach ($members as $member) {
    //         $newMember = new Members();
    //         $newMember->program = $program->id;
    //         $newMember->faculty = $member['id'];
    //         $newMember->role = $member['role'];
    //         $newMember->save();
    //     }

    //     return response()->json(['message' => 'Program updated successfully'], 200);
    // }


    public function addMemberRoleProgram(Request $request)
    {
        //INSERT VALUE TO MEMBERS TABLE
        $members = new Members();
        $members->program = $request->input('program');
        $members->faculty =  $request->input('members');
        $members->role =  $request->input('role');
        $members->save();

        return response()->json(['message' => 'Member added updated successfully'], 200);
    }

    public function postProgram($id)
    {
        $program = Program::find($id);

        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        // Check if the program is in draft status
        if ($program->status == 'draft') {

            // Check if start and end dates are set
            if (!$program->start_date || !$program->end_date) {
                return response()->json(['message' => 'Program start and end dates are not set'], 422);
            }

            // Update the status based on the current date
            $currentDate = date('Y-m-d');

            if ($program->start_date > $currentDate) {
                $program->status = 'upcoming';
            } elseif ($program->end_date < $currentDate) {
                $program->status = 'completed';
            } else {
                $program->status = 'ongoing';
            }

            $program->save();

            return response()->json(['message' => 'Program status updated']);
        }

        return response()->json(['message' => 'Program is not in draft status'], 422);
    }

    public function deleteProgram($id)
    {
        $program = Program::find($id);

        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        // Check if the program is in draft status
        if ($program->status == 'draft') {
                
            // Delete program folder
            $programFolderPath = storage_path('app/public/partners/' . $program->partner . '/programs/' . $id);
            if (File::exists($programFolderPath)) {
                File::deleteDirectory($programFolderPath);
            }
            $program->delete();

            return response()->json(['message' => 'Program deleted successfully']);
        }

        return response()->json(['message' => 'Program is not in draft status'], 422);
    }

    public function completeProgram(Request $request, $id)
    {
        $program = Program::find($id);

        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        if ($program->status !== 'ongoing' && $program->status !== 'ended') {
            return response()->json(['message' => 'Program must be ongoing or ended to be completed.'], 422);
        }

        // Check if files are present in request
        if (!$request->hasFile('certificate_file') || !$request->hasFile('attendance_file') || !$request->hasFile('invitation_file')) {
            return response()->json(['error' => 'Certificate, attendance, and invitation files are required'], 200);
        }

        // Create folder for program files
        $programFolderPath = storage_path('app/public/partners/' . $program->partner . '/programs/' . $id);

        // Upload certificate file if present
        if ($request->hasFile('certificate_file')) {
            $certificateFile = $request->file('certificate_file');
            $certificateFileName = date('ymdHis') . ' - Certificate.' . $certificateFile->getClientOriginalExtension();
            $certificateFilePath = $programFolderPath . '/certificate/';
            $certificateFile->move($certificateFilePath, $certificateFileName);
        }

        // Upload attendance file if present
        if ($request->hasFile('attendance_file')) {
            $attendanceFile = $request->file('attendance_file');
            $attendanceFileName = date('ymdHis') . ' - Attendance.' . $attendanceFile->getClientOriginalExtension();
            $attendanceFilePath = $programFolderPath . '/attendance/';
            $attendanceFile->move($attendanceFilePath, $attendanceFileName);
        }

        // Upload invitation file if present
        if ($request->hasFile('invitation_file')) {
            $invitationFile = $request->file('invitation_file');
            $invitationFileName = date('ymdHis') . ' - Invitation.' . $invitationFile->getClientOriginalExtension();
            $invitationFilePath = $programFolderPath . '/invitation/';
            $invitationFile->move($invitationFilePath, $invitationFileName);
        }

        $program->status = 'completed';
        $program->attendance = $attendanceFileName;
        $program->certificate = $certificateFileName;
        $program->invitation = $invitationFileName;
        $program->save();

        return response()->json(['message' => 'Program completed successfully.']);
    }

    public function indexProgram()
    {
        // $programs = Program::with(['programLead', 'partner'])
        //     ->orderByDesc('created_at')
        //     ->get();
        $programs = DB::table('programs')
            ->join('users', 'users.id', '=', 'programs.lead')
            ->join('partners', 'partners.id', '=', 'programs.partner')
            ->select('programs.*', 'users.id as user_id', 'users.first_name', 'users.last_name', 'users.designation', 'users.department', 'partners.id as partner', 'partners.name', 'partners.email')
            ->get();

        return response()->json($programs, 200);
    }

    public function getProgram($id)
    {

        $programs = DB::table('programs')
            ->join('users as leads', 'leads.id', '=', 'programs.lead')
            ->join('partners', 'partners.id', '=', 'programs.partner')
            ->select('programs.*', 'leads.first_name as lead_first_name', 'leads.last_name as lead_last_name', 'partners.name')
            ->where('programs.id', '=', $id)
            ->get();

        $members = DB::table('members')
            ->join('programs', 'programs.id', '=', 'members.program')
            ->join('users as members_users', 'members_users.id', '=', 'members.faculty')
            ->select('members_users.first_name as member_first_name', 'members_users.last_name as member_last_name', 'members.role as member_role', 'members_users.id as member_id')
            ->where('members.program', '=', $id)
            ->get();


        $response['programs'] = $programs;
        $response['members'] = $members;

        if (!$programs) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        return response()->json($response, 200);
    }

    public function displayTitleProgram(Request $request, $id)
    {
        $programs = DB::table('programs')
            ->join('users as leads', 'leads.id', '=', 'programs.lead')
            ->join('partners', 'partners.id', '=', 'programs.partner')
            // ->join('members', 'members.program', '=', 'programs.id')
            // ->join('users as members_users', 'members_users.id', '=', 'members.faculty')
            ->select('programs.*', 'leads.first_name as lead_first_name', 'leads.last_name as lead_last_name', 'partners.name')
            ->where('programs.id', '=', $id)
            // ->groupBy('members.program')
            ->get();

        $members = DB::table('members')
            ->join('programs', 'programs.id', '=', 'members.program')
            ->join('users as members_users', 'members_users.id', '=', 'members.faculty')
            ->select('members_users.first_name as member_first_name', 'members_users.last_name as member_last_name', 'members.role as member_role')
            ->where('members.program', '=', $id)
            ->get();


        $response['programs'] = $programs;
        $response['members'] = $members;

        return response()->json($response, 200);
    }

    public function displayProgram(Request $request, $id)
    {
        $programs = DB::table('programs')
            ->join('users as leads', 'leads.id', '=', 'programs.lead')
            ->join('partners', 'partners.id', '=', 'programs.partner')
            ->join('members', 'members.program', '=', 'programs.id')
            ->join('users as members_users', 'members_users.id', '=', 'members.faculty')
            ->select('programs.*', 'leads.first_name as lead_first_name', 'leads.last_name as lead_last_name', 'partners.name', 'partners.id as partner')
            ->where(function ($query) use ($id) {
                $query->where('programs.lead', '=', $id)
                    ->orWhere('members.faculty', '=', $id);
            })
            ->where('programs.status', '!=', 'draft')
            ->distinct()
            ->get();




        $response['programs'] = $programs;

        return response()->json($response, 200);
    }

    public function getExpiringPartners()
    {
        $endDate = Carbon::now()->addDays(30)->format('Y-m-d');

        $partners = Partner::whereDate('end_date', '<=', $endDate)
            ->select('id', 'name', 'end_date')
            ->get();

        return response()->json($partners);
    }

    public function getProgramsBySchoolYear(Request $schoolYear)
    {
        $startDate = $schoolYear . '-08-01';
        $endDate = date('Y-m-d', strtotime($schoolYear . '-07-31 +1 year'));

        $programs = Program::where(function ($query) use ($startDate, $endDate) {
            $query->whereBetween('start_date', [$startDate, $endDate])
                ->orWhereBetween('end_date', [$startDate, $endDate])
                ->orWhere(function ($query) use ($startDate, $endDate) {
                    $query->where('start_date', '<', $startDate)
                        ->where('end_date', '>', $endDate);
                });
        })->whereIn('status', ['ended', 'completed'])->get();

        $data = [
            'programs' => $programs,
            'schoolYear' => $schoolYear
        ];

        $pdf = PDF::loadView('reports.annual_accomplishment', $data);

        return $pdf->stream();
    }
}
