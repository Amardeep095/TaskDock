import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Book, Layers, CheckSquare, Users, Zap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Docs = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('intro');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sections = [
        { id: 'intro', title: 'Introduction', icon: <Book size={18} /> },
        { id: 'getting-started', title: 'Getting Started', icon: <Zap size={18} /> },
        { id: 'projects', title: 'Managing Projects', icon: <Layers size={18} /> },
        { id: 'tasks', title: 'Tasks & Milestones', icon: <CheckSquare size={18} /> },
        { id: 'collaboration', title: 'Collaboration', icon: <Users size={18} /> },
    ];

    const content = {
        intro: (
            <div className="space-y-6 animate-in fade-in duration-500">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Welcome to TaskDock Docs</h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    TaskDock is a premium project management tool designed for clarity, speed, and collaboration.
                    This documentation will guide you through everything you need to know to get the most out of your workspace.
                </p>
                <div className="bg-primary-50 border border-primary-100 p-6 rounded-2xl mt-8">
                    <h3 className="text-lg font-bold text-primary-700 mb-2">Philosophy</h3>
                    <p className="text-primary-600 leading-relaxed">
                        We believe tools should be invisible. TaskDock is built to reduce friction, so you can focus on shipping great work.
                        Minimal effort, maximum clarity.
                    </p>
                </div>
            </div>
        ),
        'getting-started': (
            <div className="space-y-8 animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Getting Started</h1>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">1. Creating an Account</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Sign up using your email. We've simplified the process to get you into your dashboard in seconds.
                        No credit card required for the free tier.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">2. Your Dashboard</h2>
                    <p className="text-slate-600 leading-relaxed">
                        The Dashboard is your command center. Here you can see:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                        <li><strong>Active Projects:</strong> A quick view of what's in flight.</li>
                        <li><strong>Recent Activity:</strong> Who did what, and when.</li>
                        <li><strong>Statistics:</strong> Real-time productivity metrics.</li>
                    </ul>
                </section>
            </div>
        ),
        projects: (
            <div className="space-y-8 animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Managing Projects</h1>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Creating a Project</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Click the <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-sm font-mono text-slate-700">+ New Project</span> button on your dashboard.
                        Give it a name, a priority level, and an optional deadline.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Project Overview vs. Workspace</h2>
                    <p className="text-slate-600 leading-relaxed">
                        TaskDock offers two views for every project:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div className="border border-slate-200 p-5 rounded-xl">
                            <h3 className="font-bold text-slate-800 mb-2">Overview</h3>
                            <p className="text-sm text-slate-600">A high-level summary. Add quick tasks, view team members, and check progress stats without diving deep.</p>
                        </div>
                        <div className="border border-slate-200 p-5 rounded-xl">
                            <h3 className="font-bold text-slate-800 mb-2">Workspace</h3>
                            <p className="text-sm text-slate-600">The deep-dive view. Access the Kanban board, detailed task lists, and file attachments.</p>
                        </div>
                    </div>
                </section>
            </div>
        ),
        tasks: (
            <div className="space-y-8 animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks & Milestones</h1>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Quick Add</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Need to jot something down fast? Use the <strong>Quick Add</strong> input on the Project Overview page.
                        You can now also select a priority flag (High, Medium, Low) right from there.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Mini Tasks & Checkboxes</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Small tasks shouldn't require big forms.
                        Our "Mini Tasks" feature lets you add checklist items and tick them off instantly.
                        Your project's progress percentage updates in real-time as you complete them.
                    </p>
                </section>
            </div>
        ),
        collaboration: (
            <div className="space-y-8 animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Collaboration</h1>
                <p className="text-slate-600 leading-relaxed">
                    TaskDock is better with a team.
                </p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Inviting Members</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Go to the <strong>Members</strong> tab or use the "Invite" button in a project.
                        You can generate a unique invite link to share with your team.
                    </p>
                </section>
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-slate-900">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <ChevronLeft size={20} className="text-slate-500" />
                    <span className="font-bold text-lg">Docs</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <motion.aside
                className={`
                    fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-50 border-r border-slate-200/60 p-6 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="mb-8 hidden md:block">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 text-sm font-medium"
                    >
                        <ChevronLeft size={16} />
                        Back to Home
                    </button>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Book className="text-primary-600" size={24} />
                        Documentation
                    </h2>
                </div>

                <nav className="space-y-1 flex-1">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => {
                                setActiveSection(section.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                ${activeSection === section.id
                                    ? 'bg-white text-primary-600 shadow-sm border border-slate-100'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                            `}
                        >
                            <span className={activeSection === section.id ? 'text-primary-500' : 'text-slate-400'}>
                                {section.icon}
                            </span>
                            {section.title}
                        </button>
                    ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-400 font-medium mb-2">Need help?</p>
                    <a href="#" className="text-sm font-semibold text-primary-600 hover:underline">Contact Support</a>
                </div>
            </motion.aside>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
                <div className="prose prose-slate prose-headings:font-bold prose-a:text-primary-600 max-w-none">
                    {content[activeSection]}
                </div>

                <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between text-sm text-slate-400">
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                    <span>TaskDock v2.0</span>
                </div>
            </main>
        </div>
    );
};

export default Docs;
