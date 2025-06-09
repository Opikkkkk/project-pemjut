import React, { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from '@/Components/UserForm';
import ConfirmModal from '@/Components/ConfirmModal';
import { User, PageProps } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';

interface UsersPageProps extends PageProps {
    users: User[];
    roles: string[];
}

export default function Index({ auth, users, roles }: UsersPageProps) {
    const { flash } = usePage().props as any;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    
    // Search and Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter and search logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRole = roleFilter === '' || user.role === roleFilter;
            
            const matchesDate = dateFilter === '' || (() => {
                const userDate = new Date(user.created_at);
                const today = new Date();
                const daysDiff = Math.floor((today.getTime() - userDate.getTime()) / (1000 * 3600 * 24));
                
                switch (dateFilter) {
                    case 'today': return daysDiff === 0;
                    case 'week': return daysDiff <= 7;
                    case 'month': return daysDiff <= 30;
                    case 'year': return daysDiff <= 365;
                    default: return true;
                }
            })();
            
            return matchesSearch && matchesRole && matchesDate;
        });
    }, [users, searchTerm, roleFilter, dateFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedUser) {
            router.delete(`/users/${selectedUser.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                }
            });
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Admin':
                return 'bg-yellow-600 text-black';
            case 'Project Manager':
                return 'bg-slate-900 text-white';
            case 'Team Member':
                return 'bg-green-800 text-white';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Export functions
    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Username', 'Role', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...filteredUsers.map(user => [
                user.name,
                user.email,
                user.username,
                user.role,
                new Date(user.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportToJSON = () => {
        const dataStr = JSON.stringify(filteredUsers, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.json';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setRoleFilter('');
        setDateFilter('');
        setCurrentPage(1);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Management</h2>}
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-200 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {flash.error}
                                </div>
                            )}

                            {/* Header with Export Options */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h3 className="text-lg font-medium text-gray-900">Users ({filteredUsers.length})</h3>
                                <div className="flex flex-wrap items-center gap-2">
                                    
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="bg-slate-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add New User
                                    </button>
                                </div>
                            </div>

                            {/* Search and Filter Section */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search by name, email, or username..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                        >
                                            <option value="">All Roles</option>
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                        >
                                            <option value="">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="week">This Week</option>
                                            <option value="month">This Month</option>
                                            <option value="year">This Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Items per page</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="bg-slate-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                                >
                                    Reset Filters
                                </button>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                                Username
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.username}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                                                <div className="flex overflow-hidden rounded-xl border border-gray-200 divide-x divide-gray-200">
                                                    <button 
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 hover:bg-gray-100 text-slate-600"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                
                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="p-2 hover:bg-gray-100 text-slate-600"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* No Results Message */}
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No users found matching your criteria.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredUsers.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        
                                        {/* Page Numbers */}
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                        currentPage === pageNum
                                                            ? 'bg-slate-700 text-white'
                                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <UserForm
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    roles={roles}
                    title="Create New User"
                />
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <UserForm
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    roles={roles}
                    title="Edit User"
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedUser(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Delete User"
                    message={`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
                />
            )}
        </AuthenticatedLayout>
    );
}