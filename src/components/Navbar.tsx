'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/logo';

export default function Navbar() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50 border-b border-gray-700 h-16">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4 relative">
        {/* Left: Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Center: Welcome message (only if logged in) */}
        <SignedIn>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-semibold animate-fadeIn">
            Welcome, User
          </div>
        </SignedIn>

        {/* Right-side controls */}
        <div className="flex space-x-4 items-center">
          <SignedIn>
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded"
            >
              Dashboard
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton
              mode="modal"
              appearance={{
                elements: {
                  card: 'bg-gray-800 text-white',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-gray-300',
                  socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600 text-white',
                  formFieldInput: 'bg-gray-700 text-white border border-gray-600',
                  footerActionText: 'text-gray-300',
                },
              }}
            >
              <button className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}