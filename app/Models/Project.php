<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
        'leader_id',
        'created_by'
    ];

    protected $with = ['leader', 'members', 'createdBy'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get all tasks for this project
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the project leader (Project Manager)
     */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    /**
     * Get the user who created this project
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all team members assigned to this project (Many-to-Many)
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members', 'project_id', 'user_id')
                    ->withTimestamps();
    }

    /**
     * Get the team member assigned to this project (backward compatibility)
     * @deprecated Use members() relationship instead
     */
    public function member(): BelongsTo
    {
        // Untuk backward compatibility, return first member
        $firstMember = $this->members()->first();
        return $firstMember ? $this->belongsTo(User::class, 'id')->where('id', $firstMember->id) : $this->belongsTo(User::class, 'id')->whereNull('id');
    }

    /**
     * Scope for filtering projects by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering projects by leader
     */
    public function scopeByLeader($query, $leaderId)
    {
        return $query->where('leader_id', $leaderId);
    }

    /**
     * Scope for filtering projects by member
     */
    public function scopeByMember($query, $memberId)
    {
        return $query->whereHas('members', function ($q) use ($memberId) {
            $q->where('user_id', $memberId);
        });
    }

    /**
     * Scope for filtering projects where user is involved (leader, member, or creator)
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('leader_id', $userId)
              ->orWhere('created_by', $userId)
              ->orWhereHas('members', function ($memberQuery) use ($userId) {
                  $memberQuery->where('user_id', $userId);
              });
        });
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'Planning' => 'blue',
            'In Progress' => 'yellow',
            'Completed' => 'green',
            'On Hold' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get members count
     */
    public function getMembersCountAttribute()
    {
        return $this->members()->count();
    }

    /**
     * Get members names as string
     */
    public function getMembersNamesAttribute()
    {
        return $this->members->pluck('name')->join(', ');
    }


    public function isProjectManager($user): bool
    {
        return $this->members()
            ->where('user_id', $user->id)
            ->where('project_members.role', 'Project Manager')
            ->exists() || $this->leader_id === $user->id;
    }

    public function isTeamMember($user): bool
    {
        return $this->members()
            ->where('user_id', $user->id)
            ->exists() || $this->leader_id === $user->id;
    }
}
