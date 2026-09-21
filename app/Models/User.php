<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'password',
        'is_super_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_super_admin' => 'boolean',
        'password' => 'hashed',
    ];

    /**
     * Build the full name from the user profile pieces.
     */
    public function getFullNameAttribute(): string
    {
        return trim(implode(' ', array_filter([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
        ], fn ($value) => ! empty($value))));
    }

    /**
     * Return the legacy full-name value when the single name column is not explicitly set.
     */
    public function getNameAttribute($value): string
    {
        return $value ?: $this->getFullNameAttribute();
    }

    /**
     * Keep the stored name in sync when a new user is created or updated.
     */
    public function setNameAttribute($value): void
    {
        $this->attributes['name'] = $value ?: $this->getFullNameAttribute();
    }
}
