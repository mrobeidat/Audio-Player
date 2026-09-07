import type { StaticImageData } from "next/image";
import poster1 from "@/assets/poster1.png";
import poster2 from "@/assets/poster2.png";
import poster3 from "@/assets/poster3.png";
import poster4 from "@/assets/poster4.png";
import poster5 from "@/assets/poster5.png";

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: StaticImageData;
};

export const tracks: readonly Track[] = [
  { id: "cymatics", title: "Cymatics", artist: "Nigel Stanford", src: "/audio/song5.mp3", cover: poster5 },
  { id: "my-love", title: "My Love", artist: "Roman Dudchyk", src: "/audio/song1.mp3", cover: poster1 },
  { id: "pleasure", title: "Pleasure", artist: "AShamaluevMusic", src: "/audio/song2.mp3", cover: poster2 },
  { id: "reverie", title: "Reverie", artist: "AShamaluevMusic", src: "/audio/song3.mp3", cover: poster3 },
  { id: "emotional", title: "Emotional", artist: "Grand Project", src: "/audio/song4.mp3", cover: poster4 },
];

export const trackLabel = (t: Track) => `${t.title} - ${t.artist}`;
