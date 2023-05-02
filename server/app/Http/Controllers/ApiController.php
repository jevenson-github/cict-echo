<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\User;
use App\Models\Partner;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function getChartData()
    {
        // Retrieve the required data from your models
        $activeExtensionsCount = Program::where('status', 'active')->count();
        $upcomingExtensionsCount = Program::where('status', 'upcoming')->count();

        $facultyWithProjectsCount = User::whereHas('projects')->count();
        $verifiedFacultyCount = User::where('status', 'verified')->count();

        $activePartnersCount = Partner::where('status', 'active')->count();
        $upcomingPartnersCount = Partner::where('status', 'upcoming')->count();

        // Create an associative array with the data
        $chartData = [
            'extensions' => [
                'active' => $activeExtensionsCount,
                'upcoming' => $upcomingExtensionsCount,
            ],
            'faculty' => [
                'projects' => $facultyWithProjectsCount,
                'verified' => $verifiedFacultyCount,
            ],
            'partners' => [
                'active' => $activePartnersCount,
                'upcoming' => $upcomingPartnersCount,
            ],
        ];

        return response()->json($chartData);
    }
}
