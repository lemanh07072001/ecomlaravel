<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\pages\Page2;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\pages\HomePage;
use App\Http\Controllers\pages\MiscError;
use App\Http\Controllers\authentications\LoginBasic;
use App\Http\Controllers\language\LanguageController;
use App\Http\Controllers\authentications\RegisterBasic;
use \App\Http\Controllers\Admin\PermissionController;

// Main Page Route
Route::prefix('admin')->middleware(['auth'])->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

  // Permission
  Route::get('/permission', [PermissionController::class, 'index'])->name('permission')->middleware('can:Xem danh sách vai trò');
  Route::get('/get-permissions', [PermissionController::class, 'getPermissions'])->name('getPermissions')->middleware('can:Xem danh sách vai trò');
  Route::get('/get_edit-permissions', [PermissionController::class, 'getEditPermissions'])->name('getEditPermissions');
  Route::get('/get-roles', [PermissionController::class, 'getRoles'])->name('getRoles');
  Route::delete('/delete-roles', [PermissionController::class, 'deleteRole'])->name('deleteRole')->middleware('can:Xóa vai trò');
  Route::post('/add-role', [PermissionController::class, 'addRole'])->name('addRole')->middleware('can:Thêm vai trò');
  Route::post('/edit-role', [PermissionController::class, 'editRole'])->name('editRole')->middleware('can:Cập nhật vai trò');
  Route::get('/get-users-list', [PermissionController::class, 'getUserList'])->name('getUserList');
    Route::get('/check-permission', [PermissionController::class, 'checkPermission'])->name('checkPermission');
  Route::post('/update-role-user', [PermissionController::class, 'updateRoleUser'])->name('updateRoleUser')->middleware('can:Phân quyền');
  Route::delete('/remove-role-user', [PermissionController::class, 'removeRoleUser'])->name('removeRoleUser')->middleware('can:Phân quyền');


  Route::get('/', [HomePage::class, 'index'])->name('home')->name('home');
});

Route::get('/page-2', [Page2::class, 'index'])->name('pages-page-2');

// locale
Route::get('/lang/{locale}', [LanguageController::class, 'swap']);
Route::get('/pages/misc-error', [MiscError::class, 'index'])->name('pages-misc-error');

// authentication
Route::get('/auth/register-basic', [RegisterBasic::class, 'index'])->name('auth-register-basic');

Auth::routes();
