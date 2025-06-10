// Pages/Tasks/Edit.tsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Project, Task } from '@/types/project';
import { ArrowLeftIcon } from 'lucide-react';

interface TasksEditProps {
  task: Task;
  project: Project;
  projectMembers: User[];
  auth: {
    user: User;
  };
}

interface TaskFormData {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  assigned_to: string;
  due_date: string;
}

const TasksEdit: React.FC<TasksEditProps> = ({ task, project, projectMembers, auth }) => {
    const { data, setData, put, processing, errors } = useForm<TaskFormData>({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        assigned_to: task.assignedTo?.id?.toString() || '',
        due_date: task.due_date || '',
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('tasks.update', task.id));
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

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Edit Task
            </h2>
            <div className="flex items-center mt-2 space-x-4">
              <p className="text-sm text-gray-600">
                Project: {project.name}
              </p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
           
          </div>
        </div>
      }
    >
      <Head title={`Edit Task: ${task.title}`} />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Current Task Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Current Task Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Task ID:</span>
                    <span className="ml-2 font-medium">#{task.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium">
                      {new Date(task.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2 font-medium">
                      {new Date(task.updated_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter task title"
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Task Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter task description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Priority and Assigned To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                      Priority *
                    </label>
                    <select
                      id="priority"
                      value={data.priority}
                      onChange={(e) => setData('priority', e.target.value as TaskFormData['priority'])}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {errors.priority && (
                      <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                    )}
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Current: </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
                      Assign To
                    </label>
                    <select
                      id="assigned_to"
                      value={data.assigned_to}
                      onChange={(e) => setData('assigned_to', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select team member</option>
                      {projectMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </select>
                    {errors.assigned_to && (
                      <p className="mt-1 text-sm text-red-600">{errors.assigned_to}</p>
                    )}
                    {task.assignedTo && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Currently assigned to: </span>
                        <span className="text-xs font-medium">
                          {task.assignedTo?.name || 'Not assigned'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  Due Date
                  </label>
                  <input
                  type="date"
                  id="due_date"
                  value={data.due_date}
                  onChange={(e) => setData('due_date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={project.start_date}
                  max={project.end_date}
                  />
                  {errors.due_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
                  )}
                  {data.due_date && (
                  (data.due_date < project.start_date || data.due_date > project.end_date) && (
                    <p className="mt-1 text-sm text-red-600">
                    Due date must be between project start date ({project.start_date.split('T')[0]}) and end date ({project.end_date.split('T')[0]})
                    </p>
                  )
                  )}
                  {task.due_date && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Current due date: </span>
                    <span className="text-xs font-medium">
                    {new Date(task.due_date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Project Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Project:</span>
                      <span className="ml-2 font-medium">{project.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium">{project.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Team Members:</span>
                      <span className="ml-2 font-medium">{projectMembers.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Project Leader:</span>
                      <span className="ml-2 font-medium">{project.leader?.name || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>

                {/* Change Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Important Note
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Changes to task details will be visible to all project members. If you're changing the assignment, the new assignee will be notified.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Link
                    href={route('tasks.show', task.id)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {processing ? 'Updating...' : 'Update Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
       <Link
              href={route('projects.index')}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="Back to Projects"
            >
              <ArrowLeftIcon className="h-6 w-6" />
              Back
            </Link>
    </AuthenticatedLayout>
  );
};

export default TasksEdit;
