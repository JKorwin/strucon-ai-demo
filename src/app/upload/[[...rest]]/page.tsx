'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[submit triggered] file state:', file);

    if (!file) {
      console.warn('[no file selected]');
      return;
    }

    setLoading(true);
    setAnalysis('');

    const formData = new FormData();
    formData.append('file', file);

    // 🔍 Log file info before sending
    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('[server status]', res.status);

      const data = await res.json();

      // 🔍 Log server response
      console.log('[server response]', data);

      setAnalysis(data.analysis || 'No analysis returned.');
    } catch (error) {
      console.error('Upload error:', error);
      setAnalysis('Error analyzing the file.');
    }

    setLoading(false);
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white p-8 transition-colors duration-300">
          <h1 className="text-4xl font-bold mb-6">Upload Project Files</h1>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
            <input
              type="file"
              accept=".pdf,.csv,application/pdf,text/csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Upload'}
            </button>
          </form>

          {analysis && (
            <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md w-full">
              <h2 className="text-lg font-semibold mb-2">AI Analysis:</h2>
              <p className="whitespace-pre-line">{analysis}</p>
            </div>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
}