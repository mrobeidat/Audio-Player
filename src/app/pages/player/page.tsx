"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Images from "../../components/Shared/Images"; // Importing Images for audio controls
import Audios from "../../components/Audio"; // Importing the audio file
import ParticleStart from "../../components/Shared/ParticleStart";
import Footer from "../../components/Shared/Footer";
import AOS from "aos"; // animate on scroll
import "aos/dist/aos.css"; // animate on scroll styles
import ParticleEnd from "../../components/Shared/ParticleEnd";

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playlist, setPlaylist] = useState<string[]>([
    Audios.Song1,
    Audios.Song2,
    Audios.Song3,
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [TextMove, setTextMove] = useState(0);

  const audioPlayer = useRef(null); // reference to audio player
  const progressBar = useRef(null); // reference to progress bar
  const animationRef = useRef(null); // reference to animation

  // To display the Song name and Poster
  const AudioList = [
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
  ];

  // To handle the user interaction with the audio player
  const handleClick = async (action: string) => {
    try {
      await fetch("/api/useractions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAction: action }),
      });
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };

  // Initializing AOS animations to set up animations on component mount
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-in",
    });
    AOS.refresh();
  }, []);

  // reset the progressBar and currentTime to 0
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime((audioPlayer.current.currentTime = 0)); // reset the current time
    progressBar.current.value = 0; // reset the progressbar position
    playNextSong();
  };

  useEffect(() => {
    const audioElement = audioPlayer.current;
    const progressElement = progressBar.current;

    if (!audioElement || !progressElement) return;

    audioElement.addEventListener("ended", handleEnded);

    const seconds = Math.floor(audioElement.duration);
    setDuration(seconds);
    progressElement.max = String(seconds);

    return () => {
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, progressBar]);

  // To play and pause the audio player
  const togglePlayPause = () => {
    if (!audioPlayer.current) return;

    const previousState = isPlaying;
    setIsPlaying(!previousState);

    if (!previousState) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(updateTime);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current!);
    }
    // Log the userAction to DB
    handleClick(isPlaying ? "Pause" : "Play");
  };

  // To Mute and Unmute the audio player
  const toggleMuteUnmute = () => {
    const audioElement = audioPlayer.current;
    if (!audioElement) return;

    audioElement.muted = !audioElement.muted;
    setIsMuted(audioElement.muted);

    // Log the userAction to DB
    handleClick(isMuted ? "Unmute" : "Mute");
  };

  // To calculate the duration
  const calculateDuration = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const minutesReturned = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const secondsReturned = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesReturned}:${secondsReturned}`;
  };

  // To control the audio duration
  const handleChangeRange = () => {
    if (!audioPlayer.current || !progressBar.current) return;

    audioPlayer.current.currentTime = Number(progressBar.current.value);
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(Number(progressBar.current.value) / duration) * 100}%`
    );
    setCurrentTime(Number(progressBar.current.value));
    progressBar.current.max = String(duration);
  };

  // To update the current time of the audio
  const updateTime = () => {
    if (!audioPlayer.current || !progressBar.current) return;

    progressBar.current.value = String(audioPlayer.current.currentTime);
    progressBar.current.style.setProperty(
      "$seek-before-width",
      `${(Number(progressBar.current.value) / duration) * 100}%`
    );
    setCurrentTime(Number(progressBar.current.value));
    animationRef.current = requestAnimationFrame(updateTime);
  };

  // Rewind or forward the audio by a specified number of seconds
  const adjustPlaybackTime = (seconds: number) => {
    if (!progressBar.current) return;

    progressBar.current.value = String(
      Number(progressBar.current.value) + seconds
    );
    handleChangeRange();
    handleClick(seconds > 0 ? "Forward" : "Backward");
  };

  // Switch to previous song
  const playPreviousSong = () => {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) {
      newIndex = playlist.length - 1;
    }
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
    if (audioPlayer.current) {
      audioPlayer.current.src = playlist[newIndex];
      audioPlayer.current.play();
      audioPlayer.current.onloadedmetadata = () => {
        setDuration(Math.floor(audioPlayer.current.duration)); // to avoid NaN in duration
      };
    }
    handleClick("Prev");
  };
  // switch to next song
  const playNextSong = () => {
    let nextSongIndex = currentSongIndex + 1;
    // If it's the last song, loop back to the first song
    if (nextSongIndex >= playlist.length) {
      nextSongIndex = 0;
    }
    setCurrentSongIndex(nextSongIndex);
    setIsPlaying(true);
    if (audioPlayer.current) {
      audioPlayer.current.src = playlist[nextSongIndex];
      audioPlayer.current.play();
      audioPlayer.current.onloadedmetadata = () => {
        setDuration(Math.floor(audioPlayer.current.duration)); // to avoid NaN in duration
      };
    }
    handleClick("Next");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTextMove((prevTextMove) =>
        prevTextMove >= 100 ? -100 : prevTextMove + 1
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Animation */}
      {isPlaying && (
        <div className={`muzik muzik-playing `}>
          {[...Array(10)].map((_, index) => (
            <div className="audio_animation" key={index}></div>
          ))}
        </div>
      )}

      {/* Song Title and Poster */}
      {isPlaying && (
        <div className="self-center p-3 mt-5 rounded-3xl text-white backdrop-blur-xl flex flex-col items-center bg-white/30 poster shadow-white z-50 overflow-hidden">
          <p
            style={{ transform: `translateX(${TextMove}%)` }}
            className="text-center py-1 mb-2 music-title"
          >
            {AudioList[currentSongIndex]?.title}
          </p>
          <Image
            className="max-h-64 object-cover rounded-2xl max-w-80"
            src={AudioList[currentSongIndex]?.img?.src || ""}
            alt={AudioList[currentSongIndex]?.title}
            height={AudioList[currentSongIndex]?.img?.height || ""}
            width={AudioList[currentSongIndex]?.img?.width || ""}
          />
        </div>
      )}

      {/* Audio Controls */}
      <div className="flex flex-col gap-1 justify-center items-center">
        {isPlaying ? <ParticleStart /> : <ParticleEnd />}
        <div
          className={`bg-black shadow-lg shadow-black/50 flex h-50 rounded-lg p-3 items-center gap-1 ${
            isPlaying
              ? "backdrop-blur-md bg-white/30 poster shadow-white/60 animate-down"
              : " animate-up"
          }`}
          style={{
            transition:
              "background-color 0.5s ease, backdrop-filter 0.5s ease ",
          }}
        >
          {/* Audio element */}
          <audio
            className="animate-down"
            preload="metadata"
            id="audio"
            ref={audioPlayer}
            src={AudioList[currentSongIndex]?.src}
          ></audio>

          {/* Buttons */}
          {[
            {
              onClick: () => adjustPlaybackTime(-5),
              src: Images.Backward,
              alt: "backward",
              height: 22,
            },
            {
              onClick: playPreviousSong,
              src: Images.Prev,
              alt: "backward",
              height: 22,
            },
            {
              onClick: togglePlayPause,
              src: isPlaying ? Images.Pause : Images.Play,
              alt: isPlaying ? "pause" : "play",
              height: 33,
            },
            {
              onClick: playNextSong,
              src: Images.Next,
              alt: "forward",
              height: 18,
            },
            {
              onClick: () => adjustPlaybackTime(5),
              src: Images.Forward,
              alt: "forward",
              height: 20,
            },
          ].map((button, index) => (
            <button key={index} onClick={button.onClick}>
              <Image
                src={button.src}
                alt={button.alt}
                className="cursor-pointer object-contain min-w-5 min-h-5 hover:fill-black"
                draggable="false"
                height={button.height}
              />
            </button>
          ))}

          {/* Current time, duration, and progress bar */}
          <div className="text-white">
            {calculateDuration(currentTime)}/
            {!isNaN(duration) && calculateDuration(duration)}
          </div>
          <input
            type="range"
            className="overflow-hidden progressBar"
            defaultValue="0"
            ref={progressBar}
            onChange={handleChangeRange}
          />

          {/* Toggle Mute/Unmute button */}
          <button onClick={toggleMuteUnmute}>
            <Image
              src={isMuted ? Images.Mute : Images.Unmute}
              alt={isMuted ? "unmute" : "mute"}
              draggable="false"
              height={18}
            />
          </button>
        </div>

        {/* View User Actions */}
        <a
          className={`text-white flex gap-2 m-3 bg-white/30 shadow-lg shadow-pink-500/50 bg-gradient-to-br from-pink-500 to-red-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 ${
            isPlaying ? "animate-down" : " animate-up"
          }`}
          href={"/pages/actions"}
        >
          <p>View User Actions</p>
          <Image height={20} width={20} alt="arrow" src={Images.NextArrow} />
        </a>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Player;
