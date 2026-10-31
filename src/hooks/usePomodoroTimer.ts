import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerMode, TimerStatus, TimerSettings, Task, SessionRecord } from '../types';
import { playCompletionSound, playClickSound } from '../utils/audio';
import { sendBrowserNotification } from '../utils/notifications';

interface UsePomodoroTimerProps {
  settings: TimerSettings;
  activeTask?: Task;
  onSessionComplete: (record: SessionRecord) => void;
  onIncrementTaskPomodoro?: (taskId: string) => void;
}

export function usePomodoroTimer({
  settings,
  activeTask,
  onSessionComplete,
  onIncrementTaskPomodoro,
}: UsePomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [celebrationOpen, setCelebrationOpen] = useState<boolean>(false);
  const [completedMode, setCompletedMode] = useState<TimerMode>('focus');

  // Compute duration in seconds based on current mode
  const getModeDurationSeconds = useCallback(
    (targetMode: TimerMode): number => {
      switch (targetMode) {
        case 'focus':
          return settings.focusDuration * 60;
        case 'shortBreak':
          return settings.shortBreakDuration * 60;
        case 'longBreak':
          return settings.longBreakDuration * 60;
      }
    },
    [settings]
  );

  const [timeLeft, setTimeLeft] = useState<number>(() => getModeDurationSeconds('focus'));
  const [totalDuration, setTotalDuration] = useState<number>(() => getModeDurationSeconds('focus'));

  // Target end timestamp for resilient background timing
  const targetEndTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // When settings change and timer is idle, update duration
  useEffect(() => {
    if (status === 'idle') {
      const dur = getModeDurationSeconds(mode);
      setTimeLeft(dur);
      setTotalDuration(dur);
    }
  }, [settings, mode, status, getModeDurationSeconds]);

  // Update document.title with live timer
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';

    if (status === 'running') {
      document.title = `(${timeStr}) ${modeLabel} - FocusFlow`;
    } else {
      document.title = 'FocusFlow – Animated Pomodoro Productivity';
    }
  }, [timeLeft, mode, status]);

  // Determine next mode
  const getNextMode = useCallback((): TimerMode => {
    if (mode === 'focus') {
      // Suggest long break after interval
      if (cycleCount % settings.longBreakInterval === 0) {
        return 'longBreak';
      }
      return 'shortBreak';
    }
    return 'focus';
  }, [mode, cycleCount, settings.longBreakInterval]);

  // Complete current session
  const handleSessionFinished = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    targetEndTimeRef.current = null;

    // Audio chime notification
    if (settings.soundEnabled) {
      playCompletionSound(settings.soundVolume);
    }

    // Browser push notification
    if (mode === 'focus') {
      sendBrowserNotification(
        '🎉 Focus Session Completed!',
        `Great job! Completed focus session #${cycleCount}. Time for a breather.`
      );
    } else {
      sendBrowserNotification(
        '⚡ Break Finished!',
        'Ready to dive back into deep open-source flow state?'
      );
    }

    // Record session data
    const record: SessionRecord = {
      id: `session-${Date.now()}`,
      mode,
      durationMinutes: Math.round(totalDuration / 60),
      completedAt: new Date().toISOString(),
      taskId: activeTask?.id,
      taskTitle: activeTask?.title,
    };
    onSessionComplete(record);

    // Increment active task pomodoro
    if (mode === 'focus' && activeTask && onIncrementTaskPomodoro) {
      onIncrementTaskPomodoro(activeTask.id);
    }

    // Trigger celebration modal
    setCompletedMode(mode);
    setCelebrationOpen(true);

    const next = getNextMode();
    const nextCycle = mode === 'focus' ? cycleCount + 1 : cycleCount;
    setCycleCount(nextCycle);
    setMode(next);

    const nextDur = getModeDurationSeconds(next);
    setTimeLeft(nextDur);
    setTotalDuration(nextDur);

    // Auto-start next session if enabled
    const shouldAutoStart =
      (mode === 'focus' && settings.autoStartBreaks) ||
      (mode !== 'focus' && settings.autoStartPomodoros);

    if (shouldAutoStart) {
      setStatus('running');
      targetEndTimeRef.current = Date.now() + nextDur * 1000;
    } else {
      setStatus('idle');
    }
  }, [
    mode,
    cycleCount,
    totalDuration,
    activeTask,
    settings,
    getNextMode,
    getModeDurationSeconds,
    onSessionComplete,
    onIncrementTaskPomodoro,
  ]);

  // Resilient interval loop
  useEffect(() => {
    if (status === 'running') {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + timeLeft * 1000;
      }

      timerIntervalRef.current = window.setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const remaining = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));

        setTimeLeft(remaining);

        if (remaining <= 0) {
          handleSessionFinished();
        }
      }, 250); // High precision tick, no CPU waste
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [status, timeLeft, handleSessionFinished]);

  // User Actions
  const startTimer = useCallback(() => {
    playClickSound();
    targetEndTimeRef.current = Date.now() + timeLeft * 1000;
    setStatus('running');
  }, [timeLeft]);

  const pauseTimer = useCallback(() => {
    playClickSound();
    if (targetEndTimeRef.current) {
      const remaining = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      targetEndTimeRef.current = null;
    }
    setStatus('paused');
  }, []);

  const resetTimer = useCallback(() => {
    playClickSound();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    targetEndTimeRef.current = null;
    setStatus('idle');
    const dur = getModeDurationSeconds(mode);
    setTimeLeft(dur);
    setTotalDuration(dur);
  }, [mode, getModeDurationSeconds]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      playClickSound();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      targetEndTimeRef.current = null;
      setMode(newMode);
      setStatus('idle');
      const dur = getModeDurationSeconds(newMode);
      setTimeLeft(dur);
      setTotalDuration(dur);
    },
    [getModeDurationSeconds]
  );

  const skipSession = useCallback(() => {
    playClickSound();
    const next = getNextMode();
    switchMode(next);
  }, [getNextMode, switchMode]);

  const adjustTime = useCallback((deltaMinutes: number) => {
    playClickSound();
    setTimeLeft((prev) => {
      const updated = Math.max(60, prev + deltaMinutes * 60);
      if (targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + updated * 1000;
      }
      setTotalDuration((orig) => Math.max(updated, orig));
      return updated;
    });
  }, []);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused inside an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'running') {
          pauseTimer();
        } else {
          startTimer();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetTimer();
      } else if (e.code === 'KeyN') {
        e.preventDefault();
        skipSession();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, startTimer, pauseTimer, resetTimer, skipSession]);

  return {
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
    closeCelebration: () => setCelebrationOpen(false),
    getNextMode,
  };
}
