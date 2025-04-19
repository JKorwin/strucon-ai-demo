'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import { CheckCircle, ChevronDown } from 'lucide-react';

export default function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const integrations = [
    { name: 'Excel', img: '/images/excel-logo.png', href: 'https://www.microsoft.com/en-us/microsoft-365/excel' },
    { name: 'QuickBooks', img: '/images/quickbooks-logo.png', href: 'https://quickbooks.intuit.com/' },
    { name: 'Google Calendar', img: '/images/googlecalendar-logo.png', href: 'https://calendar.google.com/' },
  ];

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

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

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  return (
    <>
      <SignedOut><SignIn /></SignedOut>
      <SignedIn>
        <div className="flex h-[calc(100vh-64px)] overflow-hidden text-lg">
          {/* Left sidebar: Future Integrations */}
          <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r p-4 flex flex-col items-center">
            {/* New Dashboard Image */}
            <img
              src="/images/dashboard-preview.png"
              alt="Strucon Dashboard"
              className="w-full mb-4 rounded shadow"
            />

            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white text-center">Future Integrations</h2>
            {integrations.map(({ name, img, href }) => (
              <a
                key={name}
                href={href}
                className="flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md p-4 mb-2 hover:shadow transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={img} alt={name} className="h-8 object-contain" />
              </a>
            ))}
          </aside>

          {/* Chat Section */}
          <main className="flex flex-col items-center flex-grow px-6 py-4 bg-white dark:bg-gray-900 text-base w-full relative">
            <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Ask Foreman</h1>
            <div
              ref={chatContainerRef}
              className="relative flex-grow w-full flex justify-center overflow-y-auto h-[calc(100vh-400px)] max-h-[calc(100vh-400px)] pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-10"
            >
              <div className="w-full max-w-2xl space-y-4 mx-auto">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap text-base leading-relaxed inline-block ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white text-right ml-auto'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-left'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-sm text-gray-500">Foreman is thinking…</div>
                )}
              </div>

              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute left-1/2 transform -translate-x-1/2 bottom-[170px] bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full shadow"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="absolute bottom-[160px] left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
              <div className="flex gap-2 rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your project..."
                  className="flex-grow bg-transparent text-base px-2 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg text-base disabled:opacity-50"
                  disabled={chatLoading}
                >
                  Send
                </button>
              </div>
            </div>
          </main>

          {/* Right sidebar: File Uploads */}
          <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-l p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Uploaded Files</h2>
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