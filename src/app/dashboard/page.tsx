'use client';

import { useState, useCallback, useEffect } from 'react';
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

  const simulateUpload = (fileList: File[]) => {
    let progress = [...fileList].map(() => 0);
    let interval = setInterval(() => {
      setUploadProgress((prev) => {
        const updated: Record<string, number> = { ...prev };
        for (let i = 0; i < fileList.length; i++) {
          if (updated[fileList[i].name] >= 100) continue;

          const speedMultiplier = i === currentUploadingIndex ? 1.0 : Math.max(0.05, 1.0 - 0.2 * i);
          const increment = 2 + Math.random() * 3;
          updated[fileList[i].name] = Math.min(
            100,
            (updated[fileList[i].name] || 0) + increment * speedMultiplier
          );

          if (updated[fileList[i].name] === 100 && i === currentUploadingIndex) {
            setCurrentUploadingIndex((prevIdx) => prevIdx + 1);
          }
        }

        const allDone = fileList.every((file) => updated[file.name] >= 100);
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

  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <div className="flex h-screen text-lg">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Uploaded Files
            </h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 text-sm text-center cursor-pointer transition ${
                isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white dark:bg-gray-800'
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

          {/* Chat */}
          <main className="flex flex-col flex-grow p-6 bg-white dark:bg-gray-950 max-w-4xl w-[60%] mx-auto text-base">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ask Foreman</h1>
            <div className="flex-grow overflow-y-auto border rounded-md p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`inline-block px-4 py-2 rounded-lg break-words whitespace-pre-wrap text-base leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white self-end ml-auto text-right'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white self-start'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div className="text-sm text-gray-500">Foreman is thinking…</div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
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
        </div>
      </SignedIn>
    </>
  );
}