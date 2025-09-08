<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:'. User::ROLE_MANAGER)->group(function () {
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('trash', [UserController::class, 'showDeleted'])->name('trash.index');
            Route::delete('bulk-destroy', [UserController::class, 'bulkDestroy'])->name('bulk.destroy');
            Route::post('{id}/restore', [UserController::class, 'restore'])->name('restore');
            Route::delete('force-delete', [UserController::class, 'forceDelete'])->name('force-delete');
        });

        Route::resource('users', UserController::class)->except(['show']);

        Route::prefix('product')->name('product.')->group(function () {
            Route::get('/trash', [ProductController::class, 'showDeleted'])->name('trash.index');
            Route::delete('/bulk-destroy', [ProductController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::post('/{id}/restore', [ProductController::class, 'restore'])->name('restore');
            Route::delete('force-delete', [ProductController::class, 'forceDelete'])->name('force-delete');
        });

        Route::resource('product', ProductController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';