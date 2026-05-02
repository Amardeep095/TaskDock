import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FolderKanban } from 'lucide-react';

const COLORS = ['#f43f5e', '#f59e0b', '#10b981']; // Rose, Amber, Emerald

const ProjectDistributionChart = ({ projects }) => {
    // Calculate distribution based on priority
    const distribution = [
        { name: 'High', value: 0, color: '#f43f5e' },
        { name: 'Medium', value: 0, color: '#f59e0b' },
        { name: 'Low', value: 0, color: '#10b981' },
    ];

    if (Array.isArray(projects)) {
        projects.forEach(project => {
            if (project.progress < 100) {
                const priority = project.priority || 'Medium';
                const index = distribution.findIndex(d => d.name === priority);
                if (index !== -1) distribution[index].value += 1;
            }
        });
    }

    const totalProjects = distribution.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Project Distribution</h3>
                    <p className="text-sm text-slate-500">Active projects by priority</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    <FolderKanban size={20} />
                </div>
            </div>
            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={distribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value, entry) => <span className="text-slate-500 text-sm font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-slate-900">
                            {totalProjects}
                        </p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDistributionChart;
