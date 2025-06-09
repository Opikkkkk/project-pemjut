// Pages/Tasks/Create.tsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Project } from '@/types/project';

interface TasksCreateProps {
  project: Project;
  projectMembers: User[];
  auth: {
    user: User;
  };
}

interface TaskFormData {
  project_id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  assigned_to: string;
  due_date: string;
}

const TasksCreate: React.FC<TasksCreateProps> = ({ project, projectMembers, auth }) => {

  const { data, setData, post, processing, errors } = useForm<TaskFormData>({
    project_id: project.id,
    title: '',
    description: '',
    priority: 'Medium',
    assigned_to: '',
    due_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('tasks.store'));
  };

  // Filter out null/undefined members dengan logging
let validMembers: User[] = [];
  if (projectMembers && Array.isArray(projectMembers)) {
    validMembers = projectMembers.filter(member => {
      const isValid = member && member.id && member.name;
      return isValid;
    });
  }


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Create New Task
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Project: {project.name}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={route('projects.show', project.id)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Project
            </Link>
          </div>
        </div>
      }
    >
      <Head title="Create Task" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

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
                      {validMembers.length > 0 ? (
                        validMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.email})
                          </option>
                        ))
                      ) : (
                        <option disabled>No team members available</option>
                      )}
                    </select>
                    {errors.assigned_to && (
                      <p className="mt-1 text-sm text-red-600">{errors.assigned_to}</p>
                    )}

                    {/* Debug info for members */}
                    {projectMembers && projectMembers.length === 0 && (
                      <p className="mt-1 text-sm text-orange-600">
                        Warning: No project members found. Make sure members are assigned to this project.
                      </p>
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
                  {data.due_date && (
                    data.due_date.split('T')[0] < project.start_date.split('T')[0] ||
                    data.due_date.split('T')[0] > project.end_date.split('T')[0]
                  ) && (
                    <p className="mt-1 text-sm text-red-600">
                      Due date must be between project start date ({project.start_date.split('T')[0]}) and end date ({project.end_date.split('T')[0]})
                    </p>
                  )}
                  {errors.due_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
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
                      <span className="ml-2 font-medium">{validMembers.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Project Leader:</span>
                      <span className="ml-2 font-medium">{project.leader?.name || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Link
                    href={route('projects.show', project.id)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {processing ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </AuthenticatedLayout>
  );
};

export default TasksCreate;
