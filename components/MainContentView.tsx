"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Algorithm } from "@/lib/data";
import { algorithms } from "@/lib/data";
import MathSandbox from "./MathSandbox";

const supervisedProsCons: Record<string, { pros: string[]; cons: string[] }> = {
  "01": {
    pros: ["模型可解釋性極高", "計算快速，適合大規模數據", "作為基準模型簡單好用"],
    cons: ["對異常值敏感", "無法捕捉複雜非線性關係", "需滿足線性假設"],
  },
  "02": {
    pros: ["輸出為機率，易於理解", "計算效率高", "支援正則化防止過擬合"],
    cons: ["假設特徵間線性關係", "對多重共線性敏感", "難以處理非線性邊界"],
  },
  "03": {
    pros: ["不需特徵標準化", "可解釋性強，視覺化清晰", "能同時處理數值與類別特徵"],
    cons: ["容易過擬合", "對數據微小變化敏感", "傾向產生偏差"],
  },
  "04": {
    pros: ["抗過擬合能力強", "能處理高維資料", "可評估特徵重要性"],
    cons: ["訓練時間較長", "模型可解釋性較低", "記憶體消耗較大"],
  },
  "05": {
    pros: ["在高維空間表現優異", "泛化能力強", "可透過核函數處理非線性"],
    cons: ["大數據集訓練慢", "需要謹慎選擇核函數", "難以解釋預測結果"],
  },
  "06": {
    pros: ["訓練速度極快", "對小數據集表現好", "對不相關特徵穩健"],
    cons: ["特徵獨立假設不現實", "遇到未見過的類別組合有問題", "機率估計不夠準確"],
  },
  "07": {
    pros: ["直覺簡單無需訓練", "對非線性數據有效", "新增樣本時容易擴展"],
    cons: ["預測階段計算量大", "對不相關特徵敏感", "需要特徵縮放"],
  },
  "08": {
    pros: ["準確度極高", "支援自訂損失函數", "可自動處理缺失值"],
    cons: ["訓練較慢", "對超參數敏感", "容易過擬合需正則化"],
  },
  "09": {
    pros: ["演算法簡單快速", "容易實現與解釋", "適用於大規模數據集"],
    cons: ["需預先指定 K 值", "對初始中心點敏感", "對非球形聚類效果差"],
  },
  "10": {
    pros: ["有效降維同時保留變異", "消除特徵間相關性", "減少過擬合風險"],
    cons: ["主成分不易解釋", "可能會丟失有意義訊息", "假設線性關係"],
  },
};

interface MainContentViewProps {
  selectedId: string;
}

