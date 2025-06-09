<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['project', 'assignedTo', 'comments.user'])
            ->whereHas('project', function($query) {
                $query->whereHas('members', function($q) {
                    $q->where('user_id', auth()->id());
                })->orWhere('leader_id', auth()->id());
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    public function create(Request $request)
    {
        $project = Project::findOrFail($request->project_id);

        // Check authorization
        if (!$project->isProjectManager(auth()->user())) {
            abort(403, 'Only project managers can create tasks');
        }

        // Load project members correctly
        $projectMembers = $project->members()->get();

        return Inertia::render('Tasks/Create', [
            'project' => $project->load('leader'),
            'projectMembers' => $projectMembers
        ]);
    }

    public function store(Request $request)
    {
        $project = Project::findOrFail($request->project_id);

        // Check authorization
        if (!$project->isProjectManager(auth()->user())) {
            abort(403, 'Only project managers can create tasks');
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date'
        ]);

        // Set default status
        $validated['status'] = 'To Do';

        // Create task
        Task::create($validated);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Task created successfully');
    }

    public function show(Task $task)
    {
        // Check authorization
        // Allow all users to view, but keep track if they're part of the project
        $isTeamMember = $task->project->isTeamMember(auth()->user());

        // Load all necessary relationships
        $task->load([
            'project',
            'assignedTo',
            'completedBy',
            'comments' => function($query) {
                $query->orderBy('created_at', 'desc');
            },
            'comments.user'
        ]);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
            'canUpdateStatus' => $task->canUpdateStatus(auth()->user()),
            'isProjectManager' => $task->project->isProjectManager(auth()->user())
        ]);
    }

    public function edit(Task $task)
    {
        // Check authorization
        if (!$task->project->isProjectManager(auth()->user())) {
            abort(403, 'Only project managers can edit tasks');
        }

        // Load task with relationships
        $task->load(['project.leader', 'assignedTo']);

        // Get project members correctly
        $projectMembers = $task->project->members()->get();

        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'project' => $task->project,
            'projectMembers' => $projectMembers
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // Check authorization
        if (!$task->project->isProjectManager(auth()->user())) {
            abort(403, 'Only project managers can update tasks');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date'
        ]);

        // Update task
        $task->update($validated);

        return redirect()->route('tasks.show', $task->id)
            ->with('success', 'Task updated successfully');
    }

    public function destroy(Task $task)
    {
        // Check authorization
        if (!$task->project->isProjectManager(auth()->user())) {
            abort(403, 'Only project managers can delete tasks');
        }

        $projectId = $task->project_id;

        // Delete task and its comments (if using cascade delete)
        $task->delete();

        return redirect()->route('projects.show', $projectId)
            ->with('success', 'Task deleted successfully');
    }

    public function updateStatus(Request $request, Task $task)
    {
        // Check authorization
        if (!$task->canUpdateStatus(auth()->user())) {
            abort(403, 'You cannot update this task status');
        }

        $validated = $request->validate([
            'status' => 'required|in:To Do,In Progress,Done'
        ]);

        $updateData = ['status' => $validated['status']];

        // Handle completion tracking
        if ($validated['status'] === 'Done') {
            $updateData['completed_at'] = now();
            $updateData['completed_by'] = auth()->id();
        } else {
            // Reset completion data if status changed from Done
            $updateData['completed_at'] = null;
            $updateData['completed_by'] = null;
        }

        $task->update($updateData);

        return back()->with('success', 'Task status updated successfully');
    }
}
