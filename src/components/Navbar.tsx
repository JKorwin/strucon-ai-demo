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
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Left: Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Center: Welcome text when signed in */}
        <SignedIn>
          <div className="text-white text-lg font-medium">Welcome, Michael</div>
        </SignedIn>

        {/* Right-side buttons */}
        <div className="flex space-x-6 items-center">
          {/* Book a Demo only for logged-out users */}
          <SignedOut>
            <Link href="/book-demo" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded">
              Book a Demo
            </Link>
          </SignedOut>

          {/* Dashboard for logged-in users */}
          <SignedIn>
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded">
              Dashboard
            </Link>
          </SignedIn>

          {/* Auth Buttons */}
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
                }
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