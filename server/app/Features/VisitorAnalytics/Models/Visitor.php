<?php

namespace App\Features\VisitorAnalytics\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'visitor_key',
        'visit_date',
        'country',
        'city',
        'browser_name',
        'last_seen_at',
        'analytics_consent',
        'location_consent',
        'browser_consent',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'last_seen_at' => 'datetime',
        'analytics_consent' => 'boolean',
        'location_consent' => 'boolean',
        'browser_consent' => 'boolean',
    ];
}
