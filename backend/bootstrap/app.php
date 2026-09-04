<?php

use App\Exceptions\InvoiceGeneratorException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        $middleware->api(prepend: [
            HandleCors::class,
        ]);

        // This app is API-only — there is no "login" web route to redirect
        // unauthenticated guests to. Without this, Laravel's default
        // Authenticate middleware calls route('login') eagerly and throws
        // RouteNotFoundException (a 500) instead of a clean 401 whenever a
        // request doesn't explicitly send Accept: application/json.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (InvoiceGeneratorException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => $e->getMessage()], 502);
            }
        });

        // This app is API-only — there is no web login route to redirect to,
        // so an unauthenticated request must always get a JSON 401, even
        // when the client didn't send an Accept: application/json header.
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
        });
    })->create();
