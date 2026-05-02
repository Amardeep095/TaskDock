import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { Users, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Team = () => {
    const { employees, projects } = useProjects();

    const getEmployeeStats = (employeeId) => {
        if (!projects) return { active: 0, completed: 0 };
        const employeeProjects = projects.filter(p => p.assignedTo && p.assignedTo.some(e => e.id === employeeId));
        return {
            active: employeeProjects.filter(p => p.progress < 100).length,
            completed: employeeProjects.filter(p => p.progress === 100).length
        };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        show: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/50 overflow-hidden p-6 md:p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full flex flex-col gap-8"
            >
                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-primary-600/10 rounded-xl text-primary-600 flex items-center justify-center">
                            <Users size={32} strokeWidth={2.5} />
                        </div>
                        Workspace Members
                    </h1>
                    <p className="text-slate-500 text-lg ml-1 mt-2">
                        Collaborate with your project members.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                >
                    {employees.map((employee, index) => {
                        const stats = getEmployeeStats(employee.id);
                        return (
                            <motion.div
                                key={employee.id}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="group relative overflow-hidden rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer flex flex-col hover:border-primary-200/60"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                                <div className="relative z-0 flex flex-col flex-1">
                                    <div className="h-28 bg-slate-100 group-hover:bg-primary-600 transition-colors duration-500 relative shrink-0">
                                        <div className="absolute -bottom-10 left-6">
                                            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-white group-hover:shadow-lg transition-shadow duration-300">
                                                <img
                                                    src={employee.avatar}
                                                    alt={employee.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-14 px-6 pb-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{employee.name}</h3>
                                                <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5 mt-1">
                                                    <Briefcase size={14} className="group-hover:text-primary-500 transition-colors" />
                                                    {employee.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2.5">
                                            <div className="flex items-center text-sm text-slate-400 gap-3">
                                                <Mail size={16} className="group-hover:text-primary-400 transition-colors" />
                                                <span className="group-hover:text-slate-600 transition-colors truncate">{employee.name.toLowerCase().replace(' ', '.')}@example.com</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                                            <div className="flex flex-col items-center justify-center p-2 rounded-xl group-hover:bg-primary-50/50 transition-colors">
                                                <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active</p>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-2 rounded-xl group-hover:bg-emerald-50/50 transition-colors">
                                                <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Team;
