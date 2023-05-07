<?php

namespace App\Http\Controllers;

use App\Mail\UserVerified;
use App\Mail\UserRejected;
use App\Mail\PasswordUpdated;
use App\Mail\EmailAddressUpdated;
use App\Mail\PositionUpdated;
use App\Mail\MakeAdmin;
use App\Mail\MakeFaculty;
use App\Mail\sendResetPasswordLink;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Contracts\Mail\Mailable;

class UserController extends Controller
{

    public function signUp(Request $request)
    {
        try {
            // Validate input
            $validatedData = $request->validate([
                'id' => 'required|integer|unique:users,id',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'email' => 'required|string|unique:users,email',
                'password' => 'required|string',
                'department' => 'required|string',
                'designation' => 'required|string',
                'profile_image' => 'image',
                'user_level' => 'required|in:admin,faculty',
                'status' => 'required|in:verified,pending,rejected,deactivated',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => $e->validator->errors(),
                'message' => 'Validation failed',
            ], 422);
        }

        // Create user
        $user = new User();
        $user->id = $validatedData['id'];
        $user->first_name = $validatedData['first_name'];
        $user->last_name = $validatedData['last_name'];
        $user->email = $validatedData['email'];
        $user->password = bcrypt($validatedData['password']);
        $user->department = $validatedData['department'];
        $user->designation = $validatedData['designation'];
        $user->user_level = $validatedData['user_level'];
        $user->status = $validatedData['status'];
        $user->profile_image = 'default.webp'; // Default profile image

        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $fileName = $user->id . '.webp';
            $file->move('users', $fileName);
            $user->profile_image = $fileName;
        }

        $user->save();

