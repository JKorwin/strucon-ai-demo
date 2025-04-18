'use client';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      {/* Stylized building icon */}
      <div className="relative w-5 h-6">
        {/* Left angled bar */}
        <div className="absolute bottom-0 left-0 w-1.5 h-6 bg-orange-500 transform -skew-y-12 origin-bottom-left"></div>
        {/* Right vertical bar */}
        <div className="absolute bottom-0 left-2 w-1.5 h-6 bg-orange-500"></div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-end space-x-1">
          <span className="text-white font-extrabold text-xl tracking-wider">
            STRUCON
          </span>
          <span className="text-gray-300 font-extrabold text-sm tracking-wider">
            .AI
          </span>
        </div>

        <span className="text-xs text-gray-400 tracking-[0.15em] mt-0.5">
          CONSTRUCTION INTELLIGENCE
        </span>
      </div>
    </Link>
  );
}