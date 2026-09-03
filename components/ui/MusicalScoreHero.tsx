"use client";

import {useEffect, useRef, useState} from "react";

import {CurvedScore} from "@/components/ui/CurvedScore";
import {scorePhrases, type ScorePhrase} from "@/content/score-phrases";
import {
  createFlutePlayer,
  type FlutePlayer,
} from "@/lib/flute-player";

type PlaybackState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "complete"
  | "error";

const buttonLabels: Record<PlaybackState, string> = {
  idle: "Play the phrase",
  loading: "Starting…",
  playing: "Pause",
  paused: "Resume",
  complete: "Replay",
  error: "Try again",
};

export function MusicalScoreHero() {
  const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
  const [audioStarted, setAudioStarted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const playerRef = useRef<FlutePlayer | null>(null);
  const mountedRef = useRef(true);
  const phrase = scorePhrases[phraseIndex];

  useEffect(() => {
    mountedRef.current = true;
    const frameId = window.requestAnimationFrame(() => {
      const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
      setPhraseIndex(randomValue % scorePhrases.length);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      mountedRef.current = false;
      playerRef.current?.stop();
    };
  }, []);

  const startPhrase = async (nextPhrase: ScorePhrase) => {
    playerRef.current?.stop();
    setActiveNoteIndex(-1);
    setPlaybackState("loading");

    try {
      const player = await createFlutePlayer(
        nextPhrase,
        (index) => {
          if (mountedRef.current) setActiveNoteIndex(index);
        },
        () => {
          if (!mountedRef.current) return;
          setActiveNoteIndex(-1);
          setPlaybackState("complete");
        },
      );

      if (!mountedRef.current) {
        player.stop();
        return;
      }

      playerRef.current = player;
      await player.start();
      setAudioStarted(true);
      setPlaybackState("playing");
    } catch {
      playerRef.current?.stop();
      playerRef.current = null;
      if (mountedRef.current) setPlaybackState("error");
    }
  };

  const handlePlayback = async () => {
    if (playbackState === "playing") {
      playerRef.current?.pause();
      setPlaybackState("paused");
      return;
    }

    if (playbackState === "paused") {
      await playerRef.current?.resume();
      setPlaybackState("playing");
      return;
    }

    if (playbackState === "complete") {
      const nextIndex = (phraseIndex + 1) % scorePhrases.length;
      const nextPhrase = scorePhrases[nextIndex];
      setPhraseIndex(nextIndex);
      await startPhrase(nextPhrase);
      return;
    }

    await startPhrase(phrase);
  };

  const stateLabel =
    playbackState === "error"
      ? "Audio could not start. Please try again."
      : `${phrase.composer}, ${phrase.work}`;

  return (
    <div
      className="musical-score-player"
      data-playback-state={playbackState}
      data-audio-started={audioStarted ? "true" : undefined}
    >
      <CurvedScore activeNoteIndex={activeNoteIndex} phrase={phrase} />
      <div className="musical-score-controls">
        <button
          type="button"
          className="musical-score-play-button"
          aria-label={`${buttonLabels[playbackState]} ${phrase.work}`}
          aria-pressed={playbackState === "playing"}
          disabled={playbackState === "loading"}
          onClick={handlePlayback}
        >
          <span>{buttonLabels[playbackState]}</span>
          <span aria-hidden="true" className="musical-score-play-icon">
            {playbackState === "playing" ? "Ⅱ" : "▶"}
          </span>
        </button>
        <p className="musical-score-status" aria-live="polite">
          {stateLabel}
        </p>
      </div>
    </div>
  );
}
