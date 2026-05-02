import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { ChevronLeft, Calendar, Flag, Users, CheckCircle2, Clock, Activity, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, addTask, toggleTask } = useProjects();
    const { addToast } = useToast();
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Medium');

    const project = projects.find(p => p.id === parseInt(id));

    if (!project) {
        return <div className="text-center py-12">Project not found</div>;
    }

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
        <div className="relative min-h-screen bg-transparent overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gray-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-gray-50/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-8 space-y-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-slate-500 hover:text-primary-600 transition-colors group mb-4"
                >
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all mr-3 border border-slate-100">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="font-semibold text-lg">Back to Dashboard</span>
                </button>

                <div className="glass rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50" data-aos="fade-up">
                    {/* Header Section */}
                    <div className="p-8 md:p-10 border-b border-white/40 bg-gradient-to-r from-white/60 to-transparent backdrop-blur-md">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getPriorityColor(project.priority)}`}>
                                        {project.priority}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium flex items-center gap-2">
                                    <Calendar size={16} />
                                    Created on {new Date().toLocaleDateString()} {/* Mock date for now */}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/project/${project.id}`)}
                                className="btn btn-primary shadow-lg shadow-primary-500/30 animate-pulse"
                            >
                                Enter Workspace
                            </button>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-8">
                        {/* Description */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Flag size={20} className="text-primary-600" />
                                Project Overview
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {project.description || "No description provided for this project."}
                            </p>

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
                                        <button
                                            type="submit"
                                            disabled={!newTaskText.trim()}
                                            className="p-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:hover:bg-primary-50 transition-colors font-semibold text-xs uppercase tracking-wide px-3"
                                        >
                                            Add
                                        </button>
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
                                        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${task.completed
                                            ? 'bg-slate-50 border-slate-200 opacity-75'
                                            : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className={`
                                            w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                                            ${task.completed ? 'bg-primary-500 border-primary-500' : 'border-slate-300 group-hover:border-primary-400'}
                                        `}>
                                            {task.completed && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-sm font-medium transition-all flex-1 ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                                            }`}>
                                            {task.text}
                                        </span>

                                        {/* Priority Flag */}
                                        <div className={`
                                            p-1 rounded-md 
                                            ${task.priority === 'High' ? 'bg-rose-50 text-rose-500' :
                                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-500' :
                                                    'bg-emerald-50 text-emerald-500'}
                                        `} title={`Priority: ${task.priority}`}>
                                            <Flag size={14} fill="currentColor" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Stats Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 bg-white/50 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Progress</p>
                                    <p className="text-2xl font-bold text-slate-900">{project.progress}%</p>
                                </div>
                            </div>
                            <div className="p-5 bg-white/50 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Completed</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.completedTasks} / {stats.totalTasks}</p>
                                </div>
                            </div>
                            <div className="p-5 bg-white/50 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Time Left</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.daysLeft > 0 ? `${stats.daysLeft} Days` : 'Due Today'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Team Members */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Users size={20} className="text-primary-600" />
                                Assigned Members
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {project.assignedTo && project.assignedTo.length > 0 ? (
                                    project.assignedTo.map(member => (
                                        <div key={member.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/60 shadow-sm min-w-[200px]">
                                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full bg-slate-200" />
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                                                <p className="text-xs text-slate-500">{member.role}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 italic">No members assigned.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectInfo;
