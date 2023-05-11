<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\Program;
use App\Models\User;

use Carbon\Carbon;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function statsCount()
    {
        $verifiedUsersCount = User::where('status', 'verified')->count();

        $activePartnersCount = Partner::where('status', 'active')->count();

        $totalProgramsCount = Program::whereNotIn('status', ['draft', 'prospect', 'archived'])->count();


        return response()->json([
            'verified_users_count' => $verifiedUsersCount,
            'active_partners_count' => $activePartnersCount,
            'total_programs_count' => $totalProgramsCount,
        ]);
    }

    public function getProgramChartData()
    {
        $today = Carbon::today();
        $start_date = $today->copy()->subMonths(11);
        $end_date = $today->copy()->endOfMonth();
    
        $programs = Program::selectRaw('YEAR(start_date) as start_year, MONTH(start_date) as start_month, YEAR(end_date) as end_year, MONTH(end_date) as end_month, count(*) as total')
                        ->where('status', '!=', 'draft')
                        ->where(function($query) use ($start_date, $end_date) {
                            $query->whereBetween('start_date', [$start_date, $end_date])
                                  ->orWhereBetween('end_date', [$start_date, $end_date]);
                        })
                        ->groupBy('start_year', 'start_month', 'end_year', 'end_month')
                        ->get();
    
        $data = [];
        $labels = [];
    
        for ($i = 11; $i >= 0; $i--) {
            $date = $today->copy()->subMonths($i);
            $month = $date->month;
            $year = $date->year;
            $label = $date->format('M Y');
            $labels[] = $label;
            $completed_count = 0;
            $upcoming_count = 0;
            $ongoing_count = 0;
            foreach ($programs as $program) {
                if ($program->start_month == $month && $program->start_year == $year) {
                    // Program is upcoming
                    $upcoming_count += $program->total;
                } else if ($program->end_month == $month && $program->end_year == $year) {
                    $end_date = Carbon::createFromDate($program->end_year, $program->end_month)->endOfMonth();
                    if ($end_date->isPast()) {
                        // Program is completed
                        $completed_count += $program->total;
                    } else {
                        // Program is ongoing
                        $ongoing_count += $program->total;
                    }
                }
            }
            $data[] = [$upcoming_count, $ongoing_count, $completed_count];
        }
    
        return response()->json(['data' => $data, 'labels' => $labels]);
    }

    function getPartnersEndingSoon() {
        $today = date('Y-m-d');
        $thirtyDaysFromNow = date('Y-m-d', strtotime('+30 days'));
    
        $partners = DB::table('partners')
            ->whereBetween('end_date', [$today, $thirtyDaysFromNow])
            ->orderBy('end_date')
            ->get();
    
        return $partners;
    }
    
    
    
}
