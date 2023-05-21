<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

use App\Models\Members;
use App\Models\Partner;
use App\Models\Program;
use App\Models\User;

use Carbon\Carbon;
use Dompdf\Dompdf;
use PDF;


class ReportController extends Controller
{
    public function reportTerminal($id)
    {

        $program = Program::find($id);

        if (!$program) {
            return response()->json(['message' => 'Program not found.'], 404);
        }

        $lead = User::find($program->lead);

        if (!$lead) {
            return response()->json(['message' => 'Lead not found.'], 404);
        }

        $members = Members::where('program', $id)->get();
        $dean = User::where('designation', 'Dean')
            ->where('status', 'verified')
            ->first();

        if (!$dean) {
            return response()->json(['message' => 'Dean not found.'], 404);
        }

        $facultyInvolved = collect();
        $facultyInvolved->push([
            'name' => $lead->first_name . ' ' . $lead->last_name,
            'role' => 'Lead'
        ]);

        foreach ($members as $member) {
            $faculty = User::find($member->faculty);

            if (!$faculty) {
                return response()->json(['message' => 'Faculty not found.'], 404);
            }

            $facultyInvolved->push([
                'name' => $faculty->first_name . ' ' . $faculty->last_name,
                'role' => $member->role
            ]);
        }

        $data = [
            'title' => $program->title,
            'start_date' => $program->start_date,
            'end_date' => $program->end_date,
            'location' => $program->location,
            'faculty_involved' => $facultyInvolved,
            'participants' => $program->participants,
            'details' => $program->details,
            'flow' => $program->flow,
            'additional_details' => $program->additional_details,
            'dean' => $dean,
        ];

        // Create a new instance of Dompdf
        $dompdf = new Dompdf();

        // Set the options for Dompdf
        $options = $dompdf->getOptions();
        $options->setIsPhpEnabled(true);
        $options->setIsHtml5ParserEnabled(true);
        $options->setIsRemoteEnabled(true);
        $options->setChroot(public_path());

        // Set the HTML content for the PDF using a Blade template
        $html = view('reports.terminal', $data)->render();

        // Load the HTML content into Dompdf
        $dompdf->loadHtml($html);

        // Render the PDF
        $dompdf->render();

        // Output the generated PDF to the browser
        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="mydocument.pdf"');
    }

    public function reportMonthly(Request $request) //json
    {
        $month = $request->input('month');
        $year = $request->input('year');

        $start_date = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $end_date = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        $programs = Program::where('end_date', '>=', $start_date)
            ->where('end_date', '<=', $end_date)
            ->where('status', 'completed')
            ->get(['title', 'initiative', 'start_date', 'end_date']);

        $data = [
            'month' => $month,
            'year' => $year,
            'programs' => $programs
        ];

        $pdf = PDF::loadView('reports.monthly_accomplishment', $data);
        return $pdf->stream();
    }
    
    public function reportPartners(Request $request)
    {
        $status = $request->input('status', 'all');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
    
        $partnersQuery = Partner::orderBy('name');
    
        if ($status !== 'all') {
            $partnersQuery->where('status', $status);
        }
    
        if ($startDate) {
            $partnersQuery->whereDate('start_date', '>=', $startDate);
        }
    
        if ($endDate) {
            $partnersQuery->whereDate('end_date', '<=', $endDate);
        }
    
        $partners = $partnersQuery->get();
        $partnerList = [];
    
        foreach ($partners as $partner) {
            $startDateFormatted = $partner->start_date ? Carbon::parse($partner->start_date)->format('F d, Y') : '';
            $endDateFormatted = $partner->end_date ? Carbon::parse($partner->end_date)->format('F d, Y') : '';
    
            $partnerList[] = [
                'name' => $partner->name,
                'address' => $partner->address ?? '-',
                'contact_person' => $partner->contact_person ?? '-',
                'contact_number' => $partner->contact_number ?? '-',
                'start_date' => $startDateFormatted,
                'end_date' => $endDateFormatted,
                'status' => $partner->status ?? '-',
            ];
        }
    
        $data = [
            'partners' => $partnerList,
            'status' => $status,
        ];


        if ($status === 'all') {
            $pdf = PDF::loadView('reports.unfiltered_partners', $data);
        } else {
            $pdf = PDF::loadView('reports.filtered_partners', $data);
        }
        return $pdf->download('active_partners.pdf');
    }

    public function reportFaculty(Request $request)
    {
        $facultyId = $request->input('facultyId');
        $status = $request->input('status', 'all');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        $user = DB::table('users')->where('id', $facultyId)->first();
    
        $partnersQuery = Partner::orderBy('name');
    
        if ($status !== 'all') {
            $partnersQuery->where('status', $status);
        }
    
        if ($startDate) {
            $partnersQuery->whereDate('start_date', '>=', $startDate);
        }
    
        if ($endDate) {
            $partnersQuery->whereDate('end_date', '<=', $endDate);
        }

        $upcomingPrograms = Program::where('status', 'upcoming')
            ->whereExists(function ($query) use ($facultyId) {
                $query->select(DB::raw(1))
                    ->from('members')
                    ->join('users', 'users.id', '=', 'members.faculty')
                    ->where('members.program', '=', DB::raw('programs.id'))
                    ->where('users.id', '=', $facultyId);
            })
            ->orderBy('start_date')
            ->get(['title', 'partner', 'start_date', 'end_date']);

        $ongoingPrograms = Program::where('status', 'ongoing')
            ->whereExists(function ($query) use ($facultyId) {
                $query->select(DB::raw(1))
                    ->from('members')
                    ->join('users', 'users.id', '=', 'members.faculty')
                    ->where('members.program', '=', DB::raw('programs.id'))
                    ->where('users.id', '=', $facultyId);
            })
            ->orderBy('start_date')
            ->get(['title', 'partner', 'start_date', 'end_date']);

        $completedPrograms = Program::whereIn('status', ['completed', 'ended'])
            ->whereExists(function ($query) use ($facultyId) {
                $query->select(DB::raw(1))
                    ->from('members')
                    ->join('users', 'users.id', '=', 'members.faculty')
                    ->where('members.program', '=', DB::raw('programs.id'))
                    ->where('users.id', '=', $facultyId);
            })
            ->orderBy('start_date')
            ->get(['title', 'partner', 'start_date', 'end_date']);


        $data = [
            'user' => $user,
            'upcomingPrograms' => $upcomingPrograms,
            'ongoingPrograms' => $ongoingPrograms,
            'completedPrograms' => $completedPrograms,
        ];

        $pdf = PDF::loadView('reports.list_per_faculty', $data);
        return $pdf->stream();
    }

    
    
}
