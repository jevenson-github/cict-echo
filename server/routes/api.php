<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Program;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User routes for authentication
Route::prefix('auth')->group(function () {
    Route::post('/sign-up', 'App\Http\Controllers\UserController@signUp');
    Route::post('/sign-in', 'App\Http\Controllers\UserController@signIn');
    Route::post('/send-reset-link', 'App\Http\Controllers\UserController@sendResetLink');
    Route::post('/credential-check', 'App\Http\Controllers\UserController@credentialCheck');

});

// User routes for user management
Route::prefix('user')->group(function () {
    Route::post('/verify/{id}', 'App\Http\Controllers\UserController@verifyUser');
    Route::post('/deactivate/{id}', 'App\Http\Controllers\UserController@deactivateUser');
    Route::post('/reject/{id}', 'App\Http\Controllers\UserController@rejectUser');
    Route::post('/pending/{id}', 'App\Http\Controllers\UserController@pendingUser');
    Route::delete('/delete/{id}', 'App\Http\Controllers\UserController@deleteUser');
    Route::post('/update-info/{id}', 'App\Http\Controllers\UserController@updateInfo');
    Route::post('/update-email/{id}', 'App\Http\Controllers\UserController@updateEmailAddress');
    Route::post('/update-password/{id}', 'App\Http\Controllers\UserController@updatePassword');
    Route::post('/update-position/{id}', 'App\Http\Controllers\UserController@updatePosition');
    Route::post('/make-admin/{id}', 'App\Http\Controllers\UserController@makeAdmin');
    Route::post('/make-faculty/{id}', 'App\Http\Controllers\UserController@makeFaculty');
    Route::get('/get-user/{id}', 'App\Http\Controllers\UserController@getUser');
    Route::get('/index-user', 'App\Http\Controllers\UserController@indexUser');
    Route::get('/verified-user', 'App\Http\Controllers\UserController@getAllVerifiedUser');
    Route::get('/pending-user', 'App\Http\Controllers\UserController@getAllPendingUser');
    Route::get('/deactivated-user', 'App\Http\Controllers\UserController@getAllResignedUser');
    Route::post('/reset-password/{email}', 'App\Http\Controllers\UserController@resetPassword');
    Route::get('/rejected-user', 'App\Http\Controllers\UserController@getAllRejectedUser');
    Route::get('/get-admin', 'App\Http\Controllers\UserController@getAllAdmins');
    Route::get('/get-faculty', 'App\Http\Controllers\UserController@getAllFaculty');

});

// Partner routes for partner management
Route::prefix('partner')->group(function () {
    Route::post('/add', 'App\Http\Controllers\PartnerController@addPartner');
    Route::post('/update-info/{id}', 'App\Http\Controllers\PartnerController@updateInfo');
    Route::post('/issue-moa/{id}', 'App\Http\Controllers\PartnerController@issueMoa');
    Route::post('/terminate/{id}', 'App\Http\Controllers\PartnerController@terminatePartner');
    Route::delete('/delete/{id}', 'App\Http\Controllers\PartnerController@deletePartner');
    Route::get('/get-partner/{id}', 'App\Http\Controllers\PartnerController@getPartner');
    Route::get('/index-partner', 'App\Http\Controllers\PartnerController@indexPartner');
    Route::get('/get-moa-files/{id}', 'App\Http\Controllers\PartnerController@getMoaFiles');
    Route::get('/get-partner-active', 'App\Http\Controllers\PartnerController@activePartner');
    Route::get('/expiring-partners', 'App\Http\Controllers\PartnerController@getExpiringPartners');

});

Route::prefix('dashboard')->group(function () {
    Route::get('/stats-count', 'App\Http\Controllers\DashboardController@statsCount');
    Route::get('/program-chart', 'App\Http\Controllers\DashboardController@getProgramChartData');
    Route::get('/expiring-partners', 'App\Http\Controllers\DashboardController@getPartnersEndingSoon');
});

// Program routes for program management
Route::prefix('program')->group(function () {
    Route::post('/create', 'App\Http\Controllers\ProgramController@createProgram');
    Route::post('/update/{id}', 'App\Http\Controllers\ProgramController@updateProgram');
    Route::post('/post/{id}', 'App\Http\Controllers\ProgramController@postProgram');
    Route::delete('/delete/{id}', 'App\Http\Controllers\ProgramController@deleteProgram');
    Route::post('/complete/{id}', 'App\Http\Controllers\ProgramController@completeProgram');
    Route::get('/get-program/{id}', 'App\Http\Controllers\ProgramController@getProgram');
    Route::get('/display-program/{id}', 'App\Http\Controllers\ProgramController@displayProgram');
    Route::get('/display-program-title/{id}', 'App\Http\Controllers\ProgramController@displayTitleProgram');
    Route::get('/index', 'App\Http\Controllers\ProgramController@indexProgram');    
    Route::post('/add-member-role', 'App\Http\Controllers\ProgramController@addMemberRoleProgram');
});

Route::prefix('report')->group(function () {
   Route::get('/partners', 'App\Http\Controllers\PartnerController@reportPartners');
   Route::post('/accomplishment-monthly', 'App\Http\Controllers\ProgramController@reportMonthlyAccomplishment');
    Route::post('/accomplishment-annual', 'App\Http\Controllers\ProgramController@getProgramsBySchoolYear');
   Route::get('/terminal/{id}', 'App\Http\Controllers\ProgramController@reportTerminal');
   Route::get('/extension-faculty/{id}', 'App\Http\Controllers\UserController@reportExtensionProgramsPerFaculty');

});



