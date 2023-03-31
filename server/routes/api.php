<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\FacultyController;

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

Route::get('/faculty', [App\Http\Controllers\FacultyController::class, 'index']);
Route::post('/faculty', [App\Http\Controllers\FacultyController::class, 'store']);
Route::get('/faculty/{id}', [App\Http\Controllers\FacultyController::class, 'show']);
Route::put('/faculty/{id}', [App\Http\Controllers\FacultyController::class, 'update']);
Route::delete('/faculty/{id}', [App\Http\Controllers\FacultyController::class, 'destroy']);
