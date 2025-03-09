<?php

use App\Http\Controllers\PresaleTransactionsController;
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
    Route::get('code_logins/export', [CodeForLoginController::class, 'export'])->name('code_logins.export');
    Route::post('code_logins/import', [CodeForLoginController::class, 'import'])->name('code_logins.import');


    Route::get('/wallet', [WalletController::class, 'index'])->name('walletAddress');
    Route::post('/wallet', [WalletController::class, 'store'])->name('wallets.store');
    Route::delete('wallets/{wallet}', [WalletController::class, 'destroy'])->name('wallets.destroy');
    Route::get('wallets/export', [WalletController::class, 'export'])->name('wallets.export');
    Route::post('wallets/import', [WalletController::class, 'import'])->name('wallets.import');

    Route::get('/contactForm', [ContactFormController::class, 'index'])->name('contactForm');
    Route::get('/joinUs', [ContactFormController::class, 'joinUs'])->name('joinUs');
    Route::get('contactForm/export', [ContactFormController::class, 'export'])->name('contacts.export');
    Route::post('contactForm/import', [ContactFormController::class, 'import'])->name('contacts.import');


    Route::delete('contacts/{contact}', [ContactFormController::class, 'destroy'])->name('contacts.destroy');
    Route::get('/logout', [UserController::class, 'logout'])->name('logout');

    Route::get('/cryptos', [CryptoController::class, 'index'])->name('cryptos');
    Route::put('/cryptos/{id}', [CryptoController::class, 'update'])->name('cryptos.update');

    Route::get('/whitelist', [\App\Http\Controllers\WhitelistController::class, 'index'])->name('whitelist');
    Route::put('/whitelist/{id}', [\App\Http\Controllers\WhitelistController::class, 'update'])->name('whitelist.update');

    Route::resource('presale-transactions', PresaleTransactionsController::class)
        ->except('show', 'edit')
        ->name('index', 'presale_transactions.list')
        ->name('store', 'presale_transactions.store')
        ->name('destroy', 'presale_transactions.delete');

    Route::get('presale-transactions/export', [PresaleTransactionsController::class, 'export'])->name('presale_transactions.export');
    Route::post('presale-transactions/import', [PresaleTransactionsController::class, 'import'])->name('presale_transactions.import');
    Route::post('presale-transactions/{id}/confirm', [PresaleTransactionsController::class, 'confirm'])->name('presale_transactions.confirm');

});
