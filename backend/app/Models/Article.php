<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'url',
        'author',
        'published_at',
        'tags',
        'summary',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'tags' => 'array',
    ];
}
