import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import DashboardStats from '@/Components/DashboardStats';

// Extended PageProps to include dashboard statistics
interface DashboardPageProps extends PageProps {
    stats?: {
        totalProjects: number;
        totalTasks: number;
        totalUsers: number;
        completedTasks: number;
        projects: Array<{
            id: number;
            name: string;
            status: string;
            progress: number;
            totalTasks: number;
            completedTasks: number;
            leader: {
                name: string;
            };
        }>;
    };
}

export default function Dashboard({ auth, stats }: DashboardPageProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Section */}
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold mb-2">
                                You're logged in as {auth.user.role}!
                            </h3>
                            <p className="text-2xl uppercase font-semibold">
                                WELCOME {auth.user.name}!
                            </p>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                        <div className="p-6">
                            <DashboardStats stats={stats} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}