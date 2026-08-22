let ctx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!ctx || ctx.state === "closed") ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

type OscType = "sine" | "square" | "sawtooth" | "triangle";

interface Tone {
  freq: number;
  startTime: number;
  duration: number;
  type?: OscType;
  gainStart?: number;
  gainEnd?: number;
}

function playTones(tones: Tone[]) {
  try {
    const c = getCtx();
    tones.forEach(({ freq, startTime, duration, type = "sine", gainStart = 0.3, gainEnd = 0 }) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + startTime);
      gain.gain.setValueAtTime(gainStart, c.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(gainEnd, 0.0001),
        c.currentTime + startTime + duration
      );
      osc.start(c.currentTime + startTime);
      osc.stop(c.currentTime + startTime + duration);
    });
  } catch {}
}

export const playSend = () => {
  playTones([
    { freq: 440, startTime: 0,    duration: 0.08, type: "sine", gainStart: 0.18, gainEnd: 0.01 },
    { freq: 660, startTime: 0.06, duration: 0.12, type: "sine", gainStart: 0.12, gainEnd: 0.001 },
    { freq: 880, startTime: 0.12, duration: 0.15, type: "sine", gainStart: 0.08, gainEnd: 0.001 },
  ]);
};

export const playReceive = () => {
  playTones([
    { freq: 523, startTime: 0,    duration: 0.10, type: "sine", gainStart: 0.20, gainEnd: 0.001 },
    { freq: 659, startTime: 0.08, duration: 0.15, type: "sine", gainStart: 0.14, gainEnd: 0.001 },
  ]);
};

export const playTypingStart = () => {
  playTones([
    { freq: 900, startTime: 0, duration: 0.04, type: "sine", gainStart: 0.04, gainEnd: 0.001 },
  ]);
};

export const playUserJoined = () => {
  playTones([
    { freq: 392, startTime: 0,    duration: 0.15, type: "triangle", gainStart: 0.15, gainEnd: 0.001 },
    { freq: 523, startTime: 0.12, duration: 0.15, type: "triangle", gainStart: 0.12, gainEnd: 0.001 },
    { freq: 659, startTime: 0.24, duration: 0.20, type: "triangle", gainStart: 0.10, gainEnd: 0.001 },
  ]);
};

export const playConnected = () => {
  playTones([
    { freq: 440, startTime: 0,    duration: 0.12, type: "sine", gainStart: 0.10, gainEnd: 0.001 },
    { freq: 554, startTime: 0.10, duration: 0.18, type: "sine", gainStart: 0.08, gainEnd: 0.001 },
  ]);
};
