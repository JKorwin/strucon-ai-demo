'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';

export default function DashboardPage() {
  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col items-center justify-center text-black dark:text-white bg-gray-50 dark:bg-gray-900 p-8">
          <h1 className="text-4xl font-bold">Welcome to your Dashboard 🎯</h1>
          <Link href="/upload">
            <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors">
              Upload Project Files
            </button>
          </Link>
        </div>
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
}