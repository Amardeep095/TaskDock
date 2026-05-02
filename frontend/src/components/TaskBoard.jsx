import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import TaskItem from '../components/TaskItem';
import { Plus } from 'lucide-react';

const TaskBoard = () => {
    const { id } = useParams();
    const { projects, addTask, toggleTask, addSubtask, toggleSubtask } = useProjects();
    const { addToast } = useToast();
    const [newTask, setNewTask] = useState({ text: '', priority: 'Medium', deadline: '' });

    const project = projects.find(p => p.id === parseInt(id));

    if (!project) return null;

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.text.trim()) return;
        addTask(project.id, newTask);
        addToast('Task added successfully', 'success');
        setNewTask({ text: '', priority: 'Medium', deadline: '' });
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Stats / Header for Tasks */}
                <div className="glass rounded-2xl p-6 border border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Project Tasks</h2>
                        <p className="text-gray-400 text-sm">Manage tasks and subtasks</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total</p>
                            <p className="text-xl font-bold text-white">{project.tasks.length}</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/20">
                            <p className="text-xs uppercase tracking-wider font-bold">Done</p>
                            <p className="text-xl font-bold">{project.tasks.filter(t => t.completed).length}</p>
                        </div>
                    </div>
                </div>

                {/* Add Task Form */}
                <div className="bg-[#252526] p-4 rounded-xl border border-[#333]">
                    <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg focus:outline-none focus:border-primary-600 text-gray-300 placeholder-gray-600"
                                value={newTask.text}
                                onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg focus:outline-none focus:border-primary-600 text-gray-300 text-sm"
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <input
                                type="date"
                                className="px-3 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg focus:outline-none focus:border-primary-600 text-gray-300 text-sm"
                                value={newTask.deadline}
                                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary px-4 py-2 flex items-center justify-center"
                                disabled={!newTask.text.trim()}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                    {project.tasks.map(task => (
                        <div key={task.id}>
                            {/* Re-using TaskItem but might need style adaptation for dark mode if TaskItem isn't dark-mode ready. 
                                 Assuming TaskItem is somewhat neutral or transparent.
                             */}
                            <TaskItem
                                task={task}
                                onToggle={() => toggleTask(project.id, task.id)}
                                onAddSubtask={(text) => addSubtask(project.id, task.id, text)}
                                onToggleSubtask={(subtaskId) => toggleSubtask(project.id, task.id, subtaskId)}
                                darkMode={true} // Passing a prop just in case, or will rely on global styles
                            />
                        </div>
                    ))}
                    {project.tasks.length === 0 && (
                        <div className="text-center py-12 rounded-2xl border-2 border-dashed border-[#333] bg-[#1e1e1e]">
                            <p className="text-gray-500 font-medium">No tasks yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskBoard;
