<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;



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

Route::post('/sign-up', 'App\Http\Controllers\UserController@signUp');
Route::post('/sign-in', 'App\Http\Controllers\UserController@signIn');

Route::put('/update-user/{id}', 'App\Http\Controllers\UserController@updateUser');