export default function MainContentView({ selectedId }: MainContentViewProps) {
  const [activeTab, setActiveTab] = useState<"concept" | "math" | "visual">("concept");

  const algo: Algorithm | undefined = algorithms.find((a) => a.id === selectedId);

  useEffect(() => {
    setActiveTab("concept");
  }, [selectedId]);

  if (!algo) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-300">選擇一個演算法開始學習</h3>
          <p className="mt-1 text-sm text-slate-500">從左側導覽欄選取 Machine Learning 演算法</p>
        </div>
      </div>
    );
  }

  const isSupervised = algo.type === "supervised";
  const prosCons = supervisedProsCons[algo.id] || {
    pros: ["高效能", "易於實現"],
    cons: ["需調參", "對數據敏感"],
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header Banner */}
      <motion.div
        key={`header-${algo.id}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-700/50 px-6 py-5"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {algo.id}
              </span>
              <div>
                <h2 className="text-xl font-bold text-white">{algo.name}</h2>
                <span className={isSupervised ? "tag-supervised" : "tag-unsupervised"}>
                  {isSupervised ? "監督式學習" : "非監督式學習"}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400">{algo.summary}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-lg bg-slate-800/60 p-1">
          {(["concept", "math", "visual"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "concept" && "📖 概念深入"}
              {tab === "math" && "🧮 互動數學沙盒"}
              {tab === "visual" && "📊 視覺化圖解"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${algo.id}-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Concept Deep-Dive */}
            {activeTab === "concept" && (
              <div className="space-y-5">
                {/* Definition */}
                <div className="glass-card p-5">
                  <h3 className="mb-3 text-sm font-semibold text-blue-400">📝 定義與核心概念</h3>
                  <p className="leading-relaxed text-slate-300">{algo.details}</p>
                </div>

                {/* Use Case */}
                <div className="glass-card p-5">
                  <h3 className="mb-3 text-sm font-semibold text-emerald-400">🎯 應用場景</h3>
                  <div className="flex flex-wrap gap-2">
                    {algo.use_case.split("、").map((c, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-green-400">✅ 優點</h3>
                    <ul className="space-y-2">
                      {prosCons.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="mt-0.5 text-green-400">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-red-400">⚠️ 缺點</h3>
                    <ul className="space-y-2">
                      {prosCons.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="mt-0.5 text-red-400">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Math Sandbox */}
            {activeTab === "math" && <MathSandbox algo={algo} />}

            {/* Visual Diagram */}
            {activeTab === "visual" && (
              <div className="space-y-5">
                <div className="glass-card p-5">
                  <h3 className="mb-4 text-sm font-semibold text-purple-400">📊 演算法結構視覺化圖解</h3>
                  <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-8">
                    <VisualizationPlaceholder algo={algo} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function VisualizationPlaceholder({ algo }: { algo: Algorithm }) {
  const isSupervised = algo.type === "supervised";

  if (algo.id === "03" || algo.id === "04") {
    return <TreeVisualization isForest={algo.id === "04"} />;
  }
  if (algo.id === "09") {
    return <KMeansVisualization />;
  }
  if (algo.id === "01" || algo.id === "02") {
    return <RegressionVisualization logistic={algo.id === "02"} />;
  }
  if (algo.id === "05") {
    return <SVMVisualization />;
  }
  if (algo.id === "10") {
    return <PCAVisualization />;
  }

  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${
          isSupervised ? "bg-emerald-500/10" : "bg-amber-500/10"
        }`}
      >
        <span className="text-3xl">{isSupervised ? "📈" : "🔍"}</span>
      </div>
      <p className="text-slate-400">{algo.summary}</p>
      <p className="mt-2 text-xs text-slate-600">視覺化圖解具體實現中...</p>
    </div>
  );
}

/* ─── Visualization Sub-Components ─── */

function RegressionVisualization({ logistic }: { logistic: boolean }) {
  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox="0 0 400 280" className="h-full w-full">
        {/* Axes */}
        <line x1="50" y1="240" x2="380" y2="240" stroke="#475569" strokeWidth="1.5" />
        <line x1="50" y1="240" x2="50" y2="20" stroke="#475569" strokeWidth="1.5" />
        {/* Dots */}
        {[
          [80, 200],
          [120, 170],
          [160, 150],
          [200, 130],
          [240, 110],
          [280, 90],
          [320, 70],
          [360, 55],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#60a5fa" opacity="0.7" />
        ))}
        {logistic ? (
          <path
            d="M 50 235 Q 100 230 150 220 Q 200 195 250 140 Q 300 80 350 45 Q 370 35 390 30"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
          />
        ) : (
          <line x1="60" y1="220" x2="370" y2="35" stroke="#34d399" strokeWidth="2.5" />
        )}
        <text x="200" y="270" fill="#64748b" fontSize="11" textAnchor="middle">
          {logistic ? "Sigmoid Curve — P(y=1|x)" : "Linear Fit — y = β₀ + β₁x"}
        </text>
      </svg>
    </div>
  );
}

