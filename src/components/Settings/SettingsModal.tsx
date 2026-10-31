import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Volume2, 
  Bell, 
  Clock, 
  Sliders, 
  Keyboard, 
  Check, 
  Target 
} from 'lucide-react';
import type { TimerSettings, ThemeMode } from '../../types';
import { playCompletionSound } from '../../utils/audio';
import { requestNotificationPermission, hasNotificationPermission } from '../../utils/notifications';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSaveSettings: (settings: TimerSettings) => void;
  onResetAllData: () => void;
  theme: ThemeMode;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAllData,
  theme,
}) => {
  const isDark = theme === 'dark' || theme === 'jungle';
  const isJungle = theme === 'jungle';
  const [formData, setFormData] = useState<TimerSettings>(settings);
  const [hasNotif, setHasNotif] = useState(hasNotificationPermission());
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleChange = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 400);
  };

  const handleTestSound = () => {
    playCompletionSound(formData.soundVolume);
  };

  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setHasNotif(granted);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-xl my-8 p-6 sm:p-8 rounded-3xl border shadow-2xl overflow-hidden ${
            isJungle
              ? 'bg-[#042015] border-emerald-500/20 text-white'
              : isDark
              ? 'bg-slate-900 border-white/10 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Preferences & Settings</h3>
                <p className="text-xs text-slate-400">Customize session intervals, audio, and automation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {/* Section 1: Session Durations */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-3">
                <Clock className="w-3.5 h-3.5" />
                Session Durations (minutes)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Focus Session</span>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={formData.focusDuration}
                    onChange={(e) => handleChange('focusDuration', parseInt(e.target.value) || 25)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-mono text-center ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">Short Break</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.shortBreakDuration}
                    onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value) || 5)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-mono text-center ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">Long Break</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.longBreakDuration}
                    onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value) || 15)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-mono text-center ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Long Break Interval:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={formData.longBreakInterval}
                    onChange={(e) => handleChange('longBreakInterval', parseInt(e.target.value) || 4)}
                    className={`w-16 px-2 py-1 rounded-lg border text-xs font-mono text-center ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                  <span>sessions</span>
                </div>
              </div>
            </div>

            {/* Section 2: Daily Productivity Target */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5" />
                Daily Productivity Goal
              </label>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Target pomodoros per day:</span>
                <div className="flex items-center gap-1.5">
                  {[4, 6, 8, 10, 12].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleChange('dailyGoal', count)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                        formData.dailyGoal === count
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold'
                          : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-400'
                          : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Automation Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Workflow Automation
              </label>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium">Auto-start Breaks</div>
                  <div className="text-[11px] text-slate-400">Automatically begin break countdown after focus</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoStartBreaks}
                  onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium">Auto-start Pomodoros</div>
                  <div className="text-[11px] text-slate-400">Automatically start next focus session after break</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoStartPomodoros}
                  onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Section 4: Sound Chimes & Desktop Notifications */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Audio & Alerts
              </label>

              {/* Chime sound */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-xs font-medium">Completion Sound Chime</div>
                    <div className="text-[11px] text-slate-400">Harmonic zen bell when timer completes</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestSound}
                    className="text-[11px] font-mono px-2 py-0.5 rounded border border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    Test Chime
                  </button>
                  <input
                    type="checkbox"
                    checked={formData.soundEnabled}
                    onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {formData.soundEnabled && (
                <div className="flex items-center justify-between pl-6 text-xs text-slate-400">
                  <span>Chime Volume</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={formData.soundVolume}
                    onChange={(e) => handleChange('soundVolume', parseFloat(e.target.value))}
                    className="w-32 accent-purple-500 h-1.5"
                  />
                </div>
              )}

              {/* Desktop Browser Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-medium">Desktop Notifications</div>
                    <div className="text-[11px] text-slate-400">System popups when tab is in background</div>
                  </div>
                </div>
                <div>
                  {hasNotif ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Enabled
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRequestNotif}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                    >
                      Request Permission
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 5: Keyboard Shortcuts Guide */}
            <div className="p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Keyboard className="w-3.5 h-3.5" />
                Keyboard Shortcuts Reference
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-black/20 dark:bg-black/30 border border-white/5 text-center">
                  <div className="font-bold text-purple-400">[ Space ]</div>
                  <div className="text-[10px] text-slate-400">Start / Pause</div>
                </div>
                <div className="p-2 rounded-lg bg-black/20 dark:bg-black/30 border border-white/5 text-center">
                  <div className="font-bold text-cyan-400">[ R ]</div>
                  <div className="text-[10px] text-slate-400">Reset Timer</div>
                </div>
                <div className="p-2 rounded-lg bg-black/20 dark:bg-black/30 border border-white/5 text-center">
                  <div className="font-bold text-emerald-400">[ N ]</div>
                  <div className="text-[10px] text-slate-400">Next / Skip</div>
                </div>
              </div>
            </div>

            {/* Reset All Data Danger Zone */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-rose-400">Reset Application Data</div>
                <div className="text-[11px] text-slate-500">Clears tasks, statistics, and resets defaults</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to reset all tasks and settings to factory defaults?')) {
                    onResetAllData();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
              >
                Reset Data
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-1.5"
            >
              {showSavedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
