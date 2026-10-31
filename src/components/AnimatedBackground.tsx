import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ThemeMode } from '../types';

interface AnimatedBackgroundProps {
  theme: ThemeMode;
  mode: 'focus' | 'shortBreak' | 'longBreak';
}

const PARTICLE_COUNT = 32;
const LINE_COUNT = 6;

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme, mode }) => {
  const isDark = theme === 'dark' || theme === 'jungle';
  const isJungle = theme === 'jungle';
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const orbsRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const centerGlowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Mode & theme-dependent color tokens
  const getColors = () => {
    if (isJungle) {
      return {
        focus: { primary: '#10b981', secondary: '#f59e0b', accent: '#34d399' },
        shortBreak: { primary: '#2dd4bf', secondary: '#84cc16', accent: '#059669' },
        longBreak: { primary: '#0ea5e9', secondary: '#10b981', accent: '#eab308' },
      }[mode];
    }
    return {
      focus: { primary: '#a855f7', secondary: '#06b6d4', accent: '#6366f1' },
      shortBreak: { primary: '#10b981', secondary: '#22d3ee', accent: '#14b8a6' },
      longBreak: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#6366f1' },
    }[mode];
  };

  const colors = getColors();

  // ── GSAP: Floating micro-particles / Bioluminescent fireflies ────
  useEffect(() => {
    const particles = particlesRef.current;
    if (!particles.length) return;

    const tweens: gsap.core.Tween[] = [];

    particles.forEach((el, i) => {
      if (!el) return;

      const startX = gsap.utils.random(0, 100);
      const startY = gsap.utils.random(0, 100);
      const size = isJungle ? gsap.utils.random(3, 7) : gsap.utils.random(2, 6);
      const dur = isJungle ? gsap.utils.random(8, 20) : gsap.utils.random(12, 28);

      gsap.set(el, {
        left: `${startX}%`,
        top: `${startY}%`,
        width: size,
        height: size,
        opacity: 0,
      });

      // Staggered fade in
      gsap.to(el, {
        opacity: isJungle ? gsap.utils.random(0.3, 0.85) : gsap.utils.random(0.2, 0.5),
        duration: gsap.utils.random(1, 3),
        ease: 'power2.out',
      });

      // Organic wandering motion (Jungle fireflies drift upward and sway)
      const tw = gsap.to(el, {
        x: `random(-50, 50)`,
        y: isJungle ? `random(-120, -20)` : `random(-70, 70)`,
        duration: dur,
        repeat: -1,
        yoyo: !isJungle,
        ease: isJungle ? 'sine.out' : 'sine.inOut',
        delay: gsap.utils.random(0, 3),
      });
      tweens.push(tw);

      // Bioluminescent firefly flickering pulse
      const pulse = gsap.to(el, {
        scale: isJungle ? gsap.utils.random(1.3, 2.2) : gsap.utils.random(1.2, 1.8),
        opacity: isJungle ? gsap.utils.random(0.15, 0.95) : gsap.utils.random(0.1, 0.4),
        duration: isJungle ? gsap.utils.random(1.2, 3.2) : gsap.utils.random(3, 6),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: (i % 5) * 0.4,
      });
      tweens.push(pulse);
    });

    return () => {
      tweens.forEach((tw) => tw.kill());
    };
  }, [theme, isJungle]);

  // ── GSAP: Ambient gradient orbs ─────────────────────────────────
  useEffect(() => {
    const orbs = orbsRef.current;
    if (!orbs.length) return;

    const tweens: gsap.core.Tween[] = [];

    orbs.forEach((el, i) => {
      if (!el) return;

      const dur = 14 + i * 4;
      const tw = gsap.to(el, {
        x: `random(-40, 40)`,
        y: `random(-50, 50)`,
        scale: gsap.utils.random(0.9, 1.25),
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 1.5,
      });
      tweens.push(tw);
    });

    return () => {
      tweens.forEach((tw) => tw.kill());
    };
  }, [theme]);

  // ── GSAP: Center glow breathing sync with mode ──────────────────
  useEffect(() => {
    const el = centerGlowRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, {
      scale: 1.1,
      opacity: isDark ? (isJungle ? 0.32 : 0.28) : 0.16,
      duration: 4,
      ease: 'sine.inOut',
    }).to(el, {
      scale: 0.9,
      opacity: isDark ? (isJungle ? 0.14 : 0.12) : 0.06,
      duration: 4,
      ease: 'sine.inOut',
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [mode, theme, isDark, isJungle]);

  // ── GSAP: Waveform light rays / canopy sunbeams ──────────────────
  useEffect(() => {
    const lines = linesRef.current;
    if (!lines.length) return;

    const tweens: gsap.core.Tween[] = [];

    lines.forEach((el, i) => {
      if (!el) return;

      gsap.set(el, {
        top: `${12 + i * 14}%`,
        left: '-10%',
        width: '120%',
        opacity: 0,
        scaleX: 0.7,
      });

      gsap.to(el, {
        opacity: isJungle ? 0.12 : (isDark ? 0.06 : 0.08),
        scaleX: 1,
        duration: 2,
        delay: i * 0.3,
        ease: 'power3.out',
      });

      const tw = gsap.to(el, {
        y: `random(-20, 20)`,
        x: `random(-25, 25)`,
        skewX: gsap.utils.random(-3, 3),
        duration: gsap.utils.random(10, 18),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.8,
      });
      tweens.push(tw);
    });

    return () => {
      tweens.forEach((tw) => tw.kill());
    };
  }, [theme, isDark, isJungle]);

  // ── GSAP: Grid subtle fade pulse ────────────────────────────────
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const tw = gsap.to(el, {
      opacity: isDark ? (isJungle ? 0.45 : 0.55) : 0.75,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      tw.kill();
    };
  }, [theme, isDark, isJungle]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 transition-colors duration-700"
    >
      {/* Background Grid Pattern */}
      <div
        ref={gridRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isJungle
            ? 'bg-grid-pattern-jungle opacity-50'
            : isDark
            ? 'bg-grid-pattern opacity-60'
            : 'bg-grid-pattern-light opacity-80'
        }`}
      />

      {/* ─── Ambient Gradient Orbs (Canopy & Mist) ────────────────── */}
      <div
        ref={(el) => { if (el) orbsRef.current[0] = el; }}
        className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full blur-[110px] transition-all duration-1000"
        style={{
          opacity: isDark ? (isJungle ? 0.45 : 0.38) : 0.25,
          background: isJungle
            ? `radial-gradient(circle, #065f46ee 0%, #04785788 50%, transparent 75%)`
            : `radial-gradient(circle, ${colors.primary}88, transparent 70%)`,
        }}
      />
      <div
        ref={(el) => { if (el) orbsRef.current[1] = el; }}
        className="absolute -bottom-36 -right-36 w-[34rem] h-[34rem] rounded-full blur-[110px] transition-all duration-1000"
        style={{
          opacity: isDark ? (isJungle ? 0.38 : 0.32) : 0.22,
          background: isJungle
            ? `radial-gradient(circle, #064e3bee 0%, #022c22aa 50%, transparent 75%)`
            : `radial-gradient(circle, ${colors.secondary}77, transparent 70%)`,
        }}
      />
      <div
        ref={(el) => { if (el) orbsRef.current[2] = el; }}
        className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full blur-[90px] transition-all duration-1000"
        style={{
          opacity: isDark ? (isJungle ? 0.28 : 0.2) : 0.15,
          background: isJungle
            ? `radial-gradient(circle, #f59e0b55 0%, #10b98144 50%, transparent 70%)`
            : `radial-gradient(circle, ${colors.accent}66, transparent 70%)`,
        }}
      />

      {/* ─── Center breathing glow ─────────────────────────────────── */}
      <div
        ref={centerGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] rounded-full blur-[120px] transition-all duration-1000"
        style={{
          opacity: isDark ? (isJungle ? 0.22 : 0.18) : 0.1,
          background: isJungle
            ? `radial-gradient(circle, #10b98166 0%, #04785733 40%, transparent 70%)`
            : `radial-gradient(circle, ${colors.primary}55 0%, ${colors.secondary}33 40%, transparent 70%)`,
        }}
      />

      {/* ─── Horizontal floating waveform / Canopy light rays ───────── */}
      {Array.from({ length: LINE_COUNT }).map((_, i) => (
        <div
          key={`line-${i}`}
          ref={(el) => { if (el) linesRef.current[i] = el; }}
          className="absolute h-px"
          style={{
            background: isJungle
              ? `linear-gradient(90deg, transparent, #10b98135 25%, #f59e0b30 50%, #34d39925 75%, transparent)`
              : `linear-gradient(90deg, transparent, ${colors.primary}${isDark ? '30' : '20'} 30%, ${colors.secondary}${isDark ? '25' : '18'} 70%, transparent)`,
          }}
        />
      ))}

      {/* ─── Micro particles / Fireflies ──────────────────────────── */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const particleColor = isJungle
          ? i % 3 === 0
            ? '#facc15' // firefly warm yellow
            : i % 3 === 1
            ? '#a3e635' // bioluminescent lime
            : '#34d399' // emerald mint
          : i % 3 === 0
          ? colors.primary
          : i % 3 === 1
          ? colors.secondary
          : colors.accent;

        return (
          <div
            key={`particle-${i}`}
            ref={(el) => { if (el) particlesRef.current[i] = el; }}
            className="absolute rounded-full"
            style={{
              background: particleColor,
              boxShadow: isJungle
                ? `0 0 ${gsapRandom(6, 14)}px ${particleColor}`
                : `0 0 ${gsapRandom(4, 10)}px ${particleColor}60`,
            }}
          />
        );
      })}

      {/* ─── Vignette Overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: isJungle
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(2, 20, 13, 0.65) 100%)'
            : isDark
            ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.06) 100%)',
        }}
      />
    </div>
  );
};

function gsapRandom(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
