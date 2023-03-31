<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'employeeId' => $this -> employee_id,
            'username' => $this -> username,
            'email' => $this -> email,
            'firstName' => $this -> first_name,
            'middleInitial' => $this -> middle_initial,
            'lastName' => $this -> last_name,
            'postNominal' => $this -> post_nominal,
            'employmentStatus' => $this -> employment_status,
            'department' => $this -> department,
            'designation' => $this -> designation,
            'userLevel' => $this -> user_level,
        ];
    }
}
