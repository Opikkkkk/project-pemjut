// components/DashboardStats.tsx
import React from 'react';
import { StatCard } from './StatCard';
import { ProjectProgressCard } from './ProjectProgressCard';

// Icons as React components (you can replace with your preferred icon library)
const FolderIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const TaskIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

const ChartIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

interface DashboardStatsProps {
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

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    // Provide default values if stats is undefined
    const safeStats = {
        totalProjects: 0,
        totalTasks: 0,
        totalUsers: 0,
        completedTasks: 0,
        projects: [],
        ...stats
    };

    const completionRate = safeStats.totalTasks > 0 
        ? Math.round((safeStats.completedTasks / safeStats.totalTasks) * 100) 
        : 0;

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Projects"
                    value={safeStats.totalProjects}
                    icon={<FolderIcon />}
                    color="blue"
                    subtitle="Active projects"
                />
                <StatCard
                    title="Total Tasks"
                    value={safeStats.totalTasks}
                    icon={<TaskIcon />}
                    color="green"
                    subtitle={`${safeStats.completedTasks} completed`}
                />
                <StatCard
                    title="Team Members"
                    value={safeStats.totalUsers}
                    icon={<UserIcon />}
                    color="purple"
                    subtitle="Active users"
                />
                <StatCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    icon={<ChartIcon />}
                    color="yellow"
                    subtitle="Overall progress"
                />
            </div>

            {/* Project Progress Cards */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
                {safeStats.projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {safeStats.projects.map((project) => (
                            <ProjectProgressCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No projects found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardStats;