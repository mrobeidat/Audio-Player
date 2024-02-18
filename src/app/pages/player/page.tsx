"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Images } from "../../components/Shared/Media/Images"; // Importing Images for audio controls
import Audios from "../../components/Shared/Media/Audio"; // Importing the audio file
import ParticleStart from "../../components/Shared/Particles/ParticleStart";
import Footer from "../../layout/Footer";
import AOS from "aos"; // animate on scroll
import "aos/dist/aos.css"; // animate on scroll styles
import ParticleEnd from "../../components/Shared/Particles/ParticleEnd";
import { PuffLoader } from "react-spinners";
import { AudioList } from "../../components/Shared/Media/AudioList";

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [TextMove, setTextMove] = useState(0);

  const audioPlayer = useRef(null); // reference to audio player
  const progressBar = useRef(null); // reference to progress bar
  const animationRef = useRef(null); // reference to animation

  const [playlist, setPlaylist] = useState<string[]>([
    Audios.Song5,
    Audios.Song1,
    Audios.Song2,
    Audios.Song3,
    Audios.Song4,
  ]);

  // Initializing AOS animations to set up animations on component mount
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-in",
    });
    AOS.refresh();
  }, []);

  const audioElement = audioPlayer.current;
  const handleLoadedMetadata = () => {
    const seconds = Math.floor(audioElement.duration);
    setDuration(seconds);
    progressBar.current.max = String(seconds);
  };

  useEffect(() => {
    if (!audioElement) return; // Check if audioElement is null
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioElement?.loadedmetadata, audioElement?.readyState]);

  // To handle the user interaction with the audio player
  const handleClick = async (action: string, songTitle?: string) => {
    try {
      const data = {
        userAction: action,
        songTitle: songTitle || "",
      };
      await fetch("/api/useractions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };

  // To play and pause the audio player
  const togglePlayPause = () => {
    if (!audioPlayer.current) return;

    const previousState = isPlaying;
    setIsPlaying(!previousState);

    if (!previousState) {
      audioElement.play();
      animationRef.current = requestAnimationFrame(updateTime);
      handleClick("Play", AudioList[currentSongIndex]?.title);
    } else {
      audioElement.pause();
      cancelAnimationFrame(animationRef.current!);
      handleClick("Pause", AudioList[currentSongIndex]?.title);
    }
  };

  // To Mute and Unmute the audio player
  const toggleMuteUnmute = () => {
    const audioElement = audioPlayer.current;
    if (!audioElement) return;

    audioElement.muted = !audioElement.muted;
    setIsMuted(audioElement.muted);

    // Log the userAction to DB
    const action = isMuted ? "Unmute" : "Mute";
    const songTitle = AudioList[currentSongIndex]?.title;
    handleClick(action, songTitle);
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
    const action = seconds > 0 ? "Forward" : "Backward";
    const songTitle = AudioList[currentSongIndex]?.title;
    handleClick(action, songTitle);
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
    handleClick("Prev", AudioList[newIndex]?.title);
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
    handleClick("Next", AudioList[nextSongIndex]?.title);
  };

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextMove((prevTextMove) =>
        prevTextMove >= 145 ? -145 : prevTextMove + 1
      );
    }, 37);

    const loadingInterval = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(loadingInterval);
    };
  }, []);

  // Hard coded loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="rgba(225, 253, 251, 1)" size={120} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Animation */}
      {isPlaying && (
        <div
          data-aos="zoom-in-up"
          data-aos-duration="2000"
          data-aos-easing="ease-in"
          data-aos-once="true"
          className={`muzik muzik-playing `}
        >
          {[...Array(10)].map((_, index) => (
            <div className="audio_animation" key={index}></div>
          ))}
        </div>
      )}

      {isPlaying && (
        <div
          data-aos="fade-up"
          data-aos-duration="1800"
          data-aos-easing="ease-in"
          data-aos-once="true"
          className="self-center p-3 mt-5 rounded-2xl text-white backdrop-blur-lg flex flex-col items-center bg-black/40 poster shadow-white z-50 overflow-hidden"
        >
          {/* Duration line */}
          <div
            className="absolute left-1.5 bottom-0 h-1 bg-gradient-to-r from-red-500 via-pink-600 to-rose-900 transition-all duration-700"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>

          {/* Song Title and Poster */}
          <Image
            className="max-h-64 object-cover rounded-xl max-w-80"
            src={AudioList[currentSongIndex]?.img?.src || ""}
            alt={AudioList[currentSongIndex]?.title}
            height={AudioList[currentSongIndex]?.img?.height || ""}
            width={AudioList[currentSongIndex]?.img?.width || ""}
          />
          <p
            style={{ transform: `translateX(${TextMove}%)` }}
            className="text-center py-1 mt-2 music-title"
          >
            {AudioList[currentSongIndex]?.title}
          </p>
        </div>
      )}

      {/* Audio Controls */}
      <div className="flex flex-col gap-1 justify-center items-center">
        {isPlaying ? <ParticleStart /> : <ParticleEnd />}
        <div
          className={`bg-black shadow-lg shadow-black/50 flex h-50 w-full rounded-lg p-3 items-center gap-1 ${
            isPlaying
              ? "backdrop-blur-md bg-black/50 poster shadow-white/60 animate-down"
              : "animate-up"
          }`}
          style={{
            transition:
              "background-color 0.5s ease, backdrop-filter 0.5s ease ",
          }}
        >
          {/* Audio element */}
          <audio
            id="audio"
            className="animate-down"
            onEnded={playNextSong}
            onLoadedMetadata={handleLoadedMetadata}
            autoPlay={isPlaying ? true : false}
            ref={audioPlayer}
            src={AudioList[currentSongIndex]?.src}
          ></audio>
          {/* Buttons */}
          {[
            {
              onClick: () => adjustPlaybackTime(-5),
              src: Images.Backward,
              alt: "backward",
              height: 16,
            },
            {
              onClick: playPreviousSong,
              src: Images.Prev,
              alt: "prev",
              height: 16,
            },
            {
              onClick: togglePlayPause,
              src: isPlaying ? Images.Pause : Images.Play,
              alt: isPlaying ? "pause" : "play",
              height: 28,
            },
            {
              onClick: playNextSong,
              src: Images.Next,
              alt: "next",
              height: 16,
            },
            {
              onClick: () => adjustPlaybackTime(5),
              src: Images.Forward,
              alt: "forward",
              height: 15,
            },
          ].map((button, index) => (
            <a key={index} onClick={button.onClick}>
              <Image
                src={button.src}
                alt={button.alt}
                className="cursor-pointer object-contain min-w-4 min-h-4 hover:fill-black"
                draggable="false"
                height={button.height}
              />
            </a>
          ))}

          {/* Current time, duration, and progress bar */}
          <div className="text-white">
            {calculateDuration(currentTime)}/
            {duration && !isNaN(duration) && calculateDuration(duration)}
          </div>
          <input
            type="range"
            className="overflow-hidden progressBar hover:cursor-pointer"
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
          className={`text-white flex gap-2 m-3 bg-white/30 shadow-md shadow-pink-950/50 bg-gradient-to-br from-pink-500 to-red-800 hover:bg-gradient-to-bl rounded-lg px-5 py-2.5 text-center me-2 ${
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
