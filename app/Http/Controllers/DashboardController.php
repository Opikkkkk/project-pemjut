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
                // Team Member can see projects they're assigned to
                $projectsAsMember = Project::where('member_id', $user->id)->pluck('id');
                $assignedTaskProjects = Task::whereHas('assignedUsers', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->pluck('project_id')->unique();
                
                $allProjectIds = $projectsAsMember->merge($assignedTaskProjects)->unique();
                $totalTasks = Task::whereIn('project_id', $allProjectIds)->count();
                $completedTasks = Task::whereIn('project_id', $allProjectIds)
                                     ->where('status', 'done')
                                     ->count();
                
                $stats = [
                    'totalProjects' => $allProjectIds->count(),
                    'totalTasks' => $totalTasks,
                    'totalUsers' => User::count(),
                    'completedTasks' => $completedTasks,
                    'projects' => $this->getProjectsWithProgress($user->id, 'member')
                ];
            }
            
            Log::info('Stats calculated successfully', $stats);
            
        } catch (\Exception $e) {
            Log::error('Error calculating dashboard stats: ' . $e->getMessage());
            
            // Return default values in case of error
            $stats = [
                'totalProjects' => 0,
                'totalTasks' => 0,
                'totalUsers' => 0,
                'completedTasks' => 0,
                'projects' => []
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
                    $q->where('member_id', $userId)
                      ->orWhereHas('tasks.assignedUsers', function($subQ) use ($userId) {
                          $subQ->where('user_id', $userId);
                      });
                });
            }
            
            $projects = $query->get();
            
            return $projects->map(function ($project) {
                // Count tasks for this project
                $totalTasks = $project->tasks->count();
                $completedTasks = $project->tasks->where('status', 'done')->count();
                
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