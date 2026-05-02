import { useState, useRef, useEffect } from 'react';
import { Send, User, Paperclip, Smile, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectChat = ({ project, onSendMessage, fullHeight = false }) => {
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [project.chat]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        onSendMessage(project.id, {
            senderId: user?.id || 999,
            senderName: user?.name,
            senderAvatar: user?.avatar, // Fixed: use 'avatar' from AuthContext
            text: newMessage,
            timestamp: new Date().toISOString()
        });
        setNewMessage("");
    };

    const formatTime = (isoString) => {
        try {
            return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    return (
        <div className={`flex flex-col bg-transparent ${fullHeight ? 'h-full' : 'h-[600px]'} overflow-hidden`}>
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar" ref={messagesContainerRef}>
                <AnimatePresence initial={false}>
                    {project.chat && project.chat.length > 0 ? (
                        project.chat.map((msg, idx) => {
                            const isMe = msg.senderId === (user?.id || 999);
                            const prevMsg = project.chat[idx - 1];
                            const isSameSender = prevMsg?.senderId === msg.senderId;

                            return (
                                <motion.div
                                    key={msg.id || idx}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSameSender ? 'mt-1' : 'mt-6'}`}
                                >
                                    <div className={`flex max-w-[80%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                                        {/* Avatar */}
                                        {!isMe && !isSameSender ? (
                                            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden mb-1 ring-2 ring-white">
                                                {msg.senderAvatar ? (
                                                    <img src={msg.senderAvatar} alt="avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
                                                        {msg.senderName?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-8 shrink-0" />
                                        )}

                                        <div className="flex flex-col gap-1">
                                            {!isMe && !isSameSender && (
                                                <span className="text-[10px] font-bold text-slate-500 ml-1 mb-1 uppercase tracking-wider">
                                                    {msg.senderName}
                                                </span>
                                            )}

                                            <div className={`px-4 py-3 rounded-3xl shadow-sm relative group transition-all hover:shadow-md ${isMe
                                                ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-none'
                                                : 'bg-white/80 backdrop-blur-md text-slate-800 rounded-bl-none border border-white'
                                                }`}>
                                                <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>

                                                <div className={`flex items-center gap-2 mt-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </div>

                                                {/* Hidden checkmark for "Me" messages */}
                                                {isMe && (
                                                    <div className="absolute right-3 bottom-2 text-[8px] opacity-40 group-hover:opacity-100 transition-opacity">
                                                        ✓✓
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-white"
                            >
                                <Send size={28} className="text-primary-600/60 translate-x-0.5 -translate-y-0.5" />
                            </motion.div>
                            <h4 className="text-slate-900 font-bold">New Project Hub</h4>
                            <p className="text-sm font-medium text-slate-500 max-w-[200px] mt-2">Be the first to share an update or idea with your team.</p>
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-transparent">
                <form
                    onSubmit={handleSend}
                    className="relative flex items-center gap-3 bg-white/60 backdrop-blur-2xl p-2 rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 group focus-within:ring-2 ring-primary-500/10 transition-all"
                >
                    <button type="button" className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all">
                        <Paperclip size={20} />
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share something with the team..."
                        className="flex-1 bg-transparent border-none py-3 px-1 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    />

                    <div className="flex items-center gap-1 pr-1">
                        <button type="button" className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all">
                            <Smile size={20} />
                        </button>
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-2xl shadow-lg shadow-primary-200 disabled:opacity-30 disabled:shadow-none hover:scale-110 active:scale-95 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectChat;

