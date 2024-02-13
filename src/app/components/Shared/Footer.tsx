import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 backdrop-blur bg-white/30 text-center">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <h2 className="text-md text-white dark:text-white">Made by :</h2>
          <a
            href="https://yousef-portfolio.vercel.app"
            target="_blank"
            className="footer"
          >
            Yousef Obeidat
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
