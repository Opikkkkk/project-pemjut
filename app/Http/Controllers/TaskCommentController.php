<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskCommentController extends Controller
{
    /**
     * Display comments for a specific task
     * Jika ini untuk AJAX call, tetap JSON
     */
    public function index($projectId, $taskId): JsonResponse
    {
        $user = auth()->user();

        $task = Task::where('project_id', $projectId)->findOrFail($taskId);

        // Team members can only see comments for tasks assigned to them
        if ($user->isTeamMember() && !$task->isAssignedTo($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only view comments for tasks assigned to you.'
            ], 403);
        }

        $comments = $task->comments()->with('user')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Store a new comment
     * Tetap JSON untuk form submission
     */
    public function store(Request $request, $projectId, $taskId): JsonResponse
    {
        $user = auth()->user();

        $task = Task::where('project_id', $projectId)->findOrFail($taskId);

        // Check if user has access to this task
        if ($user->isTeamMember() && !$task->isAssignedTo($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only comment on tasks assigned to you.'
            ], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $comment = TaskComment::create([
            'comment' => $validated['comment'],
            'task_id' => $taskId,
            'user_id' => $user->id,
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'data' => $comment,
            'message' => 'Comment added successfully.'
        ], 201);
    }

    /**
     * Update the specified comment
     * Tetap JSON untuk form submission
     */
    public function update(Request $request, $projectId, $taskId, $id): JsonResponse
    {
        $user = auth()->user();

        $comment = TaskComment::whereHas('task', function ($query) use ($projectId) {
            $query->where('project_id', $projectId);
        })->where('task_id', $taskId)->findOrFail($id);

        // Users can only update their own comments
        if ($comment->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only update your own comments.'
            ], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $comment->update($validated);
        $comment->load('user');

        return response()->json([
            'success' => true,
            'data' => $comment,
            'message' => 'Comment updated successfully.'
        ]);
    }

    /**
     * Remove the specified comment
     * Tetap JSON untuk AJAX
     */
    public function destroy($projectId, $taskId, $id): JsonResponse
    {
        $user = auth()->user();

        $comment = TaskComment::whereHas('task', function ($query) use ($projectId) {
            $query->where('project_id', $projectId);
        })->where('task_id', $taskId)->findOrFail($id);

        // Users can only delete their own comments, or Admin can delete any comment
        if ($comment->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only delete your own comments.'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully.'
        ]);
    }
}
