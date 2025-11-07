"use client";

import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div className="relative h-8 w-32">
        <Image
          src="/logo/lumiloops-logo-name.png"
          alt="Lumi Loops"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
