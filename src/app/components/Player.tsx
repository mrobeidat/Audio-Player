"use client";
import React, { useState } from "react";
import Image from "next/image";

// Importing images for player controls
import Images from "./Images";

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const toggleMuteUnmute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-black flex h-50 w-377 rounded-lg p-2 items-center gap-2">
      <audio src="https://samples-files.com/samples/Audio/mp3/sample-file-2.mp3"></audio>
      <Image src={Images.Backward} alt="backward" />
      <button onClick={togglePlayPause}>
        {isPlaying ? (
          <Image src={Images.Pause} alt="play" className="mt-2" />
        ) : (
          <Image src={Images.Play} alt="play" className="mt-2" />
        )}
      </button>
      <Image src={Images.Forward} alt="forward" />
      <div className="text-white">0:00/2:10</div>
      <input type="range" className="overflow-hidden progressBar" />
      <button onClick={toggleMuteUnmute}>
        {isMuted ? (
          <Image src={Images.Unmute} alt="unmute" />
        ) : (
          <Image src={Images.Mute} alt="mute" />
        )}
      </button>
    </div>
  );
};

export { Player };
