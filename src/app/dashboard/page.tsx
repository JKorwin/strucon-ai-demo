'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';

export default function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatLog((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat-gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[Foreman API Error]', res.status, errText);
        setChatLog((prev) => [
          ...prev,
          { role: 'assistant', content: '⚠️ Foreman had a backend error. Try again.' },
        ]);
        setChatLoading(false);
        return;
      }

      const data = await res.json();
      setChatLog((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatLog((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Please try again later.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Uploaded Files
            </h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 text-sm text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 bg-white dark:bg-gray-800'
              }`}
            >
              <input {...getInputProps()} />
              <p>
                {isDragActive
                  ? 'Drop files here...'
                  : 'Drag & drop or click to upload files'}
              </p>
            </div>

            <ul className="mt-4 space-y-2 overflow-y-auto text-sm text-gray-700 dark:text-white">
              {files.length === 0 ? (
                <li className="text-gray-500">No files uploaded yet.</li>
              ) : (
                files.map((file, idx) => (
                  <li key={idx} className="truncate border-b pb-1">
                    {file.name}
                  </li>
                ))
              )}
            </ul>
          </aside>

          {/* Chat */}
          <main className="flex flex-col flex-grow p-6 bg-white dark:bg-gray-950">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ask Foreman
            </h1>

            <div className="flex-grow overflow-y-auto border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <div className="space-y-4">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-2xl px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white self-end ml-auto'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-sm text-gray-500">Foreman is thinking…</div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question about your project..."
                className="flex-grow border rounded px-4 py-2 text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                disabled={chatLoading}
              >
                Send
              </button>
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
}