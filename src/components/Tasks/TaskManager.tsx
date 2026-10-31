import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Target, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import type { Task, ThemeMode } from '../../types';

interface TaskManagerProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'completedPomodoros' | 'createdAt'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetActiveTask: (id: string) => void;
  onUpdatePomodoros: (id: string, delta: number) => void;
  theme: ThemeMode;
}

const TAG_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Dev: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  Bugfix: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  Review: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  Docs: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  Learning: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  General: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },
};

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  activeTaskId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSetActiveTask,
  onUpdatePomodoros,
  theme,
}) => {
  const isDark = theme === 'dark' || theme === 'jungle';
  const isJungle = theme === 'jungle';
  const [newTitle, setNewTitle] = useState('');
  const [newEstimated, setNewEstimated] = useState(2);
  const [newTag, setNewTag] = useState<Task['tag']>('Dev');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      estimatedPomodoros: newEstimated,
      tag: newTag,
    });

    setNewTitle('');
    setNewEstimated(2);
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const totalEstimated = tasks.reduce((acc, t) => acc + (t.completed ? t.completedPomodoros : t.estimatedPomodoros), 0);
  const totalCompleted = tasks.reduce((acc, t) => acc + t.completedPomodoros, 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header with Stats & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Task Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Organize focus tasks, track pomodoros, and hit your milestones.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono backdrop-blur-md ${
              isDark ? 'bg-slate-900/60 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Total: <strong className="text-cyan-400">{totalCompleted}</strong>/{totalEstimated} 🍅 (
              {Math.round((totalEstimated * 25) / 60)}h)
            </span>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold shadow-md transition-all hover:scale-105 ${
              isJungle
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-purple-500/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Form Collapsible */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            onSubmit={handleSubmit}
            className={`p-4 sm:p-5 rounded-2xl border mb-6 backdrop-blur-xl shadow-xl overflow-hidden ${
              isJungle
                ? 'bg-[#042418]/85 border-emerald-500/35 shadow-emerald-950/40'
                : isDark
                ? 'bg-slate-900/80 border-purple-500/30'
                : 'bg-white border-purple-200 shadow-purple-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Create Focus Task
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
              <input
                type="text"
                required
                placeholder="What are you working on? (e.g. Implement OAuth Flow)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={`sm:col-span-7 px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-slate-950/60 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                autoFocus
              />

              <div className="sm:col-span-3 flex items-center gap-2">
                <label className="text-xs text-slate-400 whitespace-nowrap">Est. Pomodoros:</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={newEstimated}
                  onChange={(e) => setNewEstimated(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark ? 'bg-slate-950/60 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value as Task['tag'])}
                className={`sm:col-span-2 px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="Dev">Dev</option>
                <option value="Bugfix">Bugfix</option>
                <option value="Review">Review</option>
                <option value="Docs">Docs</option>
                <option value="Learning">Learning</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Save Task
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-white/5">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f} ({tasks.filter((t) => (f === 'active' ? !t.completed : f === 'completed' ? t.completed : true)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-10 rounded-2xl border text-center backdrop-blur-md ${
                isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white/60 border-slate-200 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-500 opacity-40" />
              <p className="text-sm font-medium">No tasks found in this view</p>
              <p className="text-xs text-slate-500 mt-1">Create a task above to anchor your focus session!</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => {
              const isActive = activeTaskId === task.id;
              const tagStyle = TAG_STYLES[task.tag] || TAG_STYLES.General;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 backdrop-blur-md flex items-center justify-between gap-3 ${
                    isActive
                      ? isDark
                        ? 'bg-slate-900/90 border-purple-500/50 shadow-lg shadow-purple-950/40'
                        : 'bg-white border-purple-400 shadow-md shadow-purple-100'
                      : isDark
                      ? 'bg-slate-900/50 border-white/5 hover:border-white/15'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Left: Complete Checkbox + Title + Tag */}
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="p-1 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                      title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 hover:stroke-purple-400 transition-colors" />
                      )}
                    </button>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-xs sm:text-sm font-medium transition-all truncate ${
                            task.completed
                              ? 'line-through text-slate-500'
                              : isDark
                              ? 'text-slate-100'
                              : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>

                        {isActive && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Active Focus
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}
                        >
                          {task.tag}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {task.completedPomodoros} of {task.estimatedPomodoros} pomodoros
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pomodoro adjust, Set Active, Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Pomodoro quick increment/decrement */}
                    <div className="hidden sm:flex items-center gap-1 bg-black/10 dark:bg-white/5 p-1 rounded-lg border border-white/5">
                      <button
                        onClick={() => onUpdatePomodoros(task.id, -1)}
                        disabled={task.completedPomodoros <= 0}
                        className="w-5 h-5 flex items-center justify-center text-xs text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/10"
                        title="Decrement completed pomodoro"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold px-1 text-purple-400">
                        {task.completedPomodoros}
                      </span>
                      <button
                        onClick={() => onUpdatePomodoros(task.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-xs text-slate-400 hover:text-white rounded hover:bg-white/10"
                        title="Increment completed pomodoro"
                      >
                        +
                      </button>
                    </div>

                    {/* Set Active Task Button */}
                    <button
                      onClick={() => onSetActiveTask(task.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-400 shadow-sm'
                          : isDark
                          ? 'bg-white/5 border-white/5 text-slate-500 hover:text-purple-300 hover:bg-white/10'
                          : 'bg-black/5 border-slate-200 text-slate-400 hover:text-purple-600 hover:bg-slate-100'
                      }`}
                      title={isActive ? 'Currently active focus task' : 'Set as current focus task'}
                    >
                      <Target className={`w-4 h-4 ${isActive ? 'text-purple-400' : ''}`} />
                    </button>

                    {/* Delete Task */}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
