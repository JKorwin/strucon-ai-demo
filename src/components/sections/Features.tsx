'use client';

import Link from 'next/link';

export default function Features() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          {/* Top Row */}
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:shadow-lg transition-all text-center">
            <h3 className="text-xl font-semibold mb-2">All-in-One Integration Hub</h3>
            <p>
              We unify tools like QuickBooks, Excel, JobTread, and Procore into a single source of truth—
              cutting out the clutter and manual work.
            </p>
          </div>

          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:shadow-lg transition-all text-center">
            <h3 className="text-xl font-semibold mb-2">AI-Powered Understanding</h3>
            <p>
              Our language model reads, analyzes, and connects information across PDFs, spreadsheets, and systems—
              spotting issues humans miss and delivering answers in seconds.
            </p>
          </div>

          {/* Bottom Row - Centered */}
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:shadow-lg transition-all md:col-span-2 md:mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Impact That Compounds</h3>
            <p>
              By automating insights and syncing the field with the office, we save hours per week,
              prevent costly errors, and give contractors clarity they’ve never had before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
