// components/ProjectProgressCard.tsx
import React from 'react';

interface ProjectProgressProps {
    project: {
        id: number;
        name: string;
        status: string;
        progress: number;
        totalTasks: number;
        completedTasks: number;
        leader: {
            name: string;
        };
    };
}

export const ProjectProgressCard: React.FC<ProjectProgressProps> = ({ project }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Planning': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'On Hold': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        if (progress >= 25) return 'bg-blue-500';
        return 'bg-gray-300';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {project.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                        Leader: {project.leader.name}
                    </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
            </div>
            
            <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="text-xs text-gray-600">
                {project.completedTasks}/{project.totalTasks} tasks completed
            </div>
        </div>
    );
};