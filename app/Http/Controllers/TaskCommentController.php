<?php

namespace App\Http\Controllers;

use App\Models\TaskComment;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        // Check if user can access this task
        $validated = $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        // Create comment
        TaskComment::create([
            'task_id' => $task->id,
            'user_id' => auth()->id(),
            'comment' => $validated['comment']
        ]);

        return back()->with('success', 'Comment added successfully');
    }

    public function destroy(TaskComment $comment)
    {
        // Load the task relationship to check permissions
        $comment->load('task.project');

        // Check if user can delete this comment
        // Only comment author or project manager can delete
        if ($comment->user_id !== auth()->id() &&
            !$comment->task->project->isProjectManager(auth()->user())) {
            abort(403, 'You can only delete your own comments or you must be a project manager');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully');
    }
}
