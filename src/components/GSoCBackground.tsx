import React from 'react';
import { motion } from 'framer-motion';

interface GSoCBackgroundProps {
  theme: 'dark' | 'light';
  mode: 'focus' | 'shortBreak' | 'longBreak';
}

const CODE_SNIPPETS = [
  { text: 'git commit -m "feat: flow"', x: '8%', y: '18%', duration: 16, delay: 0 },
  { text: '</code>', x: '84%', y: '22%', duration: 18, delay: 2 },
  { text: '{ open_source: true }', x: '12%', y: '72%', duration: 20, delay: 1 },
  { text: 'while (focus) { ship(); }', x: '80%', y: '68%', duration: 22, delay: 3 },
  { text: 'fn build_future() -> Result<()>', x: '5%', y: '45%', duration: 24, delay: 4 },
  { text: 'pr.merge({ fastForward: true })', x: '78%', y: '42%', duration: 19, delay: 1.5 },
  { text: '<FocusFlow mode="zen" />', x: '24%', y: '88%', duration: 21, delay: 2.5 },
];

const GEOMETRIC_SHAPES = [
  // Hexagon top left
  { type: 'hexagon', size: 64, x: '15%', y: '12%', duration: 25, rotate: 360 },
  // Diamond top right
  { type: 'diamond', size: 48, x: '88%', y: '15%', duration: 22, rotate: -360 },
  // Triangle bottom left
  { type: 'triangle', size: 56, x: '10%', y: '82%', duration: 28, rotate: 180 },
  // Octagon bottom right
  { type: 'octagon', size: 72, x: '85%', y: '84%', duration: 26, rotate: 360 },
  // Brackets center-left
  { type: 'brackets', size: 40, x: '6%', y: '58%', duration: 17, rotate: 15 },
  // Brackets center-right
  { type: 'brackets', size: 40, x: '92%', y: '52%', duration: 19, rotate: -15 },
];

export const GSoCBackground: React.FC<GSoCBackgroundProps> = ({ theme, mode }) => {
  const isDark = theme === 'dark';

  // Dynamic ambient glow colors based on timer mode
  const glowGradients = {
    focus: isDark
      ? 'from-purple-900/25 via-indigo-900/20 to-cyan-900/20'
      : 'from-purple-200/40 via-indigo-100/40 to-cyan-100/40',
    shortBreak: isDark
      ? 'from-emerald-900/25 via-teal-900/20 to-cyan-900/20'
      : 'from-emerald-200/40 via-teal-100/40 to-cyan-100/40',
    longBreak: isDark
      ? 'from-blue-900/25 via-sky-900/20 to-indigo-900/20'
      : 'from-blue-200/40 via-sky-100/40 to-indigo-100/40',
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Dynamic Grid Pattern */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isDark ? 'bg-grid-pattern opacity-60' : 'bg-grid-pattern-light opacity-80'
        }`}
      />

      {/* Radial ambient glow orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-40 bg-gradient-to-tr ${
          isDark ? 'from-purple-600 via-indigo-600 to-transparent' : 'from-purple-400 via-indigo-300 to-transparent'
        }`}
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-35 bg-gradient-to-bl ${
          isDark ? 'from-cyan-500 via-blue-600 to-transparent' : 'from-cyan-300 via-blue-300 to-transparent'
        }`}
      />

      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.15, 0.28, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full blur-[100px] bg-gradient-to-r ${glowGradients[mode]}`}
      />

      {/* Floating Geometric Shapes */}
      {GEOMETRIC_SHAPES.map((shape, idx) => (
        <motion.div
          key={idx}
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: ['0px', '-18px', '8px', '0px'],
            x: ['0px', '10px', '-8px', '0px'],
            rotate: [0, shape.rotate],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute hidden md:block"
        >
          {shape.type === 'hexagon' && (
            <svg width={shape.size} height={shape.size} viewBox="0 0 100 100" className="opacity-20 text-purple-400">
              <polygon
                points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            </svg>
          )}

          {shape.type === 'diamond' && (
            <svg width={shape.size} height={shape.size} viewBox="0 0 100 100" className="opacity-20 text-cyan-400">
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                transform="rotate(45 50 50)"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          )}

          {shape.type === 'triangle' && (
            <svg width={shape.size} height={shape.size} viewBox="0 0 100 100" className="opacity-20 text-blue-400">
              <polygon
                points="50 15, 90 85, 10 85"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            </svg>
          )}

          {shape.type === 'octagon' && (
            <svg width={shape.size} height={shape.size} viewBox="0 0 100 100" className="opacity-15 text-indigo-400">
              <polygon
                points="30 5, 70 5, 95 30, 95 70, 70 95, 30 95, 5 70, 5 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          )}

          {shape.type === 'brackets' && (
            <div className={`font-mono text-2xl font-semibold opacity-25 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
              {'</>'}
            </div>
          )}
        </motion.div>
      ))}

      {/* Floating Developer Code Badges (GSoC Spirit) */}
      {CODE_SNIPPETS.map((snippet, idx) => (
        <motion.div
          key={idx}
          style={{ left: snippet.x, top: snippet.y }}
          animate={{
            y: ['0px', '-14px', '10px', '0px'],
            opacity: [0.35, 0.65, 0.4, 0.35],
          }}
          transition={{
            duration: snippet.duration,
            repeat: Infinity,
            delay: snippet.delay,
            ease: 'easeInOut',
          }}
          className={`absolute hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium backdrop-blur-md border shadow-sm ${
            isDark
              ? 'bg-slate-900/60 border-slate-700/50 text-cyan-300/80'
              : 'bg-white/70 border-slate-200 text-purple-700/80 shadow-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{snippet.text}</span>
        </motion.div>
      ))}
    </div>
  );
};
