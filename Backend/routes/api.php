<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\PresaleTransactionsController;
use App\Http\Controllers\WhitelistController;
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
Route::get('getWhitelistContent', [WhitelistController::class, 'getWhitelistContent']);
Route::get('getPriceForCrypto', [CryptoController::class, 'getPriceForCrypto']);

Route::middleware(['check.token'])->group(function () {
    Route::get('wallet', [WalletController::class, 'getWallets']);
    Route::get('transactions/{wallet}', [PresaleTransactionsController::class, 'findByAddress']);
    Route::post('transactions', [PresaleTransactionsController::class, 'storeLocalTransaction']);
});
