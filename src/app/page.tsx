import React from "react";
import { Player } from "./components/Player";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center p-24">
      <Player />
    </div>
  );
};

export default Home;
