"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tracks } from "@/lib/tracks";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Particles } from "@/components/Particles";
import { NowPlaying } from "./NowPlaying";
import { Controls } from "./Controls";

export function Player() {
  const player = useAudioPlayer(tracks);
  const { audioRef, track, playing } = player;

  return (
    <div className="relative flex flex-col items-center gap-4 w-full max-w-xl">
      <audio ref={audioRef} src={track.src} preload="metadata" />
      <Particles playing={playing} />
      <NowPlaying track={track} playing={playing} progress={player.duration ? player.time / player.duration : 0} />
      <Controls player={player} />
      <Link
        href="/actions"
        className={`relative z-10 flex items-center gap-2 rounded-full bg-gradient-to-br from-pink-500 to-red-800 px-5 py-2.5 text-sm font-medium shadow-md transition hover:from-red-800 hover:to-pink-500 lift ${playing ? "translate-y-10" : ""}`}
      >
        View user actions
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
