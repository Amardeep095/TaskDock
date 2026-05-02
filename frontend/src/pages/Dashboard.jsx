
import { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    Layout, TrendingUp, Users, Shield, Globe, Plus,
    CheckCircle2, Activity, Clock, MoreVertical, Calendar,
    ChevronRight, Link as LinkIcon, Copy, Filter,
    LayoutDashboard, KeyRound, Eye, Settings, Trash2, Briefcase, X, Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer } from '../utils/animations';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import ProjectCard from '../components/ProjectCard';
import ActivityChart from '../components/charts/ActivityChart';
import ProjectDistributionChart from '../components/charts/ProjectDistributionChart';


const Dashboard = () => {
    const { projects, addProject, employees, deleteProject, searchQuery, joinProjectByLink } = useProjects();
    const { user, getToken } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    // Test backend token fetching
    const [backendMessage, setBackendMessage] = useState('');
    useEffect(() => {
        const fetchBackend = async () => {
            try {
                const token = await getToken();

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/api/protected`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setBackendMessage(data.message);
                } else {
                    setBackendMessage(`Backend returned ${response.status}`);
                }
            } catch (e) {
                console.error("Backend fetch error:", e);
                setBackendMessage("Failed to reach backend");
            }
        };
        fetchBackend();
    }, [getToken]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJoinLinkModalOpen, setIsJoinLinkModalOpen] = useState(false);
    const [isJoinIdModalOpen, setIsJoinIdModalOpen] = useState(false);
    const [joinLink, setJoinLink] = useState('');
    const [joinId, setJoinId] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeMenuProject, setActiveMenuProject] = useState(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeMenuProject && !event.target.closest('.project-menu-trigger') && !event.target.closest('.project-menu-dropdown')) {
                setActiveMenuProject(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenuProject]);

    const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '', priority: 'Medium', assignedTo: [], workspaceEnabled: true, initialTask: '' });
    const [inviteLink, setInviteLink] = useState('');

    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!newProject.name) return;

        const projectToAdd = { ...newProject };
        if (projectToAdd.initialTask) {
            projectToAdd.tasks = [{ id: Date.now(), text: projectToAdd.initialTask, priority: 'Medium', completed: false, subtasks: [] }];
        }
        delete projectToAdd.initialTask;

        addToast('Creating project...', 'info');
        const success = await addProject(projectToAdd);

        if (success) {
            addToast('Project created successfully!', 'success');
            setNewProject({ name: '', description: '', deadline: '', priority: 'Medium', assignedTo: [], workspaceEnabled: true, initialTask: '' });
            setIsModalOpen(false);
        } else {
            addToast('Failed to create project.', 'error');
        }
    }

    const toggleEmployeeSelection = (employee) => {
        if (newProject.assignedTo.some(e => e.id === employee.id)) {
            setNewProject({
                ...newProject,
                assignedTo: newProject.assignedTo.filter(e => e.id !== employee.id)
            });
        } else {
            setNewProject({
                ...newProject,
                assignedTo: [...newProject.assignedTo, employee]
            });
        }
    };

    const generateInviteLink = () => {
        const uniqueId = Math.random().toString(36).substring(2, 10);
        const link = `${window.location.origin}/invite/${uniqueId}`;
        setInviteLink(link);
        addToast('Invite link generated!', 'success');
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        addToast('Link copied to clipboard', 'success');
    };

    const handleJoinByLink = async (e) => {
        e.preventDefault();
        if (!joinLink) return;

        try {
            // Looking for invite codes in any URL format, or just a raw code
            const urlParts = joinLink.split('/invite/');
            const tokenToJoin = urlParts.length > 1 ? urlParts[1].split('/')[0] : joinLink.trim();

            if (!tokenToJoin) {
                addToast('An Invite Link or Code is required.', 'error');
                return;
            }

            addToast('Joining project...', 'info');

            const result = await joinProjectByLink(tokenToJoin);
            if (result.success) {
                addToast(result.message, 'success');
                setIsJoinLinkModalOpen(false);
                setJoinLink('');
                setJoinPassword('');
            } else {
                addToast(result.message, 'error');
            }

        } catch (error) {
            console.error("Error joining project:", error);
            addToast('An error occurred.', 'error');
        }
    };

    const handleJoinById = async (e) => {
        e.preventDefault();
        if (!joinId) {
            addToast('A Project Invite Token is required.', 'error');
            return;
        }

        addToast('Verifying Token...', 'info');
        const result = await joinProjectByLink(joinId);

        if (result.success) {
            addToast(result.message, 'success');
            setIsJoinIdModalOpen(false);
            setJoinId('');
            setJoinPassword('');
        } else {
            addToast(result.message, 'error');
        }
    };

    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };

    const filteredProjects = Array.isArray(projects) ? projects.filter(project => {
        const nameMatch = (project?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = (project?.description || "").toLowerCase().includes(searchQuery.toLowerCase());
        const isNotComplete = (project?.progress || 0) < 100;
        return (nameMatch || descMatch) && isNotComplete;
    }).sort((a, b) => {
        const priorityA = priorityOrder[a?.priority] || 4;
        const priorityB = priorityOrder[b?.priority] || 4;
        return priorityA - priorityB;
    }) : [];



    // Stats Calculation
    const statsData = {
        total: Array.isArray(projects) ? projects.length : 0,
        completed: Array.isArray(projects) ? projects.filter(p => p.progress === 100).length : 0,
        activeTasks: Array.isArray(projects) ? projects.reduce((acc, p) => {
            if (!p || !Array.isArray(p.tasks)) return acc;
            return acc + p.tasks.filter(t => !t.completed).length;
        }, 0) : 0,
        upcomingDeadlines: Array.isArray(projects) ? projects.filter(p => {
            if (!p || !p.deadline || p.progress === 100) return false;
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const parts = p.deadline.split('-');
                if (parts.length !== 3) return false;
                const due = new Date(parts[0], parts[1] - 1, parts[2]);
                due.setHours(0, 0, 0, 0);
                if (isNaN(due.getTime())) return false;
                const diffTime = due - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 7;
            } catch (e) { return false; }
        }).length : 0
    };

    const stats = [
        { label: 'Total Projects', value: statsData.total, change: 'Total', color: 'primary', icon: Layout },
        { label: 'Completed', value: statsData.completed, change: 'Done', color: 'success', icon: CheckCircle2 },
        { label: 'Active Tasks', value: statsData.activeTasks, change: 'Pending', color: 'danger', icon: Activity },
        { label: 'Upcoming Deadlines', value: statsData.upcomingDeadlines, change: 'Urgent', color: 'warning', icon: Clock }
    ];

    return (
        <div className="flex-1 flex flex-col min-h-screen font-sans bg-slate-50/50 -mx-4 md:-mx-8 -mt-6">

            {/* Header Removed - Moved to Layout */}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar space-y-8 pb-20">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-end gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
                        <p className="text-slate-500 mb-2">Here's what's happening with your projects today.</p>
                        {backendMessage && (
                            <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full border border-emerald-200">
                                🔌 {backendMessage}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsJoinLinkModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:text-primary-600 transition-colors shadow-sm overflow-hidden"
                            style={{ willChange: "transform, opacity" }}
                        >
                            <motion.div
                                className="flex items-center gap-2"
                                animate={{ opacity: isJoinLinkModalOpen ? 0 : 1 }}
                                transition={{ duration: 0.1, delay: isJoinLinkModalOpen ? 0 : 0.2 }}
                            >
                                <LinkIcon size={18} />
                                <span className="hidden sm:inline">Join via Link</span>
                            </motion.div>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsJoinIdModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:text-primary-600 transition-colors shadow-sm overflow-hidden"
                            style={{ willChange: "transform, opacity" }}
                        >
                            <motion.div
                                className="flex items-center gap-2"
                                animate={{ opacity: isJoinIdModalOpen ? 0 : 1 }}
                                transition={{ duration: 0.1, delay: isJoinIdModalOpen ? 0 : 0.2 }}
                            >
                                <KeyRound size={18} />
                                <span className="hidden sm:inline">Join via ID</span>
                            </motion.div>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="group relative flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-900/20 overflow-hidden isolate"
                            style={{ willChange: "transform, opacity" }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-slate-900 transition-colors group-hover:bg-slate-800"
                                animate={{ opacity: isModalOpen ? 0 : 1 }}
                                transition={{ duration: 0.1, delay: isModalOpen ? 0 : 0.2 }}
                            />
                            <motion.div
                                className="relative z-10 flex items-center gap-2 text-white"
                                animate={{ opacity: isModalOpen ? 0 : 1 }}
                                transition={{ duration: 0.1, delay: isModalOpen ? 0 : 0.2 }}
                            >
                                <Plus size={18} />
                                <span>New Project</span>
                            </motion.div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl transition-colors duration-300 ${stat.color === 'primary' ? 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white' :
                                    stat.color === 'success' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                                        stat.color === 'danger' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' :
                                            'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                                    }`}>
                                    <stat.icon size={22} />
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stat.color === 'primary' ? 'bg-primary-50 text-primary-700' :
                                    stat.color === 'success' ? 'bg-emerald-50 text-emerald-700' :
                                        stat.color === 'danger' ? 'bg-rose-50 text-rose-700' :
                                            'bg-amber-50 text-amber-700'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <ActivityChart />
                    </div>
                    <div className="lg:col-span-1">
                        <ProjectDistributionChart projects={projects} />
                    </div>
                </div>

                {/* Active Projects */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                            <Globe size={20} className="text-secondary-600" />
                            Active Projects
                        </h3>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/projects')}
                            className="text-sm text-primary-600 font-bold hover:text-primary-700 flex items-center gap-1 group bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                            View all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={() => setSelectedProject(project)}
                                />
                            ))}
                        </AnimatePresence>
                        {filteredProjects.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                                <Folder size={48} className="mb-4 opacity-50" />
                                <p className="font-medium text-lg">No active projects found</p>
                                <p className="text-sm">Click "New Project" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal for new project */}
            {/* Keeping the same modal logic but updating styles slightly if needed, or keeping as is */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{ willChange: "transform, opacity" }}
                            className="relative bg-white rounded-3xl p-8 w-full max-w-4xl shadow-2xl border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Create Project</h2>
                                    <p className="text-slate-500 text-sm">Launch a new initiative</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-slate-400" />
                                </motion.button>
                            </div>

                            <form onSubmit={handleAddProject} className="flex flex-col gap-8">
                                {/* Core Details Section */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Core Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Project Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                                    placeholder="e.g. Website Redesign"
                                                    value={newProject.name}
                                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                                                <textarea
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium min-h-[110px] resize-none"
                                                    placeholder="Briefly describe the goals..."
                                                    value={newProject.description}
                                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Deadline</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                                    value={newProject.deadline}
                                                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Priority</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium cursor-pointer"
                                                    value={newProject.priority}
                                                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                                                >
                                                    <option value="Low">Low Priority</option>
                                                    <option value="Medium">Medium Priority</option>
                                                    <option value="High">High Priority</option>
                                                </select>
                                            </div>


                                        </div>
                                    </div>
                                </div>

                                {/* Project Settings Section */}
                                <div className="space-y-6 pt-6 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Project Preferences</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Workspace Toggle */}
                                        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl hidden md:flex h-full">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 mb-1">Enable Workspace</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">Create an isolated environment for this project.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    className="sr-only peer"
                                                    checked={newProject.workspaceEnabled}
                                                    onChange={(e) => setNewProject({ ...newProject, workspaceEnabled: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>

                                        {/* Mobile Workspace Toggle (Vertical display) */}
                                        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl md:hidden">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 mb-1">Enable Workspace</h4>
                                                <p className="text-xs text-slate-500">Create an isolated environment.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    className="sr-only peer"
                                                    checked={newProject.workspaceEnabled}
                                                    onChange={(e) => setNewProject({ ...newProject, workspaceEnabled: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>

                                        {/* Security Information Area */}
                                        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <KeyRound size={16} className="text-slate-400" />
                                                <h4 className="text-sm font-bold text-slate-900">Project Security</h4>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                A unique secure <b>Invite Link</b> will be generated for you once this project is created, allowing you to quickly share access with your team!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Keep Assign Members handling in case employees are ever added back */}
                                    {employees.length > 0 && (
                                        <div className="space-y-2 pt-4">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Assign Initial Members</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                                                {employees.map(emp => (
                                                    <div
                                                        key={emp.id}
                                                        onClick={() => toggleEmployeeSelection(emp)}
                                                        className={`flex items-center p-2 rounded-xl cursor-pointer border transition-all ${newProject.assignedTo.some(e => e.id === emp.id)
                                                            ? 'bg-slate-900 text-white border-slate-900'
                                                            : 'bg-white border-slate-200 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full mr-2 bg-gray-200" />
                                                        <span className={`text-xs font-bold truncate ${newProject.assignedTo.some(e => e.id === emp.id) ? 'text-white' : 'text-slate-700'}`}>{emp.name}</span>
                                                        {newProject.assignedTo.some(e => e.id === emp.id) && (
                                                            <CheckCircle2 size={14} className="ml-auto text-white" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Action Buttons */}
                                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 w-full">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="bg-primary-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 transition-all font-medium"
                                    >
                                        Create Project
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            {/* Modal for Join via Link */}
            {
                isJoinLinkModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsJoinLinkModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{ willChange: "transform, opacity" }}
                            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Join Project</h2>
                                    <p className="text-slate-500 text-sm">Enter invite link</p>
                                </div>
                                <button onClick={() => setIsJoinLinkModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleJoinByLink} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Invite Link or Token</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                        placeholder="e.g. https://domain.com/invite/xyz123 or xyz123"
                                        value={joinLink}
                                        onChange={(e) => setJoinLink(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => setIsJoinLinkModalOpen(false)}
                                        className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="bg-primary-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 transition-all font-medium"
                                    >
                                        Join Project
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            {/* Modal for Join via ID */}
            {
                isJoinIdModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsJoinIdModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{ willChange: "transform, opacity" }}
                            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Join Project</h2>
                                    <p className="text-slate-500 text-sm">Enter ID & Password</p>
                                </div>
                                <button onClick={() => setIsJoinIdModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleJoinById} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Join Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                        placeholder="e.g. A1B2C3"
                                        value={joinId}
                                        onChange={(e) => setJoinId(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-medium"
                                        placeholder="••••••••"
                                        value={joinPassword}
                                        onChange={(e) => setJoinPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => setIsJoinIdModalOpen(false)}
                                        className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="bg-primary-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 transition-all font-medium"
                                    >
                                        Join Project
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            {/* Project Details Modal with Morphing Animation */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailsModal
                        projectId={selectedProject.id}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>

        </div >
    );
};

export default Dashboard;
