"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Algorithm } from "@/lib/data";
import { algorithms } from "@/lib/data";
import MathSandbox from "./MathSandbox";
import {
  BookOpen,
  Calculator,
  BarChart3,
  Brain,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Search,
  CheckCircle2,
} from "lucide-react";

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
  sliderValues: Record<string, number>;
  onSliderChange: (key: string, value: number) => void;
}

export default function MainContentView({
  selectedId,
  sliderValues,
  onSliderChange,
}: MainContentViewProps) {
  const [activeTab, setActiveTab] = useState<"concept" | "math" | "visual">("concept");

  const algo: Algorithm | undefined = algorithms.find((a) => a.id === selectedId);

  useEffect(() => {
    setActiveTab("concept");
  }, [selectedId]);

  if (!algo) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Brain className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-600">選擇一個演算法開始學習</h3>
          <p className="mt-1 text-sm text-slate-400">從左側導覽欄選取 Machine Learning 演算法</p>
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
        className="border-b border-slate-200 px-6 py-5"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {algo.id}
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{algo.name}</h2>
                <span className={isSupervised ? "tag-supervised" : "tag-unsupervised"}>
                  {isSupervised ? "監督式學習" : "非監督式學習"}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600">{algo.summary}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-lg bg-slate-100 p-1">
          {(["concept", "math", "visual"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "concept" && (
                <>
                  <BookOpen className="h-4 w-4" />
                  概念深入
                </>
              )}
              {tab === "math" && (
                <>
                  <Calculator className="h-4 w-4" />
                  互動數學沙盒
                </>
              )}
              {tab === "visual" && (
                <>
                  <BarChart3 className="h-4 w-4" />
                  視覺化圖解
                </>
              )}
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
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <Lightbulb className="h-4 w-4" />
                    定義與核心概念
                  </h3>
                  <p className="leading-relaxed text-slate-700">{algo.details}</p>
                </div>

                {/* Use Case */}
                <div className="glass-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    應用場景
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {algo.use_case.split("、").map((c, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      優點
                    </h3>
                    <ul className="space-y-2">
                      {prosCons.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-0.5 text-green-500">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      缺點
                    </h3>
                    <ul className="space-y-2">
                      {prosCons.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
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
            {activeTab === "math" && (
              <MathSandbox
                algo={algo}
                values={sliderValues}
                onSliderChange={onSliderChange}
              />
            )}

            {/* Visual Diagram */}
            {activeTab === "visual" && (
              <div className="space-y-5">
                <div className="glass-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-purple-600">
                    <BarChart3 className="h-4 w-4" />
                    演算法結構視覺化圖解
                  </h3>
                  <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8">
                    <VisualizationPlaceholder algo={algo} sliderValues={sliderValues} />
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

function VisualizationPlaceholder({
  algo,
  sliderValues,
}: {
  algo: Algorithm;
  sliderValues: Record<string, number>;
}) {
  const isSupervised = algo.type === "supervised";

  if (algo.id === "03" || algo.id === "04") {
    return <TreeVisualization isForest={algo.id === "04"} sliderValues={sliderValues} />;
  }
  if (algo.id === "09") {
    return <KMeansVisualization sliderValues={sliderValues} />;
  }
  if (algo.id === "01" || algo.id === "02") {
    return <RegressionVisualization logistic={algo.id === "02"} sliderValues={sliderValues} />;
  }
  if (algo.id === "05") {
    return <SVMVisualization sliderValues={sliderValues} />;
  }
  if (algo.id === "10") {
    return <PCAVisualization sliderValues={sliderValues} />;
  }

  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${
          isSupervised ? "bg-emerald-50" : "bg-amber-50"
        }`}
      >
        {isSupervised ? (
          <TrendingUp className="h-10 w-10 text-emerald-500" />
        ) : (
          <Search className="h-10 w-10 text-amber-500" />
        )}
      </div>
      <p className="text-slate-500">{algo.summary}</p>
      <p className="mt-2 text-xs text-slate-400">視覺化圖解具體實現中...</p>
    </div>
  );
}

/* ─── Visualization Sub-Components ─── */

function RegressionVisualization({
  logistic,
  sliderValues,
}: {
  logistic: boolean;
  sliderValues: Record<string, number>;
}) {
  const svgW = 400;
  const svgH = 280;
  const padX = 55;
  const padY = 30;
  const plotW = svgW - padX - 25;
  const plotH = svgH - padY - 35;

  const axisX1 = padX;
  const axisY = padY + plotH;
  const axisX2 = padX + plotW;
  const axisY2 = padY;

  if (logistic) {
    const w = sliderValues["w"] ?? 1;
    const b = sliderValues["b"] ?? 0;
    const xMin = -5;
    const xMax = 5;

    const toSvgX = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * plotW;
    const toSvgY = (p: number) => axisY - p * plotH;

    const pathParts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin);
      const z = -(w * x + b);
      const p = 1 / (1 + Math.exp(z));
      const sx = toSvgX(x);
      const sy = toSvgY(p);
      pathParts.push(i === 0 ? `M ${sx} ${sy}` : `L ${sx} ${sy}`);
    }
    const pathD = `M ${toSvgX(xMin)} ${toSvgY(0)} L ${toSvgX(xMax)} ${toSvgY(0)}`;

    const scatterPoints: [number, number][] = [];
    const offsets = [0.08, -0.06, 0.12, -0.1, 0.05, -0.15, 0.09, -0.04];
    for (let i = 0; i < 8; i++) {
      const xi = xMin + 1.2 * i;
      const z = -(w * xi + b);
      const p = 1 / (1 + Math.exp(z)) + offsets[i];
      scatterPoints.push([toSvgX(xi), toSvgY(Math.max(0, Math.min(1, p)))]);
    }

    return (
      <div className="relative h-64 w-full max-w-md">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-full w-full">
          <line x1={axisX1} y1={axisY} x2={axisX2} y2={axisY} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={axisX1} y1={axisY} x2={axisX1} y2={axisY2} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={axisX1} y1={toSvgY(0.5)} x2={axisX2} y2={toSvgY(0.5)} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="4 4" />
          <path d={pathParts.join(" ")} fill="none" stroke="#10b981" strokeWidth="2.5" />
          {scatterPoints.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#3b82f6" opacity="0.7" />
          ))}
          <text x={svgW / 2} y={svgH - 5} fill="#94a3b8" fontSize="11" textAnchor="middle">
            Sigmoid Curve — w={w}, b={b}
          </text>
        </svg>
      </div>
    );
  }

  const b0 = sliderValues["b0"] ?? 2;
  const b1 = sliderValues["b1"] ?? 1;
  const eps = sliderValues["eps"] ?? 0.5;

  const xMin = 0;
  const xMax = 9;
  const xSamples = [1, 2, 3, 4, 5, 6, 7, 8];
  const ySamples = xSamples.map((x) => b0 + b1 * x);

  const allY = [...ySamples, b0, b0 + b1 * xMax];
  const yDataMin = Math.min(...allY) - 2;
  const yDataMax = Math.max(...allY) + 2;

  const toSvgX = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => axisY - ((y - yDataMin) / (yDataMax - yDataMin)) * plotH;

  const lineX1 = toSvgX(xMin);
  const lineY1 = toSvgY(b0);
  const lineX2 = toSvgX(xMax);
  const lineY2 = toSvgY(b0 + b1 * xMax);

  const scatterOffsets = [0.8, -0.4, 0.6, -0.9, 0.3, -0.7, 1.0, -0.5];

  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-full w-full">
        <line x1={axisX1} y1={axisY} x2={axisX2} y2={axisY} stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1={axisX1} y1={axisY} x2={axisX1} y2={axisY2} stroke="#cbd5e1" strokeWidth="1.5" />
        {xSamples.map((x, i) => {
          const y = b0 + b1 * x + eps * scatterOffsets[i];
          return (
            <circle
              key={i}
              cx={toSvgX(x)}
              cy={toSvgY(y)}
              r="4"
              fill="#3b82f6"
              opacity="0.7"
            />
          );
        })}
        <line x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} stroke="#10b981" strokeWidth="2.5" />
        <text x={svgW / 2} y={svgH - 5} fill="#94a3b8" fontSize="11" textAnchor="middle">
          Linear Fit — y = {b0} + {b1}x
        </text>
      </svg>
    </div>
  );
}

function TreeVisualization({
  isForest,
  sliderValues,
}: {
  isForest: boolean;
  sliderValues: Record<string, number>;
}) {
  if (isForest) {
    const B = Math.round(sliderValues["b"] ?? 5);
    const acc = sliderValues["acc"] ?? 0.8;
    const treeCount = Math.min(12, Math.max(1, B));

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600">
          Random Forest — {treeCount} Trees, Acc ≈ {(acc * 100).toFixed(0)}%
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {Array.from({ length: treeCount }, (_, t) => {
              const seed = (t * 2654435761) & 0xffffffff;
              const pseudo = (n: number) => ((seed * (n + 1) * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
              return (
            <div key={t} className="flex flex-col items-center">
              <svg width="70" height="70" viewBox="0 0 100 100">
                <line x1="50" y1="20" x2="20" y2="55" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="50" y1="20" x2="80" y2="55" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="20" y1="55" x2="5" y2="85" stroke="#cbd5e1" strokeWidth="0.8" />
                <line x1="20" y1="55" x2="35" y2="85" stroke="#cbd5e1" strokeWidth="0.8" />
                <line x1="80" y1="55" x2="65" y2="85" stroke="#cbd5e1" strokeWidth="0.8" />
                <line x1="80" y1="55" x2="95" y2="85" stroke="#cbd5e1" strokeWidth="0.8" />
                <circle cx="50" cy="20" r="6" fill="#06b6d4" opacity={0.5 + pseudo(1) * 0.5} />
                <circle cx="20" cy="55" r="6" fill="#818cf8" opacity={0.5 + pseudo(2) * 0.5} />
                <circle cx="80" cy="55" r="6" fill="#f472b6" opacity={0.5 + pseudo(3) * 0.5} />
              </svg>
            </div>
              );
          })}
        </div>
      </div>
    );
  }

  const p1 = sliderValues["p1"] ?? 0.3;
  const p2 = sliderValues["p2"] ?? 0.3;
  const p3 = 1 - p1 - p2;
  const gini = 1 - (p1 * p1 + p2 * p2 + p3 * p3);

  const purityColor = (p: number) => {
    if (p > 0.8) return "#10b981";
    if (p > 0.5) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-600">
          Decision Tree — Gini = {gini.toFixed(3)}
        </span>
      </div>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <line x1="100" y1="40" x2="45" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="100" y1="40" x2="155" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="45" y1="120" x2="15" y2="180" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="45" y1="120" x2="75" y2="180" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="155" y1="120" x2="125" y2="180" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="155" y1="120" x2="185" y2="180" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="100" cy="40" r="10" fill={purityColor(Math.max(p1, p2, p3))} />
        <text x="100" y="44" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
          {(Math.max(p1, p2, p3) * 100).toFixed(0)}%
        </text>
        <circle cx="45" cy="120" r="9" fill={purityColor(p1)} />
        <circle cx="155" cy="120" r="9" fill={purityColor(p2)} />
        <text x="45" y="124" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">
          {(p1 * 100).toFixed(0)}%
        </text>
        <text x="155" y="124" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">
          {(p2 * 100).toFixed(0)}%
        </text>
      </svg>
    </div>
  );
}

function KMeansVisualization({
  sliderValues,
}: {
  sliderValues: Record<string, number>;
}) {
  const K = Math.round(sliderValues["k"] ?? 3);
  const mu1 = sliderValues["mu1"] ?? 2;
  const mu2 = sliderValues["mu2"] ?? 7;

  const clusterColors = ["#818cf8", "#f59e0b", "#10b981", "#f472b6", "#06b6d4", "#8b5cf6"];
  const centroids: { cx: number; cy: number }[] = [];
  for (let i = 0; i < Math.min(K, 6); i++) {
    const angle = (i / K) * Math.PI * 2;
    centroids.push({
      cx: 200 + 90 * Math.cos(angle),
      cy: 150 + 70 * Math.sin(angle),
    });
  }

  const svgW = 400;
  const svgH = 300;

  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-full w-full">
        {centroids.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r="45" fill="none" stroke={clusterColors[i]} strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
          </g>
        ))}
        {centroids.map((c, i) => (
          <g key={`pts-${i}`}>
            {Array.from({ length: 5 }, (_, j) => {
              const a = ((i * 7 + j * 3) / 11) * Math.PI * 2;
              const r2 = 15 + j * 5;
              return (
                <circle
                  key={j}
                  cx={c.cx + r2 * Math.cos(a)}
                  cy={c.cy + r2 * Math.sin(a)}
                  r="3.5"
                  fill={clusterColors[i]}
                  opacity="0.6"
                />
              );
            })}
            <circle cx={c.cx} cy={c.cy} r="6" fill="none" stroke={clusterColors[i]} strokeWidth="2.5" />
            <text x={c.cx} y={c.cy - 12} fill={clusterColors[i]} fontSize="10" textAnchor="middle">
              μ{i + 1}
            </text>
          </g>
        ))}
        <text x="200" y={svgH - 8} fill="#94a3b8" fontSize="11" textAnchor="middle">
          K = {K} Clusters, SSE Minimization
        </text>
      </svg>
    </div>
  );
}

function SVMVisualization({
  sliderValues,
}: {
  sliderValues: Record<string, number>;
}) {
  const wnorm = sliderValues["wnorm"] ?? 2;
  const margin = 2 / wnorm;
  const marginOffset = margin * 15;

  const svgW = 400;
  const svgH = 280;
  const cx = svgW / 2;
  const cy = svgH / 2;

  const mlx1 = 80 + marginOffset;
  const mly1 = 50 + marginOffset;
  const mlx2 = 330 + marginOffset;
  const mly2 = 240 + marginOffset;

  const marginLineX1 = cx - (1 - margin) * 120;
  const marginLineY1 = cy - 40 - (1 - margin) * 90;
  const marginLineX2 = cx + (1 - margin) * 120;
  const marginLineY2 = cy - 40 + (1 - margin) * 90;

  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-full w-full">
        <line x1="80" y1="50" x2="330" y2="240" stroke="#93c5fd" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
        <line x1={mlx1} y1={mly1} x2={mlx2} y2={mly2} stroke="#fda4af" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
        <line x1="95" y1="60" x2="315" y2="230" stroke="#06b6d4" strokeWidth="2.5" />
        <circle cx="100" cy="70" r="5" fill="none" stroke="#06b6d4" strokeWidth="2" />
        <circle cx="310" cy="230" r="5" fill="none" stroke="#06b6d4" strokeWidth="2" />
        {[
          [80, 55],
          [100, 70],
          [120, 75],
          [90, 90],
          [60, 80],
        ].map(([px, py], i) => (
          <circle key={`c1-${i}`} cx={px} cy={py} r="3.5" fill="#a5b4fc" />
        ))}
        {[
          [300, 200],
          [280, 220],
          [320, 240],
          [310, 230],
          [290, 190],
        ].map(([px, py], i) => (
          <circle key={`c2-${i}`} cx={px} cy={py} r="3.5" fill="#fda4af" />
        ))}
        <line
          x1={marginLineX1}
          y1={marginLineY1}
          x2={marginLineX2}
          y2={marginLineY2}
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <text x="200" y={svgH - 8} fill="#94a3b8" fontSize="11" textAnchor="middle">
          Max Margin = 2/‖w‖ = {margin.toFixed(2)}
        </text>
      </svg>
    </div>
  );
}

function PCAVisualization({
  sliderValues,
}: {
  sliderValues: Record<string, number>;
}) {
  const lambda1 = sliderValues["lambda1"] ?? 5;
  const lambda2 = sliderValues["lambda2"] ?? 2;
  const explained = lambda1 / (lambda1 + lambda2);
  const pc1Len = 60 + lambda1 * 18;
  const pc2Len = 40 + lambda2 * 15;

  const svgW = 400;
  const svgH = 280;
  const cx = 200;
  const cy = 140;

  return (
    <div className="relative h-64 w-full max-w-md">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-full w-full">
        <line x1="40" y1="240" x2="380" y2="240" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="40" y1="240" x2="40" y2="20" stroke="#cbd5e1" strokeWidth="1" />
        <line
          x1={cx}
          y1={cy}
          x2={cx + pc1Len * 0.7}
          y2={cy + pc1Len * 0.7}
          stroke="#06b6d4"
          strokeWidth="2.5"
        />
        <line
          x1={cx}
          y1={cy}
          x2={cx - pc2Len * 0.4}
          y2={cy + pc2Len * 0.55}
          stroke="#818cf8"
          strokeWidth="2"
          strokeDasharray="6 3"
        />
        <ellipse
          cx={cx}
          cy={cy + 30}
          rx={pc1Len * 0.35}
          ry={pc2Len * 0.25}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
          transform={`rotate(45 ${cx} ${cy + 30})`}
        />
        {[0.2, 0.35, 0.5, 0.6, 0.75].map((t, i) => {
          const dx = t * pc1Len * 0.6;
          const dy = t * pc1Len * 0.6;
          return (
            <circle key={i} cx={cx + dx} cy={cy + dy} r="4" fill="#3b82f6" />
          );
        })}
        <text x={cx + pc1Len * 0.75} y={cy + pc1Len * 0.75 - 5} fill="#06b6d4" fontSize="10">
          PC1 ({((explained) * 100).toFixed(0)}%)
        </text>
        <text x={cx - pc2Len * 0.45} y={cy + pc2Len * 0.6 + 10} fill="#818cf8" fontSize="10">
          PC2 ({((1 - explained) * 100).toFixed(0)}%)
        </text>
        <text x="193" y={svgH - 8} fill="#94a3b8" fontSize="11" textAnchor="middle">
          Λ = diag({lambda1}, {lambda2})
        </text>
      </svg>
    </div>
  );
}
