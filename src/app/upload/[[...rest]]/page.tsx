'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [insights, setInsights] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      console.warn('[no file selected]');
      return;
    }

    setLoading(true);
    setMessage(null);
    setInsights(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
      });

      const data = await res.json();
      console.log('Mock response:', data);

      if (data.success) {
        setMessage(data.message);
        setInsights(data.result.mockInsights);
      } else {
        setMessage('Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        <h1 className="text-2xl font-bold mb-4">Upload a Document</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full border rounded p-2"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Upload'}
          </button>
        </form>

        {message && (
          <div className="mt-6 bg-green-100 text-green-800 p-4 rounded">
            {message}
          </div>
        )}

        {insights && (
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Mock Insights</h2>
            <ul className="list-disc list-inside space-y-1">
              {insights.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.type}:</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SignedIn>
    </main>
  );
}