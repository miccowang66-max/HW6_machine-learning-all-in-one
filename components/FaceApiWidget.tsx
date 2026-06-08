"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Brain,
  Eye,
  Activity,
  Frown,
  Smile,
  Meh,
  X,
  ChevronUp,
  ChevronDown,
  Zap,
} from "lucide-react";

type Mood = "focused" | "neutral" | "confused" | "bored";
export type FaceMetrics = {
  attention: number;
  mood: Mood;
  engagement: number;
  blinkRate: number;
};

const moodIcons: Record<Mood, React.ElementType> = {
  focused: Zap,
  neutral: Meh,
  confused: Frown,
  bored: Meh,
};

const moodColors: Record<Mood, string> = {
  focused: "text-emerald-600 bg-emerald-100",
  neutral: "text-slate-600 bg-slate-100",
  confused: "text-amber-600 bg-amber-100",
  bored: "text-red-600 bg-red-100",
};

const moodLabels: Record<Mood, string> = {
  focused: "專注學習中",
  neutral: "一般狀態",
  confused: "感到困惑",
  bored: "可能需要休息",
};

interface FaceApiWidgetProps {
  onFaceMetricsChange?: (metrics: FaceMetrics) => void;
}

export default function FaceApiWidget({ onFaceMetricsChange }: FaceApiWidgetProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  const [isExpanded, setIsExpanded] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [metrics, setMetrics] = useState<FaceMetrics>({
    attention: 92,
    mood: "focused",
    engagement: 88,
    blinkRate: 15,
  });

  // Simulated face detection loop
  const detectionLoop = useCallback(() => {
    // In production, this would run actual face-api.js detection on the video feed
    // For this demo, we simulate metrics with slight random variations
    setMetrics((prev) => {
      const moods: Mood[] = ["focused", "neutral", "confused", "bored"];
      // Mostly keep focused, occasionally simulate mood changes
      const rand = Math.random();
      let mood: Mood = prev.mood;
      if (rand < 0.02) {
        mood = moods[Math.floor(Math.random() * moods.length)];
      } else if (rand > 0.95) {
        mood = "focused";
      }

      const newMetrics: FaceMetrics = {
        attention: Math.max(0, Math.min(100, prev.attention + (Math.random() - 0.5) * 4)),
        mood,
        engagement: Math.max(0, Math.min(100, prev.engagement + (Math.random() - 0.5) * 3)),
        blinkRate: Math.max(5, Math.min(30, prev.blinkRate + (Math.random() - 0.5) * 2)),
      };

      return newMetrics;
    });

    animFrameRef.current = requestAnimationFrame(detectionLoop);
  }, []);

  // Notify parent of metric changes
  useEffect(() => {
    onFaceMetricsChange?.(metrics);
  }, [metrics, onFaceMetricsChange]);

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      streamRef.current = stream;
      setIsCameraOn(true);
      animFrameRef.current = requestAnimationFrame(detectionLoop);
    } catch (err) {
      console.error("Camera access denied or not available:", err);
    }
  }, [detectionLoop]);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, []);

  // Draw face overlay on canvas
  useEffect(() => {
    if (!isCameraOn || !canvasRef.current) return;

    const drawOverlay = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simulated face detection bounding box
      ctx.strokeStyle = metrics.mood === "confused" ? "#f59e0b" : "#22d3ee";
      ctx.lineWidth = 2;
      // Draw a simulated face rectangle
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 10;
      const w = 100;
      const h = 120;
      ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);

      // Draw facial landmarks (simulated)
      // Eyes
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(cx - 22, cy - 20, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.arc(cx + 22, cy - 20, 3, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      const mouthY = cy + 20;
      ctx.beginPath();
      if (metrics.mood === "focused") {
        ctx.arc(cx, mouthY, 15, 0.1, Math.PI - 0.1); // Slight smile
      } else if (metrics.mood === "confused") {
        ctx.arc(cx, mouthY + 8, 12, 0.1, Math.PI - 0.1); // Frown
      } else if (metrics.mood === "bored") {
        ctx.arc(cx, mouthY, 12, Math.PI + 0.3, -0.3); // Yawn-ish
      } else {
        ctx.moveTo(cx - 12, mouthY);
        ctx.lineTo(cx + 12, mouthY); // Neutral straight line
      }
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Eye status label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("blink: " + metrics.blinkRate.toFixed(0) + "/min", cx - 40, cy - 40);
    };

    const interval = setInterval(drawOverlay, 100);
    return () => clearInterval(interval);
  }, [isCameraOn, metrics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const MoodIcon = metrics.mood === "focused" ? Zap : metrics.mood === "confused" ? Frown : metrics.mood === "bored" ? Frown : Meh;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      {/* Collapsed / Expanded toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Collapse face API panel" : "Expand face API panel"}
        className="mb-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs text-slate-500 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-slate-700"
      >
        {isExpanded ? (
          <>
            <ChevronDown className="h-3 w-3" /> 收起面板
          </>
        ) : (
          <>
            <ChevronUp className="h-3 w-3" /> Face API
          </>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                  <Brain className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Face API Tracker</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isCameraOn ? "animate-pulse bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <span className="text-[10px] text-slate-500">
                  {isCameraOn ? "Live" : "Off"}
                </span>
              </div>
            </div>

            {/* Camera Feed */}
            <div className="relative mx-3 mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-40 w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                className="absolute inset-0 h-full w-full"
                style={{ transform: "scaleX(-1)" }}
              />

              {!isCameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm">
                  <button
                    onClick={startCamera}
                    aria-label="Start camera"
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 active:scale-95"
                  >
                    <Camera className="h-4 w-4" />
                    啟動鏡頭
                  </button>
                </div>
              )}

              {isCameraOn && (
                <button
                  onClick={stopCamera}
                  aria-label="Stop camera"
                  className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500/80 text-white transition-all duration-200 hover:bg-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Metrics */}
            <div className="space-y-3 p-4">
              {/* Mood */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">當前狀態</span>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${moodColors[metrics.mood]}`}>
                    <MoodIcon className="h-3 w-3" />
                    {moodLabels[metrics.mood]}
                  </span>
                </div>
              </div>

              {/* Attention */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Eye className="h-3 w-3" />
                    注意力
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {metrics.attention.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    animate={{ width: `${metrics.attention}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  />
                </div>
              </div>

              {/* Engagement */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Activity className="h-3 w-3" />
                    參與度
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {metrics.engagement.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    animate={{ width: `${metrics.engagement}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  />
                </div>
              </div>

              {/* Blink Rate */}
              <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
                <span className="text-[10px] text-slate-500">眨眼頻率</span>
                <span className="text-xs font-mono text-slate-600">
                  {metrics.blinkRate.toFixed(0)} <span className="text-[10px] text-slate-400">/min</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
