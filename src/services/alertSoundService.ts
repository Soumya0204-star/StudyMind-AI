// Web Audio Procedural Alarm & Sound Notification System
// 100% Client-Side Web Audio API - Unmistakable attention-grabbing alarm sounds

export type AlarmSoundType = "DIGITAL_CLOCK" | "SIREN" | "CHIME";

class AlertSoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private volume = 0.8;
  private alarmType: AlarmSoundType = "DIGITAL_CLOCK";
  private isAlarmRunning = false;
  private alarmIntervalId: any = null;

  constructor() {
    // Auto-unlock AudioContext on first user interaction anywhere in the window
    if (typeof window !== "undefined") {
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener("click", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };
      window.addEventListener("click", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });
    }
  }

  /**
   * Pre-warms / unlocks the AudioContext upon user gesture.
   */
  public unlockAudio(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch((err) => console.warn("Could not resume AudioContext:", err));
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopAlarm();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setAlarmType(type: AlarmSoundType) {
    this.alarmType = type;
  }

  public getAlarmType(): AlarmSoundType {
    return this.alarmType;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0.1, Math.min(1.0, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Starts a continuous alarm loop while the student's eyes remain closed (> 5 seconds).
   * Pulses alarm beeps every 1.4 seconds until student opens their eyes or dismisses.
   */
  public startAlarm() {
    if (!this.soundEnabled || this.isAlarmRunning) return;
    this.isAlarmRunning = true;

    // Play immediate first burst
    this.playAlarmBurst();

    // Pulse repeat every 1.4s
    this.alarmIntervalId = setInterval(() => {
      if (this.isAlarmRunning && this.soundEnabled) {
        this.playAlarmBurst();
      }
    }, 1400);
  }

  /**
   * Stops the ongoing alarm immediately when the student opens their eyes or dismisses.
   */
  public stopAlarm() {
    this.isAlarmRunning = false;
    if (this.alarmIntervalId) {
      clearInterval(this.alarmIntervalId);
      this.alarmIntervalId = null;
    }
  }

  public isAlarmActive(): boolean {
    return this.isAlarmRunning;
  }

  /**
   * Plays a single alarm burst based on the selected alarmType.
   */
  public playAlarmBurst(force = false) {
    if (!this.soundEnabled && !force) return;

    try {
      const ctx = this.unlockAudio();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (this.alarmType === "DIGITAL_CLOCK") {
        this.synthDigitalAlarm(ctx, masterGain);
      } else if (this.alarmType === "SIREN") {
        this.synthSirenAlarm(ctx, masterGain);
      } else {
        this.synthChimeAlarm(ctx, masterGain);
      }
    } catch (err) {
      console.warn("Could not play alarm burst:", err);
    }
  }

  /**
   * Classic loud digital alarm clock beeper:
   * Rapid burst of 4 crisp, attention-grabbing square-wave beeps.
   */
  private synthDigitalAlarm(ctx: AudioContext, destination: AudioNode) {
    const t = ctx.currentTime;
    const beeps = [0, 0.12, 0.24, 0.36];

    beeps.forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Square wave gives that distinct electronic alarm clock timbre
      osc.type = "square";
      osc.frequency.setValueAtTime(1046.5, t + offset); // C6 high alert pitch

      gain.gain.setValueAtTime(0, t + offset);
      gain.gain.linearRampToValueAtTime(0.35, t + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.09);
    });
  }

  /**
   * Urgent high-low oscillating siren alarm.
   */
  private synthSirenAlarm(ctx: AudioContext, destination: AudioNode) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    // Pitch oscillation
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.linearRampToValueAtTime(1250, t + 0.25);
    osc.frequency.linearRampToValueAtTime(700, t + 0.5);
    osc.frequency.linearRampToValueAtTime(1250, t + 0.75);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.04);
    gain.gain.setValueAtTime(0.3, t + 0.7);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.85);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(t);
    osc.stop(t + 0.85);
  }

  /**
   * Harmonic dual-tone wake-up chime.
   */
  private synthChimeAlarm(ctx: AudioContext, destination: AudioNode) {
    const t = ctx.currentTime;
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(659.25, t, 0.4); // E5
    playTone(880.0, t + 0.16, 0.45); // A5
    playTone(1318.5, t + 0.32, 0.55); // E6
  }

  /**
   * Gentle confirmation sound when user clicks awake or completes a session.
   */
  public playSuccessChime() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.unlockAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const t = ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, t + 0.16); // G5

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch (err) {
      console.warn("Could not play success chime:", err);
    }
  }
}

export const alertSoundService = new AlertSoundService();
