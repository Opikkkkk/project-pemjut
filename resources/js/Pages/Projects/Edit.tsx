// Pages/Projects/Edit.tsx
import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react'; // Add router import
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ProjectEditProps, ProjectFormData } from '@/types/project';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ProjectEdit: React.FC<ProjectEditProps> = ({
  project,
  projectManagers,
  teamMembers,
  auth
}) => {
  const { data, setData, put, processing, errors } = useForm<ProjectFormData>({
    name: project.name,
    description: project.description || '',
    start_date: project.start_date,
    end_date: project.end_date,
    status: project.status,
    leader_id: project.leader?.id || null,
    member_ids: project.selected_member_ids || [],
  });

  // Add console.log to debug
  console.log('Project:', project);
  console.log('Team Members:', teamMembers);
  console.log('Selected Members:', data.member_ids);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('projects.update', project.id)); // Use put from useForm instead of router
  };

  const handleMemberToggle = (memberId: number) => {
    const currentIds = Array.isArray(data.member_ids) ? data.member_ids : [];
    if (currentIds.includes(memberId)) {
      setData('member_ids', currentIds.filter(id => id !== memberId));
    } else {
      setData('member_ids', [...currentIds, memberId]);
    }
  };

  const getSelectedMembers = () => {
    if (!teamMembers) return []; // Add null check
    const currentIds = Array.isArray(data.member_ids) ? data.member_ids : [];
    return teamMembers.filter(member => currentIds.includes(member.id));
  };

  const getFilteredMembers = () => {
    if (!teamMembers) return [];
    return teamMembers.filter(member =>
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      member.role === 'Team Member'
    );
  };

  const removeMember = (memberId: number) => {
    const currentIds = Array.isArray(data.member_ids) ? data.member_ids : [];
    setData('member_ids', currentIds.filter(id => id !== memberId));
  };

  const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
  ];

  const selectedMembers = getSelectedMembers();
  const filteredMembers = getFilteredMembers();

  const renderProjectLeaderSelect = () => (
    <div>
        <InputLabel htmlFor="leader_id" value="Project Leader" />
        <select
            id="leader_id"
            name="leader_id"
            value={data.leader_id || ''}
            onChange={(e) => setData('leader_id', e.target.value ? parseInt(e.target.value) : null)}
            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
            required
        >
            <option value="">Select Project Leader</option>
            {projectManagers.filter(manager => manager.role === 'Project Manager').map((manager) => (
                <option key={manager.id} value={manager.id}>
                    {manager.name} ({manager.email})
                </option>
            ))}
        </select>
        <InputError message={errors.leader_id} className="mt-2" />
    </div>
  );

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center">
          <Link
            href={route('projects.index')}
            className="mr-4 inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Back to Projects"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            Back
          </Link>

          <div className="flex flex-1 justify-between items-center">
            
            <Link
              href={route('projects.show', project.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Project
            </Link>
          </div>
        </div>
      }
    >
      <Head title={`Edit ${project.name}`} />
      <div className="flex flex-1 justify-center items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {project.name}
        </h2>
      </div>

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
                {renderProjectLeaderSelect()}

                {/* Team Members Multi-Select */}
                <div>
                  <InputLabel htmlFor="member_ids" value="Team Members" />

                  {/* Selected Members Display */}
                  {selectedMembers.length > 0 && (
                    <div className="mt-2 mb-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map((member) => (
                          <span
                            key={member.id}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
                          >
                            {member.name}
                            <button
                              type="button"
                              onClick={() => removeMember(member.id)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedMembers.length} member(s) selected
                      </p>
                    </div>
                  )}

                  {/* Dropdown */}
                  <div className="relative">
                    <div
                      className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <TextInput
                        type="text"
                        placeholder="Search and select team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full border-0 focus:ring-0"
                      />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md border border-gray-300 overflow-auto">
                        {filteredMembers.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No team members found
                          </div>
                        ) : (
                          filteredMembers.map((member) => {
                            const isSelected = Array.isArray(data.member_ids) && data.member_ids.includes(member.id);
                            return (
                              <div
                                key={member.id}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                                  isSelected ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => handleMemberToggle(member.id)}
                              >
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {member.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {member.email}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="text-blue-600">
                                    ✓
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Click outside to close dropdown */}
                  {isDropdownOpen && (
                    <div
                      className="fixed inset-0 z-5"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                  )}

                  <InputError message={errors.member_ids} className="mt-2" />
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
                <div className="flex justify-end gap-2">
                  <Link
                    href={route('projects.show', project.id)}
                    className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </Link>
                  <PrimaryButton disabled={processing}>
                    {processing ? 'Updating...' : 'Update'}
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
