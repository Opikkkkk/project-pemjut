// Pages/Tasks/Show.tsx
import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task, User, TaskComment } from '@/types/project';

interface TaskShowProps {
  task: Task & {
    comments?: TaskComment[];
    completed_by?: User;
    completed_at?: string;
  };
  canUpdateStatus: boolean;
  isProjectManager: boolean;
  auth: {
    user: User;
  };
}

const TaskShow: React.FC<TaskShowProps> = ({
  task,
  canUpdateStatus,
  isProjectManager,
  auth
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  const { data: statusData, setData: setStatusData, patch: patchStatus, processing: statusProcessing } = useForm({
    status: task.status
  });

  const { data: commentData, setData: setCommentData, post: postComment, processing: commentProcessing, reset } = useForm({
    comment: ''
  });

    const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'To Do':
        return 'bg-gray-100 text-gray-800';
        case 'In Progress':
        return 'bg-blue-100 text-blue-800';
        case 'Done':
        return 'bg-green-100 text-green-800';
        default:
        return 'bg-gray-100 text-gray-800';
    }
    };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    patchStatus(route('tasks.update-status', task.id));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postComment(route('task-comments.store', task.id), {
      onSuccess: () => reset('comment')
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      router.delete(route('task-comments.destroy', commentId));
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      router.delete(route('tasks.destroy', task.id));
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              {task.title}
            </h2>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                {task.priority} Priority
              </span>
              <span className="text-sm text-gray-600">
                Task ID: #{task.id}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {isProjectManager && (
              <>
                <Link
                  href={route('tasks.edit', task.id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Task
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </>
            )}
            {task.project && (
              <Link
                href={route('projects.show', task.project?.id)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Back to Project
              </Link>
            )}
          </div>
        </div>
      }
    >
      <Head title={task.title} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">📋</span>
                  Task Details
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'comments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">💬</span>
                  Comments ({task.comments?.length || 0})
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Status Update Form */}
                  {canUpdateStatus && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-900 mb-3">Update Task Status</h3>
                      <form onSubmit={handleStatusUpdate} className="flex items-center space-x-3">
                        <select
                        value={statusData.status}
                        onChange={(e) => setStatusData('status', e.target.value as 'To Do' | 'In Progress' | 'Done')}
                        className="border border-blue-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        </select>
                        <button
                          type="submit"
                          disabled={statusProcessing || statusData.status === task.status}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50"
                        >
                          {statusProcessing ? 'Updating...' : 'Update Status'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Task Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Task Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Task Title</label>
                        <p className="mt-1 text-sm text-gray-900">{task.title}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {task.project ? (
                            <Link
                              href={route('projects.show', task.project.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {task.project.name}
                            </Link>
                          ) : (
                            <span>No project assigned</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                        <div className="mt-1">
                          {task.assigned_to ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {task.assigned_to.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{task.assigned_to.name}</p>
                                <p className="text-sm text-gray-500">{task.assigned_to.email}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Not assigned</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {task.due_date ? (
                            <span className={`${new Date(task.due_date) < new Date() && task.status !== 'Done' ? 'text-red-600 font-medium' : ''}`}>
                              {new Date(task.due_date).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          ) : (
                            'No due date set'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{task.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Task Completion Info */}
                  {task.status === 'Done' && task.completed_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Completion Details</label>
                      <div className="bg-green-50 p-4 rounded-md">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-800">
                            <strong>Completed on:</strong> {new Date(task.completed_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {task.completed_by && (
                            <span className="text-green-800">
                              <strong>Completed by:</strong> {task.completed_by.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Task Timeline */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Task Timeline</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between text-sm">
                        <span>Created: {new Date(task.created_at).toLocaleDateString('id-ID')}</span>
                        <span>Last Updated: {new Date(task.updated_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-6">
                  {/* Add Comment Form */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Comment</h3>
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      <div>
                        <textarea
                          value={commentData.comment}
                          onChange={(e) => setCommentData('comment', e.target.value)}
                          placeholder="Write your comment here..."
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={commentProcessing || !commentData.comment.trim()}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                          {commentProcessing ? 'Adding...' : 'Add Comment'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Comments List */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Comments ({task.comments?.length || 0})
                    </h3>

                    {task.comments && task.comments.length > 0 ? (
                      <div className="space-y-4">
                        {task.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      {comment.user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString('id-ID', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>

                              {(comment.user.id === auth.user.id || isProjectManager) && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-4">💬</div>
                        <p className="text-gray-500">No comments yet</p>
                        <p className="text-sm text-gray-400 mt-2">Be the first to add a comment!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default TaskShow;
