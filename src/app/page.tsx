import { Player } from "@/components/player/Player";

export default function HomePage() {
  return (
    <div className="grid min-h-[calc(100dvh-12rem)] place-items-center">
      <Player />
    </div>
  );
}
