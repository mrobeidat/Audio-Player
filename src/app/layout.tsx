import React from "react";
import { Inter } from "next/font/google";
import "./styles/globals.scss";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Shared/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Audio Player",
  description: "Audio player app",
};

export default function RootLayout({ children }) {
  return (
    <html
      className="bg-gradient-to-r from-customPurple to-red-500  via-pink-800"
      lang="en"
    >
      <Head>
        <link rel="icon" href="/public/favicon.ico" sizes="any" />
      </Head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
