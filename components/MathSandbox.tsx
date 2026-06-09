"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import type { Algorithm } from "@/lib/data";
import { Sliders, RotateCcw, Triangle, Wand2 } from "lucide-react";

interface MathSandboxProps {
  algo: Algorithm;
  values: Record<string, number>;
  onSliderChange: (key: string, value: number) => void;
}

// Pre-defined slider configs per algorithm
export const sliderConfigs: Record<
  string,
  { name: string; key: string; min: number; max: number; step: number; defaultVal: number }[]
> = {
  "01": [
    { name: "β₀ (截距)", key: "b0", min: -5, max: 5, step: 0.5, defaultVal: 2 },
    { name: "β₁ (斜率)", key: "b1", min: -3, max: 3, step: 0.1, defaultVal: 1 },
    { name: "ε (誤差)", key: "eps", min: 0, max: 2, step: 0.1, defaultVal: 0.5 },
  ],
  "02": [
    { name: "w (權重)", key: "w", min: -5, max: 5, step: 0.5, defaultVal: 1 },
    { name: "b (偏置)", key: "b", min: -3, max: 3, step: 0.5, defaultVal: 0 },
  ],
  "03": [
    { name: "P₁ (類別1佔比)", key: "p1", min: 0, max: 1, step: 0.1, defaultVal: 0.3 },
    { name: "P₂ (類別2佔比)", key: "p2", min: 0, max: 1, step: 0.1, defaultVal: 0.3 },
  ],
  "04": [
    { name: "B (樹的數量)", key: "b", min: 1, max: 20, step: 1, defaultVal: 5 },
    { name: "Tree Accuracy", key: "acc", min: 0.5, max: 1, step: 0.05, defaultVal: 0.8 },
  ],
  "05": [
    { name: "||w|| (權重範數)", key: "wnorm", min: 0.5, max: 5, step: 0.5, defaultVal: 2 },
  ],
  "06": [
    { name: "P(C) (先驗機率)", key: "prior", min: 0, max: 1, step: 0.1, defaultVal: 0.5 },
    { name: "P(X|C) (似然度)", key: "likelihood", min: 0, max: 1, step: 0.1, defaultVal: 0.7 },
  ],
  "07": [
    { name: "K (鄰居數)", key: "k", min: 1, max: 15, step: 1, defaultVal: 5 },
    { name: "x₁ 座標", key: "x1", min: 0, max: 10, step: 0.5, defaultVal: 3 },
    { name: "y₁ 座標", key: "y1", min: 0, max: 10, step: 0.5, defaultVal: 4 },
  ],
  "08": [
    { name: "γ (學習率)", key: "gamma", min: 0.01, max: 1, step: 0.05, defaultVal: 0.1 },
    { name: "m (迭代次數)", key: "m", min: 1, max: 10, step: 1, defaultVal: 3 },
  ],
  "09": [
    { name: "K (聚類數)", key: "k", min: 2, max: 8, step: 1, defaultVal: 3 },
    { name: "μ₁ (中心1)", key: "mu1", min: 0, max: 10, step: 0.5, defaultVal: 2 },
    { name: "μ₂ (中心2)", key: "mu2", min: 0, max: 10, step: 0.5, defaultVal: 7 },
  ],
  "10": [
    { name: "特徵值 λ₁", key: "lambda1", min: 0, max: 10, step: 0.5, defaultVal: 5 },
    { name: "特徵值 λ₂", key: "lambda2", min: 0, max: 10, step: 0.5, defaultVal: 2 },
  ],
};

