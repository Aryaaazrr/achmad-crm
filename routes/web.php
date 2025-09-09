<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadsController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
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

    Route::prefix('leads')->name('leads.')->group(function () {
        Route::middleware('role:' . User::ROLE_SALES)->group(function () {
            Route::get('/create', [LeadsController::class, 'create'])->name('create');
            Route::post('/', [LeadsController::class, 'store'])->name('store');
            Route::delete('/', [LeadsController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::delete('/{id}', [LeadsController::class, 'destroy'])->name('destroy');
        });

        Route::get('/', [LeadsController::class, 'index'])->name('index');
        Route::get('/{id}/edit', [LeadsController::class, 'edit'])->name('edit');
        Route::put('/{id}', [LeadsController::class, 'update'])->name('update');
    });

    Route::prefix('project')->name('project.')->group(function () {
        Route::middleware('role:' . User::ROLE_SALES)->group(function () {
            Route::get('/create', [ProjectController::class, 'create'])->name('create');
            Route::post('/', [ProjectController::class, 'store'])->name('store');
            Route::delete('/', [ProjectController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy');
        });

        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/{id}', [ProjectController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ProjectController::class, 'update'])->name('update');
    });

    Route::resource('customer', CustomerController::class)->only(['index', 'show']);

    Route::get('report', [ReportController::class, 'index'])->name('report.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
