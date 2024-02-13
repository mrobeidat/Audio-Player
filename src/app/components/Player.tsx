"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

import Images from "./Images"; // Importing Images for audio controls
import Audios from "./Audio"; // Importing the audio file

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioPlayer = useRef<HTMLAudioElement | null>(null); // reference to audio player
  const progressBar = useRef<HTMLInputElement | null>(null); // reference to progress bar
  const animationRef = useRef<number | null>(null); // reference to animation

  useEffect(() => {
    const audioElement = audioPlayer.current;
    const progressElement = progressBar.current;

    if (!audioElement || !progressElement) return;

    // reset the progressBar and currentTime to 0
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      progressElement.value = "0";
    };

    audioElement.addEventListener("ended", handleEnded);

    const seconds = Math.floor(audioElement.duration);
    setDuration(seconds);
    progressElement.max = String(seconds);

    return () => {
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [audioPlayer, progressBar]);

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
  };

  // To Mute and Unmute the audio player
  const toggleMuteUnmute = () => {
    const audioElement = audioPlayer.current;
    if (!audioElement) return;

    audioElement.muted = !audioElement.muted;
    setIsMuted(audioElement.muted);
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

  // To rewind the audio 5 seconds before
  const Backward = () => {
    if (!progressBar.current) return;

    progressBar.current.value = String(Number(progressBar.current.value) - 5);
    handleChangeRange();
  };

  // To forward the audio 5 seconds after
  const Forward = () => {
    if (!progressBar.current) return;

    progressBar.current.value = String(Number(progressBar.current.value) + 5);
    handleChangeRange();
  };
  return (
    <div className="bg-black flex h-50 w-377 rounded-lg p-3 items-center gap-1">
      <audio id="audio" ref={audioPlayer} src={Audios.Piano}></audio>

      {/* backward button */}
      <Image
        onClick={Backward}
        src={Images.Backward}
        alt="backward"
        className="cursor-pointer object-contain min-w-7 min-h-7"
      />

      {/* Toggle Play/Pause button */}
      <button onClick={togglePlayPause}>
        {isPlaying ? (
          <Image
            src={Images.Pause}
            alt="pause"
            className="object-contain min-w-8 min-h-7"
          />
        ) : (
          <Image
            src={Images.Play}
            alt="play"
            className="object-contain min-w-8 min-h-7"
          />
        )}
      </button>

      {/* forward button */}
      <Image
        onClick={Forward}
        src={Images.Forward}
        alt="forward"
        className="cursor-pointer object-contain min-w-7 min-h-7"
      />

      {/* currentTime & duration */}
      <div className="text-white">
        {calculateDuration(currentTime)}/
        {(duration && !isNaN(duration)) && calculateDuration(duration)}
      </div>

      {/* progressBar */}
      <input
        type="range"
        className="overflow-hidden progressBar"
        defaultValue="0"
        ref={progressBar}
        onChange={handleChangeRange}
      />

      {/* Toggle Mute/Unmute button */}
      <button onClick={toggleMuteUnmute}>
        {isMuted ? (
          <Image src={Images.Mute} alt="unmute" />
        ) : (
          <Image src={Images.Unmute} alt="mute" />
        )}
      </button>
    </div>
  );
};

export { Player };
