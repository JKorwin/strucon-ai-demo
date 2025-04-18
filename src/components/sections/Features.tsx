import Link from 'next/link';

export default function Features() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/features/seamless-data-integration">
            <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:shadow-lg cursor-pointer transition-all">
              <h3 className="text-xl font-semibold">Unified Platform Integration</h3>
              <p>Effortlessly unify your construction data across multiple platforms.</p>
            </div>
          </Link>

          <Link href="/features/ai-powered-natural-language-query">
            <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:shadow-lg cursor-pointer transition-all">
              <h3 className="text-xl font-semibold">AI-Powered Natural Language Query</h3>
              <p>Ask questions naturally and get real-time, accurate insights instantly.</p>
            </div>
          </Link>

          <Link href="/features/integrated-insights-hub">
            <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:shadow-lg cursor-pointer transition-all">
              <h3 className="text-xl font-semibold">Integrated Insights Hub</h3>
              <p>Centralized hub providing actionable analytics across projects.</p>
            </div>
          </Link>

          <Link href="/features/flexible-user-friendly-solutions">
            <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow hover:shadow-lg cursor-pointer transition-all">
              <h3 className="text-xl font-semibold">Real-Time Insights, All in One Place</h3>
              <p>Easy-to-use interfaces adaptable to your specific workflow.</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
