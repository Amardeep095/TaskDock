import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import TaskItem from '../components/TaskItem';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, addTask, toggleTask, addSubtask, toggleSubtask } = useProjects();
    const { addToast } = useToast();
    const [newTask, setNewTask] = useState({ text: '', priority: 'Medium', deadline: '' });
    const [isInviteCopied, setIsInviteCopied] = useState(false);

    const project = projects.find(p => p.id === parseInt(id));

    if (!project) {
        return <div className="text-center py-12">Project not found</div>;
    }

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.text.trim()) return;
        addTask(project.id, newTask);
        addToast('Task added successfully', 'success');
        setNewTask({ text: '', priority: 'Medium', deadline: '' });
    };

    const handleCopyInvite = () => {
        const link = `${window.location.origin}/invite/${project.id}`;
        navigator.clipboard.writeText(link);
        addToast('Invite link copied to clipboard!', 'success');
        setIsInviteCopied(true);
        setTimeout(() => setIsInviteCopied(false), 2000);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-danger-50 text-danger-600 border-danger-100';
            case 'Medium': return 'bg-warning-50 text-warning-600 border-warning-100';
            case 'Low': return 'bg-success-50 text-success-600 border-success-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-200';
        }
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

            <div className="relative z-10 w-full p-4 md:p-8 space-y-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 hover:text-primary-600 transition-colors group mb-4"
                >
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all mr-3 border border-slate-100">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="font-semibold text-lg">Back to Dashboard</span>
                </button>

                <div className="glass rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50" data-aos="fade-up">
                    <div className="p-8 md:p-10 border-b border-white/40 bg-gradient-to-r from-white/40 to-transparent backdrop-blur-md">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
                                    {project.priority && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getPriorityColor(project.priority)}`}>
                                            {project.priority}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6 max-w-2xl">{project.description}</p>

                                <div className="flex items-center gap-4">
                                    {project.deadline && (
                                        <div className="inline-flex items-center text-sm font-medium text-slate-500 bg-white/60 px-4 py-2 rounded-xl border border-white/50 shadow-sm">
                                            <span className="text-slate-400 mr-2">Deadline:</span>
                                            <span className="text-slate-700">{new Date(project.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div className="inline-flex items-center text-sm font-medium text-slate-500 bg-white/60 px-4 py-2 rounded-xl border border-white/50 shadow-sm">
                                        <span className="text-slate-400 mr-2">Tasks:</span>
                                        <span className="text-slate-700">{project.tasks.length}</span>
                                    </div>
                                    {project.assignedTo && project.assignedTo.length > 0 && (
                                        <div className="inline-flex items-center text-sm font-medium text-slate-500 bg-white/60 px-4 py-2 rounded-xl border border-white/50 shadow-sm">
                                            <span className="text-slate-400 mr-2">Team:</span>
                                            <div className="flex -space-x-2">
                                                {project.assignedTo.map((emp, i) => (
                                                    <img
                                                        key={emp.id || i}
                                                        src={emp.avatar}
                                                        alt={emp.name}
                                                        className="w-6 h-6 rounded-full border-2 border-white"
                                                        title={emp.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end md:min-w-[150px] gap-4">
                                <button
                                    onClick={handleCopyInvite}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 text-slate-700 text-sm font-semibold rounded-xl border border-white/50 shadow-sm transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    {isInviteCopied ? 'Copied!' : 'Invite Link'}
                                </button>

                                <div className="flex flex-col items-end w-full">
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-2">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * project.progress) / 100} className="text-primary-600 transition-all duration-1000 ease-out" strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute text-xl md:text-2xl font-bold text-slate-800">{project.progress}%</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest text-right">Completion</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 bg-white/30 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="flex justify-between items-end border-b border-gray-200/60 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Project Tasks</h2>
                                    <p className="text-gray-500 text-sm mt-1">Manage tasks and milestones</p>
                                </div>
                                <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
                                    {project.tasks.filter(t => t.completed).length}/{project.tasks.length} Completed
                                </span>
                            </div>

                            {/* Quick Add Mini Task */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newTask.text.trim()) return;
                                    handleAddTask(e);
                                }}
                                className="relative group"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Plus size={18} className="text-primary-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add a mini task..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    value={newTask.text}
                                    onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                                />
                                <div className="absolute inset-y-0 right-2 flex items-center">
                                    <button
                                        type="submit"
                                        disabled={!newTask.text.trim()}
                                        className="p-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:hover:bg-primary-50 transition-colors font-semibold text-xs uppercase tracking-wide px-3"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="space-y-4 mb-10">
                            {project.tasks.map(task => (
                                <div key={task.id} data-aos="fade-up">
                                    <TaskItem
                                        task={task}
                                        onToggle={() => toggleTask(project.id, task.id)}
                                        onAddSubtask={(text) => addSubtask(project.id, task.id, text)}
                                        onToggleSubtask={(subtaskId) => toggleSubtask(project.id, task.id, subtaskId)}
                                    />
                                </div>
                            ))}
                            {project.tasks.length === 0 && (
                                <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-200/70 bg-slate-50/50">
                                    <p className="text-slate-400 font-medium">No tasks yet. Kickstart this project by adding a task below!</p>
                                </div>
                            )}
                        </div>

                        {/* Team Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="glass p-6 rounded-2xl border border-white/40 shadow-xl shadow-slate-200/30">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    Project Team
                                </h3>

                                {project.assignedTo && project.assignedTo.length > 0 ? (
                                    <div className="space-y-4">
                                        {project.assignedTo.map((user, idx) => (
                                            <div key={user.id || idx} className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                                    {user.role && <p className="text-xs text-slate-500 font-medium">{user.role}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                                        <p className="text-sm text-slate-500 font-medium">No team members assigned.</p>
                                        <button
                                            onClick={handleCopyInvite}
                                            className="mt-3 text-xs font-bold text-primary-600 hover:text-primary-700"
                                        >
                                            Invite someone
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
