"use client";

import React, { useState } from "react";
import { 
  Server, 
  Cpu, 
  Database, 
  Activity, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  ArrowRight,
  FileCode,
  Layers
} from "lucide-react";
import { mockSystemHealth, mockAdminUsers, mockAILogs } from "@/data/mockAdmin";

interface AdminDashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const [isReindexing, setIsReindexing] = useState(false);

  const handleReindex = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
      alert("Đã hoàn tất đánh chỉ mục Qdrant Vector Store cho 450+ tài liệu tri thức!");
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1220] via-slate-900 to-purple-950 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Server className="h-3.5 w-3.5 text-purple-400" />
              <span>Architecture Console • VFO2O-20 System Admin</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">System Administration</h1>
            <p className="text-xs text-slate-300 mt-1">
              Giám sát hạ tầng microservices, kết nối LLM Provider, Vector Store và cấu hình tham số RAG
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReindex}
              disabled={isReindexing}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-purple-500 disabled:opacity-50 transition"
            >
              <RefreshCw className={`h-4 w-4 ${isReindexing ? "animate-spin" : ""}`} />
              <span>{isReindexing ? "Đang Re-index..." : "Re-index Qdrant Vectors"}</span>
            </button>
          </div>
        </div>

        {/* 6 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-slate-800 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Tổng người dùng</span>
            <div className="text-2xl font-black text-white mt-1">128</div>
            <span className="text-[10px] text-purple-300">102 Advisors</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Quản lý (Managers)</span>
            <div className="text-2xl font-black text-purple-400 mt-1">18</div>
            <span className="text-[10px] text-slate-400">12 Showrooms</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Tài liệu RAG</span>
            <div className="text-2xl font-black text-white mt-1">450+</div>
            <span className="text-[10px] text-purple-300">12.4k Chunks</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Truy vấn AI / Tháng</span>
            <div className="text-2xl font-black text-purple-400 mt-1">48.2k</div>
            <span className="text-[10px] text-emerald-400">+14% Growth</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">System Uptime</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">99.98%</div>
            <span className="text-[10px] text-slate-400">SLA cam kết</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">RAG MRR@5</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">94.2%</div>
            <span className="text-[10px] text-emerald-300">High Precision</span>
          </div>
        </div>
      </div>

      {/* System Health Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-600" />
          <span>Trạng Thái Sức Khỏe Hạ Tầng (System Health)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockSystemHealth.map((sh, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{sh.name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  {sh.uptime}
                </span>
              </div>

              <p className="text-xs font-mono text-purple-700">{sh.service}</p>
              <p className="text-xs text-slate-500">{sh.detail}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Độ trễ trung bình:</span>
                <span className="font-extrabold text-slate-900">{sh.latencyMs} ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation into Admin Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          onClick={() => onNavigate("admin_users")}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 flex items-center justify-between">
            <span>Quản Lý Người Dùng & Quyền</span>
            <ArrowRight className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">128 tài khoản Advisor, Manager, Super Admin</p>
        </div>

        <div
          onClick={() => onNavigate("admin_ai_config")}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 flex items-center justify-between">
            <span>Cấu Hình LLM & Tham Số RAG</span>
            <ArrowRight className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">Chunk size, Top-K, Temperature, System Prompts</p>
        </div>

        <div
          onClick={() => onNavigate("admin_ai_logs")}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 flex items-center justify-between">
            <span>AI Logs & Audit Security</span>
            <ArrowRight className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">Ghi nhận từng request token, độ trễ và sự kiện hệ thống</p>
        </div>
      </div>
    </div>
  );
};
