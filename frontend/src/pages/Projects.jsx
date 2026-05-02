import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useState } from 'react';
import { Code, Terminal, Cpu, Clock, ChevronRight, Activity, ArrowRight, CheckCircle2, Folder, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';

const Projects = () => {
    const navigate = useNavigate();
    const { projects } = useProjects();
    const [selectedProject, setSelectedProject] = useState(null);

    // Filter projects with null checks
    const activeProjects = Array.isArray(projects) ? projects.filter(p => (p?.progress || 0) < 100) : [];
    const completedProjects = Array.isArray(projects) ? projects.filter(p => (p?.progress || 0) === 100) : [];

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

    const renderProjectCard = (project) => (
        <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
        />
    );

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] p-6 md:p-8 space-y-12 bg-slate-50/50">
            <div className="flex flex-col gap-2 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
                >
                    <div className="p-2.5 bg-primary-600/10 rounded-xl text-primary-600">
                        <Folder size={32} strokeWidth={2.5} />
                    </div>
                    Projects
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 text-lg ml-1"
                >
                    Manage and launch your project environments.
                </motion.p>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={20} className="text-blue-500" />
                    Active Projects
                </h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                >
                    <AnimatePresence>
                        {activeProjects.map(project => renderProjectCard(project))}
                    </AnimatePresence>

                    {/* Create New Placeholder */}
                    <motion.div
                        variants={itemVariants}
                        onClick={() => navigate('/dashboard')}
                        className="group relative rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-white transition-all duration-300 cursor-pointer min-h-[320px] shadow-sm overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-primary-100 transition-all duration-300">
                                <Plus size={28} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                            </div>
                            <span className="font-bold text-slate-700">New Project</span>
                            <span className="text-xs mt-2 font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-500 flex items-center gap-1 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                Go to Dashboard <ChevronRight size={14} />
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {completedProjects.length > 0 && (
                <div className="space-y-6 pt-12 border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle2 size={24} className="text-emerald-500" />
                        Completed Projects
                    </h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                    >
                        <AnimatePresence>
                            {completedProjects.map(project => renderProjectCard(project))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailsModal
                        projectId={selectedProject.id}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Simple Plus icon component
const Plus = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

export default Projects;
