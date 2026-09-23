"use client";

import React from "react";
import { History, ShieldCheck, ArrowRight, Clock, Award } from "lucide-react";
import { mockSampleSessionResult } from "@/data/mockPractice";
import { PracticeSessionResult } from "@/types";

interface HistoryViewProps {
  onSelectResult: (result: PracticeSessionResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectResult }) => {
  const historyList = [
    mockSampleSessionResult,
    {
      ...mockSampleSessionResult,
      sessionId: "sess-2026-0920-02",
      scenarioTitle: "VF 7 — So sánh trực diện ADAS & Vận hành với C-SUV Máy Xăng",
      vehicleModel: "VinFast VF 7 Plus AWD",
      date: "20/09/2026 10:15",
      overallScore: 82,
      managerScore: 84,
      duration: "16 phút 10 giây",
      managerNote: "Trình bày rất hay về động cơ 349 mã lực và dẫn động AWD. Bước chốt đơn cần quyết đoán hơn."
    },
    {
      ...mockSampleSessionResult,
      sessionId: "sess-2026-0918-03",
      scenarioTitle: "VF 9 — Thuyết phục Doanh nhân lựa chọn Ghế Cơ trưởng VIP",
      vehicleModel: "VinFast VF 9 Plus (6 chỗ)",
      date: "18/09/2026 16:40",
      overallScore: 79,
      managerScore: 80,
      duration: "18 phút 05 giây",
      managerNote: "Cần nhấn mạnh thêm vào hệ thống treo khí nén để thuyết phục đối tượng khách hàng lớn tuổi."
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Lịch Sử Các Phiên Luyện Tập
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xem lại transcript, phân tích điểm AI và phản hồi của Quản lý đào tạo
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {historyList.map((item) => (
          <div
            key={item.sessionId}
            onClick={() => onSelectResult(item)}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {item.vehicleModel}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.date} ({item.duration})
                </span>
                {item.managerReviewed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                    <ShieldCheck className="h-3 w-3" />
                    Đã được Manager duyệt
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{item.scenarioTitle}</h3>
              {item.managerNote && (
                <p className="text-xs text-slate-600 italic line-clamp-1">
                  "{item.managerNote}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-right">
                <p className="text-[11px] text-slate-400">Điểm số</p>
                <p className="text-xl font-black text-blue-600">
                  {item.managerScore ?? item.overallScore}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </p>
              </div>

              <div className="p-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white transition">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
