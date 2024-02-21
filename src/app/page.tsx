import React from "react";
import Player from "./pages/player/page";
const Home: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center p-24 bg-gradient-to-r from-slate-950 via-cyan-600 to-slate-900">
      <Player />
    </div>
  );
};

export default Home;
