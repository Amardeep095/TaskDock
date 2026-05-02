import { useState } from 'react';
import {
    Layout, TrendingUp, Users, Shield, Globe, Search, Plus,
    CheckCircle2, Activity, Clock, MoreVertical, Calendar,
    ChevronRight, Bell, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const DemoDashboard = () => {
    // Mock Data for the Demo
    const stats = [
        { label: 'Total Projects', value: '12', change: '+12%', color: 'primary', icon: Layout },
        { label: 'Completed', value: '8', change: '+5%', color: 'success', icon: CheckCircle2 },
        { label: 'Active Tasks', value: '24', change: '-2%', color: 'danger', icon: Activity },
        { label: 'Upcoming Deadlines', value: '3', change: 'Action', color: 'warning', icon: Clock }
    ];

    const projects = [
        {
            id: 'demo-1',
            name: 'Website Redesign',
            description: 'Revamp the corporate website with modern UI/UX principles and improved performance.',
            progress: 75,
            deadline: '2026-03-15',
            priority: 'High',
            assignedTo: [{ name: 'Amardeep Doe' }, { name: 'Sarah Smith' }]
        },
        {
            id: 'demo-2',
            name: 'Mobile App Launch',
            description: 'Prepare for the iOS and Android launch of the new customer-facing application.',
            progress: 45,
            deadline: '2026-04-01',
            priority: 'Medium',
            assignedTo: [{ name: 'Alex Wang' }]
        },
        {
            id: 'demo-3',
            name: 'Internal Tools',
            description: 'Develop a suite of internal tools to streamline employee onboarding and resource management.',
            progress: 90,
            deadline: '2026-02-28',
            priority: 'Low',
            assignedTo: []
        }
    ];

    const sidebarItems = [
        { icon: Layout, active: true },
        { icon: TrendingUp, active: false },
        { icon: Users, active: false },
        { icon: Shield, active: false },
        { icon: Settings, active: false },
    ];

    return (
        <div className="flex h-[600px] w-full bg-slate-50 text-slate-900 font-sans overflow-hidden rounded-xl border border-slate-200">
            {/* Sidebar */}
            <div className="w-16 sm:w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 space-y-6 shrink-0 z-20">
                <div className="mb-2">
                    <div className="flex items-center justify-center">
                        <Layout className="text-primary-600 h-8 w-8" />
                    </div>
                </div>
                {sidebarItems.map((item, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${item.active
                            ? 'bg-primary-50 text-primary-600 shadow-sm'
                            : 'text-slate-400 hover:text-primary-600 hover:bg-slate-50'
                            }`}
                    >
                        <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} />
                        {item.active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            Item {i + 1}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
                {/* Header */}
                <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-slate-800 leading-tight">Dashboard</h2>
                        <span className="text-xs text-slate-400 font-medium">Overview</span>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative">
                            <Search size={20} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary-500 w-32 sm:w-48 transition-all"
                            />
                        </div>
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm ring-1 ring-slate-100">
                            JD
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar space-y-8">
                    {/* Welcome Section */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back, Amardeep! 👋</h1>
                            <p className="text-slate-500 text-sm">Here's what's happening with your projects today.</p>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95 transform duration-150">
                            <Plus size={16} />
                            <span>New Project</span>
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group cursor-default"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.color === 'primary' ? 'bg-primary-50 text-primary-600' :
                                        stat.color === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                            stat.color === 'danger' ? 'bg-rose-50 text-rose-600' :
                                                'bg-amber-50 text-amber-600'
                                        }`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' :
                                        stat.change === 'Action' ? 'bg-amber-50 text-amber-600' :
                                            'bg-rose-50 text-rose-600'
                                        }`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</h3>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Active Projects */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Globe size={18} className="text-primary-600" />
                                Active Projects
                            </h3>
                            <button className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1 group">
                                View all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={() => { }} // No-op for demo
                                />
                            ))}

                            {/* New Project Placeholder */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-600 transition-all cursor-pointer min-h-[300px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                                    <Plus size={24} />
                                </div>
                                <span className="font-semibold">Create New Project</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoDashboard;
