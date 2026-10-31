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
  ChevronDown,
  Leaf 
} from 'lucide-react';
import type { AmbientSoundType, ThemeMode } from '../types';

interface NavbarProps {
  activeTab: 'timer' | 'dashboard' | 'tasks';
  setActiveTab: (tab: 'timer' | 'dashboard' | 'tasks') => void;
  openSettings: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
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
  setTheme,
  streak,
  ambientSoundType,
  ambientVolume,
  setAmbientSound,
  setAmbientVolume,
}) => {
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const isDark = theme === 'dark' || theme === 'jungle';
  const isJungle = theme === 'jungle';

  const navItems = [
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ] as const;

  const ambientOptions: { type: AmbientSoundType; label: string; desc: string }[] = [
    { type: 'off', label: 'Off', desc: 'No background audio' },
    { type: 'jungle', label: '🌿 Rainforest Canopy', desc: 'Canopy rain & tropical birds' },
    { type: 'binaural', label: '40Hz Gamma Focus', desc: 'Binaural flow state beats' },
    { type: 'rain', label: 'Gentle Rain', desc: 'Calming rain soundscape' },
    { type: 'whitenoise', label: 'White / Pink Noise', desc: 'Deep background mask' },
    { type: 'cafe', label: 'Developer Cafe', desc: 'Warm ambient murmur' },
  ];

  return (
    <header className="relative z-40 w-full max-w-6xl mx-auto px-4 pt-4 sm:pt-6">
      <nav
        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-lg ${
          isJungle
            ? 'bg-[#041d13]/85 border-emerald-500/20 shadow-emerald-950/30'
            : isDark
            ? 'bg-slate-900/70 border-white/10 shadow-purple-950/20'
            : 'bg-white/80 border-slate-200/80 shadow-slate-200/50'
        }`}
      >
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('timer')}
          className="flex items-center gap-2.5 cursor-pointer group pl-2"
        >
          <div className={`w-9 h-9 rounded-xl p-0.5 shadow-md group-hover:scale-105 transition-transform ${
            isJungle
              ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 shadow-emerald-500/30'
              : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-purple-500/25'
          }`}>
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
              isJungle ? 'bg-[#03150d]' : isDark ? 'bg-slate-950' : 'bg-white'
            }`}>
              {isJungle ? (
                <Leaf className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-sm">
                  &lt;/&gt;
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold tracking-tight text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Focus<span className={isJungle ? 'text-emerald-400' : 'text-cyan-400'}>Flow</span>
              </span>
              <span className={`hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isJungle
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
              }`}>
                {isJungle ? 'JUNGLE' : 'GSAP PRO'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className={`flex items-center p-1 rounded-xl border ${
          isJungle
            ? 'bg-black/25 border-emerald-500/15'
            : 'bg-black/10 dark:bg-white/5 border-white/5'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? isJungle
                      ? 'text-white shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25'
                      : 'text-white shadow-md bg-gradient-to-r from-purple-600 to-indigo-600'
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
          {/* Day Streak Counter */}
          <div 
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium ${
              isJungle
                ? 'bg-emerald-500/10 border-emerald-500/25 text-amber-300'
                : isDark
                ? 'bg-white/5 border-white/10 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
            title={`You're on a ${streak}-day productivity streak!`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="font-mono font-bold">{streak}</span>
            <span className="text-[10px] opacity-75">days</span>
          </div>

          {/* Ambient Sound Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-medium ${
                ambientSoundType !== 'off'
                  ? isJungle
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : isDark
                  ? 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  : 'bg-black/5 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Ambient soundscapes"
            >
              {ambientSoundType === 'off' ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              )}
              <span className="hidden sm:inline">
                {ambientSoundType === 'off' ? 'Sound' : ambientSoundType.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Sound Selection Menu */}
            {showSoundMenu && (
              <div 
                className={`absolute right-0 mt-2 w-64 rounded-2xl p-2 border backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isJungle
                    ? 'bg-[#031d14]/95 border-emerald-500/30'
                    : isDark 
                    ? 'bg-slate-950/95 border-white/10' 
                    : 'bg-white/95 border-slate-200'
                }`}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Ambient Soundscapes
                </div>
                <div className="space-y-1">
                  {ambientOptions.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => {
                        setAmbientSound(opt.type);
                        setShowSoundMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col ${
                        ambientSoundType === opt.type
                          ? isJungle
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-purple-500/20 text-cyan-300 border border-purple-500/30'
                          : isDark
                          ? 'text-slate-300 hover:bg-white/5'
                          : 'text-slate-700 hover:bg-black/5'
                      }`}
                    >
                      <div className="text-xs font-medium flex items-center justify-between">
                        <span>{opt.label}</span>
                        {ambientSoundType === opt.type && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Volume Slider inside sound menu */}
                {ambientSoundType !== 'off' && (
                  <div className="mt-2 pt-2 border-t border-white/10 px-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Sound Volume</span>
                      <span>{Math.round(ambientVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={ambientVolume}
                      onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 h-1.5 rounded-lg bg-slate-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Selector (Cyber / Jungle / Light) */}
          <div className={`flex items-center p-0.5 rounded-xl border ${
            isJungle 
              ? 'bg-emerald-950/40 border-emerald-500/20' 
              : isDark 
              ? 'bg-white/5 border-white/10' 
              : 'bg-black/5 border-slate-200'
          }`}>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-purple-600/30 text-purple-300 shadow-sm border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Midnight Cyber Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('jungle')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'jungle'
                  ? 'bg-emerald-500/30 text-emerald-300 shadow-sm border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Jungle Oasis Theme (Rainforest & Fireflies)"
            >
              <Leaf className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'light'
                  ? 'bg-amber-400/30 text-amber-600 shadow-sm border border-amber-400/30'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Daylight Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={openSettings}
            className={`p-2 rounded-xl border transition-all ${
              isJungle
                ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                : isDark
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
