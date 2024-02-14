"use client";
import React from "react";
import Player from "./pages/player/page";
const Home: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center p-24 bg-gradient-to-r from-customPurple to-red-500  via-pink-800">
      <Player />
    </div>
  );
};

export default Home;
