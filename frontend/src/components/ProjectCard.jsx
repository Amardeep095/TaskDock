import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Trash2, MoreVertical, ExternalLink, Users, Clock } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCard = ({ project, onClick }) => {
    const navigate = useNavigate();
    const { deleteProject } = useProjects();
    const { addToast } = useToast();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="group relative bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            {/* Subtle Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header: Icon & Menu */}
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:rotate-3 ${project.priority === 'High' ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-200' :
                        project.priority === 'Medium' ? 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-200' :
                            'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-200'
                        }`}>
                        <span className="font-bold text-xl">{project.name.charAt(0).toUpperCase()}</span>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            <MoreVertical size={18} />
                        </motion.button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 ring-1 ring-black/5 overflow-hidden z-50 origin-top-right"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-1.5 space-y-1">
                                        <motion.button
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                if (window.confirm('Delete this project?')) {
                                                    deleteProject(project.id);
                                                    addToast('Project deleted', 'success');
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getPriorityStyle(project.priority)}`}>
                            {project.priority || 'No Priority'}
                        </span>
                        {project.progress === 100 && (
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                                <CheckCircle2 size={10} />
                                Completed
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2 leading-tight">
                        {project.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {project.description}
                    </p>
                </div>

                {/* Footer: Progress & Meta */}
                <div className="mt-auto space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                            <span className="text-sm font-bold text-slate-900">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-slate-900'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/60">
                        <div className="flex -space-x-2">
                            {project.assignedTo && project.assignedTo.length > 0 ? (
                                project.assignedTo.slice(0, 3).map((user, idx) => (
                                    <div key={idx} className="relative group/avatar">
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 object-cover bg-white"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <Users size={14} />
                                </div>
                            )}
                            {project.assignedTo?.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 ring-1 ring-slate-100">
                                    +{project.assignedTo.length - 3}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <Clock size={14} className="text-slate-400" />
                            <span>{project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Setting'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
