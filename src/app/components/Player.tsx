"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

// Importing Images for audio controls
import Images from "./Images";
// Importing the audio file
import Audios from "./Audio";

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [duration, setduration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioPlayer = useRef(null); // reference to audio player
  const progressBar = useRef(null); // reference to progress bar
  const animationRef = useRef(null); // reference to animation

  useEffect(() => {
    const audioElement = audioPlayer.current;

    // handle the behavior when audio ends
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime((audioPlayer.current.currentTime = 0)); // reset the current time
      progressBar.current.value = 0; // reset the progressbar position
    };
    audioElement.addEventListener("ended", handleEnded);

    // Convert the duration to minutes and seconds (ex: 2:10)
    const seconds = Math.floor(audioElement.duration);
    setduration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  // To play and pause the audio player
  const togglePlayPause = () => {
    const previousState = isPlaying;
    setIsPlaying(!previousState);

    if (!previousState) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(updateTime);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  // To Mute and Unmute the audio player
  const toggleMuteUnmute = () => {
    const audioElement = document.getElementById("audio") as HTMLAudioElement;
    if (audioElement) {
      audioElement.muted = !audioElement.muted;
      setIsMuted(audioElement.muted);
    } else {
      console.log("No audio element found");
    }
  };

  // To calculate the duration
  const calculateDuration = (secs) => {
    const minutes = Math.floor(secs / 60);
    const minutesReturned = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const secondsReturned = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesReturned}:${secondsReturned}`;
  };

  // To control the audio duration
  const handleChangeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    progressBar.current.style.setProperty(
      "$seek-before-width",
      `${(progressBar.current.value / duration) * 100}}`
    );
    setCurrentTime(progressBar.current.value);
  };

  // To update the current time of the audio
  const updateTime = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    progressBar.current.style.setProperty(
      "$seek-before-width",
      `${(progressBar.current.value / duration) * 100}}`
    );
    setCurrentTime(progressBar.current.value);
    animationRef.current = requestAnimationFrame(updateTime);
  };
  return (
    <div className="bg-black flex h-50 w-377 rounded-lg p-3 items-center gap-1">
      <audio id="audio" ref={audioPlayer} src={Audios.Piano}></audio>
      <Image
        src={Images.Backward}
        alt="backward"
        className="object-contain min-w-7 min-h-7"
      />
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
      <Image
        src={Images.Forward}
        alt="forward"
        className="object-contain min-w-7 min-h-7"
      />
      <div className="text-white">
        {calculateDuration(currentTime)}/
        {duration && !isNaN(duration) && calculateDuration(duration)}
      </div>
      <input
        type="range"
        className="overflow-hidden progressBar"
        defaultValue="0"
        ref={progressBar}
        onChange={handleChangeRange}
      />
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
