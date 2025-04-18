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
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex space-x-6 items-center">
          {/* Dropdown Menu */}
          <div className="relative group">
            <button className="px-3 py-2 text-white">Features ▼</button>
            <div className="absolute hidden group-hover:block bg-gray-800 shadow-lg rounded-md mt-1 py-2">
              <Link href="/features/crm-integration" className="block px-4 py-2 text-white">Instant CRM Integration</Link>
              <Link href="/features/predictive-analytics" className="block px-4 py-2 text-white">Predictive Analytics</Link>
              <Link href="/features/profitability-insights" className="block px-4 py-2 text-white">Profitability Insights</Link>
              <Link href="/features/vendor-management" className="block px-4 py-2 text-white">Vendor Management</Link>
            </div>
          </div>

          <Link href="/pricing" className="text-white">Pricing</Link>
          <Link href="/company" className="text-white">Company</Link>
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
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-12 h-12' // ✅ Bigger profile picture (48px)
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}