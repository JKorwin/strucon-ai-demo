'use client';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Logo() {
  const { resolvedTheme } = useTheme();

  const src =
    resolvedTheme === 'dark'
      ? '/images/logo-dark.png'
      : '/images/logo-light.png';

  return (
    <Image
      src={src}
      alt="Foreman Logo"
      width={64}
      height={64}
      className="object-contain"
      priority
    />
  );
}