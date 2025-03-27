<?php

use App\Http\Controllers\PresaleTransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\WalletController;

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

Route::post('/login', [UserController::class, 'loginForUser']);
Route::post('/contact', [ContactFormController::class, 'store']);

Route::middleware(['check.token'])->group(function () {
    Route::get('wallet', [WalletController::class, 'getWallets']);
    Route::get('transactions/{wallet}', [PresaleTransactionsController::class, 'findByAddress']);
    Route::get('getWhitelistContent', [\App\Http\Controllers\WhitelistController::class, 'getWhitelistContent']);
    Route::get('getPriceForCrypto', [\App\Http\Controllers\CryptoController::class, 'getPriceForCrypto']);
});
