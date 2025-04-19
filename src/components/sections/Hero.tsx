'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 max-w-xl"
      >
        <span className="uppercase text-indigo-500 font-semibold tracking-wide text-sm">
        </span>
        <h1 className="mt-4 text-5xl font-bold leading-tight text-gray-800">
          Centralized AI Construction Intelligence​
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Seamlessly integrate advanced analytics directly into your favorite construction CRMs.
          Quickly understand spending, optimize profitability, and enhance project outcomes—all in one intuitive dashboard.
        </p>
      </motion.div>

      {/* Right Image Content */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex justify-center md:justify-end"
      >
        <Image
          src="/images/dashboard-mockup.png"
          alt="Strucon Analytics Dashboard"
          width={600}
          height={400}
          className="rounded-xl shadow-xl"
        />
      </motion.div>
    </section>
  );
}
