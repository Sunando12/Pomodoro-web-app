import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Plus, Minus, Keyboard } from 'lucide-react';
import type { TimerMode, TimerStatus } from '../../types';

interface TimerControlsProps {
  mode: TimerMode;
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onModeChange: (mode: TimerMode) => void;
  onAdjustTime: (deltaMinutes: number) => void;
  theme: 'dark' | 'light';
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  mode,
  status,
  onStart,
  onPause,
  onReset,
  onSkip,
  onModeChange,
  onAdjustTime,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isRunning = status === 'running';

  const modes: { id: TimerMode; label: string }[] = [
    { id: 'focus', label: 'Focus' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
  ];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Mode Switcher Tabs */}
      <div
        className={`flex items-center p-1.5 rounded-2xl backdrop-blur-md border shadow-sm ${
          isDark ? 'bg-slate-900/70 border-white/10' : 'bg-slate-100/90 border-slate-200'
        }`}
      >
        {modes.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`relative px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTimerModeIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 shadow-md shadow-purple-500/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Buttons Row */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={onReset}
          title="Reset timer (R)"
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 shadow-md'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        {/* Big Start / Pause Play Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? onPause : onStart}
          title={isRunning ? 'Pause (Space)' : 'Start (Space)'}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all ${
            isRunning
              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/30'
              : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-purple-500/40 glow-purple'
          }`}
        >
          {isRunning ? (
            <Pause className="w-8 h-8 fill-white" />
          ) : (
            <Play className="w-8 h-8 fill-white ml-1" />
          )}
        </motion.button>

        {/* Skip / Next Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={onSkip}
          title="Skip to next session (N)"
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 shadow-md'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
          }`}
        >
          <SkipForward className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Quick Time Increments (+5m / -5m) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAdjustTime(-5)}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-colors flex items-center gap-1 ${
            isDark
              ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Minus className="w-3 h-3" />
          <span>5 min</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">adjust</span>

        <button
          onClick={() => onAdjustTime(5)}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-colors flex items-center gap-1 ${
            isDark
              ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-3 h-3" />
          <span>5 min</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div
        className={`flex items-center gap-3 px-3.5 py-1.5 rounded-xl text-[11px] font-mono border backdrop-blur-sm ${
          isDark
            ? 'bg-slate-900/30 border-white/5 text-slate-400'
            : 'bg-slate-100/70 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-1">
          <Keyboard className="w-3.5 h-3.5 opacity-70" />
          <span className="font-semibold">Shortcuts:</span>
        </div>
        <span>[Space] {isRunning ? 'Pause' : 'Start'}</span>
        <span>•</span>
        <span>[R] Reset</span>
        <span>•</span>
        <span>[N] Skip</span>
      </div>
    </div>
  );
};
