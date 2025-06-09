<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get statistics based on user role
        $stats = $this->getDashboardStats($user);
        
        // Debug logging
        Log::info('Dashboard Stats:', $stats);
        
        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
    
    private function getDashboardStats($user)
    {
        $stats = [];
        
        try {
            if ($user->isAdmin()) {
                // Admin can see all statistics
                $totalTasks = Task::count();
                $completedTasks = Task::where('status', 'done')->count();
                
                $stats = [
                    'totalProjects' => Project::count(),
                    'totalTasks' => $totalTasks,
                    'totalUsers' => User::count(),
                    'completedTasks' => $completedTasks,
                    'projects' => $this->getProjectsWithProgress()
                ];
            } elseif ($user->isProjectManager()) {
                // Project Manager can see projects they lead
                $projectsAsLeader = Project::where('leader_id', $user->id)->pluck('id');
                $totalTasks = Task::whereIn('project_id', $projectsAsLeader)->count();
                $completedTasks = Task::whereIn('project_id', $projectsAsLeader)
                                     ->where('status', 'done')
                                     ->count();
                
                $stats = [
                    'totalProjects' => Project::where('leader_id', $user->id)->count(),
                    'totalTasks' => $totalTasks,
                    'totalUsers' => User::count(),
                    'completedTasks' => $completedTasks,
                    'projects' => $this->getProjectsWithProgress($user->id, 'leader')
                ];
           } else {
            // Team Member dapat melihat proyek yang mereka terlibat
            $projectIds = Project::where(function($query) use ($user) {
                $query->whereHas('members', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                })
                ->orWhereHas('tasks', function($q) use ($user) {
                    $q->where('assigned_to', $user->id);
                });
            })->pluck('id');

            $totalTasks = Task::whereIn('project_id', $projectIds)
                             ->orWhere('assigned_to', $user->id)
                             ->count();
                             
            $completedTasks = Task::whereIn('project_id', $projectIds)
                                 ->orWhere('assigned_to', $user->id)
                                 ->where('status', 'done')
                                 ->count();
            
            $stats = [
                'totalProjects' => $projectIds->count(),
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'totalUsers' => User::count(),
                'projects' => $this->getProjectsWithProgress($user->id, 'member')
            ];
        }
        
        Log::info('Stats calculated successfully', $stats);
        
    } catch (\Exception $e) {
        Log::error('Error calculating dashboard stats: ' . $e->getMessage());
        $stats = [
            'totalProjects' => 0,
            'totalTasks' => 0,
            'completedTasks' => 0,
            'totalUsers' => 0,
            'projects' => collect([])
        ];
    }
    
    return $stats;
}

    
private function getProjectsWithProgress($userId = null, $role = null)
    {
        try {
            $query = Project::with(['leader', 'tasks']);
            
                
            if ($userId && $role === 'leader') {
                $query->where('leader_id', $userId);
            } elseif ($userId && $role === 'member') {
                $query->where(function($q) use ($userId) {
                    $q->whereHas('members', function($subQ) use ($userId) {
                        $subQ->where('user_id', $userId);
                    })
                    ->orWhereHas('tasks', function($subQ) use ($userId) {
                        $subQ->where('assigned_to', $userId);
                    });
                });
            }   
            
            $projects = $query->get();
        
        return $projects->map(function ($project) {
            // Perbaikan cara menghitung tasks dan progress
            $totalTasks = $project->tasks->count();
            $completedTasks = $project->tasks->filter(function($task) {
                return $task->status === 'Done' || $task->status === 'done';
            })->count();
            
            // Hitung progress
            $progress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;
            
            return [
                'id' => $project->id,
                'name' => $project->name,
                'status' => $project->status,
                'progress' => $progress,
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'leader' => [
                    'name' => $project->leader->name ?? 'Unassigned'
                ]
            ];
        });
        
    } catch (\Exception $e) {
        Log::error('Error getting projects with progress: ' . $e->getMessage());
        return collect([]);
    }
}

}