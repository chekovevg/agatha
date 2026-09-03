import type {ScorePhrase} from "@/content/score-phrases";

export type FlutePlayer = {
  pause(): void;
  resume(): Promise<void>;
  start(): Promise<void>;
  stop(): void;
};

export async function createFlutePlayer(
  phrase: ScorePhrase,
  onNote: (index: number) => void,
  onComplete: () => void,
): Promise<FlutePlayer> {
  const Tone = await import("tone");
  const transport = Tone.getTransport();
  const draw = Tone.getDraw();
  const reverb = new Tone.Reverb({decay: 1.5, wet: 0.16}).toDestination();
  const vibrato = new Tone.Vibrato({frequency: 5.1, depth: 0.08}).connect(
    reverb,
  );
  const synth = new Tone.FMSynth({
    harmonicity: 1.01,
    modulationIndex: 0.75,
    oscillator: {type: "sine"},
    envelope: {
      attack: 0.08,
      decay: 0.14,
      sustain: 0.7,
      release: 0.55,
    },
    modulation: {type: "sine"},
    modulationEnvelope: {
      attack: 0.05,
      decay: 0.16,
      sustain: 0.18,
      release: 0.35,
    },
    volume: -11,
  }).connect(vibrato);
  const eventIds: number[] = [];
  let disposed = false;

  const resetTransport = () => {
    transport.stop();
    transport.seconds = 0;
  };

  const clearEvents = () => {
    for (const eventId of eventIds.splice(0)) {
      transport.clear(eventId);
    }
  };

  const schedulePhrase = () => {
    clearEvents();
    resetTransport();

    phrase.notes.forEach((note, index) => {
      eventIds.push(
        transport.scheduleOnce((time) => {
          synth.triggerAttackRelease(note.pitch, note.duration, time, 0.52);
          draw.schedule(() => onNote(index), time);
        }, note.time),
      );
    });

    const duration = Math.max(
      ...phrase.notes.map((note) => note.time + note.duration),
    );
    eventIds.push(
      transport.scheduleOnce((time) => {
        draw.schedule(onComplete, time);
      }, duration + 0.08),
    );
  };

  return {
    pause() {
      if (!disposed) transport.pause();
    },
    async resume() {
      if (disposed) return;
      await Tone.start();
      transport.start();
    },
    async start() {
      if (disposed) return;
      await Tone.start();
      schedulePhrase();
      transport.start("+0.05");
    },
    stop() {
      if (disposed) return;
      disposed = true;
      clearEvents();
      resetTransport();
      synth.dispose();
      vibrato.dispose();
      reverb.dispose();
    },
  };
}
