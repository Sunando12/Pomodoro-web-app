import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, X } from 'lucide-react';
import type { TimerMode } from '../types';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedMode: TimerMode;
  onStartNext: () => void;
  nextMode: TimerMode;
  sessionNumber: number;
}

const DEVELOPER_QUOTES = [
  "Commit pushed to main! You're in peak flow state.",
  "Clean build, 100% test coverage. Stellar focus!",
  "Open source mastery unlocked. Hydrate and stretch!",
  "PR merged without merge conflicts. Outstanding progress!",
  "Deep work milestone accomplished. Ready for a well-earned break?",
];

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  completedMode,
  onStartNext,
  nextMode,
  sessionNumber,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti cannons
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#a855f7', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFocus = completedMode === 'focus';
  const quote = DEVELOPER_QUOTES[sessionNumber % DEVELOPER_QUOTES.length];

  const nextTitle =
    nextMode === 'focus'
      ? 'Next Focus Session'
      : nextMode === 'shortBreak'
      ? 'Short Break (5m)'
      : 'Long Break (15m)';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl glass-panel border border-purple-500/30 shadow-2xl overflow-hidden text-center"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
            {isFocus ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {isFocus ? 'Focus Session Completed!' : 'Break Finished!'}
          </h3>

          <p className="text-slate-300 text-sm mb-4 leading-relaxed font-sans">
            "{quote}"
          </p>

          {isFocus && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Completed Pomodoro #{sessionNumber}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-all"
            >
              Take a breather
            </button>
            <button
              onClick={() => {
                onClose();
                onStartNext();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{nextTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
