// Pages/Projects/Show.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ProjectShowProps, Task } from '@/types/project';

const ProjectShow: React.FC<ProjectShowProps> = ({
  project,
  auth
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'members' | 'tasks'>('details');

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      router.delete(route('projects.destroy', project.id));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskPriorityBadgeColor = (priority: string) => {
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

  const tabs = [
    { id: 'details', label: 'Project Details', icon: '📋' },
    { id: 'members', label: `Team Members (${project.members?.length || 0})`, icon: '👥' },
    { id: 'tasks', label: `Tasks (${project.tasks?.length || 0})`, icon: '✅' },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              {project.name}
            </h2>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(project.status)}`}>
                {project.status}
              </span>
              <span className="text-sm text-gray-600">
                Project ID: #{project.id}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              href={route('projects.edit', project.id)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Project
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
            <Link
              href={route('projects.index')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      }
    >
      <Head title={project.name} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Project Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <p className="mt-1 text-sm text-gray-900">{project.name}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(project.start_date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(project.end_date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                        <div className="mt-1">
                          {project.leader ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {project.leader.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{project.leader.name}</p>
                                <p className="text-sm text-gray-500">{project.leader.email}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Not assigned</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created By</label>
                        <div className="mt-1">
                          {project.created_by_user ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {project.created_by_user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{project.created_by_user.name}</p>
                                <p className="text-sm text-gray-500">{project.created_by_user.email}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Not available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{project.description}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Project Timeline</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between text-sm">
                        <span>Created: {new Date(project.created_at).toLocaleDateString('id-ID')}</span>
                        <span>Last Updated: {new Date(project.updated_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Members Tab */}
              {activeTab === 'members' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Team Members ({project.members?.length || 0})
                    </h3>
                    <Link
                      href={route('projects.edit', project.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Manage Members
                    </Link>
                  </div>

                  {project.members && project.members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.members.map((member) => (
                        <div key={member.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-lg font-medium text-gray-700">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                              <p className="text-sm text-gray-500">{member.email}</p>
                              {member.role && (
                                <p className="text-xs text-gray-400 mt-1">{member.role}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-lg mb-2">👥</div>
                      <p className="text-gray-500">No team members assigned to this project</p>
                      <Link
                        href={route('projects.edit', project.id)}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                      >
                        Add Team Members
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Project Tasks ({project.tasks?.length || 0})
                    </h3>
                    <Link
                      href={route('tasks.create', { project_id: project.id })}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                      Add New Task
                    </Link>
                  </div>

                  {project.tasks && project.tasks.length > 0 ? (
                    <div className="space-y-4">
                      {project.tasks.map((task: Task) => (
                        <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusBadgeColor(task.status)}`}>
                                {task.status}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskPriorityBadgeColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          )}

                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              {task.assigned_to && (
                                <span>Assigned to: {task.assigned_to.name}</span>
                              )}
                              {task.due_date && (
                                <span>Due: {new Date(task.due_date).toLocaleDateString('id-ID')}</span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Link
                                href={route('tasks.show', task.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </Link>
                              <Link
                                href={route('tasks.edit', task.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-lg mb-2">✅</div>
                      <p className="text-gray-500">No tasks created for this project</p>
                      <Link
                        href={route('tasks.create', { project_id: project.id })}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                      >
                        Create First Task
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProjectShow;
