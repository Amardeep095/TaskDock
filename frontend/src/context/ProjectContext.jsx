import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const { user, loading, getToken } = useAuth();
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const socket = useRef(null);

    // Initialize Socket
    useEffect(() => {
        console.log(`🔌 Initializing Socket.io connection to ${API_URL}`);
        socket.current = io(API_URL, {
            reconnectionAttempts: 10,
            transports: ['polling', 'websocket']
        });

        socket.current.on('new-message', (data) => {
            const { projectId, message } = data;
            console.log(`📡 Real-time message received for project: ${projectId}`, message);

            // Ensure ID comparison is robust (handle string vs number)
            const targetId = Number(projectId);

            setProjects(prev => {
                const updatedProjects = prev.map(p => {
                    if (Number(p.id) === targetId) {
                        const currentChat = p.chat || [];
                        const isDuplicate = currentChat.some(m =>
                            m.id === message.id ||
                            (m.timestamp === message.timestamp && m.text === message.text && m.senderId === message.senderId)
                        );

                        if (!isDuplicate) {
                            console.log(`✅ Appending message to project ${targetId}`);
                            return { ...p, chat: [...currentChat, message] };
                        } else {
                            console.log(`⏭️ Skipping duplicate message for project ${targetId}`);
                        }
                    }
                    return p;
                });
                return updatedProjects;
            });
        });

        socket.current.on('joined-room', (data) => {
            console.log(`✅ Server confirmed joining room: ${data.room}`);
        });

        socket.current.on('connect', () => {
            console.log('✅ Socket connected successfully. ID:', socket.current.id);
            // Test ping
            socket.current.emit('ping-test');
        });

        socket.current.on('pong-test', (data) => {
            console.log('🏓 Pong received from server at:', data.time);
        });

        socket.current.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, []);

    // Helper to join rooms
    const joinProjectRoom = (projectId) => {
        if (socket.current) {
            if (socket.current.connected) {
                socket.current.emit('join-project', projectId);
            } else {
                // If not connected, wait for connect event
                socket.current.once('connect', () => {
                    socket.current.emit('join-project', projectId);
                });
            }
        }
    };

    const fetchProjects = async () => {
        if (!user) {
            setProjects([]);
            return;
        }
        try {
            const token = await getToken();

            // Version Check to verify backend update
            const vRes = await fetch(`${API_URL}/api/public`);
            if (vRes.ok) {
                const vData = await vRes.json();
                console.log("🔍 Backend Version Check:", vData.version || "Unknown");
            }

            const res = await fetch(`${API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log("📥 Projects fetched from backend:", data);
                setProjects(data);
            } else {
                console.error("Failed to fetch projects", res.status);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchProjects();
        }
    }, [user, loading]);

    const [employees] = useState([]);

    const addProject = async (project) => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...project,
                    id: project.id || Date.now(),
                    progress: project.progress || 0,
                    tasks: project.tasks || [],
                    chat: project.chat || []
                })
            });

            if (res.ok) {
                const savedProject = await res.json();
                setProjects(prev => [...prev, savedProject]);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error adding project:", error);
            return false;
        }
    };

    const deleteProject = async (projectId) => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/projects/${projectId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== projectId));
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const addTask = async (projectId, task) => {
        try {
            const token = await getToken();
            const newTask = { ...task, id: Date.now(), completed: false, subtasks: [] };
            const res = await fetch(`${API_URL}/api/projects/${projectId}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newTask)
            });

            if (res.ok) {
                const updatedProject = await res.json();
                setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const toggleTask = async (projectId, taskId) => {
        // Optimistic UI update
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
                const progress = updatedTasks.length > 0 ? Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100) : 0;
                return { ...p, tasks: updatedTasks, progress };
            }
            return p;
        }));

        try {
            const token = await getToken();
            await fetch(`${API_URL}/api/projects/${projectId}/tasks/${taskId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error toggling task:", error);
            fetchProjects(); // Revert on error
        }
    };

    const addSubtask = async (projectId, taskId, subtaskText) => {
        try {
            const token = await getToken();
            const newSubtask = { id: Date.now(), text: subtaskText, completed: false };
            const res = await fetch(`${API_URL}/api/projects/${projectId}/tasks/${taskId}/subtasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newSubtask)
            });

            if (res.ok) {
                const updatedProject = await res.json();
                setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
            }
        } catch (error) {
            console.error("Error adding subtask:", error);
        }
    };

    const toggleSubtask = async (projectId, taskId, subtaskId) => {
        // Optimistic UI Update
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks.map(t => {
                    if (t.id === taskId) {
                        const updatedSubtasks = t.subtasks.map(st =>
                            st.id === subtaskId ? { ...st, completed: !st.completed } : st
                        );
                        return { ...t, subtasks: updatedSubtasks };
                    }
                    return t;
                });
                return { ...p, tasks: updatedTasks };
            }
            return p;
        }));

        try {
            const token = await getToken();
            await fetch(`${API_URL}/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error toggling subtask:", error);
            fetchProjects(); // Revert on failure
        }
    };

    const addMessage = async (projectId, message) => {
        const newMessage = { ...message, id: Date.now() };

        // Optimistic Update
        setProjects(prev => prev.map(p => {
            if (Number(p.id) === Number(projectId)) {
                const currentChat = p.chat || [];
                return { ...p, chat: [...currentChat, newMessage] };
            }
            return p;
        }));

        try {
            const token = await getToken();
            // Refactored to emit via socket
            try {
                if (socket.current && socket.current.connected) {
                    console.log(`📤 Emitting message via socket for project ${projectId}`);
                    socket.current.emit('send-message', { projectId, message: newMessage });
                } else {
                    console.warn('⚠️ Socket not connected, message will only be saved to DB. Connected:', socket.current?.connected);
                    // Socket not connected, message will only be saved to DB.
                }
            } catch (socketErr) {
                console.error('❌ Failed to emit socket message:', socketErr);
            }

            await fetch(`${API_URL}/api/projects/${projectId}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newMessage)
            });
        } catch (error) {
            console.error("❌ Error adding message:", error);
            fetchProjects(); // re-sync if failed
        }
    };

    const updateProjectProgress = (currentProjects) => {
        const calculateProgress = (tasks) => {
            if (tasks.length === 0) return 0;
            const completed = tasks.filter(t => t.completed).length;
            return Math.round((completed / tasks.length) * 100);
        };

        const finalProjects = currentProjects.map(p => ({
            ...p,
            progress: calculateProgress(p.tasks)
        }));

        saveProjects(finalProjects);
    }

    const completeProject = async (projectId) => {
        // Find existing project to manually set progress to 100 on frontend immediately
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, progress: 100, tasks: p.tasks.map(t => ({ ...t, completed: true })) };
            }
            return p;
        }));

        // Note: For a robust app we'd have a specific endpoint `PUT /api/projects/:id/complete` 
        // that handles the mass task update, but as a shortcut we can hit existing task APIs 
        // or just accept the local state will sync cleanly if tasks are properly implemented.
        // For now to match previous functionality:
        try {
            const token = await getToken();
            await fetch(`${API_URL}/api/projects/${projectId}/complete`, { // Assuming you create this endpoint
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects(); // Re-sync data after update
        } catch (error) {
            console.error("Error completing project:", error);
        }
    };

    const joinProjectByLink = async (joinToken) => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/projects/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ joinToken })
            });

            const data = await res.json();

            if (data.success) {
                fetchProjects(); // re-fetch to get the newly attached project
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error || data.message || 'Failed to join project' };
            }

        } catch (error) {
            console.error("Error joining project:", error);
            return { success: false, message: "An error occurred while joining the project" };
        }
    };

    const saveProjectCode = async (projectId, workspace) => {
        console.log(`📡 Attempting to save code for project ID: ${projectId}`);
        try {
            const token = await getToken();
            const url = `${API_URL}/api/projects/${projectId}/workspace`;
            console.log(`🔗 Sending PUT request to: ${url}`);

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ workspace })
            });

            console.log(`📬 Save response status: ${res.status}`);

            if (res.ok) {
                const updatedProject = await res.json();
                console.log("✅ Project workspace saved successfully");
                setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
                return true;
            }
            const errorData = await res.json();
            console.error("❌ Save failed:", errorData);
            return false;
        } catch (error) {
            console.error("❌ Error saving project code:", error);
            return false;
        }
    };

    return (
        <ProjectContext.Provider value={{
            projects, employees, addProject, deleteProject,
            completeProject, addTask, toggleTask, addSubtask,
            toggleSubtask, addMessage, searchQuery, setSearchQuery,
            joinProjectByLink, saveProjectCode, joinProjectRoom
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
