<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);

        // ponytail: trust only private-network proxies; '*' let clients spoof
        // X-Forwarded-For and bypass IP rate limits. Add CDN ranges here if
        // the site ever goes behind Cloudflare.
        $middleware->trustProxies(at: [
            '127.0.0.1',
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Consistent JSON error response
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                return response()->json([
                    // Never leak internal messages (DB details etc.) for server errors
                    'message' => $status >= 500 ? 'Terjadi kesalahan pada server.' : $e->getMessage(),
                    'errors' => $status < 500 && method_exists($e, 'errors') ? $e->errors() : null,
                ], $status);
            }
        });
    })
    ->create();

// Rate limiter: public forms (login, register, payment)
RateLimiter::for('forms', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});

// Rate limiter: general API
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
