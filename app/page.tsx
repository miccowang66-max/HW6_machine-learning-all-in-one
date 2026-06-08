"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import AlgorithmNav from "@/components/AlgorithmNav";
import MainContentView from "@/components/MainContentView";
import FaceApiWidget from "@/components/FaceApiWidget";
import HelpModal from "@/components/HelpModal";
import { Brain, Github, Sparkles } from "lucide-react";
import type { FaceMetrics } from "@/components/FaceApiWidget";

export default function Home() {
  const [selectedId, setSelectedId] = useState("01");
  const [showHelp, setShowHelp] = useState(false);

  const handleFaceMetricsChange = useCallback(
    (metrics: FaceMetrics) => {
      // Trigger help modal if confused mood detected
      if (metrics.mood === "confused") {
        // Only show if not already showing (debounce via state)
        setShowHelp(true);
        // Auto-dismiss after 12 seconds
        const timer = setTimeout(() => setShowHelp(false), 12000);
        return () => clearTimeout(timer);
      }
    },
    []
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950">
      {/* Top Bar */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-700/50 bg-slate-900/80 px-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">ML Algorithms Panorama</h1>
            <p className="text-[10px] text-slate-500">Top 10 Machine Learning Algorithms</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-[10px] text-slate-400">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Interactive Dashboard v1.0
          </span>
          <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Algorithm Navigation */}
        <aside className="w-80 flex-shrink-0 border-r border-slate-700/50 bg-slate-900/50">
          <AlgorithmNav selectedId={selectedId} onSelect={setSelectedId} />
        </aside>

        {/* Main Content */}
        <main className="relative flex-1 overflow-hidden bg-slate-950">
          <MainContentView selectedId={selectedId} />
        </main>
      </div>

      {/* Face API Widget */}
      <FaceApiWidget onFaceMetricsChange={handleFaceMetricsChange} />

      {/* Help Modal (triggered by confused detection) */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
