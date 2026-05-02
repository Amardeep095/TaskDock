import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import ProjectCard from '../components/ProjectCard';
import { Search, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { Link } from 'react-router-dom';

const CompletedProjects = () => {
    const { projects } = useProjects();
    const [searchQuery, setSearchQuery] = useState('');

    const completedProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return project.progress === 100 && matchesSearch;
    });

    return (
        <div className="relative min-h-screen bg-transparent overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gray-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
            </div>

            <div className="relative z-10 space-y-8 p-6 md:p-8 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            <CheckCircle2 className="text-primary-600" size={32} />
                            Completed Projects
                        </h1>
                        <p className="text-slate-500 mt-2">Review your successes and past achievements</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative group"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search archives..."
                            className="pl-9 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent w-full md:w-64 shadow-sm transition-all hover:bg-white/80 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                >
                    {completedProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={fadeInUp}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </motion.div>

                {completedProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300"
                    >
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 border border-primary-100">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No completed projects yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8">
                            Keep working hard! Your finished projects will appear here once they reach 100% completion.
                        </p>
                        <Link to="/dashboard" className="btn btn-primary inline-flex items-center gap-2">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CompletedProjects;
