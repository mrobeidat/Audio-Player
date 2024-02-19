"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Images } from "../../components/Shared/Media/Images"; // Importing Images for audio controls
import ParticleStart from "../../components/Shared/Particles/ParticleStart";
import Footer from "../../layout/Footer";
import AOS from "aos"; // animate on scroll
import "aos/dist/aos.css"; // animate on scroll styles
import ParticleEnd from "../../components/Shared/Particles/ParticleEnd";
import { PuffLoader } from "react-spinners";
import { AudioList } from "../../components/Shared/Media/AudioList";
import { playlist } from "../../components/Shared/Media/AudioList";
interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  // state of the audio player controls
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isMuted: false,
    duration: 0,
    currentTime: 0,
    currentSongIndex: 1,
    textMove: 0,
  });

  // reference to loading state, audio player, progress bar, and animation
  const [audioState, setAudioState] = useState({
    loading: true,
    audioPlayer: useRef(null),
    progressBar: useRef(null),
    animationRef: useRef(null),
  });

  // Loading the meta data on mount
  const audioElement = audioState.audioPlayer.current;
  const handleLoadedMetadata = () => {
    const seconds = Math.floor(audioElement.duration);
    setPlayerState((prevState) => ({
      ...prevState,
      duration: seconds,
    }));
    audioState.progressBar.current.max = String(seconds);
  };
  useEffect(() => {
    if (!audioElement) return;
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
    const { audioPlayer, animationRef } = audioState;
    const { isPlaying, currentSongIndex } = playerState;

    if (!audioPlayer.current) return;

    if (!isPlaying) {
      setPlayerState((prevState) => ({ ...prevState, isPlaying: true }));
      audioElement.play();
      audioState.animationRef.current = requestAnimationFrame(updateTime);
      handleClick("Play", AudioList[currentSongIndex]?.title);
    } else {
      setPlayerState((prevState) => ({ ...prevState, isPlaying: false }));
      audioElement.pause();
      cancelAnimationFrame(animationRef.current!);
      handleClick("Pause", AudioList[currentSongIndex]?.title);
    }
  };

  // To Mute and Unmute the audio player
  const toggleMuteUnmute = () => {
    const audioElement = audioState.audioPlayer.current;
    if (!audioElement) return;

    audioElement.muted = !audioElement.muted;
    const action = playerState.isMuted ? "Unmute" : "Mute";
    const songTitle = AudioList[playerState.currentSongIndex]?.title;

    setPlayerState((prevState) => ({
      ...prevState,
      isMuted: audioElement.muted,
    }));

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

  // To control the audio seek duration
  const handleChangeRange = () => {
    if (!audioState.audioPlayer.current || !audioState.progressBar.current)
      return;

    audioState.audioPlayer.current.currentTime = Number(
      audioState.progressBar.current.value
    );
    audioState.progressBar.current.style.setProperty(
      "--seek-before-width",
      `${
        (Number(audioState.progressBar.current.value) / playerState.duration) *
        100
      }%`
    );
    setPlayerState((prevState) => ({
      ...prevState,
      currentTime: Number(audioState.progressBar.current.value),
    }));
    audioState.progressBar.current.max = String(playerState.duration);

    // Log "seek" and song title
    const songTitle = AudioList[playerState.currentSongIndex]?.title;
    handleClick("Seek", songTitle);
  };

  // To update the current time of the audio
  const updateTime = () => {
    if (!audioState.audioPlayer.current || !audioState.progressBar.current)
      return;

    audioState.progressBar.current.value = String(
      audioState.audioPlayer.current.currentTime
    );
    audioState.progressBar.current.style.setProperty(
      "$seek-before-width",
      `${
        (Number(audioState.progressBar.current.value) / playerState.duration) *
        100
      }%`
    );
    setPlayerState((prevState) => ({
      ...prevState,
      currentTime: Number(audioState.progressBar.current.value),
    }));
    audioState.animationRef.current = requestAnimationFrame(updateTime);
  };

  // Rewind or forward the audio by a specified number of seconds
  const adjustPlaybackTime = (seconds: number) => {
    if (!audioState.progressBar.current) return;

    audioState.progressBar.current.value = String(
      Number(audioState.progressBar.current.value) + seconds
    );

    handleChangeRange();
    const action = seconds > 0 ? "Forward" : "Backward";
    const songTitle = AudioList[playerState.currentSongIndex]?.title;
    handleClick(action, songTitle);
  };

  // Switch to previous song
  const playPreviousSong = () => {
    let newIndex = playerState.currentSongIndex - 1;
    if (newIndex < 0) {
      newIndex = playlist.length - 1;
    }
    setPlayerState((prevState) => ({
      ...prevState,
      currentSongIndex: newIndex,
      isPlaying: true,
    }));
    if (audioState.audioPlayer.current) {
      audioState.audioPlayer.current.src = playlist[newIndex];
      audioState.audioPlayer.current.play();
      audioState.audioPlayer.current.onloadedmetadata = () => {
        setPlayerState((prevState) => ({
          ...prevState,
          duration: Math.floor(audioState.audioPlayer.current.duration),
        }));
      };
    }
    handleClick("Prev", AudioList[newIndex]?.title);
  };

  // switch to next song
  const playNextSong = () => {
    let nextSongIndex = playerState.currentSongIndex + 1;
    if (nextSongIndex >= playlist.length) {
      nextSongIndex = 0;
    }
    setPlayerState((prevState) => ({
      ...prevState,
      currentSongIndex: nextSongIndex,
      isPlaying: true,
    }));

    if (audioState.audioPlayer.current) {
      audioState.audioPlayer.current.src = playlist[nextSongIndex];
      audioState.audioPlayer.current.play();
      audioState.audioPlayer.current.onloadedmetadata = () => {
        setPlayerState((prevState) => ({
          ...prevState,
          duration: Math.floor(audioState.audioPlayer.current.duration),
        }));
      };
    }
    handleClick("Next", AudioList[nextSongIndex]?.title);
  };

  // for song title animation and loading timeout
  useEffect(() => {
    const textInterval = setInterval(() => {
      setPlayerState((prevState) => ({
        ...prevState,
        textMove: prevState.textMove >= 155 ? -155 : prevState.textMove + 1,
      }));
    }, 37);

    const loadingInterval = setTimeout(() => {
      setAudioState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }, 2000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(loadingInterval);
    };
  }, []);

  // Hard coded loading
  if (audioState.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="rgba(225, 253, 251, 1)" size={120} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Animation */}
      {playerState.isPlaying && (
        <div
          data-aos="zoom-in-up"
          data-aos-duration="2000"
          data-aos-easing="ease-in"
          data-aos-once="true"
          className={`muzik z-10`}
        >
          {[...Array(10)].map((_, index) => (
            <div className="audio_animation" key={index}></div>
          ))}
        </div>
      )}

      {playerState.isPlaying && (
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
            style={{
              width: `${
                (playerState.currentTime / playerState.duration) * 100
              }%`,
            }}
          ></div>

          {/* Song Title and Poster */}
          <Image
            className="max-h-64 object-cover rounded-xl max-w-80"
            src={AudioList[playerState.currentSongIndex]?.img?.src || ""}
            alt={AudioList[playerState.currentSongIndex]?.title}
            height={AudioList[playerState.currentSongIndex]?.img?.height || ""}
            width={AudioList[playerState.currentSongIndex]?.img?.width || ""}
          />
          <p
            style={{ transform: `translateX(${playerState.textMove}%)` }}
            className="text-center py-1 mt-2 music-title"
          >
            {AudioList[playerState.currentSongIndex]?.title}
          </p>
        </div>
      )}

      {/* Audio Controls */}
      <div className="flex flex-col gap-1 justify-center items-center">
        {playerState.isPlaying ? <ParticleStart /> : <ParticleEnd />}
        <div
          className={`bg-black shadow-lg shadow-black/50 flex h-50 w-full rounded-lg p-3 items-center gap-1 ${
            playerState.isPlaying
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
            autoPlay={playerState.isPlaying ? true : false}
            ref={audioState.audioPlayer}
            src={AudioList[playerState.currentSongIndex]?.src}
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
              src: playerState.isPlaying ? Images.Pause : Images.Play,
              alt: playerState.isPlaying ? "pause" : "play",
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
            {calculateDuration(playerState.currentTime)}/
            {playerState.duration &&
              !isNaN(playerState.duration) &&
              calculateDuration(playerState.duration)}
          </div>
          <input
            type="range"
            className="overflow-hidden progressBar hover:cursor-pointer"
            defaultValue="0"
            ref={audioState.progressBar}
            onChange={handleChangeRange}
          />

          {/* Toggle Mute/Unmute button */}
          <button onClick={toggleMuteUnmute}>
            <Image
              src={playerState.isMuted ? Images.Mute : Images.Unmute}
              alt={playerState.isMuted ? "unmute" : "mute"}
              draggable="false"
              height={18}
            />
          </button>
        </div>

        {/* View User Actions */}
        <a
          className={`text-white flex gap-2 m-3 shadow-md bg-gradient-to-br from-pink-500 to-red-800 hover:from-red-800 hover:to-pink-500 hover:bg-gradient-to-bl rounded-lg px-5 py-2.5 text-center transition-background duration-300 transform ${
            playerState.isPlaying ? "animate-down" : "animate-up"

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
