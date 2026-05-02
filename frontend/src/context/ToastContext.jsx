import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] space-y-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transform transition-all duration-300 animate-slide-in-right min-w-[300px] ${toast.type === 'success' ? 'bg-white/90 border-success-100 text-slate-800' :
                            toast.type === 'error' ? 'bg-white/90 border-danger-100 text-slate-800' :
                                'bg-white/90 border-info-100 text-slate-800'
                            }`}
                    >
                        <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-success-50 text-success-600' :
                            toast.type === 'error' ? 'bg-danger-50 text-danger-600' :
                                'bg-info-50 text-info-600'
                            }`}>
                            {toast.type === 'success' && <CheckCircle size={16} />}
                            {toast.type === 'error' && <AlertCircle size={16} />}
                            {toast.type === 'info' && <Info size={16} />}
                        </div>
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
