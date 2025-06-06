<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display tasks for a specific project
     */
    public function index(Request $request, $projectId): Response
    {
        $user = auth()->user();
        $project = Project::findOrFail($projectId);

        $query = $project->tasks()->with(['assignedUsers', 'creator', 'comments.user']);

        // Team members can only see tasks assigned to them
        if ($user->isTeamMember()) {
            $query->whereHas('assignedUsers', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $tasks = $query->latest()->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'project' => $project
        ]);
    }

    /**
     * Display the specified task
     */
    public function show($projectId, $id): Response
    {
        $user = auth()->user();

        $task = Task::with(['assignedUsers', 'creator', 'comments.user'])
                   ->where('project_id', $projectId)
                   ->findOrFail($id);

        // Team members can only see tasks assigned to them
        if ($user->isTeamMember() && !$task->isAssignedTo($user->id)) {
            abort(403, 'Unauthorized. You can only view tasks assigned to you.');
        }

        return Inertia::render('Tasks/Show', [
            'task' => $task
        ]);
    }

    // Keep form submission methods as JSON
    public function store(Request $request, $projectId): JsonResponse
    {
        // Keep existing logic
        // ... existing code
    }

    public function update(Request $request, $projectId, $id): JsonResponse
    {
        // Keep existing logic
        // ... existing code
    }

    public function destroy($projectId, $id): JsonResponse
    {
        // Keep existing logic
        // ... existing code
    }

    public function getTeamMembers(): JsonResponse
    {
        // Keep existing logic for AJAX
        // ... existing code
    }
}
