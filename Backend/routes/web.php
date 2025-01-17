<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CodeForLoginController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\CryptoController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});

Route::get('/', [UserController::class, 'index'])->name('adminLoginIndex');
Route::post('/adminLogin', [UserController::class, 'login'])->name('adminLogin');

Route::middleware(['admin'])->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
    Route::post('/code_logins', [CodeForLoginController::class, 'store'])->name('code_logins.store');
    Route::delete('code_logins/{code}', [CodeForLoginController::class, 'destroy'])->name('destroyCode');


    Route::get('/wallet', [WalletController::class, 'index'])->name('walletAddress');
    Route::post('/wallet', [WalletController::class, 'store'])->name('wallets.store');
    Route::delete('wallets/{wallet}', [WalletController::class, 'destroy'])->name('wallets.destroy');

    Route::get('/contactForm', [ContactFormController::class, 'index'])->name('contactForm');
    Route::get('/joinUs', [ContactFormController::class, 'joinUs'])->name('joinUs');

    Route::delete('contacts/{contact}', [ContactFormController::class, 'destroy'])->name('contacts.destroy');
    Route::get('/logout', [UserController::class, 'logout'])->name('logout');

    Route::get('/cryptos', [CryptoController::class, 'index'])->name('cryptos');
    Route::put('/cryptos/{id}', [CryptoController::class, 'update'])->name('cryptos.update');

    Route::get('/whitelist', [\App\Http\Controllers\WhitelistController::class, 'index'])->name('whitelist');
    Route::put('/whitelist/{id}', [\App\Http\Controllers\WhitelistController::class, 'update'])->name('whitelist.update');
});
