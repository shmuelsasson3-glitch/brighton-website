<?php

use App\Http\Controllers\ContactSubmissionController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'pages.home')->name('home');
Route::view('/residential', 'pages.residential')->name('residential');
Route::get('/commercial', [PageController::class, 'commercial'])->name('commercial');
Route::view('/commercial-installs', 'pages.commercial-installs')->name('commercial-installs');
Route::view('/sitework', 'pages.sitework')->name('sitework');
Route::view('/snow', 'pages.snow')->name('snow');

Route::get('/work', [ProjectController::class, 'index'])->name('work.index');
Route::get('/work/{project:slug}', [ProjectController::class, 'show'])->name('work.show');

Route::post('/contact', [ContactSubmissionController::class, 'store'])->name('contact.store');

$legacyRedirects = [
    'index.html' => '/',
    'residential.html' => '/residential',
    'commercial.html' => '/commercial',
    'commercial-installs.html' => '/commercial-installs',
    'sitework.html' => '/sitework',
    'snow.html' => '/snow',
    'work.html' => '/work',
    'arlington-project.html' => '/work/arlington',
    'baker-project.html' => '/work/baker',
    'bates-road.html' => '/work/bates-road',
    'beige-project.html' => '/work/beige',
    'corner-project.html' => '/work/corner',
    'pool-patio.html' => '/work/pool-patio',
    'scotchway-project.html' => '/work/scotchway',
    'sukkah-project.html' => '/work/sukkah',
    'toras-aron-project.html' => '/work/toras-aron',
    'vanard-project.html' => '/work/vanard',
];

foreach ($legacyRedirects as $old => $new) {
    Route::permanentRedirect($old, $new);
}
