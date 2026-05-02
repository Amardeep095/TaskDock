import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { Code, Terminal, Cpu, Clock, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkspaceSelect = () => {
    const navigate = useNavigate();
    const { projects } = useProjects();

    // Filter only active projects (not completed) for the workspace list
    const activeProjects = projects.filter(p => p.status !== 'Completed');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] p-6 md:p-8 space-y-8 bg-slate-50/50">
            <div className="flex flex-col gap-2 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
                >
                    <div className="p-2.5 bg-primary-600/10 rounded-xl text-primary-600">
                        <Terminal size={32} strokeWidth={2.5} />
                    </div>
                    Select Workspace
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 text-lg ml-1"
                >
                    Choose an active project to launch your collaborative environment.
                </motion.p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
            >
                {activeProjects.map(project => (
                    <motion.div
                        variants={itemVariants}
                        key={project.id}
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="group relative overflow-hidden rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-500 cursor-pointer flex flex-col"
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Top decorative glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="p-6 relative z-10 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-5">
                                <div className="p-3.5 bg-slate-50 text-slate-700 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 ring-1 ring-slate-200/50 group-hover:ring-primary-600 shadow-sm group-hover:shadow-md">
                                    <Code size={24} strokeWidth={2} />
                                </div>
                                <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest shadow-sm">
                                    <Activity size={12} className="animate-pulse" />
                                    Active
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-700 transition-colors line-clamp-1">
                                {project.name}
                            </h3>
                            <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="space-y-4 w-full mt-auto">
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                                        <span>Progress</span>
                                        <span className="text-primary-600">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${project.progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                            className="bg-primary-500 h-1.5 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Cpu size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                                        <span className="group-hover:text-slate-600 transition-colors">Monaco Ready</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Create New Placeholder */}
                <motion.div
                    variants={itemVariants}
                    onClick={() => navigate('/dashboard')}
                    className="group relative rounded-[2rem] border-2 border-dashed border-slate-200/80 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer min-h-[min(320px,100%)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-primary-100 transition-all duration-300">
                            <Terminal size={28} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-primary-700 transition-colors">Create New Workspace</span>
                        <span className="text-sm mt-2 font-medium bg-slate-200/50 px-3 py-1 rounded-full text-slate-500 group-hover:bg-primary-100/50 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                            Go to Dashboard <ChevronRight size={14} />
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default WorkspaceSelect;
