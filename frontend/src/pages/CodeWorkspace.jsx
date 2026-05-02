import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
    Folder, FileCode, Search, Settings,
    ChevronDown, Plus, X,
    Play, Save, Share2, Users, Loader2, ChevronRight
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import TaskBoard from '../components/TaskBoard';

const CodeWorkspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, saveProjectCode } = useProjects();
    const { addToast } = useToast();
    const project = projects.find(p => p.id === parseInt(id));

    const [activeTab, setActiveTab] = useState('code'); // 'code' | 'tasks'
    const [isSaving, setIsSaving] = useState(false);

    const defaultFiles = {
        'App.jsx': {
            name: 'App.jsx',
            language: 'javascript',
            content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello ${project?.name || 'World'}</h1>\n    </div>\n  );\n}\n\nexport default App;`
        },
        'index.css': {
            name: 'index.css',
            language: 'css',
            content: `body {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n}`
        },
        'utils.js': {
            name: 'utils.js',
            language: 'javascript',
            content: `export const formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n};`
        }
    };

    const [files, setFiles] = useState(defaultFiles);

    // Load files from project workspace if they exist
    useEffect(() => {
        if (project?.workspace && Object.keys(project.workspace).length > 0) {
            setFiles(project.workspace);
        }
    }, [project?.id]);

    const [activeFile, setActiveFile] = useState('App.jsx');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSave = async () => {
        if (!project) return;
        setIsSaving(true);
        const success = await saveProjectCode(project.id, files);
        setIsSaving(false);
        if (success) {
            addToast('Project code saved successfully!', 'success');
        } else {
            addToast('Failed to save project code.', 'error');
        }
    };

    if (!project) return <div className="text-center text-white pt-20">Project not found</div>;

    const handleEditorChange = (value) => {
        setFiles({
            ...files,
            [activeFile]: { ...files[activeFile], content: value }
        });
    };

    // Placeholder for TaskBoard component
    const TaskBoard = () => (
        <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Task Board Content Coming Soon!
        </div>
    );

    return (
        <div className="flex h-screen w-full bg-[#1e1e1e] text-gray-300 overflow-hidden font-sans">
            {/* Sidebar (Only visible in Code View) */}
            {activeTab === 'code' && (
                <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} flex flex-col bg-[#252526] border-r border-[#333] transition-all duration-300`}>
                    <div className="p-3 text-xs font-bold uppercase tracking-wider flex justify-between items-center text-gray-400">
                        <span>Explorer</span>
                        <button onClick={() => setIsSidebarOpen(false)} className="hover:text-white">
                            <ChevronPointLeft size={16} /> {/* Placeholder icon repair below */}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="px-2 py-1">
                            <div className="flex items-center gap-1 text-sm font-bold text-blue-400 mb-2 cursor-pointer">
                                <ChevronDown size={14} />
                                <span className="truncate">{project.name}</span>
                            </div>
                            {Object.keys(files).map(fileName => (
                                <div
                                    key={fileName}
                                    onClick={() => setActiveFile(fileName)}
                                    className={`flex items-center gap-2 px-4 py-1 cursor-pointer text-sm hover:bg-[#2a2d2e] ${activeFile === fileName ? 'bg-[#37373d] text-white' : ''}`}
                                >
                                    <FileCode size={14} className={fileName.endsWith('css') ? 'text-blue-300' : 'text-yellow-300'} />
                                    <span>{fileName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar Navigation */}
                <div className="h-12 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                            <ChevronRight className="rotate-180" size={14} /> Dashboard
                        </button>
                        {/* Tab Switcher */}
                        <div className="flex bg-[#252526] rounded-md p-1 border border-[#333]">
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`px-3 py-1 text-xs font-medium rounded ${activeTab === 'code' ? 'bg-[#37373d] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Code
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`px-3 py-1 text-xs font-medium rounded ${activeTab === 'tasks' ? 'bg-[#37373d] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Tasks
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center -space-x-2 mr-4">
                            {project.assignedTo?.slice(0, 3).map(user => (
                                <img key={user.id} src={user.avatar} className="w-6 h-6 rounded-full border border-[#1e1e1e]" title={user.name} />
                            ))}
                            <button className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] text-white border border-[#1e1e1e] hover:bg-primary-500">
                                <Plus size={12} />
                            </button>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`p-1.5 flex items-center gap-2 px-3 rounded text-sm font-medium transition-all ${isSaving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-500'}`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="p-1.5 bg-green-700 text-white rounded hover:bg-green-600 transition-colors">
                            <Play size={16} />
                        </button>
                        <button className="p-1.5 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>

                {/* View Content */}
                <div className="flex-1 relative bg-[#1e1e1e]">
                    {activeTab === 'code' ? (
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            language={files[activeFile].language}
                            value={files[activeFile].content}
                            theme="vs-dark"
                            onChange={handleEditorChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                automaticLayout: true,
                            }}
                        />
                    ) : (
                        <div className="h-full bg-[#1e1e1e]">
                            <TaskBoard />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Start Icon Correction
const ChevronPointLeft = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
)

export default CodeWorkspace;
