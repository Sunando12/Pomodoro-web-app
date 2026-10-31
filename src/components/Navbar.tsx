import React, { useState } from 'react';
import { 
  Timer, 
  BarChart3, 
  CheckSquare, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Flame, 
  VolumeX, 
  Music, 
  ChevronDown 
} from 'lucide-react';
import type { AmbientSoundType } from '../types';

interface NavbarProps {
  activeTab: 'timer' | 'dashboard' | 'tasks';
  setActiveTab: (tab: 'timer' | 'dashboard' | 'tasks') => void;
  openSettings: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  streak: number;
  ambientSoundType: AmbientSoundType;
  ambientVolume: number;
  setAmbientSound: (type: AmbientSoundType) => void;
  setAmbientVolume: (vol: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
  theme,
  toggleTheme,
  streak,
  ambientSoundType,
  ambientVolume,
  setAmbientSound,
  setAmbientVolume,
}) => {
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ] as const;

  const ambientOptions: { type: AmbientSoundType; label: string; desc: string }[] = [
    { type: 'off', label: 'Off', desc: 'No background audio' },
    { type: 'binaural', label: '40Hz Gamma Focus', desc: 'Binaural flow state beats' },
    { type: 'rain', label: 'Gentle Rain', desc: 'Calming rain soundscape' },
    { type: 'whitenoise', label: 'White / Pink Noise', desc: 'Deep background mask' },
    { type: 'cafe', label: 'Developer Cafe', desc: 'Warm ambient murmur' },
  ];

  return (
    <header className="relative z-40 w-full max-w-6xl mx-auto px-4 pt-4 sm:pt-6">
      <nav
        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-lg ${
          isDark
            ? 'bg-slate-900/70 border-white/10 shadow-purple-950/20'
            : 'bg-white/80 border-slate-200/80 shadow-slate-200/50'
        }`}
      >
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('timer')}
          className="flex items-center gap-2.5 cursor-pointer group pl-2"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-sm">
                &lt;/&gt;
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold tracking-tight text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Focus<span className="text-cyan-400">Flow</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                GSoC '26
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-md bg-gradient-to-r from-purple-600 to-indigo-600'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Streak, Ambient Sound, Theme & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak Indicator */}
          <div
            title={`Current focus streak: ${streak} days!`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold cursor-default"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="font-mono">{streak}d</span>
          </div>

          {/* Ambient Sound Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1 border transition-all ${
                ambientSoundType !== 'off'
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : isDark
                  ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  : 'bg-black/5 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Ambient Soundscapes"
            >
              {ambientSoundType !== 'off' ? (
                <Music className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: '6s' }} />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <ChevronDown className="w-3 h-3 hidden sm:inline" />
            </button>

            {/* Ambient Sound Menu Dropdown */}
            {showSoundMenu && (
              <div
                className={`absolute right-0 mt-2 w-64 p-3 rounded-2xl glass-panel shadow-2xl border z-50 animate-in fade-in zoom-in-95 ${
                  isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Ambient Soundscape
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                    Web Audio
                  </span>
                </div>

                <div className="space-y-1">
                  {ambientOptions.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => {
                        setAmbientSound(opt.type);
                        setShowSoundMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                        ambientSoundType === opt.type
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold'
                          : isDark
                          ? 'hover:bg-white/5 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-[10px] text-slate-400">{opt.desc}</div>
                      </div>
                      {ambientSoundType === opt.type && (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>

                {ambientSoundType !== 'off' && (
                  <div className="mt-3 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Volume</span>
                      <span className="font-mono">{Math.round(ambientVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={ambientVolume}
                      onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 rounded-lg bg-slate-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                : 'bg-black/5 border-slate-200 text-indigo-600 hover:bg-slate-100'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={openSettings}
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                : 'bg-black/5 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Open Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </header>
  );
};
