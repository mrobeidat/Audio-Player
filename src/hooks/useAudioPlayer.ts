"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type ActionKind, logAction } from "@/lib/actions";
import { type Track, trackLabel } from "@/lib/tracks";

const SKIP_SECONDS = 5;

export function useAudioPlayer(tracks: readonly Track[]) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeOnLoad = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[index] ?? tracks[0]!;
  const log = useCallback((kind: ActionKind, t: Track = track) => logAction(kind, trackLabel(t)), [track]);

  const select = useCallback(
    (next: number, kind: ActionKind) => {
      const wrapped = (next + tracks.length) % tracks.length;
      resumeOnLoad.current = true;
      setIndex(wrapped);
      setTime(0);
      log(kind, tracks[wrapped]);
    },
    [tracks, log],
  );

  const next = useCallback(() => select(index + 1, "Next"), [select, index]);
  const prev = useCallback(() => select(index - 1, "Prev"), [select, index]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play().catch(() => undefined);
      log("Play");
    } else {
      a.pause();
      log("Pause");
    }
  }, [log]);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
    log(a.muted ? "Mute" : "Unmute");
  }, [log]);

  const seekTo = useCallback((secs: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(Math.max(0, secs), a.duration || 0);
    setTime(a.currentTime);
  }, []);

  const commitSeek = useCallback(() => log("Seek"), [log]);

  const skip = useCallback(
    (direction: 1 | -1) => {
      const a = audioRef.current;
      if (!a) return;
      seekTo(a.currentTime + direction * SKIP_SECONDS);
      log(direction > 0 ? "Forward" : "Backward");
    },
    [seekTo, log],
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => {
      setDuration(a.duration || 0);
      if (resumeOnLoad.current) {
        resumeOnLoad.current = false;
        void a.play().catch(() => undefined);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", next);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", next);
    };
  }, [next]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.metadata = new MediaMetadata({ title: track.title, artist: track.artist, artwork: [{ src: track.cover.src, sizes: `${track.cover.width}x${track.cover.height}`, type: "image/png" }] });
    ms.setActionHandler("play", toggle);
    ms.setActionHandler("pause", toggle);
    ms.setActionHandler("previoustrack", prev);
    ms.setActionHandler("nexttrack", next);
    ms.setActionHandler("seekbackward", () => skip(-1));
    ms.setActionHandler("seekforward", () => skip(1));
    return () => {
      for (const action of ["play", "pause", "previoustrack", "nexttrack", "seekbackward", "seekforward"] as MediaSessionAction[]) ms.setActionHandler(action, null);
    };
  }, [track, toggle, prev, next, skip]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          skip(1);
          break;
        case "ArrowLeft":
          skip(-1);
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyN":
          next();
          break;
        case "KeyP":
          prev();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, skip, toggleMute, next, prev]);

  return { audioRef, track, index, playing, muted, time, duration, toggle, toggleMute, seekTo, commitSeek, skip, next, prev, select };
}

export type AudioPlayer = ReturnType<typeof useAudioPlayer>;
