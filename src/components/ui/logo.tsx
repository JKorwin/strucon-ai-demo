'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col items-start justify-center leading-tight select-none">
      <div className="flex items-center gap-2">
        {/* Orange Icon (building shape) */}
        <div className="w-2 h-6 bg-orange-500 relative">
          <div className="absolute left-2 w-2 h-10 bg-orange-500 transform -skew-y-12"></div>
        </div>

        {/* STRUCON.AI */}
        <span className="text-white font-extrabold text-2xl tracking-wide">
          STRUCON<span className="text-gray-300">.AI</span>
        </span>
      </div>

      {/* Subtitle */}
      <span className="text-xs tracking-widest text-gray-400 mt-0.5 ml-[22px]">
        CONSTRUCTION INTELLIGENCE
      </span>
    </Link>
  );
}