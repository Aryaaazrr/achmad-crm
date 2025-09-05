<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::delete('/users/bulk-destroy', [UserController::class, 'bulkDestroy'])
    ->name('users.bulk-destroy');
    Route::resource('users', UserController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';