"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

export function Navbar() {
  const onActions = usePathname() === "/actions";
  return (
    <nav className="glass fixed inset-x-0 top-0 z-30 flex h-16 items-center px-4">
      {onActions ? (
        <Link href="/" className="flex items-center gap-2 rounded-full bg-gradient-to-br from-pink-500 to-red-800 px-5 py-2.5 text-sm font-medium transition hover:from-red-800 hover:to-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-300">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      ) : (
        <Link href="/" aria-label="Home">
          <Image src={logo} alt="Audio Player" className="h-8 w-24 object-contain" priority />
        </Link>
      )}
    </nav>
  );
}
