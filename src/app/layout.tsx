import React from "react";
import { Inter } from "next/font/google";
import "./styles/globals.scss";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Audio Player",
  description: "Audio player app",
};

export default function RootLayout({ children }) {
  return (
    <html
      className="bg-gradient-to-r from-customPurple via-customPink to-red-500"
      lang="en"
    >
      <Head>
        <link rel="icon" href="/public/favicon.ico" sizes="any" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
