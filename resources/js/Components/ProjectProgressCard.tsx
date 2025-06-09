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
            case 'Planning': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'On Hold': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-gradient-to-r from-green-400 to-green-600';
        if (progress >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        if (progress >= 25) return 'bg-gradient-to-r from-blue-400 to-blue-600';
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
    };

    return (
        <div className="w-full min-w-[700px] max-w-none bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 group">
            {/* Main Content - Using Grid Layout for wider display */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
                
                {/* Left Section - Project Info (Takes 4 columns) */}
                <div className="lg:col-span-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1 mr-8">
                            <h4 className="font-bold text-2xl text-gray-900 group-hover:text-blue-700 transition-colors whitespace-nowrap">
                                {project.name}
                            </h4>
                            <div className="flex items-center mt-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                <p className="text-base text-gray-600 font-medium whitespace-nowrap">
                                    Leader: <span className="text-gray-800">{project.leader.name}</span>
                                </p>
                            </div>
                        </div>
                        <span className={`px-5 py-2 rounded-full text-base font-semibold border ${getStatusColor(project.status)} shadow-sm flex-shrink-0`}>
                            {project.status}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base font-semibold text-gray-700">Progress</span>
                            <span className="text-base font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded">
                                {project.progress}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                            <div 
                                className={`h-4 rounded-full transition-all duration-500 shadow-sm ${getProgressColor(project.progress)}`}
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Task Stats - Horizontal Layout */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-base font-medium text-gray-700">
                                {project.completedTasks}/{project.totalTasks} tasks completed
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded">
                            {project.totalTasks - project.completedTasks} remaining
                        </div>
                    </div>
                </div>

                {/* Right Section - Summary Stats (Takes 1 column) */}
                <div className="flex flex-col justify-center space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">
                    <div className="text-center lg:text-left">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                            {project.progress}<span className="text-2xl text-gray-600">%</span>
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            Completed
                        </div>
                    </div>
                    
                    <div className="text-center lg:text-left">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {project.totalTasks}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            Total Tasks
                        </div>
                    </div>

                    <div className="text-center lg:text-left">
                        <div className="text-xl font-semibold text-orange-600 mb-1">
                            {project.totalTasks - project.completedTasks}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            Remaining
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};