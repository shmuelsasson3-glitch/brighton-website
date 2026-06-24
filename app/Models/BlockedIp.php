<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockedIp extends Model
{
    protected $fillable = ['ip', 'reason', 'blocked_until'];

    protected $casts = ['blocked_until' => 'datetime'];

    public function isActive(): bool
    {
        return $this->blocked_until === null || $this->blocked_until->isFuture();
    }
}
