"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Images } from "../components/Shared/Media/Images";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear(); // get the current year
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 backdrop-blur bg-black/30 text-center">
        <div className="w-full max-w-screen-xl mx-auto p-2.5 md:py-2">
          <a
            href="https://yousef-portfolio.vercel.app"
            target="_blank"
            className="footer"
          >
            <p className="font-sans">
              {currentYear}&copy; Made with<span>❤️</span>by Yousef Obeidat
            </p>
          </a>
          <div className="flex gap-3 justify-center mt-4">
            <a
              className="inline-block transform transition-transform ease-in-out duration-300 hover:scale-110"
              href="https://github.com/mrobeidat"
              target="_blank"
            >
              <Image src={Images.Github} alt="github" width={30} height={30} />
            </a>
            <a
              className="inline-block transform transition-transform ease-in-out duration-300 hover:scale-110"
              href="https://www.linkedin.com/in/mrobeidat/"
              target="_blank"
            >
              <Image
                src={Images.Linkedin}
                alt="linkedin"
                width={30}
                height={30}
              />
            </a>
            <a
              href="https://yousef-portfolio.vercel.app"
              target="_blank"
              className="inline-block transform transition-transform ease-in-out duration-300 hover:scale-110"
            >
              <Image
                src={Images.Portfolio}
                alt="portfolio"
                width={30}
                height={30}
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
