"use client";

import React, { useState } from "react";
import { 
  Theater, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Filter,
  UserCheck,
  Zap,
  Target
} from "lucide-react";
import { mockScenarios } from "@/data/mockScenarios";
import { RoleplayScenario } from "@/types";

interface RoleplayViewProps {
  onStartSession: (scenario: RoleplayScenario) => void;
  onViewHistory: () => void;
}

export const RoleplayView: React.FC<RoleplayViewProps> = ({ 
  onStartSession,
  onViewHistory
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredScenarios = mockScenarios.filter((scen) => {
    if (selectedVehicle !== "all" && scen.vehicleId !== selectedVehicle) return false;
    if (selectedDifficulty !== "all" && scen.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-900 text-xs font-semibold mb-2">
            <Theater className="h-3.5 w-3.5 text-slate-900" />
            <span>Phòng Luyện tập AI Customer Simulator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Chọn Tình Huống Bán Xe & Bắt Đầu Luyện Tập
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Thử thách bản thân với các kiểu khách hàng thực tế: Kỹ sư công nghệ logic, Doanh nhân bận rộn, Khách hàng truyền thống lo ngại pin. Hệ thống sẽ tự động chấm điểm dựa trên 5 tiêu chí Rubric chuẩn.
          </p>
        </div>

        <button
          onClick={onViewHistory}
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
        >
          <Clock className="h-4 w-4 text-slate-400" />
          <span>Xem Lịch sử Luyện tập</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Dòng xe:
          </span>
          {["all", "vf-3", "vf-5", "vf-6", "vf-7", "vf-8", "vf-9"].map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVehicle(v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedVehicle === v
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {v === "all" ? "Tất cả mẫu xe" : v.toUpperCase().replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Độ khó:</span>
          {["all", "Cơ bản", "Tiêu chuẩn", "Nâng cao"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedDifficulty === d
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {d === "all" ? "Tất cả" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScenarios.map((scen) => (
          <div
            key={scen.id}
            className="flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden group"
          >
            <div className="p-6 space-y-4">
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-900">
                    {scen.vehicleModel}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    scen.difficulty === "Cơ bản"
                      ? "bg-slate-100 text-slate-900"
                      : scen.difficulty === "Tiêu chuẩn"
                      ? "bg-slate-100 text-slate-900"
                      : "bg-slate-100 text-slate-900"
                  }`}>
                    Độ khó: {scen.difficulty}
                  </span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  ~{scen.durationMinutes} phút
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-slate-900 transition-colors">
                {scen.title}
              </h3>

              {/* Persona Card */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={scen.customerPersona.avatar}
                  alt={scen.customerPersona.name}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-xs">
                      {scen.customerPersona.name} ({scen.customerPersona.age} tuổi)
                    </h4>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-slate-200/70 text-slate-600 font-medium truncate">
                      {scen.customerPersona.occupation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    <strong>Tính cách:</strong> {scen.customerPersona.personality}
                  </p>
                </div>
              </div>

              {/* Objectives & Skills */}
              <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Mục tiêu:</strong> {scen.trainingObjective}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scen.targetSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span>Ngân sách: </span>
                <strong className="text-slate-700">{scen.customerPersona.budgetVnd}</strong>
              </div>

              <button
                onClick={() => onStartSession(scen)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800 transition active:scale-95"
              >
                <span>Vào phòng luyện tập</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
