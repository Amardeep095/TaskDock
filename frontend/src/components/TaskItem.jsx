import { useState } from 'react';
import { Check, Circle, ChevronDown, ChevronRight, Plus, Calendar, Flag } from 'lucide-react';

const differenceInDays = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (date1 < date2) ? -diffDays : diffDays;
};

const TaskItem = ({ task, onToggle, onAddSubtask, onToggleSubtask, darkMode = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [subtaskText, setSubtaskText] = useState('');

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!subtaskText.trim()) return;
        onAddSubtask(subtaskText);
        setSubtaskText('');
    };

    const completedSubtasks = task.subtasks ? task.subtasks.filter(st => st.completed).length : 0;
    const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    const getDeadlineColor = (dueDate, completed) => {
        if (completed) return { color: 'text-gray-400', label: '' };
        if (!dueDate) return { color: 'text-gray-400', label: '' };

        const days = differenceInDays(new Date(dueDate), new Date());
        const diffDays = Math.ceil(days);

        if (diffDays < 0) return { color: 'text-danger-600', label: '! Overdue' };
        if (diffDays <= 3) return { color: 'text-warning-600', label: '! Due Soon' };
        return { color: 'text-gray-400', label: '' };
    };

    const deadlineStatus = getDeadlineColor(task.deadline, task.completed);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-danger-600 bg-danger-50 border-danger-100';
            case 'Medium': return 'text-warning-600 bg-warning-50 border-warning-100';
            case 'Low': return 'text-success-600 bg-success-50 border-success-100';
            default: return 'text-gray-400 bg-gray-50 border-gray-100';
        }
    };

    const containerClasses = darkMode
        ? `rounded-xl border transition-all duration-200 ${task.completed ? 'bg-[#1e1e1e] border-[#333]' : 'bg-[#252526] border-[#333] hover:border-[#555]'}`
        : `rounded-xl border transition-all duration-200 ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'}`;

    const textClasses = darkMode
        ? `font-medium transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`
        : `font-medium text-gray-900 transition-all ${task.completed ? 'opacity-50 line-through' : ''}`;

    const checkboxClasses = darkMode
        ? `mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${task.completed ? 'bg-success-600 border-success-600 text-white' : 'bg-transparent border-gray-500 hover:border-primary-400'}`
        : `mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${task.completed ? 'bg-success-600 border-success-600 text-white' : 'bg-white border-gray-300 hover:border-primary-600'}`;

    return (
        <div className={containerClasses}>
            <div className="p-4 flex items-start gap-3">
                <button
                    onClick={() => onToggle(task.id)}
                    className={checkboxClasses}
                >
                    {task.completed && <Check size={12} strokeWidth={3} />}
                </button>

                <div className="flex-1 min-w-0">
                    <div
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="cursor-pointer group select-none"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className={textClasses}>
                                {task.text}
                            </h3>
                            <div className="flex items-center gap-2">
                                {task.priority && (
                                    <div className={`p-1 rounded-md ${getPriorityColor(task.priority)}`}>
                                        <Flag size={14} fill="currentColor" />
                                    </div>
                                )}
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${progress === 100 ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-600'}`}>
                                    <span>{progress}%</span>
                                </div>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {task.deadline && (
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${deadlineStatus?.color ? (deadlineStatus.color.includes('danger') ? 'bg-danger-50 border-danger-200 text-danger-700' : 'bg-warning-50 border-warning-200 text-warning-700') : 'bg-white border-gray-200 text-gray-500'}`}>
                                    <Calendar size={12} />
                                    <span>{new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    {deadlineStatus?.label && <span className="ml-1 opacity-75">- {deadlineStatus.label}</span>}
                                </div>
                            )}
                            {totalSubtasks > 0 && (
                                <div className="flex items-center gap-2" title={`${completedSubtasks} of ${totalSubtasks} milestones completed`}>
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-success-500' : 'bg-primary-600'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="font-medium">{completedSubtasks}/{totalSubtasks}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtasks Section (Milestones) */}
            {isExpanded && (
                <div className="px-4 pb-4 pl-12">
                    <div className="space-y-2 mb-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Milestones</p>
                        {task.subtasks && task.subtasks.map(subtask => (
                            <div key={subtask.id} className="flex items-center gap-3 group animate-in slide-in-from-top-1 duration-200">
                                <button
                                    onClick={() => onToggleSubtask(subtask.id)}
                                    className={`flex-shrink-0 transition-colors ${subtask.completed ? 'text-success-600' : 'text-gray-300 group-hover:text-primary-600'}`}
                                >
                                    {subtask.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </button>
                                <span className={`text-sm transition-all ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                    {subtask.text}
                                </span>
                            </div>
                        ))}
                        {(!task.subtasks || task.subtasks.length === 0) && (
                            <p className="text-sm text-gray-400 italic">No milestones yet.</p>
                        )}
                    </div>

                    <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                        <Plus size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Add a milestone..."
                            className="flex-1 bg-transparent text-sm border-none focus:ring-0 p-0 text-gray-600 placeholder:text-gray-400"
                            value={subtaskText}
                            onChange={(e) => setSubtaskText(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700 disabled:opacity-50"
                            disabled={!subtaskText.trim()}
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
