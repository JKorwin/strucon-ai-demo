'use client';
import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/images/logo-dark.png"
      alt="Foreman Logo"
      width={64}
      height={64}
      className="object-contain"
      priority
    />
  );
}