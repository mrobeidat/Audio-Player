"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Images from "./Shared/Images"; // Importing Images for audio controls
import Audios from "./Audio"; // Importing the audio file
import Particle from "./Shared/Particle";
import Footer from "./Shared/Footer";

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioPlayer = useRef(null); // reference to audio player
  const progressBar = useRef(null); // reference to progress bar
  const animationRef = useRef(null); // reference to animation

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

  useEffect(() => {
    const audioElement = audioPlayer.current;
    const progressElement = progressBar.current;

    if (!audioElement || !progressElement) return;

    // reset the progressBar and currentTime to 0
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime((audioPlayer.current.currentTime = 0)); // reset the current time
      progressBar.current.value = 0; // reset the progressbar position
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
    // Logging the userAction to DB
    handleClick(isPlaying ? "Pause" : "Play");
  };

  // To Mute and Unmute the audio player
  const toggleMuteUnmute = () => {
    const audioElement = audioPlayer.current;
    if (!audioElement) return;

    audioElement.muted = !audioElement.muted;
    setIsMuted(audioElement.muted);

    // Logging the userAction to DB
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

    // Logging the userAction to DB
    handleClick("Backward");
  };

  // To forward the audio 5 seconds after
  const Forward = () => {
    if (!progressBar.current) return;

    progressBar.current.value = String(Number(progressBar.current.value) + 5);
    handleChangeRange();

    // Logging the userAction to DB
    handleClick("Forward");
  };
  return (
    <div className="flex flex-col gap-7 justify-center items-center">
      <Particle />
      <div
        className={`bg-black z-50 flex h-50 w-377 rounded-lg p-3 items-center gap-1 ${
          isPlaying && "backdrop-blur-sm bg-white/30"
        }`}
        style={{
          transition: "background-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <audio
          data-aos="fade-down"
          data-aos-once="true"
          id="audio"
          ref={audioPlayer}
          src={Audios.Piano}
        ></audio>

        {/* backward button */}
        <Image
          onClick={Backward}
          src={Images.Backward}
          alt="backward"
          className="cursor-pointer object-contain min-w-7 min-h-7"
          draggable="false"
        />

        {/* Toggle Play/Pause button */}
        <button onClick={togglePlayPause}>
          {isPlaying ? (
            <Image
              src={Images.Pause}
              alt="pause"
              className="object-contain min-w-8 min-h-7"
              draggable="false"
            />
          ) : (
            <Image
              src={Images.Play}
              alt="play"
              className="object-contain min-w-8 min-h-7"
              draggable="false"
            />
          )}
        </button>

        {/* forward button */}
        <Image
          onClick={Forward}
          src={Images.Forward}
          alt="forward"
          className="cursor-pointer object-contain min-w-7 min-h-7"
          draggable="false"
        />

        {/* currentTime & duration */}
        <div className="text-white">
          {calculateDuration(currentTime)}/
          {duration && !isNaN(duration) && calculateDuration(duration)}
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
            <Image src={Images.Mute} alt="unmute" draggable="false" />
          ) : (
            <Image src={Images.Unmute} alt="mute" draggable="false" />
          )}
        </button>
      </div>
      <a
        data-aos="fade-up"
        data-aos-once="true"
        className="text-white m-3 bg-gradient-to-br from-pink-500 to-red-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
        href={"/useractions"}
      >
        Go to User Actions
      </a>
      <Footer />
    </div>
  );
};

export { Player };
