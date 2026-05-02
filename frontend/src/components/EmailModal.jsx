import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const EmailModal = ({ onClose, user }) => {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    if (!user) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'invite': return <User size={16} className="text-primary-600" />;
            case 'assignment': return <CheckCircle2 size={16} className="text-primary-600" />;
            case 'system': return <AlertCircle size={16} className="text-slate-500" />;
            default: return <Bell size={16} className="text-primary-600" />;
        }
    };

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
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100/50 text-primary-600 rounded-xl relative">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Notifications</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar p-3 space-y-1">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <motion.div
                                key={notif._id || notif.id}
                                whileHover={{ scale: 0.98 }}
                                className={`relative p-4 rounded-2xl cursor-pointer transition-colors ${notif.unread ? 'bg-primary-50/50 hover:bg-primary-50' : 'bg-transparent hover:bg-slate-50'}`}
                            >
                                {notif.unread && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                                )}
                                <div className={`flex gap-3 items-start ${notif.unread ? 'pl-3' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm ${notif.unread ? 'bg-white' : 'bg-slate-100'}`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-600 leading-snug">
                                            <span className="font-bold text-slate-900">{notif.sender}</span> {notif.text}
                                        </p>
                                        <p className="text-xs font-medium text-slate-400 mt-1">
                                            {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : notif.time}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                <Bell size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700">All caught up!</h3>
                            <p className="text-xs text-slate-500 mt-1">Check back later for new notifications.</p>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/30 text-center">
                    <button
                        onClick={markAllAsRead}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors px-4 py-2 rounded-xl hover:bg-primary-50"
                    >
                        Mark all as read
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailModal;
