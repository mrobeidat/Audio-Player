import { FastForward, Pause, Play, Rewind, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import type { AudioPlayer } from "@/hooks/useAudioPlayer";
import { clock } from "@/lib/format";

function IconButton({ label, onClick, children, className = "" }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={`grid place-items-center rounded-full p-2 transition hover:bg-white/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-400 ${className}`}>
      {children}
    </button>
  );
}

export function Controls({ player }: { player: AudioPlayer }) {
  const { playing, muted, time, duration, toggle, toggleMute, seekTo, commitSeek, skip, next, prev } = player;
  const fill = duration ? `${(time / duration) * 100}%` : "0%";

  return (
    <div className={`glass relative z-10 flex w-full flex-wrap items-center justify-center gap-1 rounded-3xl p-2 shadow-2xl shadow-black/50 lift sm:flex-nowrap sm:rounded-full ${playing ? "translate-y-10 shadow-white/40" : ""}`}>
      <IconButton label="Back 5 seconds" onClick={() => skip(-1)}><Rewind className="size-4" /></IconButton>
      <IconButton label="Previous track" onClick={prev}><SkipBack className="size-4" /></IconButton>
      <IconButton label={playing ? "Pause" : "Play"} onClick={toggle} className="bg-white/10">
        {playing ? <Pause className="size-6" fill="currentColor" /> : <Play className="size-6" fill="currentColor" />}
      </IconButton>
      <IconButton label="Next track" onClick={next}><SkipForward className="size-4" /></IconButton>
      <IconButton label="Forward 5 seconds" onClick={() => skip(1)}><FastForward className="size-4" /></IconButton>

      <IconButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute} className="sm:hidden">
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </IconButton>

      <span className="ms-1 font-mono text-xs tabular-nums text-white/90" aria-live="off">{clock(time)}/{clock(duration)}</span>

      <input
        type="range"
        className="seek order-last mx-2 w-full basis-full sm:order-none sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-auto"
        style={{ "--fill": fill } as React.CSSProperties}
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(time, duration || 0)}
        onChange={(e) => seekTo(Number(e.target.value))}
        onPointerUp={commitSeek}
        onKeyUp={commitSeek}
        aria-label="Seek"
        aria-valuetext={clock(time)}
      />

      <IconButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute} className="hidden sm:grid">
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </IconButton>
    </div>
  );
}
