"use client";
import Image from "next/image";
import React from "react";
import { Images } from "../components/Shared/Media/Images";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear(); // get the current year
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 backdrop-blur bg-black/30 text-center">
        <div className="w-full max-w-screen-xl mx-auto p-2 md:p-4">
          <a
            href="https://yousef-portfolio.vercel.app"
            target="_blank"
            className="footer"
          >
            <p className="text-sm md:text-base font-sans">
              {currentYear}&copy; Made with<span>❤️</span>by Yousef Obeidat
            </p>
          </a>
          <div className="flex gap-2 justify-center mt-2 md:mt-4">
            <a
              className="inline-block transform transition-transform ease-in-out duration-300 hover:scale-110"
              href="https://github.com/mrobeidat"
              target="_blank"
            >
              <Image src={Images.Github} alt="github" width={24} height={24} />
            </a>
            <a
              className="inline-block transform transition-transform ease-in-out duration-300 hover:scale-110"
              href="https://www.linkedin.com/in/mrobeidat/"
              target="_blank"
            >
              <Image
                src={Images.Linkedin}
                alt="linkedin"
                width={24}
                height={24}
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
                width={24}
                height={24}
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
