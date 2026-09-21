<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'category_id',
        'party',
        'photo',
        'gender',
        'student_id',
        'course',
        'year_level',
        'is_active',
        'votes_count',
    ];

    protected $appends = ['name'];

    public function getNameAttribute()
    {
        $parts = array_filter([$this->first_name ?? '', $this->middle_name ?? '', $this->last_name ?? '']);
        return trim(implode(' ', $parts));
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
