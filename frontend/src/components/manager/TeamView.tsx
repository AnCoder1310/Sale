"use client";

import React, { useState } from "react";
import { Users, Search, Filter, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";
import { mockManagerAdvisors } from "@/data/mockManager";
import { AdvisorPerformance } from "@/types";

interface TeamViewProps {
  onAssign: (advisor: AdvisorPerformance) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onAssign }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockManagerAdvisors.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Đội Ngũ Tư Vấn Viên
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng 24 nhân viên tại showroom VinFast Vinh, Nghệ An
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc chức danh..."
            className="rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((adv) => (
          <div
            key={adv.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={adv.avatar}
                    alt={adv.name}
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{adv.name}</h3>
                    <p className="text-xs text-slate-500">{adv.title}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  adv.status === "high_performer"
                    ? "bg-blue-50 text-blue-800"
                    : adv.status === "on_track"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-red-50 text-red-800"
                }`}>
                  {adv.status === "high_performer" ? "Top" : adv.status === "on_track" ? "On track" : "Attention"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400">Điểm TB:</span>
                  <p className="font-black text-slate-900 text-sm">{adv.averageScore}/100</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Hoàn thành:</span>
                  <p className="font-black text-slate-900 text-sm">{adv.completedSessions} phiên</p>
                </div>
              </div>

              {/* Skill gap warning if any */}
              {adv.skills.policyAccuracy < 70 && (
                <div className="mt-3 p-2.5 rounded-xl bg-red-50 text-red-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span>Kỹ năng Chính sách yếu ({adv.skills.policyAccuracy}%)</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onAssign(adv)}
              className="w-full py-2.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
            >
              Giao kịch bản luyện tập
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
