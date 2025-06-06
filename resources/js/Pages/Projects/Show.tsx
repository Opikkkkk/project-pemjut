// Pages/Projects/Show.tsx
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ProjectShowProps } from '@/types/project';

const ProjectShow: React.FC<ProjectShowProps> = ({ project, auth }) => {
  const canManageProjects = ['Admin', 'Project Manager'].includes(auth.user.role);
  const canDeleteProjects = auth.user.role === 'Admin';

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      router.delete(route('projects.destroy', project.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Planning': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'On Hold': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = () => {
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = () => {
    const today = new Date();
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);

    if (today < start) return 0;
    if (today > end) return 100;

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    return Math.round((elapsed / totalDuration) * 100);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Project: {project.name}
          </h2>
          <div className="flex space-x-2">
            {canManageProjects && (
              <>
                <Link
                  href={route('projects.edit', project.id)}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Project
                </Link>
                {canDeleteProjects && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Delete Project
                    </button>
                )}
              </>
            )}
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
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Project Overview Card */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {project.name}
                  </h1>
                  {getStatusBadge(project.status)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Project Duration</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {calculateDuration()} days
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Project Progress</span>
                  <span className="text-sm text-gray-500">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Details */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(project.start_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(project.end_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">{getStatusBadge(project.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDateTime(project.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDateTime(project.updated_at)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Team Information */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Information</h3>
                <div className="space-y-6">
                  {/* Project Leader */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Project Leader</h4>
                    {project.leader ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {project.leader.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.leader.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.leader.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {project.leader.role}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No leader assigned</p>
                    )}
                  </div>

                  {/* Team Member */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Team Member</h4>
                    {project.member ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {project.member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.member.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {project.member.role}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No member assigned</p>
                    )}
                  </div>

                  {/* Created By */}
                  {project.created_by_user && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Created By</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {project.created_by_user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.created_by_user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.created_by_user.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {project.created_by_user.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProjectShow;
