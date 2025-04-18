import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Mockups from "@/components/sections/Mockups";
import ProblemSolution from "@/components/sections/ProblemSolution";

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Hero />
      <Features />
      <Mockups />
      <ProblemSolution />
      <Footer />
    </main>
  );
}
