"use client";

import { useState, useEffect, useCallback } from "react";
import AlgorithmNav from "@/components/AlgorithmNav";
import MainContentView from "@/components/MainContentView";
import FaceApiWidget from "@/components/FaceApiWidget";
import HelpModal from "@/components/HelpModal";
import { Brain, Download, Github, Sparkles } from "lucide-react";
import type { FaceMetrics } from "@/components/FaceApiWidget";
import { sliderConfigs } from "@/components/MathSandbox";

export default function Home() {
  const [selectedId, setSelectedId] = useState("01");
  const [showHelp, setShowHelp] = useState(false);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const config = sliderConfigs[selectedId] || [];
    const defaults: Record<string, number> = {};
    config.forEach((c) => {
      defaults[c.key] = c.defaultVal;
    });
    setSliderValues(defaults);
  }, [selectedId]);

  const handleFaceMetricsChange = useCallback(
    (metrics: FaceMetrics) => {
      if (metrics.mood === "confused") {
        setShowHelp(true);
        const timer = setTimeout(() => setShowHelp(false), 12000);
        return () => clearTimeout(timer);
      }
    },
    []
  );

  const handleSliderChange = useCallback((key: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Top Bar */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">ML Algorithms Panorama</h1>
            <p className="text-[10px] text-slate-500">Top 10 Machine Learning Algorithms</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/ml_algorithms.py"
            download
            aria-label="Download Python implementations"
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-medium text-blue-600 cursor-pointer transition-colors duration-200 hover:bg-blue-100 hover:text-blue-700"
          >
            <Download className="h-3 w-3" />
            Download .py
          </a>
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-500">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Interactive Dashboard v1.1
          </span>
          <a
            href="#"
            aria-label="GitHub repository"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-600"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Algorithm Navigation */}
        <aside className="w-80 flex-shrink-0 border-r border-slate-200 bg-white">
          <AlgorithmNav selectedId={selectedId} onSelect={setSelectedId} />
        </aside>

        {/* Main Content */}
        <main id="main-content" className="relative flex-1 overflow-hidden bg-slate-50">
          <MainContentView
            selectedId={selectedId}
            sliderValues={sliderValues}
            onSliderChange={handleSliderChange}
          />
        </main>
      </div>

      {/* Face API Widget */}
      <FaceApiWidget onFaceMetricsChange={handleFaceMetricsChange} />

      {/* Help Modal (triggered by confused detection) */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
