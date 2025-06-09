<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'assigned_to',
        'due_date',
        'completed_at',
        'completed_by'
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    // Relasi ke Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Relasi ke User yang ditugaskan
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Relasi ke User yang menyelesaikan task
    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    // Relasi ke comments
    public function comments()
    {
        return $this->hasMany(TaskComment::class);
    }

    // Method untuk check apakah user bisa update status
    public function canUpdateStatus($user)
    {
        // Project manager atau user yang ditugaskan bisa update status
        return $this->project->isProjectManager($user) ||
               ($this->assigned_to && $this->assigned_to == $user->id);
    }
}
