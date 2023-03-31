<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use App\Http\Resources\FacultyResource;
use App\Http\Resources\FacultyCollection;

class FacultyController extends Controller
{
    public function index()
    {
        return new FacultyCollection(Faculty::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|unique:faculty',
            'password' => 'required',
            'email' => 'required|unique:faculty',
            'first_name' => 'required',
            'last_name' => 'required',
            'employment_status' => 'required',
            'department' => 'required',
        ]);

        $faculty = Faculty::create($validatedData);

        return response()->json([
            'message' => 'Faculty created successfully',
            'faculty' => $faculty
        ], 201);
    }

    public function show($id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        return new FacultyResource($faculty);
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        $validatedData = $request->validate([
            'username' => 'required|unique:faculty,username,' . $id,
            'email' => 'required|unique:faculty,email,' . $id,
            'first_name' => 'required',
            'last_name' => 'required',
            'employment_status' => 'required',
            'department' => 'required',
        ]);

        $faculty->update($validatedData);

        return response()->json([
            'message' => 'Faculty updated successfully',
            'faculty' => $faculty
        ]);
    }

    public function destroy($id)
    {
        $faculty = Faculty::find($id);

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        $faculty->delete();

        return response()->json([
            'message' => 'Faculty deleted successfully'
        ]);
    }
}
