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
      <html lang="en" className="dark">
        <body className="antialiased bg-gray-900 text-white">
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
