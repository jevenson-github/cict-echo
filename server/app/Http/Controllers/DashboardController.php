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
        $programs = Program::where('status', '!=', 'draft')
            ->orderBy('start_date', 'ASC')
            ->get(['id', 'title', 'status', 'start_date', 'end_date']);

        $upcoming = [];
        $ongoing = [];
        $completed = [];

        foreach ($programs as $program) {
            $start = Carbon::parse($program->start_date);
            $end = Carbon::parse($program->end_date);
            $now = Carbon::now();

            if ($end->lt($now)) {
                $completed[] = $program;
            } else if ($start->gt($now)) {
                $upcoming[] = $program;
            } else {
                $ongoing[] = $program;
            }
        }

        $upcomingData = $this->getProgramData($upcoming, 'Upcoming', 'rgba(255, 99, 132, 1)');
        $ongoingData = $this->getProgramData($ongoing, 'Ongoing', 'rgba(54, 162, 235, 1)');
        $completedData = $this->getProgramData($completed, 'Completed', 'rgba(75, 192, 192, 1)');

        $labels = array_unique(array_merge($upcomingData['labels'], $ongoingData['labels'], $completedData['labels']));

        $datasets = [
            [
                'label' => 'Upcoming',
                'data' => $this->mergeData($labels, $upcomingData['data']),
                'color' => $upcomingData['color'],
            ],
            [
                'label' => 'Ongoing',
                'data' => $this->mergeData($labels, $ongoingData['data']),
                'color' => $ongoingData['color'],
            ],
            [
                'label' => 'Completed',
                'data' => $this->mergeData($labels, $completedData['data']),
                'color' => $completedData['color'],
            ],
        ];

        return ['labels' => $labels, 'datasets' => $datasets];
    }

    private function getProgramData($programs, $label, $color)
    {
        $data = [];

        foreach ($programs as $program) {
            $start = Carbon::parse($program->start_date);
            $end = Carbon::parse($program->end_date);

            $startLabel = $start->format('Y-m-d');
            $endLabel = $end->format('Y-m-d');

            // If start and end dates are the same, only show one label
            if ($startLabel === $endLabel) {
                $label = $startLabel;
            } else {
                $label = "$startLabel - $endLabel";
            }

            $data[$label] = isset($data[$label]) ? $data[$label] + 1 : 1;
        }

        return ['labels' => array_keys($data), 'data' => array_values($data), 'color' => $color];
    }

    private function mergeData($labels, $data)
    {
        $mergedData = [];

        foreach ($labels as $label) {
            $key = array_search($label, $data['labels'], true);

            if ($key !== false) {
                $mergedData[] = $data['data'][$key];
            } else {
                $mergedData[] = 0;
            }
        }

        return $mergedData;
    }
}
