"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Images } from "../components/Shared/Media/Images";

const Navbar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <>
      <nav className="backdrop-blur bg-black/30 z-30 fixed w-full flex items-center justify-between">
        <div className="flex items-center p-4">
          {currentPath === "/pages/actions" ? (
            <a
              href="/"
              className="flex gap-2 text-white bg-gradient-to-br from-pink-500 to-red-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-full text-sm px-5 py-2.5"
            >
              <Image src={Images.BackArrow} height={20} width={20} alt="back" />
              <p>Back</p>
            </a>
          ) : (
            <div className="max-w-screen-xl flex items-center justify-center px-3.5 py-1">
              <a href="/" className="flex space-x-3 rtl:space-x-reverse">
                <Image
                  draggable="false"
                  src={Images.Logo}
                  className="h-8 w-24 align-middle object-contain"
                  alt="Logo"
                />
              </a>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
