"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Mockups() {
  const images = [
    { src: "/images/dashboard-mockup.png", alt: "Dashboard Mockup" },
    { src: "/images/timeline-mockup.png", alt: "Timeline & Milestone Tracking" },
    { src: "/images/vendor-mockup.png", alt: "Vendor Management" },
  ];

  return (
    <section className="py-20 container mx-auto text-center">
      <h2 className="text-4xl font-bold mb-12">See Strucon AI in Action</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <Image src={img.src} alt={img.alt} width={400} height={250} className="rounded-xl shadow-lg" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
