"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzerPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);

  const analyzeText = () => {
    if (!inputText.trim()) return;
    
    const wordCount = inputText.trim().split(/\s+/).length;
    const charCount = inputText.length;
    const readingTime = Math.ceil(wordCount / 200);

    setResult({ wordCount, charCount, readingTime });
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-8 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Text Analyzer</h1>
        <p className="text-gray-600">Paste your text below to get instant insights.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative z-10">
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          placeholder="Start typing or paste your text here to analyze..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
        
        <div className="mt-4 flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {setResult(null); setInputText("")}}
            className="text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
          >
            Clear Text
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeText}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
          >
            Analyze Text
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-lg relative -z-0"
          >
            <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">Analysis Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-4xl font-extrabold text-indigo-600">{result.wordCount}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Words</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-4xl font-extrabold text-indigo-600">{result.charCount}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Characters</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-4xl font-extrabold text-indigo-600">{result.readingTime}m</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Estimated Read Time</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
