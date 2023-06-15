<?php

namespace App\Http\Controllers;

use App\Mail\UserVerified;
use App\Mail\UserRejected;
use App\Mail\PasswordUpdated;
use App\Mail\EmailAddressUpdated;
use App\Mail\PositionUpdated;
use App\Mail\MakeAdmin;
use App\Mail\MakeFaculty;
use App\Mail\MakeSuccessor;
use App\Mail\sendResetPasswordLink;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Program;
use App\Models\Partner;
use App\Models\Members;
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
use Dompdf\Dompdf;
use PDF;


class UserController extends Controller
{

    public function signUp(Request $request)
    {
        // Create user
        $user = new User();
        $user->id = $request['id'];
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->email = $request['email'];
        $user->password = bcrypt($request['password']);
        $user->department = $request['department'];
        $user->designation = $request['designation'];
        $user->user_level = 'faculty';
        $user->status = 'pending';

        if ($request->hasFile('profilePicture')) {
            $file = $request->file('profilePicture');
            $fileName = $request['id'] . '.webp';
            $file->move('users', $fileName);
        }

        if ($request->hasFile('idCard')) {
            $file = $request->file('idCard');
            $fileName = $request['id'] . '.webp';
            $file->move('verification', $fileName);
        }

        $user->save();

        return response()->json([
            'message' => 'User created successfully',
            'hi' => $request['id']
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

    public function rejectUser(Request $request, $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            // Return an error response indicating that the user was not found
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Get the reason for rejecting the user from the request
        $reason = $request->input('reason');

        // Send an email to the user notifying them that their account has been rejected
        Mail::to($user->email_address)->send(new UserRejected($user, $request->reason));

        // Delete the user
        $user->delete();



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

    public function updateInfo(Request $request, $id)
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
            $fileName = $user->id . '.webp'; // Set filename to ID.webp
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
            $response['status'] = $user->status;
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
        $user = User::select('id', 'first_name', 'last_name', 'email', 'department', 'designation', 'user_level', 'status')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }

    public function getSuccessor()
    {
        $users = DB::table('users')->where('user_level', '=', "successor")->get();


        foreach ($users as $user) {
            $user->full_name = $user->first_name . ' ' . $user->last_name;
        }

        $sorted_users = $users->sortBy('full_name')->values()->all();


        return response()->json($sorted_users, 200);
    }

    public function makeSuccessor($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->user_level = 'successor';
        $user->save();

        return response()->json(['message' => 'User has been added as a successor.']);
    }

    public function removeSuccessor()
    {
        $users = User::where('user_level', 'successor')->get();

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found with user_level = "successor"'], 404);
        }

        foreach ($users as $user) {
            $user->user_level = 'faculty';
            $user->save();
        }

        return response()->json(['message' => 'Users have been removed as successors and set as faculty.']);
    }

    public function indexUser() ///
    {
        $users = User::all(['id', 'first_name', 'last_name', 'email', 'department', 'designation', 'profile_image', 'user_level', 'status']);
        return response()->json($users, 200);
    }

    public function getAllVerifiedUser()
    {
        $users = DB::table('users')->where('status', '=', "verified")->get();

        foreach ($users as $user) {
            $user->full_name = $user->first_name . ' ' . $user->last_name;
        }

        $sorted_users = $users->sortBy('full_name')->values()->all();

        return response()->json($sorted_users, 200);
    }


    public function getAllPendingUser()
    {
        $users = DB::table('users')->where('status', '=', "pending")->get();

        foreach ($users as $user) {
            $user->full_name = $user->first_name . ' ' . $user->last_name;
        }

        $sorted_users = $users->sortBy('full_name')->values()->all();

        return response()->json($sorted_users, 200);
    }


    public function getAllResignedUser()
    {
        $users = DB::table('users')->where('status', '=', "deactivated")->get();

        foreach ($users as $user) {
            $user->full_name = $user->first_name . ' ' . $user->last_name;
        }

        $sorted_users = $users->sortBy('full_name')->values()->all();

        return response()->json($sorted_users, 200);
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


    public function credentialCheck(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|unique:users',
            'email' => 'required|email|unique:users'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'email' => $validator->errors()->has('email') ? 'existing' : 'unique',
                'id' => $validator->errors()->has('id') ? 'existing' : 'unique',
            ]);
        }

        // If the validation passes, return a response with no additional data
        return response()->json();
    }

    public function verifyPassword(Request $request)
    {
        $id = $request->input('id');
        $password = $request->input('password');

        // Retrieve the user from the database based on the provided ID
        $user = User::find($id);

        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Verify the password
        if (Hash::check($password, $user->password)) {
            $response['response'] = 'correct';
            return response()->json($response);
        } else {
            $response['response'] = 'incorrect';
            return response()->json($response);
        }
    }

    public function acceptTransfer()
    {
        // Find the current admin
        $currentAdmin = User::where('user_level', 'admin')->first();

        // Find the successor
        $successor = User::where('user_level', 'successor')->first();

        if (!$currentAdmin || !$successor) {
            return response()->json(['message' => 'Current admin or successor not found'], 404);
        }

        // Update user levels
        $currentAdmin->user_level = 'faculty';
        $successor->user_level = 'admin';

        // Save the changes
        $currentAdmin->save();
        $successor->save();

        return response()->json(['message' => 'Transfer of admin and successor completed successfully']);
    }

    public function rejectTransfer()
    {
        // Find the current admin
        $currentAdmin = User::where('user_level', 'admin')->first();

        // Find the successor
        $successor = User::where('user_level', 'successor')->first();

        if (!$currentAdmin || !$successor) {
            return response()->json(['message' => 'Current admin or successor not found'], 404);
        }

        // Update user levels
        $currentAdmin->user_level = 'admin';
        $successor->user_level = 'faculty';

        // Save the changes
        $currentAdmin->save();
        $successor->save();

        return response()->json(['message' => 'Transfer of admin and successor completed successfully']);
    }
}
