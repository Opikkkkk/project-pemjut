// components/StatCard.tsx
import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'yellow';
    subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue':
                return {
                    bg: 'bg-blue-500',
                    text: 'text-blue-600',
                    iconBg: 'bg-blue-100'
                };
            case 'green':
                return {
                    bg: 'bg-green-500',
                    text: 'text-green-600',
                    iconBg: 'bg-green-100'
                };
            case 'purple':
                return {
                    bg: 'bg-purple-500',
                    text: 'text-purple-600',
                    iconBg: 'bg-purple-100'
                };
            case 'yellow':
                return {
                    bg: 'bg-yellow-500',
                    text: 'text-yellow-600',
                    iconBg: 'bg-yellow-100'
                };
            default:
                return {
                    bg: 'bg-gray-500',
                    text: 'text-gray-600',
                    iconBg: 'bg-gray-100'
                };
        }
    };

    const colorClasses = getColorClasses(color);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
                <div className={`p-3 rounded-full ${colorClasses.iconBg}`}>
                    <div className={colorClasses.text}>
                        {icon}
                    </div>
                </div>
                <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    </div>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
};