<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\API\AuthController;

Route::get('/', function () {
    return redirect()->route('login');
});

// Route::post('/login', [AuthController::class, 'login'])->name('login');


Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('users');
    Route::post('/', [UserController::class, 'store'])->name('users');
    Route::post('/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy');
});

Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('projects');
    Route::post('/', [ProjectController::class, 'store'])->name('projects');
    Route::post('/{id}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');
});

Route::prefix('tasks')->group(function () {
    Route::get('/', [TaskController::class, 'index'])->name('tasks');
    Route::post('/', [TaskController::class, 'store'])->name('tasks');
    Route::post('/{id}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
