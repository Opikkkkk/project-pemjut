// Pages/Projects/Show.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ProjectShowProps, Task } from '@/types/project';
import { 
    EyeIcon, 
    PencilSquareIcon, 
    TrashIcon,
    ArrowLeftIcon // Add this import
} from '@heroicons/react/24/outline';

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
            <div className="flex justify-end mb-4 gap-2">
              <Link
                href={route('projects.edit', project.id)}
                className="inline-flex items-center justify-center rounded-full p-2 bg-green-100 hover:bg-green-200 transition-colors"
                title="Edit Project"
              >
                <PencilSquareIcon className="h-5 w-5 text-green-700" />
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center rounded-full p-2 bg-red-100 hover:bg-red-200 transition-colors"
                title="Delete Project"
              >
                <TrashIcon className="h-5 w-5 text-red-700" />
              </button>
            </div>
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
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
                    >
                      + Manage Members
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
                {/* Only show Create Task button if user is project manager */}
                {(project.leader?.id === auth.user.id || project.created_by === auth.user.id) && (
                    <Link
                      href={route('tasks.create', { project_id: project.id })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      Add Task
                    </Link>
                )}
                </div>

                {/* Task Status Overview */}
                {project.tasks && project.tasks.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                    { status: 'To Do', count: project.tasks.filter(t => t.status === 'To Do').length, color: 'bg-gray-100 text-gray-800' },
                    { status: 'In Progress', count: project.tasks.filter(t => t.status === 'In Progress').length, color: 'bg-blue-100 text-blue-800' },
                    { status: 'Done', count: project.tasks.filter(t => t.status === 'Done').length, color: 'bg-green-100 text-green-800' }
                    ].map((item) => (
                    <div key={item.status} className="bg-white border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                        <div className={`text-xs font-medium rounded-full px-2 py-1 mt-1 ${item.color}`}>
                        {item.status}
                        </div>
                    </div>
                    ))}
                </div>
                )}

                {project.tasks && project.tasks.length > 0 ? (
                <div className="space-y-4">
                    {project.tasks.map((task: Task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusBadgeColor(task.status)}`}>
                                {task.status}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskPriorityBadgeColor(task.priority)}`}>
                                {task.priority}
                            </span>
                            </div>

                            {task.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              {task.assignedTo && (
    <div className="flex items-center space-x-1">
        <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
                {task.assignedTo.name.charAt(0).toUpperCase()}
            </span>
        </div>
        <span>Assigned to: {task.assignedTo.name}</span>
    </div>
)}
                            {task.due_date && (
                                <span className={`${new Date(task.due_date) < new Date() && task.status !== 'Done' ? 'text-red-600 font-medium' : ''}`}>
                                Due: {new Date(task.due_date).toLocaleDateString('id-ID')}
                                </span>
                            )}
                            <span>Task #{task.id}</span>
                            </div>
                        </div>
                        </div>

                        <div className="flex justify-between items-center">
                        {/* Status Update Dropdown - Only for assigned user or project manager */}
                        <div className="flex items-center space-x-2">
                            {(task.assignedTo?.id === auth.user.id ||
                            project.leader?.id === auth.user.id ||
                            project.created_by === auth.user.id) && (
                            <form
                                onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const status = formData.get('status') as string;
                                router.patch(route('tasks.update-status', task.id), { status });
                                }}
                                className="flex items-center space-x-2"
                            >
                                <select
                                name="status"
                                defaultValue={task.status}
                                onChange={(e) => {
                                    router.patch(route('tasks.update-status', task.id), {
                                    status: e.target.value
                                    });
                                }}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                                </select>
                            </form>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                            {/* View button - always visible */}
                            <Link
                                href={route('tasks.show', task.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                <EyeIcon className="h-5 w-5" />
                            </Link>

                            {/* Edit/Delete buttons - only for project managers */}
                            {(project.leader?.id === auth.user.id || project.created_by === auth.user.id) && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <Link
                                        href={route('tasks.edit', task.id)}
                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
                                                router.delete(route('tasks.destroy', task.id));
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks created yet</h3>
                    <p className="text-gray-500 mb-4">
                    Start organizing your project by creating tasks for your team.
                    </p>
                    {(project.leader?.id === auth.user.id || project.created_by === auth.user.id) && (
                    <Link
                        href={route('tasks.create', { project_id: project.id })}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                        Create First Task
                    </Link>
                    )}
                </div>
                )}
            </div>
            )}
            </div>
          </div>
        </div>
        
      </div>
      <div className="flex-1"></div>
        <div className="mt-6 flex justify-end space-x-2">
           <Link
              href={route('projects.index')}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="Back to Projects"
            >
              <ArrowLeftIcon className="h-6 w-6" />
              Back
            </Link>
            <div className="flex-1"></div>
           
          </div>
    </AuthenticatedLayout>
    
  );
};

export default ProjectShow;
