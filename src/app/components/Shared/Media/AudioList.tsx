// To display the Song name and Poster
import Audios from "./Audio"; // Importing the audio file
import { Images } from "./Images"; // Importing Images for audio controls

// Audio Posters and source files
export const AudioList = [
  {
    title: "Cymatics - Nigel Stanford ",
    src: Audios.Song5,
    img: Images.Poster5,
  },
  {
    title: "My Love - Roman Dudchyk",
    src: Audios.Song1,
    img: Images.Poster1,
  },
  {
    title: "Pleasure - AShamaluevMusic",
    src: Audios.Song2,
    img: Images.Poster2,
  },
  {
    title: "Reverie  - AShamaluevMusic",
    src: Audios.Song3,
    img: Images.Poster3,
  },
  {
    title: "Emotional - Grand Project",
    src: Audios.Song4,
    img: Images.Poster4,
  },
];

// Audio files playlist
export const playlist = [
  Audios.Song1,
  Audios.Song2,
  Audios.Song3,
  Audios.Song4,
  Audios.Song5,
];