function TreeVisualization({ isForest }: { isForest: boolean }) {
  const trees = isForest ? 3 : 1;
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {Array.from({ length: trees }, (_, t) => (
        <div key={t} className="flex flex-col items-center">
          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            {isForest ? `Tree #${t + 1}🌲` : "🌳 Root Node"}
          </div>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <line x1="50" y1="20" x2="20" y2="55" stroke="#475569" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="80" y2="55" stroke="#475569" strokeWidth="1.5" />
            <line x1="20" y1="55" x2="5" y2="85" stroke="#475569" strokeWidth="1" />
            <line x1="20" y1="55" x2="35" y2="85" stroke="#475569" strokeWidth="1" />
            <line x1="80" y1="55" x2="65" y2="85" stroke="#475569" strokeWidth="1" />
            <line x1="80" y1="55" x2="95" y2="85" stroke="#475569" strokeWidth="1" />
            <circle cx="50" cy="20" r="7" fill="#22d3ee" />
            <circle cx="20" cy="55" r="7" fill="#818cf8" />
            <circle cx="80" cy="55" r="7" fill="#f472b6" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function KMeansVisualization() {
  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox="0 0 400 280" className="h-full w-full">
        {/* Cluster 1 */}
        <circle cx="120" cy="120" r="60" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="6 4" />
        {[
          [100, 100],
          [130, 90],
          [140, 130],
          [110, 140],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#818cf8" />
        ))}
        <circle cx="120" cy="115" r="6" fill="none" stroke="#6366f1" strokeWidth="2.5" />
        <text x="120" y="105" fill="#818cf8" fontSize="10" textAnchor="middle">μ₁</text>

        {/* Cluster 2 */}
        <circle cx="280" cy="160" r="50" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 4" />
        {[
          [260, 150],
          [290, 140],
          [300, 170],
          [270, 175],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#fbbf24" />
        ))}
        <circle cx="280" cy="158" r="6" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <text x="280" y="148" fill="#fbbf24" fontSize="10" textAnchor="middle">μ₂</text>
      </svg>
    </div>
  );
}

function SVMVisualization() {
  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox="0 0 400 280" className="h-full w-full">
        {/* Dashed margins */}
        <line x1="80" y1="60" x2="320" y2="230" stroke="#6366f1" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
        <line x1="110" y1="40" x2="350" y2="210" stroke="#6366f1" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
        {/* Hyperplane */}
        <line x1="95" y1="50" x2="335" y2="220" stroke="#22d3ee" strokeWidth="2.5" />
        {/* Support vectors */}
        <circle cx="100" cy="70" r="5" fill="none" stroke="#22d3ee" strokeWidth="2" />
        <circle cx="310" cy="230" r="5" fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* Class dots */}
        {[
          [80, 55],
          [100, 70],
          [120, 75],
          [90, 90],
          [60, 80],
        ].map(([cx, cy], i) => (
          <circle key={`c1-${i}`} cx={cx} cy={cy} r="3.5" fill="#818cf8" />
        ))}
        {[
          [300, 200],
          [280, 220],
          [320, 240],
          [310, 230],
          [290, 190],
        ].map(([cx, cy], i) => (
          <circle key={`c2-${i}`} cx={cx} cy={cy} r="3.5" fill="#f472b6" />
        ))}
        <text x="200" y="265" fill="#64748b" fontSize="11" textAnchor="middle">
          Max Margin Hyperplane
        </text>
      </svg>
    </div>
  );
}

function PCAVisualization() {
  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox="0 0 400 280" className="h-full w-full">
        {/* Original axes */}
        <line x1="40" y1="240" x2="380" y2="240" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow)" />
        <line x1="40" y1="240" x2="40" y2="20" stroke="#475569" strokeWidth="1" />
        {/* PC1 */}
        <line x1="100" y1="100" x2="320" y2="220" stroke="#22d3ee" strokeWidth="2" />
        {/* PC2 orthogonal */}
        <line x1="240" y1="90" x2="160" y2="230" stroke="#818cf8" strokeWidth="2" strokeDasharray="6 3" />
        {/* Dots projected */}
        {[0.25, 0.4, 0.55, 0.65, 0.8].map((t, i) => {
          const x = 100 + t * 220;
          const y = 100 + t * 120;
          return <circle key={i} cx={x} cy={y} r="4" fill="#60a5fa" />;
        })}
        <text x="360" y="160" fill="#22d3ee" fontSize="10">PC1</text>
        <text x="200" y="83" fill="#818cf8" fontSize="10">PC2</text>
        <text x="193" y="270" fill="#64748b" fontSize="11" textAnchor="middle">
          Cov(X) = QΛQᵀ — Principal Components
        </text>
      </svg>
    </div>
  );
}
