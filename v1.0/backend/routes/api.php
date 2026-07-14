<?php

use App\Http\Controllers\Api\V1\ContactMessageController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\HomeController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class);
    Route::get('/home', HomeController::class);
    Route::post('/contact-messages', [ContactMessageController::class, 'store']);
});

