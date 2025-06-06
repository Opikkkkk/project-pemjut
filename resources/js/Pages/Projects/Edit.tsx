// Pages/Projects/Edit.tsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ProjectEditProps, ProjectFormData } from '@/types/project';

const ProjectEdit: React.FC<ProjectEditProps> = ({
  project,
  projectManagers,
  teamMembers,
  auth
}) => {
  const { data, setData, put, processing, errors } = useForm<ProjectFormData>({
    name: project.name,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date,
    status: project.status,
    leader_id: project.leader_id,
    member_id: project.member_id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('projects.update', project.id));
  };

  const statusOptions = [
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
            Edit Project: {project.name}
          </h2>
          <div className="flex space-x-2">
            <Link
              href={route('projects.show', project.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Project
            </Link>
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
      <Head title={`Edit ${project.name}`} />

      <div className="py-12">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div>
                  <InputLabel htmlFor="name" value="Project Name" />
                  <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Description */}
                <div>
                  <InputLabel htmlFor="description" value="Description" />
                  <textarea
                    id="description"
                    name="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    rows={4}
                    required
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                {/* Start Date */}
                <div>
                  <InputLabel htmlFor="start_date" value="Start Date" />
                  <TextInput
                    id="start_date"
                    type="date"
                    name="start_date"
                    value={data.start_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('start_date', e.target.value)}
                    required
                  />
                  <InputError message={errors.start_date} className="mt-2" />
                </div>

                {/* End Date */}
                <div>
                  <InputLabel htmlFor="end_date" value="End Date" />
                  <TextInput
                    id="end_date"
                    type="date"
                    name="end_date"
                    value={data.end_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('end_date', e.target.value)}
                    required
                  />
                  <InputError message={errors.end_date} className="mt-2" />
                </div>

                {/* Status */}
                <div>
                  <InputLabel htmlFor="status" value="Status" />
                  <select
                    id="status"
                    name="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as ProjectFormData['status'])}
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    required
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.status} className="mt-2" />
                </div>

                {/* Project Leader */}
                <div>
                  <InputLabel htmlFor="leader_id" value="Project Leader" />
                  <select
                    id="leader_id"
                    name="leader_id"
                    value={data.leader_id}
                    onChange={(e) => setData('leader_id', e.target.value ? parseInt(e.target.value) : '')}
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    required
                  >
                    <option value="">Select Project Leader</option>
                    {projectManagers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} ({manager.email})
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.leader_id} className="mt-2" />
                </div>

                {/* Team Member */}
                <div>
                  <InputLabel htmlFor="member_id" value="Team Member" />
                  <select
                    id="member_id"
                    name="member_id"
                    value={data.member_id}
                    onChange={(e) => setData('member_id', e.target.value ? parseInt(e.target.value) : '')}
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    required
                  >
                    <option value="">Select Team Member</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.member_id} className="mt-2" />
                </div>

                {/* Project Info */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Project Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString('id-ID')}</p>
                    <p><strong>Last Updated:</strong> {new Date(project.updated_at).toLocaleDateString('id-ID')}</p>
                    {project.created_by_user && (
                      <p><strong>Created By:</strong> {project.created_by_user.name}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end">
                  <Link
                    href={route('projects.show', project.id)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4"
                  >
                    Cancel
                  </Link>
                  <PrimaryButton className="ml-4" disabled={processing}>
                    {processing ? 'Updating...' : 'Update Project'}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProjectEdit;
