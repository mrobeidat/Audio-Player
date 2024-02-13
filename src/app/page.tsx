"use client";
import React, { useEffect } from "react";
import { Player } from "./components/Player";
import AOS from "aos";
import "aos/dist/aos.css";
const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 400, 
      easing: "ease-in",
    });
    AOS.refresh();
  }, []);
  return (
    <div className="flex h-screen items-center justify-center p-24 bg-gradient-to-r from-customPurple to-red-500  via-pink-800">
      <Player />
    </div>
  );
};

export default Home;
