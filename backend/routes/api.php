<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ReferenceDataController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\Settings\CompanyBrandingController;
use App\Http\Controllers\Api\Settings\CompanySettingsController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/customers/search', [CustomerController::class, 'search']);
    Route::get('/customers/{customer}/statement', [CustomerController::class, 'statement']);
    Route::get('/customers/{customer}/statement/pdf', [CustomerController::class, 'statementPdf']);
    Route::apiResource('customers', CustomerController::class);

    Route::post('/invoices/{invoice}/duplicate', [InvoiceController::class, 'duplicate']);
    Route::patch('/invoices/{invoice}/status', [InvoiceController::class, 'updateStatus']);
    Route::post('/invoices/{invoice}/pdf', [InvoiceController::class, 'pdf']);
    Route::post('/invoices/{invoice}/email', [InvoiceController::class, 'sendEmail']);
    Route::get('/invoices/{invoice}/emails', [InvoiceController::class, 'emailHistory']);
    Route::apiResource('invoices', InvoiceController::class);

    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/charts/monthly-income', [DashboardController::class, 'monthlyIncome']);
        Route::get('/charts/monthly-invoices', [DashboardController::class, 'monthlyInvoices']);
        Route::get('/latest-customers', [DashboardController::class, 'latestCustomers']);
        Route::get('/latest-payments', [DashboardController::class, 'latestPayments']);
        Route::get('/top-customers', [DashboardController::class, 'topCustomers']);
        Route::get('/recent-activity', [DashboardController::class, 'recentActivity']);
    });

    Route::get('/currencies', [ReferenceDataController::class, 'currencies']);
    Route::get('/taxes', [ReferenceDataController::class, 'taxes']);
    Route::get('/roles', [ReferenceDataController::class, 'roles']);

    Route::apiResource('users', UserController::class);

    Route::get('/reports/summary', [ReportController::class, 'periodSummary']);
    Route::get('/reports/{type}/export', [ReportController::class, 'export'])
        ->whereIn('type', ['sales', 'vat', 'customers', 'outstanding', 'payments']);
    Route::get('/reports/{type}', [ReportController::class, 'show'])
        ->whereIn('type', ['sales', 'vat', 'customers', 'outstanding', 'payments']);

    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    Route::get('/settings/company', [CompanySettingsController::class, 'show']);
    Route::put('/settings/company', [CompanySettingsController::class, 'update']);
    Route::post('/settings/company/{asset}', [CompanyBrandingController::class, 'upload'])
        ->whereIn('asset', ['logo', 'signature', 'stamp']);
    Route::delete('/settings/company/{asset}', [CompanyBrandingController::class, 'destroy'])
        ->whereIn('asset', ['logo', 'signature', 'stamp']);
});
