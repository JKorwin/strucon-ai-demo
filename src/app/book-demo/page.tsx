'use client';

import React, { JSX } from 'react';

export default function BookDemoPage(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white p-8 transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-4">Book a Demo</h1>
      <p className="text-lg text-center mb-6">
        Please fill out the form below, and we'll get back to you shortly to schedule your demo.
      </p>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-md px-4 py-2"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-md px-4 py-2"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-md px-4 py-2"
          />
          <textarea
            placeholder="What are you hoping to see during the demo?"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-md px-4 py-2"
            rows={4}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors"
          >
            Request Demo
          </button>
        </form>
      </div>
    </div>
  );
}
  