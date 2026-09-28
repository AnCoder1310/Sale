"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#FFFFFF] text-[#111111] select-none">
      <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center mx-auto text-[#111111]">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-black text-[#111111]">Đã xảy ra sự cố</h2>
        <p className="text-xs text-[#737373] leading-relaxed">
          {error?.message || "Hệ thống gặp lỗi kết nối tạm thời. Vui lòng thử lại."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 rounded-xl bg-[#111111] text-white font-bold text-xs hover:bg-[#262626] transition flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Thử lại</span>
          </button>
          <Link
            href="/login/"
            className="px-4 py-2.5 rounded-xl border border-[#D4D4D4] text-[#111111] font-bold text-xs hover:bg-[#F5F5F5] transition flex items-center gap-1.5"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Đăng nhập lại</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
