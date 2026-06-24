<?php

namespace App\Http\Middleware;

use App\Models\BlockedIp;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlockSpamIps
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('admin', 'admin/*', 'up')) {
            return $next($request);
        }

        $blocked = BlockedIp::where('ip', $request->ip())
            ->where(fn ($q) => $q->whereNull('blocked_until')->orWhere('blocked_until', '>', now()))
            ->exists();

        if ($blocked) {
            abort(403, 'Access temporarily restricted.');
        }

        return $next($request);
    }
}
