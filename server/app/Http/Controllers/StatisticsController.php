<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function getCounts()
    {
        $countActiveExtensions = DB::table('programs')
            ->where('status', 'ongoing')
            ->count();

        $countUpcomingExtensions = DB::table('programs')
            ->where('status', 'upcoming')
            ->count();

        $countFacultyWithProjects = DB::table('users')
            ->join('members', 'users.id', '=', 'members.faculty_id')
            ->join('programs', 'members.program_id', '=', 'programs.id')
            ->where('programs.status', '!=', 'draft')
            ->count();

        $countVerifiedFaculty = DB::table('users')
            ->where('status', 'verified')
            ->count();

        $countActivePartners = DB::table('partners')
            ->where('status', 'active')
            ->count();

        $countUpcomingPartners = DB::table('partners')
            ->where('status', 'upcoming')
            ->count();

        $counts = [
            'active_extensions' => $countActiveExtensions,
            'upcoming_extensions' => $countUpcomingExtensions,
            'faculty_with_projects' => $countFacultyWithProjects,
            'total_verified_faculty' => $countVerifiedFaculty,
            'active_partners' => $countActivePartners,
            'upcoming_partners' => $countUpcomingPartners
        ];


        return response()->json($counts);
    }

    public function statisticData(){ 

        $users = DB::table('users') ->select('users.first_name', 'users.last_name' , )->where('status', '=', 'verified')->get();

       
        $response['users'] = $users;

        return response()->json($response,200);

    }
}
