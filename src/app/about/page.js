"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Info, Code, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto w-full p-8 mt-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About The Project</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">This project serves as a demonstration of modern web framework capabilities wrapped in a clean, professional UI.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
        >
          <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
            <Info size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Purpose</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            This project acts as an educational tool to display how Next.js layouts, App Router navigation, and React hooks function perfectly together.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
        >
          <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
            <Code size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Technology</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Built purely with Next.js, elegantly styled utilizing Tailwind CSS utilities, and brought to life utilizing Framer Motion physics-based animations.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
        >
          <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
            <Rocket size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Deployment</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            The source code is perfectly structured to be completely highly-scalable and edge-ready, deployable instantly via Vercel for global fast delivery.
          </p>
        </motion.div>
      </div>
      
      <div className="text-center">
         <Link href="/" className="inline-block text-indigo-600 font-semibold hover:underline bg-indigo-50 px-6 py-3 rounded-full">
           &larr; Return to Home Dashboard
         </Link>
      </div>
    </div>
  );
}
