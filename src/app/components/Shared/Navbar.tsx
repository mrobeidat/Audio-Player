"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Images from "./Images";

const Navbar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <>
      <nav className="backdrop-blur bg-white/30 z-50 fixed w-full flex items-center justify-between">
        <div className="flex items-center p-2">
          {currentPath === "/useractions" && (
            <a
              href="/"
              className="text-white bg-gradient-to-br from-pink-500 to-red-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              ᐊ Back
            </a>
          )}
        </div>
        <div className="max-w-screen-xl flex items-center justify-center px-3.5 py-1">
          <a href="/" className="flex space-x-3 rtl:space-x-reverse">
            <Image
              src={Images.Logo}
              className="h-14 w-40 align-middle object-contain"
              alt="Logo"
            />
          </a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
