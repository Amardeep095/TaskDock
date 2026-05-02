import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Settings, Shield, Bell, LogOut, Mail, Briefcase, Calendar, ChevronRight } from 'lucide-react';

const UserProfileModal = ({ onClose, user, onLogout }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end p-4 sm:p-6 items-start">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />

            {/* Notification Panel - Small & Minimal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 mt-14 overflow-hidden flex flex-col"
            >
                {/* Profile Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col items-center bg-slate-50/50 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-md mb-4 ring-2 ring-primary-100">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-primary-600">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {user.name || 'Anonymous User'}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                        <Mail size={12} /> {user.email || 'user@TaskDock.ai'}
                    </p>
                    <div className="mt-3 px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                        {user.role || 'Enterprise Member'}
                    </div>
                </div>

                {/* Body / Menu Options */}
                <div className="p-3 space-y-1">
                    {[
                        { icon: Settings, label: 'Account Preferences' },
                        { icon: Shield, label: 'Privacy & Security' },
                        { icon: Briefcase, label: 'My Department' }
                    ].map((item, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 0.98 }}
                            className="w-full flex items-center p-3 rounded-2xl transition-all group/btn hover:bg-slate-50"
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl group-hover/btn:bg-white border border-transparent group-hover/btn:border-slate-200 group-hover/btn:shadow-sm group-hover/btn:text-primary-600 transition-all shrink-0">
                                <item.icon size={16} />
                            </div>
                            <span className="ml-3 font-semibold text-sm text-slate-700">{item.label}</span>
                            <ChevronRight size={16} className="ml-auto text-slate-300 group-hover/btn:text-primary-500 group-hover/btn:translate-x-0.5 transition-all" />
                        </motion.button>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <motion.button
                        whileHover={{ scale: 0.98 }}
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-50 border border-slate-200 shadow-sm transition-all"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfileModal;
