'use client';
import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/images/strucon-logo.PNG"
      alt="Strucon Logo"
      width={64}
      height={64}
      className="object-contain"
      priority
    />
  );
}