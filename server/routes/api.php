<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PartnerController;



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
    Route::post('/reset-password', 'App\Http\Controllers\UserController@resetPassword');
    Route::post('/validate-email', 'App\Http\Controllers\UserController@validateEmail');
    Route::post('/validate-id', 'App\Http\Controllers\UserController@validateId');
});

// User routes for user management
Route::prefix('user')->group(function () {
    Route::post('/verify/{id}', 'App\Http\Controllers\UserController@verifyUser');
    Route::delete('/reject/{id}', 'App\Http\Controllers\UserController@rejectUser');
    Route::post('/update-info/{id}', 'App\Http\Controllers\UserController@updateInfo');
    Route::post('/update-email/{id}', 'App\Http\Controllers\UserController@updateEmailAddress');
    Route::post('/update-password/{id}', 'App\Http\Controllers\UserController@updatePassword');
    Route::post('/update-position/{id}', 'App\Http\Controllers\UserController@updatePosition');
    Route::post('/make-admin/{id}', 'App\Http\Controllers\UserController@makeAdmin');
    Route::post('/make-faculty/{id}', 'App\Http\Controllers\UserController@makeFaculty');
    Route::get('/get-user/{id}', 'App\Http\Controllers\UserController@getUser');
    Route::get('/index-user', 'App\Http\Controllers\UserController@indexUser');
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
});

// Program routes for program management
Route::prefix('program')->group(function () {
    Route::post('/create', 'App\Http\Controllers\ProgramController@createProgram');
    Route::post('/update/{id}', 'App\Http\Controllers\ProgramController@updateProgram');
    Route::post('/post/{id}', 'App\Http\Controllers\ProgramController@postProgram');
    Route::delete('/delete/{id}', 'App\Http\Controllers\ProgramController@deleteProgram');
    Route::post('/complete/{id}', 'App\Http\Controllers\ProgramController@completeProgram');
    Route::get('/get-program/{id}', 'App\Http\Controllers\ProgramController@getProgram');
    Route::get('/index-program', 'App\Http\Controllers\ProgramController@indexProgram');
});

Route::get('/get-files', 'App\Http\Controllers\PartnerController@fileData');
