<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/dashboard', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth'])->group(function () {
    // 1. Home / Dashboard
    Route::get('/', function () {
        return Inertia::render('Home');
    });
    Route::get('/dashboard', function () {
        return Inertia::render('Home');
    });

    // 2. Unidades
    Route::get('/unidades', function () {
        // La ruta al componente en tu carpeta Pages/
        return Inertia::render('Catalogos/Unidades');
    });

    // 3. Usuarios
    Route::get('/usuarios', function () {
        return Inertia::render('Catalogos/Usuarios');
    });

    // 4. Registro y Salida (Unificado)
    Route::get('/registrosalida', function () {
        return Inertia::render('Catalogos/RegistroYSalidaUnificado');
    });

    // Tienes que hacer esto para CADA una de las 15 rutas que listaste:
    Route::get('/motivos', function () {
        return Inertia::render('Catalogos/Motivos');
    });

    Route::get('/reportes', function () {
        return Inertia::render('Catalogos/Reportes');
    });
    // ... y así sucesivamente para /destino, /reportes, /menus, etc.
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
