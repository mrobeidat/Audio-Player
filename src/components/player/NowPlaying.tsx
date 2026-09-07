import Image from "next/image";
import type { Track } from "@/lib/tracks";

const BARS = ["#d715d7", "#d71515", "#d71579", "#d76715", "#d76415", "#d70415", "#d76715", "#d71579", "#d71515", "#d715d7"];
const DELAYS = [1, 0.8, 0.6, 0.4, 0.2, 0.4, 0.4, 0.6, 0.8, 1];

export function NowPlaying({ track, playing, progress }: { track: Track; playing: boolean; progress: number }) {
  if (!playing) return null;
  return (
    <>
      <div className="relative z-10 flex h-24 items-center justify-center gap-5" aria-hidden>
        {BARS.map((color, i) => (
          <span key={i} className="w-3 rounded-full animate-bar" style={{ background: color, animationDelay: `${DELAYS[i]}s` }} />
        ))}
      </div>
      <figure className="glass relative z-10 mt-2 flex w-72 flex-col items-center overflow-hidden rounded-2xl p-3 shadow-[0_22px_70px_4px_rgba(0,0,0,0.68)]">
        <Image src={track.cover} alt={track.title} priority sizes="288px" className="max-h-64 w-full rounded-xl object-cover" />
        <figcaption className="mt-2 w-full overflow-hidden py-1 text-center font-serif title-glow">
          <span className="inline-block whitespace-nowrap animate-marquee">{track.title} · {track.artist}</span>
        </figcaption>
        <span className="absolute inset-x-0 bottom-0 h-1 origin-left bg-gradient-to-r from-red-500 via-pink-600 to-rose-900 transition-transform duration-500" style={{ transform: `scaleX(${progress})` }} />
      </figure>
    </>
  );
}
