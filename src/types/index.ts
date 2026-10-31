export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  tag: 'Dev' | 'Bugfix' | 'Review' | 'Docs' | 'Learning' | 'General';
  createdAt: number;
}

export type AmbientSoundType = 'off' | 'rain' | 'whitenoise' | 'binaural' | 'cafe';

export interface TimerSettings {
  focusDuration: number;        // in minutes
  shortBreakDuration: number;   // in minutes
  longBreakDuration: number;    // in minutes
  longBreakInterval: number;    // sessions before long break (e.g., 4)
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number;          // 0 to 1
  ambientSound: AmbientSoundType;
  ambientVolume: number;        // 0 to 1
  dailyGoal: number;            // target pomodoros today
}

export interface SessionRecord {
  id: string;
  mode: TimerMode;
  durationMinutes: number;
  completedAt: string; // ISO string
  taskId?: string;
  taskTitle?: string;
}

export interface DailyStat {
  date: string;         // YYYY-MM-DD
  dayName: string;      // Mon, Tue, etc.
  focusMinutes: number;
  sessionsCount: number;
  goalMinutes: number;
}
