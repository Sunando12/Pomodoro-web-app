import type { TimerSettings, Task, SessionRecord, ThemeMode } from '../types';

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  soundVolume: 0.8,
  ambientSound: 'off',
  ambientVolume: 0.5,
  dailyGoal: 8,
};

const STORAGE_KEYS = {
  SETTINGS: 'focusflow_settings_v1',
  TASKS: 'focusflow_tasks_v1',
  ACTIVE_TASK_ID: 'focusflow_active_task_v1',
  SESSIONS: 'focusflow_sessions_v1',
  STREAK: 'focusflow_streak_v1',
  THEME: 'focusflow_theme_v1',
};

// Seed initial tasks for rich developer experience
const INITIAL_TASKS: Task[] = [
  {
    id: 'task-core-architecture',
    title: 'Design Core Architecture & State Flow',
    completed: false,
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    tag: 'Dev',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'task-core-refactor',
    title: 'Refactor Timer state with resilient delta timestamps',
    completed: true,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    tag: 'Bugfix',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'task-api-docs',
    title: 'Review PR & write developer contribution guidelines',
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    tag: 'Review',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

// Helper to generate seed past 7 days sessions for dashboard
function generateSeedSessions(): SessionRecord[] {
  const sessions: SessionRecord[] = [];
  const now = new Date();

  // Create data for previous 6 days plus today
  const dailyCounts = [5, 7, 4, 8, 6, 9, 3]; // Mon to Sun / past 7 days
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = dailyCounts[6 - i];

    for (let j = 0; j < count; j++) {
      const sessionDate = new Date(d);
      sessionDate.setHours(9 + j * 1.5, Math.floor(Math.random() * 45));
      sessions.push({
        id: `seed-${i}-${j}`,
        mode: 'focus',
        durationMinutes: 25,
        completedAt: sessionDate.toISOString(),
        taskTitle: j % 2 === 0 ? 'Core Feature Implementation' : 'Performance Optimization',
      });
    }
  }

  return sessions;
}

export function loadSettings(): TimerSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load settings from storage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: TimerSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to storage', e);
  }
}

export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load tasks from storage', e);
  }
  return INITIAL_TASKS;
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks to storage', e);
  }
}

export function loadActiveTaskId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK_ID) || 'task-core-architecture';
  } catch {
    return 'task-core-architecture';
  }
}

export function saveActiveTaskId(id: string | null) {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK_ID);
    }
  } catch (e) {
    console.warn('Failed to save active task ID', e);
  }
}

export function loadSessions(): SessionRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load sessions from storage', e);
  }
  const seeded = generateSeedSessions();
  saveSessions(seeded);
  return seeded;
}

export function saveSessions(sessions: SessionRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.warn('Failed to save sessions to storage', e);
  }
}

export function loadStreak(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
    return stored ? parseInt(stored, 10) : 5; // Initial 5 day streak
  } catch {
    return 5;
  }
}

export function saveStreak(streak: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
  } catch (e) {
    console.warn('Failed to save streak', e);
  }
}

export function loadTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (stored === 'light' || stored === 'dark' || stored === 'jungle') return stored;
  } catch {}
  return 'dark'; // Default dark theme
}

export function saveTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.warn('Failed to save theme', e);
  }
}
