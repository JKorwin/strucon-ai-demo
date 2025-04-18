'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import { CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (fileList: File[]) => {
    let interval = setInterval(() => {
      setUploadProgress((prev) => {
        const updated: Record<string, number> = { ...prev };
        let allDone = true;

        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (updated[file.name] >= 100) continue;

          allDone = false;
          const speedMultiplier = i === currentUploadingIndex ? 1.0 : Math.max(0.35, 0.65 - 0.05 * i);
          const increment = 2 + Math.random() * 3;
          updated[file.name] = Math.min(100, (updated[file.name] || 0) + increment * speedMultiplier);

          if (updated[file.name] === 100 && i === currentUploadingIndex) {
            setCurrentUploadingIndex((prevIdx) => prevIdx + 1);
          }
        }

        if (allDone) clearInterval(interval);
        return updated;
      });
    }, 100);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    simulateUpload(acceptedFiles);
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

      const data = await res.json();
      setChatLog((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setChatLog((prev) => [...prev, { role: 'assistant', content: 'Error. Try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !chatLoading) {
      sendMessage();
    }
  };

  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <div className="flex h-screen text-lg">
          {/* Chat Section */}
          <main className="flex flex-col justify-between flex-grow px-6 py-4 bg-white dark:bg-gray-900 text-base w-full">
            <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Ask Foreman</h1>
            <div className="flex-grow overflow-y-auto px-4 space-y-4">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`inline-block px-4 py-2 rounded-lg break-words whitespace-pre-wrap text-base leading-relaxed max-w-[75%] ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white self-end ml-auto text-right'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white self-start'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div className="text-sm text-gray-500">Foreman is thinking…</div>
              )}
            </div>
            <div className="mt-4 flex gap-2 px-4">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your project..."
                className="flex-grow border rounded px-4 py-2 text-base"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-base disabled:opacity-50"
                disabled={chatLoading}
              >
                Send
              </button>
            </div>
          </main>

          {/* File Upload Section on Right */}
          <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-l p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Uploaded Files
            </h2>
            <div
              {...getRootProps()}
              className={`rounded-md p-4 text-sm text-center cursor-pointer transition ${
                isDragActive ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
              }`}
            >
              <input {...getInputProps()} />
              <p>{isDragActive ? 'Drop files here...' : 'Drag & drop or click to upload files'}</p>
            </div>
            <ul className="mt-4 space-y-2 overflow-y-auto text-sm text-gray-700 dark:text-white">
              {files.length === 0 ? (
                <li className="text-gray-500">No files uploaded yet.</li>
              ) : (
                files.map((file, idx) => {
                  const progress = uploadProgress[file.name] || 0;
                  const color = `hsl(${Math.floor((progress / 100) * 120)}, 70%, 50%)`;
                  return (
                    <li key={idx} className="truncate pb-1">
                      <div className="flex justify-between items-center">
                        <span className="truncate">{file.name}</span>
                        {progress === 100 && <CheckCircle className="text-green-600 w-4 h-4 ml-1" />}
                      </div>
                      <div className="w-full h-2 mt-1 rounded bg-gray-200">
                        <div
                          className="h-full rounded"
                          style={{ width: `${progress}%`, backgroundColor: color }}
                        ></div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>
        </div>
      </SignedIn>
    </>
  );
}