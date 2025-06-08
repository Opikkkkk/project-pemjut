// Pages/Projects/Index.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ProjectIndexProps, Project } from '@/types/project';

const ProjectIndex: React.FC<ProjectIndexProps> = ({
  projects,
  filters = {}, // Default ke object kosong jika tidak ada
  auth,
  canManage
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('projects.index'), {
      search: searchTerm,
      status: statusFilter,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (project: Project) => {
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

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Planning', label: 'Planning' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Projects
          </h2>
          {canManage && (
            <Link
              href={route('projects.create')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Project
            </Link>
          )}
        </div>
      }
    >
      <Head title="Projects" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Search and Filter Section */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  />
                </div>
                <div className="md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(!projects || (Array.isArray(projects) ? projects.length === 0 : projects.data.length === 0)) ? (
              <div className="col-span-full bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-center text-gray-500">
                  <p className="text-lg">No projects found</p>
                  <p className="text-sm mt-2">
                    {filters.search || filters.status
                      ? 'Try adjusting your search criteria'
                      : 'Create your first project to get started'
                    }
                  </p>
                </div>
              </div>
            ) : (
              (Array.isArray(projects) ? projects : projects.data).map((project) => (
                <div key={project.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Project Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Project Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Start Date:</span>
                        <span className="text-gray-900">
                          {new Date(project.start_date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">End Date:</span>
                        <span className="text-gray-900">
                          {new Date(project.end_date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Leader:</span>
                        <span className="text-gray-900">
                          {project.leader?.name || 'Not Assigned'}
                        </span>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Team Members:</span>
                        <span className="text-xs text-gray-400">
                          {project.members_count || project.members?.length || 0} member(s)
                        </span>
                      </div>

                      {project.members && project.members.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {project.members.slice(0, 3).map((member) => (
                            <span
                              key={member.id}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                              title={member.email}
                            >
                              {member.name}
                            </span>
                          ))}
                          {project.members.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                              +{project.members.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : project.members_names ? (
                        <div className="text-xs text-gray-600">
                          {project.members_names}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No members assigned</p>
                      )}
                    </div>

                    {/* Project Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <Link
                          href={route('projects.show', project.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </Link>
                        {canManage && (
                          <>
                            <Link
                              href={route('projects.edit', project.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(project)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {project.tasks_count || 0} task(s)
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {projects && !Array.isArray(projects) && projects.links && projects.links.length > 3 && (
            <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex justify-center">
                  <nav className="flex space-x-1">
                    {projects.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          link.active
                            ? 'bg-blue-600 text-white'
                            : link.url
                            ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing {projects.from} to {projects.to} of {projects.total} results
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProjectIndex;
