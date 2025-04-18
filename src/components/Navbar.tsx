'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Logo from '@/components/ui/logo'; // ✅ imported from your component folder

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link href="/">
          {mounted && <Logo />} {/* ✅ use your logo component */}
        </Link>

        <div className="flex space-x-6 items-center">
          {/* Dropdown Menu */}
          <div className="relative group">
            <button className="px-3 py-2 text-black dark:text-white">Features ▼</button>
            <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md mt-1 py-2">
              <Link href="/features/crm-integration" className="block px-4 py-2 text-black dark:text-white">Instant CRM Integration</Link>
              <Link href="/features/predictive-analytics" className="block px-4 py-2 text-black dark:text-white">Predictive Analytics</Link>
              <Link href="/features/profitability-insights" className="block px-4 py-2 text-black dark:text-white">Profitability Insights</Link>
              <Link href="/features/vendor-management" className="block px-4 py-2 text-black dark:text-white">Vendor Management</Link>
            </div>
          </div>

          <Link href="/pricing" className="text-black dark:text-white">Pricing</Link>
          <Link href="/company" className="text-black dark:text-white">Company</Link>
          <Link href="/book-demo" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded">
            Book a Demo
          </Link>

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

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-2 rounded text-sm bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            {resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
}