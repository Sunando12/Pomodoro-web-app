import type { AmbientSoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a zen chime chord when a session completes
 */
export function playCompletionSound(volume = 0.7) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic pentatonic frequencies (Zen bell / soft singing chime)
    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      // Smooth attack and long gentle decay
      gain.gain.setValueAtTime(0.001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime((volume * 0.3) / (index + 1), now + index * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 2.5);
    });
  } catch (err) {
    console.warn('Audio playback not supported or blocked:', err);
  }
}

/**
 * Play a subtle soft click when buttons are pressed
 */
export function playClickSound(volume = 0.2) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Ignore muted context errors
  }
}

// Ambient Audio Generator Manager
class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'off';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private binauralNodes: { left: OscillatorNode; right: OscillatorNode } | null = null;
  private rainInterval: number | null = null;
  private jungleInterval: number | null = null;

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }

  private init() {
    if (!this.ctx) {
      this.ctx = getAudioContext();
    }
  }

  public setSound(type: AmbientSoundType, volume = 0.5) {
    this.stop();
    this.currentType = type;
    if (type === 'off') return;

    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(Math.max(0.001, volume * 0.4), ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    if (type === 'whitenoise') {
      this.startWhiteNoise();
    } else if (type === 'rain') {
      this.startRainSound();
    } else if (type === 'binaural') {
      this.startBinauralBeats();
    } else if (type === 'cafe') {
      this.startCafeSound();
    } else if (type === 'jungle') {
      this.startJungleSound();
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(Math.max(0.001, volume * 0.4), this.ctx.currentTime, 0.1);
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop?.();
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }

    if (this.binauralNodes) {
      try {
        this.binauralNodes.left.stop();
        this.binauralNodes.right.stop();
        this.binauralNodes.left.disconnect();
        this.binauralNodes.right.disconnect();
      } catch {}
      this.binauralNodes = null;
    }

    if (this.rainInterval) {
      window.clearInterval(this.rainInterval);
      this.rainInterval = null;
    }

    if (this.jungleInterval) {
      window.clearInterval(this.jungleInterval);
      this.jungleInterval = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }

    this.currentType = 'off';
  }

  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private startWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.buffer = this.createNoiseBuffer();
    bufferSource.loop = true;

    // Filter to pink/warm white noise
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    bufferSource.connect(filter);
    filter.connect(this.gainNode);
    bufferSource.start();
    this.noiseNode = bufferSource;
  }

  private startRainSound() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.buffer = this.createNoiseBuffer();
    bufferSource.loop = true;

    // Bandpass filter for rushing gentle rain
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.7, this.ctx.currentTime);

    bufferSource.connect(bandpass);
    bandpass.connect(this.gainNode);
    bufferSource.start();
    this.noiseNode = bufferSource;

    // Occasional gentle drops
    this.rainInterval = window.setInterval(() => {
      if (!this.ctx || !this.gainNode) return;
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const dropTime = this.ctx.currentTime;

      dropOsc.frequency.setValueAtTime(1400 + Math.random() * 800, dropTime);
      dropOsc.frequency.exponentialRampToValueAtTime(300, dropTime + 0.08);

      dropGain.gain.setValueAtTime(0.04, dropTime);
      dropGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.08);

      dropOsc.connect(dropGain);
      dropGain.connect(this.gainNode);

      dropOsc.start(dropTime);
      dropOsc.stop(dropTime + 0.09);
    }, 450);
  }

  private startBinauralBeats() {
    if (!this.ctx || !this.gainNode) return;
    // 210Hz Left, 250Hz Right = 40Hz Gamma wave for peak deep focus
    const merger = this.ctx.createChannelMerger(2);

    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(210, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(250, this.ctx.currentTime);

    oscLeft.connect(merger, 0, 0); // Left channel
    oscRight.connect(merger, 0, 1); // Right channel

    merger.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();

    this.binauralNodes = { left: oscLeft, right: oscRight };
  }

  private startCafeSound() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.buffer = this.createNoiseBuffer();
    bufferSource.loop = true;

    // Lowpass filter for warm background murmur
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    bufferSource.connect(filter);
    filter.connect(this.gainNode);
    bufferSource.start();
    this.noiseNode = bufferSource;
  }

  private startJungleSound() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSource = this.ctx.createBufferSource();
    bufferSource.buffer = this.createNoiseBuffer();
    bufferSource.loop = true;

    // Gentle canopy rain and rustling jungle foliage
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1100, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.85, this.ctx.currentTime);

    bufferSource.connect(bandpass);
    bandpass.connect(this.gainNode);
    bufferSource.start();
    this.noiseNode = bufferSource;

    // Tropical bird chirps and distant nature sounds
    this.jungleInterval = window.setInterval(() => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      const baseFreq = 2100 + Math.random() * 900;

      // Soft bird chirp sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.16);
    }, 3000);
  }
}

export const ambientSound = new AmbientAudioManager();
