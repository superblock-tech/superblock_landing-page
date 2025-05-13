<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\CryptoNetworkController;
use App\Http\Controllers\API\TransactionsController;
use App\Http\Controllers\API\WalletController;
use App\Http\Controllers\API\WhitelistController;
use Illuminate\Support\Facades\Route;

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

Route::post('login', [AuthController::class, 'login']);
Route::post('contact', [ContactController::class, 'store']);
Route::get('whitelist', [WhitelistController::class, 'index']);
Route::get('crypto/prices', [CryptoNetworkController::class, 'index']);

Route::middleware(['check.token'])->group(function () {
    Route::get('transactions', [TransactionsController::class, 'index']);
    Route::post('wallet', [WalletController::class, 'update']);
});
