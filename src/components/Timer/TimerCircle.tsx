import React from 'react';
import { motion } from 'framer-motion';
import type { TimerMode, TimerStatus, Task } from '../../types';
import { Target, Coffee, Flame } from 'lucide-react';

interface TimerCircleProps {
  mode: TimerMode;
  status: TimerStatus;
  timeLeft: number;        // in seconds
  totalDuration: number;   // in seconds
  cycleCount: number;      // e.g. 1 to 4
  longBreakInterval: number;
  activeTask?: Task;
  onSelectTaskClick: () => void;
  theme: 'dark' | 'light';
}

export const TimerCircle: React.FC<TimerCircleProps> = ({
  mode,
  status,
  timeLeft,
  totalDuration,
  cycleCount,
  longBreakInterval,
  activeTask,
  onSelectTaskClick,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Circle calculation
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  // Progress fraction from 0 (empty) to 1 (full)
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // Mode color configurations
  const modeConfigs = {
    focus: {
      label: 'Focus Session',
      gradientId: 'focusGradient',
      startColor: '#a855f7',
      endColor: '#06b6d4',
      glowClass: 'glow-purple',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: Flame,
    },
    shortBreak: {
      label: 'Short Break',
      gradientId: 'shortBreakGradient',
      startColor: '#10b981',
      endColor: '#06b6d4',
      glowClass: 'glow-cyan',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: Coffee,
    },
    longBreak: {
      label: 'Long Break',
      gradientId: 'longBreakGradient',
      startColor: '#3b82f6',
      endColor: '#8b5cf6',
      glowClass: 'glow-blue',
      badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: Coffee,
    },
  };

  const currentConfig = modeConfigs[mode];
  const ModeIcon = currentConfig.icon;

  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      {/* Active Task Floating Pill Banner */}
      <div className="mb-6 z-10 w-full max-w-sm px-2">
        {activeTask ? (
          <button
            onClick={onSelectTaskClick}
            className={`w-full group px-4 py-2 rounded-xl border backdrop-blur-md transition-all flex items-center justify-between shadow-md ${
              isDark
                ? 'bg-slate-900/80 border-purple-500/30 hover:border-purple-500/60 text-slate-200'
                : 'bg-white/90 border-purple-300 hover:border-purple-500 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden text-left">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                <Target className="w-4 h-4" />
              </span>
              <div className="truncate">
                <div className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-semibold">
                  Active Focus Task
                </div>
                <div className="text-xs sm:text-sm font-semibold truncate group-hover:text-purple-400 transition-colors">
                  {activeTask.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeTask.completedPomodoros}/{activeTask.estimatedPomodoros} 🍅
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={onSelectTaskClick}
            className={`w-full px-4 py-2 rounded-xl border border-dashed transition-all flex items-center justify-center gap-2 text-xs font-medium ${
              isDark
                ? 'border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200'
                : 'border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span>Select or add a focus task for this session</span>
          </button>
        )}
      </div>

      {/* Main Circular Countdown Container */}
      <div className="relative flex items-center justify-center p-4">
        {/* Soft breathing background glow */}
        <div
          className={`absolute inset-4 rounded-full filter blur-2xl opacity-30 transition-all duration-700 ${
            status === 'running' ? 'animate-timer-glow' : 'opacity-15'
          }`}
          style={{
            background: `radial-gradient(circle, ${currentConfig.startColor} 0%, transparent 70%)`,
          }}
        />

        {/* SVG Circular Ring */}
        <div className="relative w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 320 320">
            <defs>
              <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="shortBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              className={`fill-none transition-colors duration-500 ${
                isDark ? 'stroke-slate-800/80' : 'stroke-slate-200'
              }`}
              strokeWidth="10"
            />

            {/* Subtle Dotted Secondary Guide */}
            <circle
              cx="160"
              cy="160"
              r={radius - 12}
              className={`fill-none stroke-dasharray-[4,8] opacity-20 ${
                isDark ? 'stroke-purple-400' : 'stroke-purple-600'
              }`}
              strokeWidth="1.5"
            />

            {/* Active Animated Progress Arc */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              className="fill-none transition-all duration-300 ease-linear"
              stroke={`url(#${currentConfig.gradientId})`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter:
                  status === 'running'
                    ? `drop-shadow(0 0 8px ${currentConfig.startColor})`
                    : 'none',
              }}
            />
          </svg>

          {/* Central Timer Information Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
            {/* Mode Badge with Icon */}
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-2 shadow-sm ${currentConfig.badgeBg}`}
            >
              <ModeIcon className="w-3.5 h-3.5" />
              <span>{currentConfig.label}</span>
              {status === 'running' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </motion.div>

            {/* Time Countdown (Large MM:SS) */}
            <motion.div
              key={timeFormatted}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              className={`font-mono text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {timeFormatted}
            </motion.div>

            {/* Pomodoro Session Cycle Indicator (e.g. Session 3 of 4) */}
            <div className="mt-3 flex flex-col items-center gap-1.5">
              <span className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Session {((cycleCount - 1) % longBreakInterval) + 1} of {longBreakInterval}
              </span>

              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: longBreakInterval }).map((_, i) => {
                  const currentIdx = (cycleCount - 1) % longBreakInterval;
                  const isDone = i < currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'w-6 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-md shadow-purple-500/50'
                          : isDone
                          ? 'w-2 bg-emerald-400'
                          : isDark
                          ? 'w-2 bg-slate-700'
                          : 'w-2 bg-slate-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