        return response()->json([
            'message' => 'User created successfully',
        ], 201);
    }

    public function verifyUser(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Update the user's status to "verified"
        $user->status = 'verified';
        $user->save();

        // Send a verification email to the user
        Mail::to($user->email)->send(new UserVerified($user));

        // Return a response indicating success
        return response()->json(['message' => 'User has been verified.']);
    }

    public function deactivateUser(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Update the user's status to "verified"
        $user->status = 'deactivated';
        $user->user_level = 'faculty';
        $user->save();

        // Send a verification email to the user
        Mail::to($user->email)->send(new UserVerified($user));

        // Return a response indicating success
        return response()->json(['message' => 'User has been deactivated.']);
    }

    public function rejectUser(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Update the user's status to "verified"
        $user->status = 'rejected';
        $user->save();

        // Return a response indicating success
        return response()->json(['message' => 'User has been rejected and email has been sent.']);
    }

    public function pendingUser(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Update the user's status to "verified"
        $user->status = 'pending';
        $user->save();

        // Return a response indicating success
        return response()->json(['message' => 'User has been rependingjected and email has been sent.']);
    }

    public function deleteUser(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Delete the user's entry
        $user->delete();

        // Return a response indicating success
        return response()->json(['message' => 'User has been deleted and email has been sent.']);
    }

    public function updateInfo(Request $request, $id) // ///
    {

        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
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

        // Update profile picture if it's provided
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');

            //$originalName = $file->getClientOriginalName();
            $fileName = $user->id . '.webp'; // Set filename to ID.webp

            // // Convert and save image
            // $image = Image::make($file);
            // $image->encode(
            //     'webp',
            //     100
            // );
            $file->move('users', $fileName);
        }

        // Save the updated user information
        $result = $user->save();

        // Check if the update query affected any rows
        if (!$result) {
            // Return an error response indicating that the update failed
            return response()->json(['error' => 'Failed to update user information.'], 500);
        }

        // Return a response indicating success
        return response()->json(['message' => 'User information has been updated.']);
    }

    public function updateEmailAddress(Request $request, $id) // ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Validate the new email address
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        if ($validator->fails()) {
            // Return an error response indicating that the new email address is invalid
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        // Update the email address
        $user->email = $request->email;

        // Save the updated user information
        $result = $user->save();

        // Check if the update query affected any rows
        if (!$result) {
            // Return an error response indicating that the update failed
            return response()->json(['error' => 'Failed to update email address.'], 500);
        }

        // Send the email if the email address is valid
        if (filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
            Mail::to($user->email)->send(new EmailAddressUpdated($user));
        }

        // Return a response indicating success
        return response()->json(['message' => 'Email address has been updated.']);
    }

    public function updatePassword(Request $request, $id) // ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            // Return a validation error response
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Update the user's password
        $user->password = bcrypt($request->password);

        // Save the updated user information
        $result = $user->save();

        if (!$result) {
            // Return an error response indicating that the update failed
            return response()->json(['error' => 'Failed to update password.'], 500);
        }

        // Send an email notification to the user
        Mail::to($user->email)->send(new PasswordUpdated($user));

        // Return a response indicating success
        return response()->json(['message' => 'Password has been updated and email sent.']);
    }

    public function updatePosition(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Get the current position
        $currentPosition = $user->designation . ', ' . $user->department;

        // Update designation if it's provided
        if ($request->has('designation')) {
            $user->designation = $request->designation;
        }

        // Update department if it's provided
        if ($request->has('department')) {
            $user->department = $request->department;
        }

        // Get the new position
        $newPosition = $user->designation . ', ' . $user->department;

        // If the position has not changed, return a response indicating success
        if ($currentPosition === $newPosition) {
            return response()->json(['message' => 'User position has not changed.']);
        }

        // Save the updated user information
        $result = $user->save();

        // Check if the update query affected any rows
        if (!$result) {
            // Return an error response indicating that the update failed
            return response()->json(['error' => 'Failed to update user position.'], 500);
        }

        // Send email notification
        Mail::to($user->email)->send(new PositionUpdated($user, $newPosition));

        // Return a response indicating success
        return response()->json(['message' => 'User position has been updated.']);
    }

    public function makeAdmin(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Check if user is a faculty
        if ($user->user_level != 'faculty') {
            // Return an error response indicating that the user is not a faculty
            return response()->json(['error' => 'User is not a faculty.'], 403);
        }

        // Add the admin user level to the user
        $user->user_level = 'admin';

        // Save the updated user information
        $result = $user->save();

        // Check if the update query affected any rows
        if (!$result) {
            // Return an error response indicating that the update failed
            return response()->json(['error' => 'Failed to update user information.'], 500);
        }

        // Send an email to the user notifying them of the change
        Mail::to($user->email)->send(new MakeAdmin($user));

        // Return a response indicating success
        return response()->json(['message' => 'User has been added as an admin.']);
    }

    public function makeFaculty(Request $request, $id) ///
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Check if user is currently an admin
        if ($user->user_level !== 'admin') {
            // Return an error response indicating that the user is not an admin
            return response()->json(['error' => 'User is not an admin.'], 200);
        }

        // Remove admin privileges from the user
        $user->user_level = 'faculty';

        // Save the updated user information
        $result = $user->save();

        // Check if the update query affected any rows
        if (!$result) {
            // Return an error response indicating that the update failed
            return response()->json(['error' => 'Failed to remove admin privileges.'], 500);
        }

        // Send email notification to the user
        Mail::to($user->email)->send(new MakeFaculty($user));

        // Return a response indicating success
        return response()->json(['message' => 'Admin privileges have been removed.']);
    }

    public function signIn(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                $response['status'] = 'invalid';
                return response()->json($response);
            }
        } catch (JWTException $e) {
            $response['status'] = 'invalid';
            return response()->json($response);
        }

        $user = auth()->user();

        if ($user->status === 'deactivated' || $user->status === 'pending') {
            $response['status'] = $user -> status;
            return response()->json($response);
        }

        $token = JWTAuth::claims([
            'id' => $user->id,
            'emailAddress' => $user->email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'department' => $user->department,
            'designation' => $user->designation,
        ])->attempt($credentials);

        $response['data'] = $token;
        $response['status'] = 'verified';
        $response['role'] = $user->user_level;

        return response()->json($response);
    }

    public function getUser($id) ///
    {
        $user = User::select('id', 'first_name', 'last_name', 'email', 'department', 'designation', 'profile_image', 'user_level', 'status')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['user' => $user], 200);
    }

    public function indexUser() ///
    {
        $users = User::all(['id', 'first_name', 'last_name', 'email', 'department', 'designation', 'profile_image', 'user_level', 'status']);
        return response()->json($users, 200);
    }

    public function getAllVerifiedUser()
    {
        $users = DB::table('users')->where('status', '=', "verified")->get();
        return response()->json($users, 200);
    }

    public function getAllPendingUser()
    {
        $users = DB::table('users')->where('status', '=', "pending")->get();
        return response()->json($users, 200);
    }

    public function getAllResignedUser()
    {
        $users = DB::table('users')->where('status', '=', "deactivated")->get();
        return response()->json($users, 200);
    }

    public function getAllRejectedUser()
    {
        $users = DB::table('users')->where('status', '=', "rejected")->get();
        return response()->json($users, 200);
    }

    public function getAllAdmins()
    {
        $users = DB::table('users')->where('user_level', '=', "admin")->get();
        return response()->json($users, 200);
    }

    public function getAllFaculty()
    {
        $users = DB::table('users')->where('user_level', '=', "faculty",)->where('status', '=', "verified",)->get();
        return response()->json($users, 200);
    }



    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            $response['status'] = 'Error';
            // $response['message'] = 'Email address not found.';
            return response()->json($response);
            // return response()->json(['error' => 'Email address not found.'], 404);
        } else {

            $data = [
                'email' => $request->email
            ];
            Mail::to($request->email)->send(new sendResetPasswordLink($data));

            $response['status'] = 'Successful';
            $response['message'] = 'Password reset email sent.';
            return response()->json($response);
        }

        // Generate a password reset token
        // $token = Password::createToken($user);

        // Send email with password reset link
        // Mail::send('emails.passwordReset', ['token' => $token], function ($message) use ($user) {
        //     $message->to($user->email)->subject('Password Reset Request');
        // });


        // return response()->json(['message' => 'Password reset email sent.']);

    }

    public function resetPassword(Request $request, $email)
    {
        // Find the user by ID
        // $user = User::find($email);
        $user = User::where('email', '=', $email)->first();

        if (!$user) {
            // Return an error response indicating that the user was not found
            // return response()->json(['error' => 'User not found.'], 404);
            $response['status'] = 'Error';
            $response['message'] = 'User not found';
            return response()->json($response);
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            // Return a validation error response
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Update the user's password
        $user->password = bcrypt($request->password);

        // Save the updated user information
        $result = $user->save();

        if (!$result) {
            // Return an error response indicating that the update failed
            // return response()->json(['error' => 'Failed to update password.'], 500);
            $response['status'] = 'Error';
            $response['message'] = 'Failed to update password';
            return response()->json($response);
        }

        // Send an email notification to the user
        Mail::to($user->email)->send(new PasswordUpdated($user));

        // Return a response indicating success
        // return response()->json(['message' => 'Password has been updated and email sent.']);
        $response['status'] = 'Successful';
        $response['message'] = 'Password has been updated';
        return response()->json($response);
    }
}