export default function MathSandbox({ algo, values, onSliderChange }: MathSandboxProps) {
  const config = sliderConfigs[algo.id] || [];

  const handleSlider = (key: string, val: number) => {
    onSliderChange(key, val);
  };

  const handleReset = () => {
    config.forEach((c) => {
      onSliderChange(c.key, c.defaultVal);
    });
  };

  const dynamicResult = useMemo(() => computeDynamicResult(algo.id, values), [algo.id, values]);

  return (
    <div className="space-y-5">
      {/* Formula Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-x-auto p-5"
      >
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
          <Triangle className="h-4 w-4" />
          核心數學公式
        </h3>
        <div className="rounded-lg bg-slate-100 p-4 text-center">
          <span className="text-lg">
            <TeX math={algo.formula} />
          </span>
        </div>
      </motion.div>

      {/* Interactive Sliders */}
      {config.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-600">
              <Sliders className="h-4 w-4" />
              互動參數調整
            </h3>
            <button
              onClick={handleReset}
              aria-label="Reset parameters"
              className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-600"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {config.map((slider) => (
              <div key={slider.key}>
                <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm text-slate-700">{slider.name}</label>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-blue-600">
                    {typeof values[slider.key] === "number" && Number.isInteger(values[slider.key])
                      ? values[slider.key]
                      : values[slider.key]?.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={values[slider.key]}
                  onChange={(e) => handleSlider(slider.key, parseFloat(e.target.value))}
                  aria-label={slider.name}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-500 transition-all duration-200"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>{slider.min}</span>
                  <span>{slider.max}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Dynamic Result */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
          <Wand2 className="h-4 w-4" />
          動態計算結果
        </h3>
        <div className="rounded-lg bg-slate-100 p-4">
          {dynamicResult.type === "latex" ? (
            <span className="text-base">
              <TeX math={dynamicResult.value} />
            </span>
          ) : (
            <div className="space-y-2">
              <p className="text-base text-slate-700">{dynamicResult.value}</p>
              {dynamicResult.subtext && (
                <p className="text-sm text-slate-500">{dynamicResult.subtext}</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface DynamicResult {
  type: "text" | "latex";
  value: string;
  subtext?: string;
}

function computeDynamicResult(
  algoId: string,
  values: Record<string, number>
): DynamicResult {
  switch (algoId) {
    case "01": {
      const b0 = values["b0"] ?? 2;
      const b1 = values["b1"] ?? 1;
      const eps = values["eps"] ?? 0.5;
      const x = 3;
      const y = b0 + b1 * x + eps;
      return {
        type: "latex",
        value: `y = ${b0} + ${b1} \\cdot ${x} + ${eps.toFixed(1)} = ${y.toFixed(2)}`,
      };
    }
    case "02": {
      const w = values["w"] ?? 1;
      const b = values["b"] ?? 0;
      const x = 1;
      const z = -(w * x + b);
      const p = 1 / (1 + Math.exp(z));
      return {
        type: "latex",
        value: `P(y=1|x=1) = \\frac{1}{1+e^{-(${w}\\cdot 1 + ${b})}} = ${p.toFixed(4)}`,
      };
    }
    case "03": {
      const p1 = values["p1"] ?? 0.3;
      const p2 = values["p2"] ?? 0.3;
      const p3 = 1 - p1 - p2;
      const gini = 1 - (p1 * p1 + p2 * p2 + p3 * p3);
      return {
        type: "latex",
        value: `\\text{Gini} = 1 - (${p1.toFixed(1)}^2 + ${p2.toFixed(1)}^2 + ${p3.toFixed(1)}^2) = ${gini.toFixed(4)}`,
      };
    }
    case "04": {
      const B = values["b"] ?? 5;
      const acc = values["acc"] ?? 0.8;
      return {
        type: "text",
        value: `集成預測：${B} 棵樹中平均約 ${Math.round(acc * B)} 棵投票一致`,
        subtext: `每棵樹準確率 ≈ ${(acc * 100).toFixed(0)}%，集成後準確率通常更高`,
      };
    }
    case "05": {
      const wnorm = values["wnorm"] ?? 2;
      const margin = 2 / wnorm;
      return {
        type: "latex",
        value: `\\text{Margin} = \\frac{2}{\\lVert w \\rVert} = \\frac{2}{${wnorm}} = ${margin.toFixed(2)}`,
      };
    }
    case "06": {
      const prior = values["prior"] ?? 0.5;
      const likelihood = values["likelihood"] ?? 0.7;
      const evidence = 0.6;
      const posterior = (likelihood * prior) / evidence;
      return {
        type: "latex",
        value: `P(C|X) = \\frac{${likelihood.toFixed(1)} \\cdot ${prior.toFixed(1)}}{${evidence.toFixed(1)}} = ${posterior.toFixed(4)}`,
      };
    }
    case "07": {
      const k = values["k"] ?? 5;
      const x1 = values["x1"] ?? 3;
      const y1 = values["y1"] ?? 4;
      const dist = Math.sqrt(x1 * x1 + y1 * y1);
      return {
        type: "text",
        value: `K = ${k}，到最近的 ${k} 個鄰居的平均歐氏距離 ≈ ${dist.toFixed(2)}`,
        subtext: `新點 (${x1}, ${y1}) → 看最近的 ${k} 個鄰居多數類別決定分類`,
      };
    }
    case "08": {
      const gamma = values["gamma"] ?? 0.1;
      const m = values["m"] ?? 3;
      return {
        type: "latex",
        value: `F_{${m}}(x) = F_{${m - 1}}(x) + ${gamma} \\cdot h_{${m}}(x)`,
        subtext: `學習率 γ = ${gamma}，第 ${m} 次迭代時依序修正殘差`,
      };
    }
    case "09": {
      const k = values["k"] ?? 3;
      const mu1 = values["mu1"] ?? 2;
      const mu2 = values["mu2"] ?? 7;
      return {
        type: "text",
        value: `K = ${k} 個聚類，中心點 µ = {${mu1.toFixed(1)}, ${mu2.toFixed(1)}, ...}`,
        subtext: `不斷疊代更新中心點使 SSE = Σ||xᵢ - μⱼ||² 收斂至最小`,
      };
    }
    case "10": {
      const lambda1 = values["lambda1"] ?? 5;
      const lambda2 = values["lambda2"] ?? 2;
      const explained = lambda1 / (lambda1 + lambda2);
      return {
        type: "latex",
        value: `\\text{Var}_{\\text{PC1}} = ${(explained * 100).toFixed(1)}\\%, \\quad \\Lambda = \\begin{pmatrix} ${lambda1} & 0 \\\\ 0 & ${lambda2} \\end{pmatrix}`,
      };
    }
    default:
      return { type: "text", value: "調整參數觀察結果變化" };
  }
}
