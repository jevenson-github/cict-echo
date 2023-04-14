<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;



class UserController extends Controller
{

    public function signUp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|unique:users,id',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email_address' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:8|max:255',
            'department' => 'nullable|string|max:50',
            'designation' => 'nullable|string|max:50',
            'profile_image' => 'nullable|string|max:255',
            'user_level' => 'nullable|in:admin,faculty',
            'status' => 'nullable|in:verified,pending,resigned'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = new User;
        $user->id = $request->id;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email_address = $request->email_address;
        $user->password = Hash::make($request->password);
        $user->department = null;
        $user->designation = null;
        $user->profile_image = null;
        $user->user_level = 'faculty';
        $user->status = 'pending';
        $user->save();

        return response()->json([
            'message' => 'User created successfully'
        ], 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update first name if it's provided
        if ($request->has('first_name')) {
            $user->first_name = $request->first_name;
        }

        // Update last name if it's provided
        if ($request->has('last_name')) {
            $user->last_name = $request->last_name;
        }

        // Update department if it's provided
        if ($request->has('department')) {
            $user->department = $request->department;
        }

        // Update designation if it's provided
        if ($request->has('designation')) {
            $user->designation = $request->designation;
        }

        // Update profile image if it's provided
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('public/profile-images');
            $user->profile_image = str_replace('public/', '', $path);
        }

        // Update status if it's provided
        if ($request->has('status')) {
            $user->status = $request->status;
        }

        $user->save();

        return response()->json(['message' => 'User updated successfully']);
    }


    public function signIn(Request $request)
    {
        $credentials = $request->only('email_address', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        $user = auth()->user();
        $token = JWTAuth::claims([
            'id' => $user->id,
            'emailAddress' => $user->email_address,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'department' => $user->department,
            'designation' => $user->designation,
            'profileImage' => $user->profile_image,
            'userLevel' => $user->user_level,
            'status' => $user->status,
        ])->attempt($credentials);

        $response['data'] = [
            'token' => $token,
        ];

        return response()->json($response);
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
