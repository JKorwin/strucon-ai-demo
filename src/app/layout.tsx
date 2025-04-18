'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '../components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Strucon.ai',
  description: 'AI-Powered Construction Analytics SaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
