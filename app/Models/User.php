<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'role',
        'password',
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
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Role constants
     */
    const ROLE_ADMIN = 'Admin';
    const ROLE_PROJECT_MANAGER = 'Project Manager';
    const ROLE_TEAM_MEMBER = 'Team Member';

    /**
     * Check if user is Admin
     */
    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is Project Manager
     */
    public function isProjectManager()
    {
        return $this->role === self::ROLE_PROJECT_MANAGER;
    }

    /**
     * Check if user is Team Member
     */
    public function isTeamMember()
    {
        return $this->role === self::ROLE_TEAM_MEMBER;
    }

    /**
     * Get all available roles
     */
    public static function getRoles()
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_PROJECT_MANAGER,
            self::ROLE_TEAM_MEMBER,
        ];
    }


    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
