import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { Calendar, Flag, Users, CheckCircle2, Clock, Activity, Plus, X, ChevronRight, Link as LinkIcon, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetailsModal = ({ projectId, onClose }) => {
    const { projects, addTask, toggleTask, addSubtask, toggleSubtask } = useProjects();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Medium');

    const project = projects.find(p => p.id === parseInt(projectId));

    if (!project) return null;

    const handleQuickAddTask = (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        addTask(project.id, {
            text: newTaskText,
            priority: newTaskPriority,
            deadline: ''
        });

        addToast('Task added to project', 'success');
        setNewTaskText('');
        setNewTaskPriority('Medium');
    };

    const copyInviteLink = () => {
        const link = `${window.location.origin}/invite/${project.joinToken || project.id}`;
        navigator.clipboard.writeText(link);
        addToast('Invite link copied!', 'success');
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-200';
        }
    };

    const stats = {
        totalTasks: project.tasks.length,
        completedTasks: project.tasks.filter(t => t.completed).length,
        daysLeft: project.deadline ? Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                style={{ willChange: "transform, opacity" }}
            >
                {/* Header Section */}
                <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white relative z-10 flex-shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm z-50"
                    >
                        <X size={20} />
                    </motion.button>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 pr-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <motion.h1
                                    className="text-3xl font-extrabold text-slate-900 tracking-tight"
                                >
                                    {project.name}
                                </motion.h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getPriorityColor(project.priority)}`}>
                                    {project.priority}
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <Calendar size={16} />
                                Created on {new Date().toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyInviteLink}
                                className="btn bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <LinkIcon size={16} />
                                Invite Link
                            </motion.button>
                            {project.workspaceEnabled !== false && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(`/project/${project.id}`)}
                                    className="btn btn-primary shadow-lg shadow-primary-500/30 w-full sm:w-auto px-6 py-2 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                                >
                                    Enter Workspace
                                    <ChevronRight size={16} />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                    {/* Description */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Flag size={20} className="text-primary-600" />
                            Project Overview
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg mb-6">
                            {project.description || "No description provided for this project."}
                        </p>

                        {/* Project Team and Security Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Team */}
                            {project.assignedTo && project.assignedTo.length > 0 && (
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 h-full">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Project Team</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.assignedTo.map((user, idx) => (
                                            <div key={user.id || idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                    alt={user.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                                <span className="text-xs font-bold text-slate-700">{user.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Security / Invite Area */}
                            {/* Security / Invite Area */}
                            {project.joinToken && (
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 h-full flex flex-col justify-center">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Copy size={16} className="text-slate-400" />
                                        Share & Invite
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-primary-300 transition-colors"
                                            onClick={copyInviteLink}
                                            title="Copy Invite Link">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Invite Link</span>
                                            <span className="text-sm font-mono font-bold text-primary-600 truncate ml-2">.../invite/{project.joinToken.substring(0, 8)}...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Add Mini Task */}
                        <div className="mt-6">
                            <form
                                onSubmit={handleQuickAddTask}
                                className="relative group max-w-xl"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Plus size={18} className="text-primary-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add a mini task to this project..."
                                    className="w-full pl-11 pr-32 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                                    <select
                                        value={newTaskPriority}
                                        onChange={(e) => setNewTaskPriority(e.target.value)}
                                        className="h-8 text-xs font-bold text-slate-500 bg-slate-100 border-none rounded-lg cursor-pointer focus:ring-0 hover:bg-slate-200 transition-colors"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="submit"
                                        disabled={!newTaskText.trim()}
                                        className="p-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:hover:bg-primary-50 transition-colors font-semibold text-xs uppercase tracking-wide px-3"
                                    >
                                        Add
                                    </motion.button>
                                </div>
                            </form>
                        </div>

                        {/* Mini Tasks List */}
                        <div className="mt-6 space-y-3">
                            {project.tasks.length > 0 && (
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Mini Tasks</h3>
                                    <span className="text-xs font-medium text-slate-400">
                                        {project.tasks.filter(t => t.completed).length}/{project.tasks.length} Done
                                    </span>
                                </div>
                            )}

                            {project.tasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => toggleTask(project.id, task.id)}
                                    className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${task.completed
                                        ? 'bg-slate-50 border-slate-200 opacity-75'
                                        : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`
                                            w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0
                                            ${task.completed ? 'bg-primary-500 border-primary-500' : 'border-slate-300 group-hover:border-primary-400'}
                                        `}>
                                            {task.completed && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-sm font-medium transition-all line-clamp-2 ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                                            }`}>
                                            {task.text}
                                        </span>
                                    </div>

                                    <div className={`
                                        shrink-0 p-1.5 rounded-lg border
                                        ${task.priority === 'High' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                            task.priority === 'Medium' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                'bg-emerald-50 text-emerald-500 border-emerald-100'}
                                    `} title={`Priority: ${task.priority}`}>
                                        <Flag size={14} fill="currentColor" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Progress</p>
                                <p className="text-2xl font-bold text-slate-900">{project.progress}%</p>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Completed</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.completedTasks} / {stats.totalTasks}</p>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Time Left</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.daysLeft > 0 ? `${stats.daysLeft} Days` : 'Due Today'}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectDetailsModal;
