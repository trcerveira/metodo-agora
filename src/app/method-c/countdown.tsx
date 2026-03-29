"use client";

import { useEffect, useState } from "react";

function getTimeLeft() {
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59, 999
  );
  const diff = endOfDay.getTime() - now.getTime();

  if (diff <= 0) return { h: 0, m: 0, s: 0 };

  return {
    h: Math.floor(diff / (1000 * 60 * 60)),
    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    s: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full bg-[#1E2310]/80 border-b border-[#7A8A32]/30 py-3 px-4">
      <div className="max-w-3xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        <span className="text-sm text-[#BFD64B] font-medium">
          A oferta exclusiva encerra em
        </span>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-[#E8E4DC] tabular-nums">
              {String(time.h).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#E8E4DC]/40">h</span>
          </div>
          <span className="text-[#E8E4DC]/30 text-xl font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-[#E8E4DC] tabular-nums">
              {String(time.m).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#E8E4DC]/40">m</span>
          </div>
          <span className="text-[#E8E4DC]/30 text-xl font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-[#E8E4DC] tabular-nums">
              {String(time.s).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#E8E4DC]/40">s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
