"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Frown, X, HelpCircle, ArrowRight, MessageSquare, BookOpen } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-900 shadow-2xl"
          >
            {/* Glow */}
            <div className="absolute -top-10 left-1/2 h-20 w-40 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-start gap-3 border-b border-slate-700/50 px-6 pt-5 pb-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                <Frown className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white">需要協助嗎？</h3>
                <p className="mt-0.5 text-sm text-slate-400">
                  我們偵測到你可能感到有些困惑，以下是你可以嘗試的資源。
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="relative space-y-2 p-4">
              <HelpOption
                icon={BookOpen}
                title="查看基礎概念說明"
                desc="重新閱讀目前演算法的定義與核心理念"
              />
              <HelpOption
                icon={MessageSquare}
                title="切換到另一種視覺化"
                desc="嘗試互動沙盒或視覺化圖解來輔助理解"
              />
              <HelpOption
                icon={ArrowRight}
                title="先了解更簡單的演算法"
                desc="建議從線性回歸 (01) 或 KNN (07) 開始"
              />
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700/50 px-6 py-3">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
              >
                了解了，繼續學習
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function HelpOption({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <button className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-800/60">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </button>
  );
}
