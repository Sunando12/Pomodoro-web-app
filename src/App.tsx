import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { GSoCBackground } from './components/GSoCBackground';
import { TimerCircle } from './components/Timer/TimerCircle';
import { TimerControls } from './components/Timer/TimerControls';
import { TaskManager } from './components/Tasks/TaskManager';
import { DashboardView } from './components/Dashboard/DashboardView';
import { SettingsModal } from './components/Settings/SettingsModal';
import { CelebrationModal } from './components/CelebrationModal';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import type { AmbientSoundType, Task, SessionRecord, TimerSettings } from './types';
import { 
  loadSettings, 
  saveSettings, 
  loadTasks, 
  saveTasks, 
  loadActiveTaskId, 
  saveActiveTaskId, 
  loadSessions, 
  saveSessions, 
  loadStreak, 
  saveStreak, 
  loadTheme, 
  saveTheme,
  DEFAULT_SETTINGS 
} from './utils/storage';
import { ambientSound } from './utils/audio';
import { 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame 
} from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadTheme());
  const [activeTab, setActiveTab] = useState<'timer' | 'dashboard' | 'tasks'>('timer');
  const [settings, setSettings] = useState<TimerSettings>(() => loadSettings());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => loadActiveTaskId());
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessions());
  const [streak, setStreak] = useState<number>(() => loadStreak());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync theme with HTML class and body background
  useEffect(() => {
    saveTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0b0c16';
      document.body.style.color = '#f8fafc';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  // Handle ambient sound change
  const handleAmbientSoundChange = (type: AmbientSoundType) => {
    const updated = { ...settings, ambientSound: type };
    setSettings(updated);
    saveSettings(updated);
    ambientSound.setSound(type, updated.ambientVolume);
  };

  const handleAmbientVolumeChange = (vol: number) => {
    const updated = { ...settings, ambientVolume: vol };
    setSettings(updated);
    saveSettings(updated);
    ambientSound.setVolume(vol);
  };

  // Find active task object
  const activeTask = tasks.find((t) => t.id === activeTaskId && !t.completed) || tasks.find((t) => !t.completed);

  // Record completed session
  const handleSessionComplete = (record: SessionRecord) => {
    const updatedSessions = [record, ...sessions];
    setSessions(updatedSessions);
    saveSessions(updatedSessions);

    // Update streak if today has focus sessions
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySessions = updatedSessions.filter(
      (s) => s.completedAt.startsWith(todayStr) && s.mode === 'focus'
    );
    if (todaySessions.length === 1) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      saveStreak(newStreak);
    }
  };

  // Increment completed pomodoro on task
  const handleIncrementTaskPomodoro = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextCount = t.completedPomodoros + 1;
          const isDone = nextCount >= t.estimatedPomodoros;
          return {
            ...t,
            completedPomodoros: nextCount,
            completed: isDone ? true : t.completed,
          };
        }
        return t;
      });
      saveTasks(updated);
      return updated;
    });
  };

  // Timer Hook
  const {
    mode,
    status,
    timeLeft,
    totalDuration,
    cycleCount,
    celebrationOpen,
    completedMode,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    skipSession,
    adjustTime,
    closeCelebration,
  } = usePomodoroTimer({
    settings,
    activeTask,
    onSessionComplete: handleSessionComplete,
    onIncrementTaskPomodoro: handleIncrementTaskPomodoro,
  });

  // Task Handlers
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed' | 'completedPomodoros' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
      completedPomodoros: 0,
      createdAt: Date.now(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveTasks(updated);
    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
      saveActiveTaskId(newTask.id);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      saveTasks(updated);
      return updated;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasks(updated);
      return updated;
    });
    if (activeTaskId === id) {
      const remaining = tasks.filter((t) => t.id !== id && !t.completed);
      const nextId = remaining.length > 0 ? remaining[0].id : null;
      setActiveTaskId(nextId);
      saveActiveTaskId(nextId);
    }
  };

  const handleSetActiveTask = (id: string) => {
    setActiveTaskId(id);
    saveActiveTaskId(id);
    setActiveTab('timer');
  };

  const handleUpdatePomodoros = (id: string, delta: number) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const newCompleted = Math.max(0, t.completedPomodoros + delta);
          return {
            ...t,
            completedPomodoros: newCompleted,
            completed: newCompleted >= t.estimatedPomodoros && delta > 0 ? true : t.completed,
          };
        }
        return t;
      });
      saveTasks(updated);
      return updated;
    });
  };

  // Reset all data
  const handleResetAllData = () => {
    localStorage.clear();
    setSettings(DEFAULT_SETTINGS);
    setTasks([]);
    setActiveTaskId(null);
    setSessions([]);
    setStreak(1);
    ambientSound.stop();
  };

  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-300 font-sans ${theme === 'dark' ? 'dark' : ''}`}>
      {/* GSoC-Inspired Animated Background */}
      <GSoCBackground theme={theme} mode={mode} />

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        toggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        streak={streak}
        ambientSoundType={settings.ambientSound}
        ambientVolume={settings.ambientVolume}
        setAmbientSound={handleAmbientSoundChange}
        setAmbientVolume={handleAmbientVolumeChange}
      />

      {/* Page Content Viewport */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'timer' && (
            <motion.div
              key="timer-tab"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center justify-center max-w-4xl px-4"
            >
              {/* Circular Timer Ring */}
              <TimerCircle
                mode={mode}
                status={status}
                timeLeft={timeLeft}
                totalDuration={totalDuration}
                cycleCount={cycleCount}
                longBreakInterval={settings.longBreakInterval}
                activeTask={activeTask}
                onSelectTaskClick={() => setActiveTab('tasks')}
                theme={theme}
              />

              {/* Controls */}
              <div className="mt-4 sm:mt-6 w-full">
                <TimerControls
                  mode={mode}
                  status={status}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onReset={resetTimer}
                  onSkip={skipSession}
                  onModeChange={switchMode}
                  onAdjustTime={adjustTime}
                  theme={theme}
                />
              </div>

              {/* Bottom Quick Developer Stats Strip */}
              <div className="mt-10 grid grid-cols-3 gap-3 w-full max-w-md">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`p-3 rounded-2xl border backdrop-blur-md text-left transition-all hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-white/5 hover:border-purple-500/30'
                      : 'bg-white/80 border-slate-200 hover:border-purple-300 shadow-sm'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono text-slate-400">Streak</div>
                  <div className="text-sm font-bold text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{streak} Days</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`p-3 rounded-2xl border backdrop-blur-md text-left transition-all hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-white/5 hover:border-cyan-500/30'
                      : 'bg-white/80 border-slate-200 hover:border-cyan-300 shadow-sm'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono text-slate-400">Active Tasks</div>
                  <div className="text-sm font-bold text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{tasks.filter((t) => !t.completed).length} Tasks</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`p-3 rounded-2xl border backdrop-blur-md text-left transition-all hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-white/5 hover:border-emerald-500/30'
                      : 'bg-white/80 border-slate-200 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono text-slate-400">Daily Target</div>
                  <div className="text-sm font-bold text-purple-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{settings.dailyGoal} 🍅 Target</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <DashboardView
                sessions={sessions}
                settings={settings}
                streak={streak}
                theme={theme}
              />
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <TaskManager
                tasks={tasks}
                activeTaskId={activeTaskId}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onSetActiveTask={handleSetActiveTask}
                onUpdatePomodoros={handleUpdatePomodoros}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          FocusFlow v2.4 • Open Source Productivity
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 text-cyan-400/80">
          <Sparkles className="w-3.5 h-3.5" />
          GSoC Developer Edition
        </span>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          saveSettings(newSettings);
        }}
        onResetAllData={handleResetAllData}
        theme={theme}
      />

      {/* Celebration Modal with Confetti */}
      <CelebrationModal
        isOpen={celebrationOpen}
        onClose={closeCelebration}
        completedMode={completedMode}
        onStartNext={() => {
          closeCelebration();
          startTimer();
        }}
        nextMode={mode}
        sessionNumber={cycleCount}
      />
    </div>
  );
}

export default App;
