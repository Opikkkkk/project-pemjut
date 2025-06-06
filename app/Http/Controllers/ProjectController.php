<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with(['leader', 'createdBy', 'member'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($project) {
                // Add status color for frontend
                $project->status_color = $this->getStatusColor($project->status);
                return $project;
            });

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'canManage' => $this->canManageProjects()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // This route is protected by middleware, but double-check
        if (!$this->canManageProjects()) {
            abort(403, 'You do not have permission to create projects.');
        }

        // Get Project Managers for leader dropdown
        $projectManagers = User::where('role', 'Project Manager')
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        // Get Team Members for member dropdown
        $teamMembers = User::where('role', 'Team Member')
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return Inertia::render('Projects/Create', [
            'projectManagers' => $projectManagers,
            'teamMembers' => $teamMembers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$this->canManageProjects()) {
            abort(403, 'You do not have permission to create projects.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:projects,name',
            'description' => 'required|string|min:10',
            'start_date' => 'required|date|before_or_equal:end_date',
            'end_date' => 'required|date|after:start_date',
            'status' => ['required', Rule::in(['Planning', 'In Progress', 'Completed', 'On Hold'])],
            'leader_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);
                    if (!$user || $user->role !== 'Project Manager') {
                        $fail('The selected leader must be a Project Manager.');
                    }
                },
            ],
            'member_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);
                    if (!$user || $user->role !== 'Team Member') {
                        $fail('The selected member must be a Team Member.');
                    }
                },
            ],
        ], [
            'name.unique' => 'A project with this name already exists.',
            'start_date.before_or_equal' => 'Start date must be before or equal to end date.',
            'description.min' => 'Project description must be at least 10 characters.',
            'end_date.after' => 'End date must be after start date.',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
            'leader_id' => $validated['leader_id'],
            'member_id' => $validated['member_id'],
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('projects.index')
            ->with('success', 'Project "' . $project->name . '" created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $project->load(['leader', 'createdBy', 'member']);
        $project->status_color = $this->getStatusColor($project->status);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'canManage' => $this->canManageProjects()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        if (!$this->canManageProjects()) {
            abort(403, 'You do not have permission to edit projects.');
        }

        // Get Project Managers for leader dropdown
        $projectManagers = User::where('role', 'Project Manager')
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        // Get Team Members for member dropdown
        $teamMembers = User::where('role', 'Team Member')
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return Inertia::render('Projects/Edit', [
            'project' => $project->load(['leader', 'createdBy', 'member']),
            'projectManagers' => $projectManagers,
            'teamMembers' => $teamMembers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        if (!$this->canManageProjects()) {
            abort(403, 'You do not have permission to update projects.');
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('projects', 'name')->ignore($project->id)
            ],
            'description' => 'required|string|min:10',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => ['required', Rule::in(['Planning', 'In Progress', 'Completed', 'On Hold'])],
            'leader_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);
                    if (!$user || $user->role !== 'Project Manager') {
                        $fail('The selected leader must be a Project Manager.');
                    }
                },
            ],
            'member_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);
                    if (!$user || $user->role !== 'Team Member') {
                        $fail('The selected member must be a Team Member.');
                    }
                },
            ],
        ], [
            'name.unique' => 'A project with this name already exists.',
            'description.min' => 'Project description must be at least 10 characters.',
            'end_date.after' => 'End date must be after start date.',
        ]);

        $project->update($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project "' . $project->name . '" updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if (!$this->canDe()) {
            abort(403, 'You do not have permission to delete projects.');
        }

        $projectName = $project->name;
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project "' . $projectName . '" deleted successfully.');
    }

    /**
     * Check if current user can manage projects
     */
    private function canManageProjects(): bool
    {
        return auth()->check() && in_array(auth()->user()->role, ['Admin', 'Project Manager']);
    }

    private function canDeleteProjects(): bool
    {
        return auth()->check() && auth()->user()->role === 'Admin';
    }

    /**
     * Get status color for frontend
     */
    private function getStatusColor(string $status): string
    {
        return match($status) {
            'Planning' => 'blue',
            'In Progress' => 'yellow',
            'Completed' => 'green',
            'On Hold' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get projects statistics (for dashboard or reports)
     */
    public function statistics()
    {
        $stats = [
            'total' => Project::count(),
            'planning' => Project::byStatus('Planning')->count(),
            'in_progress' => Project::byStatus('In Progress')->count(),
            'completed' => Project::byStatus('Completed')->count(),
            'on_hold' => Project::byStatus('On Hold')->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get projects by current user (as leader or member)
     */
    public function myProjects()
    {
        $userId = auth()->id();

        $projects = Project::with(['leader', 'createdBy', 'member'])
            ->where(function ($query) use ($userId) {
                $query->where('leader_id', $userId)
                      ->orWhere('member_id', $userId)
                      ->orWhere('created_by', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($project) {
                $project->status_color = $this->getStatusColor($project->status);
                return $project;
            });

        return Inertia::render('Projects/MyProjects', [
            'projects' => $projects
        ]);
    }
}
