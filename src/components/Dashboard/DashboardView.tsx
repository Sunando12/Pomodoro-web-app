import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Calendar, 
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import type { SessionRecord, TimerSettings, ThemeMode } from '../../types';

interface DashboardViewProps {
  sessions: SessionRecord[];
  settings: TimerSettings;
  streak: number;
  theme: ThemeMode;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sessions,
  settings,
  streak,
  theme,
}) => {
  const isDark = theme === 'dark' || theme === 'jungle';
  const isJungle = theme === 'jungle';
  const [chartView, setChartView] = useState<'hours' | 'sessions'>('hours');

  // Filter today's sessions
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(
    (s) => s.completedAt.startsWith(todayStr) && s.mode === 'focus'
  );
  const todayCount = todaySessions.length;
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todayHours = Math.floor(todayMinutes / 60);
  const remainingTodayMinutes = todayMinutes % 60;

  // Daily goal calculation
  const goalSessions = settings.dailyGoal || 8;
  const goalPercent = Math.min(100, Math.round((todayCount / goalSessions) * 100));

  // Compute 7-day data for the chart
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const daySessions = sessions.filter(
      (s) => s.completedAt.startsWith(dateStr) && s.mode === 'focus'
    );
    const dayMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const dayHours = parseFloat((dayMinutes / 60).toFixed(1));

    return {
      date: dateStr,
      day: dayName,
      hours: dayHours,
      sessions: daySessions.length,
      goalHours: (settings.focusDuration * goalSessions) / 60,
    };
  });

  const totalWeeklyHours = last7DaysData
    .reduce((acc, d) => acc + d.hours, 0)
    .toFixed(1);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-3 rounded-xl shadow-xl border text-xs font-mono backdrop-blur-md ${
            isDark ? 'bg-slate-900/95 border-purple-500/30 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          <div className="font-bold text-cyan-400 mb-1">{data.day} ({data.date})</div>
          <div className="flex items-center justify-between gap-3 text-slate-300">
            <span>Focus Time:</span>
            <span className="font-bold text-purple-400">{data.hours} hours</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-slate-300">
            <span>Sessions:</span>
            <span className="font-bold text-emerald-400">{data.sessions} pomodoros</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Productivity Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Weekly analytics, session milestones, and focus streak metrics.
        </p>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Today's Focus Time */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
            isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Focus Today
            </span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {todayHours}h {remainingTodayMinutes}m
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">On track</span> with daily schedule
          </div>
        </motion.div>

        {/* Metric 2: Completed Pomodoros */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
            isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Completed Sessions
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {todayCount} <span className="text-sm font-normal text-slate-400">sessions</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Total completed today
          </div>
        </motion.div>

        {/* Metric 3: Daily Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
            isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Daily Goal
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {goalPercent}%
          </div>
          <div className="mt-2 w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            {todayCount} of {goalSessions} pomodoros
          </div>
        </motion.div>

        {/* Metric 4: Streak Count */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
            isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Focus Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono text-amber-400`}>
            {streak} <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Keep your momentum going!</span>
          </div>
        </motion.div>
      </div>

      {/* Main Chart Section: Weekly Focus Distribution */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-md mb-8 ${
          isDark ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Weekly Focus Trends
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {totalWeeklyHours} hrs this week
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Daily deep work productivity over the past 7 days
            </p>
          </div>

          {/* Toggle between Hours and Sessions view */}
          <div className="flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-white/5">
            <button
              onClick={() => setChartView('hours')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                chartView === 'hours'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hours
            </button>
            <button
              onClick={() => setChartView('sessions')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                chartView === 'sessions'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sessions
            </button>
          </div>
        </div>

        {/* Recharts Area / Bar Container */}
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'hours' ? (
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isJungle ? '#10b981' : '#8b5cf6'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={isJungle ? '#f59e0b' : '#06b6d4'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? (isJungle ? '#064e3b' : '#334155') : '#e2e8f0'} opacity={0.4} />
                <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke={isJungle ? '#10b981' : '#a855f7'}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? (isJungle ? '#064e3b' : '#334155') : '#e2e8f0'} opacity={0.4} />
                <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sessions" fill={isJungle ? '#10b981' : '#06b6d4'} radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Session Activity Log */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-md ${
          isDark ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recent Focus Activity
            </h3>
          </div>
          <span className="text-xs text-slate-400">Latest completed milestones</span>
        </div>

        <div className="divide-y divide-white/5">
          {sessions.slice(0, 5).map((session, idx) => {
            const timeDate = new Date(session.completedAt);
            const timeFormatted = timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateFormatted = timeDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

            return (
              <div key={session.id || idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {session.taskTitle || 'Open-Source Feature Focus'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {dateFormatted} at {timeFormatted}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    +{session.durationMinutes} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
