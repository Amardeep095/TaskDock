import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Search, Hash, Users, Filter, ChevronRight, Activity, Plus } from 'lucide-react';
import ProjectChat from '../components/ProjectChat';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
    const { projects, addMessage, joinProjectRoom } = useProjects();
    const { user } = useAuth();
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Select first project by default if none selected
    useEffect(() => {
        if (projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0].id);
        }
        if (selectedProjectId) {
            console.log(`📡 Joining socket room for project: ${selectedProjectId}`);
            joinProjectRoom(selectedProjectId);
        }
    }, [projects, selectedProjectId]);

    // DERIVE selectedProject from global projects array to ensure reactivity
    const selectedProject = projects.find(p => p.id === selectedProjectId);

    // Filter projects where user is assigned or is creator
    const userProjects = projects.filter(p =>
        p.createdBy === user?.id || (p.assignedTo && p.assignedTo.some(emp => emp.clerkId === user?.id))
    );

    const filteredProjects = userProjects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] p-6 md:p-8 space-y-8 bg-slate-50/50 flex flex-col overflow-hidden">
            {/* Standard Header Section matching Workspace/Projects */}
            <div className="flex flex-col gap-2 relative z-10 shrink-0">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
                >
                    <div className="p-2.5 bg-primary-600/10 rounded-xl text-primary-600">
                        <MessageSquare size={32} strokeWidth={2.5} />
                    </div>
                    Messages
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 text-lg ml-1"
                >
                    Collaborate with your team members in real-time.
                </motion.p>
            </div>

            {/* Main Chat Interface Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row min-h-0 overflow-hidden relative"
            >
                {/* Project List Sidebar */}
                <div className="w-full md:w-80 bg-white/40 border-r border-slate-200/50 flex flex-col backdrop-blur-md shrink-0">
                    <div className="p-6 border-b border-slate-200/50">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Find projects..."
                                className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all shadow-sm placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.button
                                    layout
                                    key={project.id}
                                    onClick={() => setSelectedProjectId(project.id)}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full text-left p-4 rounded-3xl transition-all flex items-center gap-4 group ${selectedProjectId === project.id
                                        ? 'bg-white shadow-xl shadow-primary-600/5 border border-primary-100/50 ring-1 ring-primary-50/50'
                                        : 'text-slate-600 border border-transparent hover:bg-white/60 hover:border-slate-200/50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner transition-all ${selectedProjectId === project.id
                                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rotate-3 shadow-primary-200'
                                        : 'bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600'
                                        }`}>
                                        {project.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className={`font-bold text-sm truncate transition-colors ${selectedProject?.id === project.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {project.name}
                                            </h3>
                                            {project.chat?.length > 0 && (
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(project.chat[project.chat.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate font-medium">
                                            {project.chat?.length > 0
                                                ? project.chat[project.chat.length - 1].text
                                                : `No messages yet in ${project.name}`
                                            }
                                        </p>
                                    </div>
                                    <ChevronRight size={14} className={`transition-transform duration-300 ${selectedProject?.id === project.id ? 'translate-x-0 opacity-100 text-primary-500' : '-translate-x-2 opacity-0'}`} />
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Chat Display Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white/20 backdrop-blur-md relative">
                    {selectedProject ? (
                        <>
                            {/* Detailed Header for Chat */}
                            <div className="p-6 border-b border-slate-200/50 flex justify-between items-center bg-white/40 backdrop-blur-xl shrink-0">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl transition-all bg-gradient-to-br ${selectedProject.priority === 'High' ? 'from-rose-500 to-rose-600 shadow-rose-200' :
                                            selectedProject.priority === 'Medium' ? 'from-amber-400 to-amber-500 shadow-amber-200' :
                                                'from-primary-500 to-primary-600 shadow-primary-200'
                                            }`}>
                                            {selectedProject.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-2xl text-slate-900 tracking-tight leading-tight">{selectedProject.name}</h2>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-slate-200/50">
                                                <Activity size={10} className="text-slate-400" />
                                                {selectedProject.priority} Priority
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 rounded-lg text-[10px] font-bold text-primary-600 uppercase tracking-wider border border-primary-100/50">
                                                <Hash size={10} className="text-primary-400" />
                                                {selectedProject.chat?.length || 0} Messages
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 hidden sm:flex">
                                    <div className="flex -space-x-3 hover:-space-x-1 transition-all duration-300">
                                        {selectedProject.assignedTo ? (
                                            selectedProject.assignedTo.slice(0, 4).map((emp, i) => (
                                                <div
                                                    key={i}
                                                    className="w-10 h-10 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg ring-1 ring-slate-100"
                                                    title={emp.name}
                                                >
                                                    <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-400">
                                                <Users size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-500 transition-all hover:-translate-y-0.5 active:translate-y-0">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Messages Wrapper */}
                            <div className="flex-1 overflow-hidden relative">
                                <div className="absolute inset-0">
                                    <ProjectChat
                                        project={selectedProject}
                                        onSendMessage={addMessage}
                                        fullHeight={true}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/10 p-8 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-6 relative"
                            >
                                <div className="absolute inset-0 bg-primary-600/5 blur-xl rounded-full" />
                                <MessageSquare size={40} className="text-primary-600 relative z-10" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-slate-800">Your Conversations</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2 max-w-xs">Select a project from the sidebar to start collaborating with your team.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Messages;
