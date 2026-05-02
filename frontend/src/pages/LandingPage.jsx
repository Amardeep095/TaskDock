import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import LoaderOverlay from '../components/LoaderOverlay';
import { CheckCircle2, Zap, Shield, ArrowRight, Layout, TrendingUp, Users, Globe, Search } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer, slideInLeft, slideInRight } from '../utils/animations';
import DotGrid from '../components/DotGrid';
import ThreeDTilt from '../components/ThreeDTilt';
import DemoDashboard from '../components/DemoDashboard';

const LandingPage = () => {
    const { user } = useAuth();
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);
    const headerBlur = useTransform(scrollY, [0, 100], [0, 12]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false); // New state for exit animation
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds optimal loading time
        return () => clearTimeout(timer);
    }, []);

    const handleLoginSuccess = () => {
        setIsExiting(true);        // Start exit animation (re-enable loader)
        setIsLoading(true);        // Reuse loading state logic to "close" the iris

        // Navigate after animation
        setTimeout(() => {
            navigate('/dashboard');
        }, 1200); // Slightly longer than 1.0s animation to ensure full closure
    };

    const [maskSize, setMaskSize] = useState(0);

    const navBackgroundColor = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)']);
    const navBackdropFilter = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(8px)']);
    const navBorderColor = useTransform(scrollY, [0, 100], ['rgba(0,0,0,0)', 'rgba(229, 231, 235, 1)']);

    // If user is already logged in, redirect to dashboard
    if (user && !isExiting) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="relative min-h-screen bg-white overflow-x-hidden selection:bg-primary-200 selection:text-primary-900">
            <LoaderOverlay isLoading={isLoading} />

            {/* Main Content (Underneath) - Normal rendering */}
            <div
                className="relative z-10 min-h-screen bg-transparent flex flex-col font-sans"
            >
                {/* Navbar */}
                <motion.nav
                    className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 transition-all duration-300"
                    style={{
                        backgroundColor: navBackgroundColor,
                        backdropFilter: navBackdropFilter,
                        borderColor: navBorderColor
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <Layout className="h-8 w-8 text-primary-600" />
                                    <span className="font-bold text-xl text-slate-900">TaskDock</span>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</a>
                                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Features</a>
                                <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About</a>
                                <Link to="/docs" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Docs</Link>
                                <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Contact</a>

                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <button className="text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors cursor-pointer">Log In</button>
                                </SignInButton>

                                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-primary-600 text-white font-bold transition-all px-6 py-2.5 rounded-full shadow-lg hover:shadow-primary-600/30 border border-transparent"
                                    >
                                        Get Started
                                    </motion.button>
                                </SignUpButton>
                            </div>
                            {/* Mobile Menu Button Placeholder (if needed in future) */}
                            <div className="md:hidden">
                                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-primary-600 text-white font-bold text-sm px-4 py-2 rounded-full"
                                    >
                                        Get Started
                                    </motion.button>
                                </SignUpButton>
                            </div>
                        </div>
                    </div>
                </motion.nav>

                {/* Global Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <DotGrid
                        dotSize={4}
                        gap={20}
                        baseColor="#d1fae5" // Light emerald
                        activeColor="#059669" // Brand color (Green)
                        proximity={100}
                        shockRadius={100}
                        shockStrength={2}
                        resistance={1200}
                        returnDuration={1.5}
                    />
                </div>

                {/* Hero Section */}
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-10">

                    <div
                        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    >
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm cursor-default"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-medium text-gray-600">v2.0 is now live</span>
                        </motion.div>

                        <motion.h1
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]"
                        >
                            Manage Projects <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 animate-gradient" style={{ backgroundSize: '200% auto' }}>
                                With Clarity
                            </span>
                        </motion.h1>

                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-12 leading-relaxed"
                        >
                            Streamline your workflow, track progress, and collaborate seamlessly.
                            The premium project management tool for modern teams.
                        </motion.p>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row justify-center gap-4 px-4"
                        >
                            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn bg-primary-600 text-white text-lg px-8 py-4 shadow-xl shadow-primary-600/20 group relative overflow-hidden flex flex-row items-center justify-center gap-2"
                                >
                                    <span className="relative z-10 flex items-center">
                                        Get Started Free
                                        <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                    </span>
                                </motion.button>
                            </SignUpButton>
                            <motion.button
                                onClick={() => {
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-secondary text-lg px-8 py-4"
                            >
                                Learn More
                            </motion.button>
                        </motion.div>

                        {/* Dashboard Preview */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="mt-20 relative mx-auto max-w-6xl perspective-1000"
                        >
                            <ThreeDTilt className="relative z-10 transition-transform duration-200 ease-out">
                                <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:rounded-3xl lg:p-4 backdrop-blur-sm">
                                    <div className="rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-200">
                                        <DemoDashboard />
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-12 -right-8 md:-right-16 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.07)] border border-gray-100 hidden md:block"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-success-50 text-success-600 p-3 rounded-xl">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Task Completed</p>
                                            <p className="text-xs text-slate-500 font-medium">Just now</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute top-24 -left-8 md:-left-16 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.07)] border border-gray-100 hidden md:block"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-warning-50 text-warning-600 p-3 rounded-xl border border-warning-100">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Productivity Up</p>
                                            <p className="text-xs text-slate-500 font-medium">+24% this week</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -18, 0] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                    className="absolute -bottom-6 -left-4 md:-left-12 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.07)] border border-gray-100 hidden md:block"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-info-50 text-info-600 p-3 rounded-xl border border-info-100">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Team Growth</p>
                                            <p className="text-xs text-slate-500 font-medium">+3 new members</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -22, 0] }}
                                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                    className="absolute -bottom-10 -right-6 md:-right-12 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.07)] border border-gray-100 hidden md:block"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-primary-50 text-primary-600 p-3 rounded-xl border border-primary-100">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Secure</p>
                                            <p className="text-xs text-slate-500 font-medium">Encrypted Data</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </ThreeDTilt>
                        </motion.div>

                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="mt-12 max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed"
                        >
                            A high-performance interface designed for clarity. Real-time insights and seamless task management to keep your team productive.
                        </motion.p>

                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-32 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-20">
                            <motion.h2
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="text-primary-600 font-semibold tracking-wide uppercase text-xs mb-3"
                            >
                                Features
                            </motion.h2>
                            <motion.h2
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight"
                            >
                                Everything you need to <br />manage your workflow.
                            </motion.h2>
                            <motion.p
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="text-slate-500 text-lg max-w-2xl mx-auto"
                            >
                                Powerful features designed to help your team stay organized and focused.
                            </motion.p>
                        </div>

                        <motion.div
                            className="bento-grid"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <FeatureCard
                                icon={<Layout size={32} />}
                                title="Intuitive Dashboard"
                                desc="Get a bird's eye view of all your projects. Drag and drop tasks, verify progress, and stay in control."
                                color="bg-info-50 text-info-600 border-info-100"
                            />
                            <FeatureCard
                                icon={<TrendingUp size={32} />}
                                title="Smart Tracking"
                                desc="Track completion rates, velocity, and bottlenecks in real-time with automated charts and insights."
                                color="bg-success-50 text-success-600 border-success-100"
                            />
                            <FeatureCard
                                icon={<Shield size={32} />}
                                title="Enterprise Security"
                                desc="Your data is encrypted at rest and in transit. Role-based access control keeps sensitive info safe."
                                color="bg-gray-50 text-gray-700 border-gray-200"
                            />
                            <FeatureCard
                                icon={<Users size={32} />}
                                title="Team Collaboration"
                                desc="Real-time updates, comments, and mentions keep everyone on the same page, wherever they are."
                                color="bg-accent-purple-50 text-accent-purple-600 border-gray-200"
                            />
                            <FeatureCard
                                icon={<Globe size={32} />}
                                title="Global Access"
                                desc="Access your workspace from anywhere, on any device. Your office is wherever you are."
                                color="bg-info-50 text-info-600 border-info-100"
                            />
                            <FeatureCard
                                icon={<Zap size={32} />}
                                title="Fast & Responsive"
                                desc="Built for speed. Instant loading times and smooth interactions for a frustration-free experience."
                                color="bg-warning-50 text-warning-600 border-warning-100"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* About Section */}
                <div id="about" className="py-32 relative overflow-hidden z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={slideInLeft}
                            >
                                <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-xs mb-3">About Us</h2>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Built for teams that <br />want to move faster.</h2>
                                <p className="text-slate-500 text-lg mb-6 leading-relaxed">
                                    TaskDock was born from a simple idea: project management shouldn't be a project itself. We believe in tools that get out of your way and let you focus on clarity, collaboration, and shipping great work.
                                </p>
                                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                                    Whether you're a startup of 5 or an enterprise of 500, our mission is to provide the most intuitive, performant, and beautiful way to manage your workflow.
                                </p>
                                <div className="flex items-center space-x-4">
                                    <div className="flex -space-x-3">
                                        <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" />
                                        <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" />
                                        <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64" alt="User" />
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">+2k</div>
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium">
                                        Trusted by 2,000+ teams
                                    </div>
                                </div>

                            </motion.div>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={slideInRight}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent rounded-2xl transform rotate-3"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                                    alt="Team Collaboration"
                                    className="relative rounded-2xl shadow-xl border border-slate-200"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>


                {/* CTA Section */}
                <div className="py-24 relative overflow-hidden z-10">
                    <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Ready to boost your productivity?</h2>
                        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">Join thousands of teams that use TaskDock to deliver projects on time, every time.</p>
                        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:bg-primary-700 transition-colors"
                            >
                                Start Your Free Trial
                            </motion.button>
                        </SignUpButton>
                    </div>
                </div>

                {/* Footer / Contact Section */}
                <footer id="contact" className="py-20 border-t border-slate-200 z-10 relative bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-2">
                                <span className="text-2xl font-bold text-slate-900 tracking-tight mb-4 block">TaskDock</span>
                                <p className="text-slate-500 mb-6 max-w-sm">
                                    Empowering teams to build the future. Simple, powerful, and designed for speed.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
                                <ul className="space-y-3 text-sm text-slate-500">
                                    <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
                                    <li><a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a></li>
                                    <li><Link to="/docs" className="hover:text-primary-600 transition-colors">Documentation</Link></li>
                                    <li><a href="#" className="hover:text-primary-600 transition-colors">Changelog</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
                                <ul className="space-y-3 text-sm text-slate-500">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                        1324Amardeep@gmail.com
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                        7991167574
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                        San Francisco, CA
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
                            <p>© 2026 TaskDock Inc. All rights reserved.</p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>

                <div className="pb-20"></div> {/* Spacer for fixed footer/content edge cases if needed */}
            </div> {/* End of Main Content Wrapper */}
        </div >
    );
};

// Sub-component for Bento Grid Item with Spotlight Effect
const FeatureCard = ({ icon, title, desc, color }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }

    return (
        <motion.div
            variants={fadeInUp}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -5 }}
            className="relative bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 0.05), transparent 40%)`,
                }}
            />

            <div className={`relative z-10 w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 ring-4 ring-white`}>
                <motion.div
                    animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                    {icon}
                </motion.div>
            </div>
            <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="relative z-10 text-slate-500 leading-relaxed">{desc}</p>
        </motion.div>
    );
};

export default LandingPage;

