"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";

// Importing Images for player controls
import Images from "./Images";
// Importing the audio file
import Audios from "./Audio";

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioPlayer = useRef(null);

  // To play and pause the audio player
  const togglePlayPause = () => {
    const previousState = isPlaying;
    setIsPlaying(!previousState);

    if (!previousState) {
      audioPlayer.current.play();
    } else {
      audioPlayer.current.pause();
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

  return (
    <div className="bg-black flex h-50 w-377 rounded-lg p-3 items-center gap-2">
      <audio id="audio" ref={audioPlayer} src={Audios.Piano}></audio>
      <Image src={Images.Backward} alt="backward" />
      <button onClick={togglePlayPause}>
        {isPlaying ? (
          <Image src={Images.Pause} alt="pause" />
        ) : (
          <Image src={Images.Play} alt="play" />
        )}
      </button>
      <Image src={Images.Forward} alt="forward" />
      <div className="text-white">0:00/2:10</div>
      <input type="range" className="overflow-hidden progressBar" />
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
