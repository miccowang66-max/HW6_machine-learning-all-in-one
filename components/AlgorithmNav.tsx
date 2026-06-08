"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Activity,
  Network,
  Trees,
  GitMerge,
  Calculator,
  Users,
  Zap,
  Shapes,
  Minimize2,
  ChevronRight,
  Search,
  Hash,
} from "lucide-react";
import type { Algorithm } from "@/lib/data";
import { algorithms } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  LineChart,
  Activity,
  Network,
  Trees,
  GitMerge,
  Calculator,
  Users,
  Zap,
  Shapes,
  Minimize2,
};

interface AlgorithmNavProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function AlgorithmNav({ selectedId, onSelect }: AlgorithmNavProps) {
  const [search, setSearch] = useState("");

  const filtered = algorithms.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="mb-1 flex items-center gap-2">
          <Hash className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Algorithm Panorama
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Top 10 ML Algorithms</h2>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋演算法..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search algorithms"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-colors duration-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Algorithm List */}
      <nav className="flex-1 overflow-y-auto px-3 py-1">
        <AnimatePresence mode="wait">
          {filtered.map((algo, index) => {
            const Icon = iconMap[algo.icon] || LineChart;
            const isActive = selectedId === algo.id;
            const isSupervised = algo.type === "supervised";

            return (
              <motion.button
                key={algo.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
                onClick={() => handleSelect(algo.id)}
                className={`group relative mb-1.5 flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 ring-1 ring-blue-200"
                    : "hover:bg-slate-100"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-blue-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* ID badge */}
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600"
                  }`}
                >
                  {algo.id}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`truncate text-sm font-semibold ${
                        isActive ? "text-blue-600" : "text-slate-700 group-hover:text-slate-900"
                      }`}
                    >
                      {algo.name}
                    </h3>
                    <span className={isSupervised ? "tag-supervised" : "tag-unsupervised"}>
                      {isSupervised ? "Supervised" : "Unsupervised"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{algo.summary}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        isActive ? "text-blue-500" : "text-slate-400"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400">{algo.use_case}</span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  className={`mt-2 h-4 w-4 flex-shrink-0 transition-all ${
                    isActive
                      ? "rotate-90 text-blue-500"
                      : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-400"
                  }`}
                />
              </motion.button>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">沒有找到匹配的演算法</p>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Supervised</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 8 Algos
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> 2 Algos
            </span>
          </div>
          <span>Unsupervised</span>
        </div>
      </div>
    </div>
  );
}
