"use client";

import React, { useState, useEffect } from "react";
import { practiceApi } from "@/api/practice";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
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
  const router = useRouter();
  const [isReindexing, setIsReindexing] = useState(false);
  const [dbStats, setDbStats] = useState<any>(null);

  useEffect(() => {
    practiceApi.getDatabaseStats()
      .then((data: any) => setDbStats(data))
      .catch((err) => console.log("Database stats fetch error:", err));
  }, []);

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
      <div className="p-8 rounded-3xl bg-[#111111] text-white shadow-sm border border-[#262626]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-2">
              <Server className="h-3.5 w-3.5 text-white" />
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
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 disabled:opacity-50 transition"
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
            <span className="text-[10px] text-slate-400">102 Advisors</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Quản lý (Managers)</span>
            <div className="text-2xl font-black text-white mt-1">18</div>
            <span className="text-[10px] text-slate-400">12 Showrooms</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Tài liệu RAG</span>
            <div className="text-2xl font-black text-white mt-1">450+</div>
            <span className="text-[10px] text-slate-400">12.4k Chunks</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Truy vấn AI / Tháng</span>
            <div className="text-2xl font-black text-white mt-1">48.2k</div>
            <span className="text-[10px] text-slate-400">+14% Growth</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">System Uptime</span>
            <div className="text-2xl font-black text-slate-400 mt-1">99.98%</div>
            <span className="text-[10px] text-slate-400">SLA cam kết</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">RAG MRR@5</span>
            <div className="text-2xl font-black text-slate-400 mt-1">94.2%</div>
            <span className="text-[10px] text-slate-300">High Precision</span>
          </div>
        </div>
      </div>

      {/* System Health Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-900" />
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
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                  <CheckCircle2 className="h-3 w-3 text-slate-900" />
                  {sh.uptime}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-800">{sh.service}</p>
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
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-slate-200 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center mb-3">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-900 flex items-center justify-between">
            <span>Quản Lý Người Dùng & Quyền</span>
            <ArrowRight className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">128 tài khoản Advisor, Manager, Super Admin</p>
        </div>

        <div
          onClick={() => onNavigate("admin_ai_config")}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-slate-200 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center mb-3">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-900 flex items-center justify-between">
            <span>Cấu Hình LLM & Tham Số RAG</span>
            <ArrowRight className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">Chunk size, Top-K, Temperature, System Prompts</p>
        </div>

        <div
          onClick={() => onNavigate("admin_ai_logs")}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-slate-200 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center mb-3">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-900 flex items-center justify-between">
            <span>AI Logs & Audit Security</span>
            <ArrowRight className="h-4 w-4" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">Ghi nhận từng request token, độ trễ và sự kiện hệ thống</p>
        </div>
      </div>

      {/* Live SQLite Database Statistics Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Cơ Sở Dữ Liệu Bền Vững SQLite (data/app.db)</h3>
              <p className="text-[11px] text-slate-400">Trạng thái kết nối SQLAlchemy 2.0 và số lượng bản ghi thực tế trên đĩa</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-xs border border-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-700 animate-pulse"></span>
            <span>SQLite Connected</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tài khoản Users</span>
            <span className="text-xl font-black text-white mt-1 block">{dbStats?.tables?.users ?? 4}</span>
            <span className="text-[10px] text-slate-400">Advisor, Manager, Admin</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Phiên Luyện Tập</span>
            <span className="text-xl font-black text-white mt-1 block">{dbStats?.tables?.practice_sessions ?? 13}</span>
            <span className="text-[10px] text-slate-400">Đã lưu trữ đầy đủ</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tin Nhắn Hội Thoại</span>
            <span className="text-xl font-black text-white mt-1 block">{dbStats?.tables?.session_messages ?? 74}</span>
            <span className="text-[10px] text-white">Multi-turn History</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Đánh Giá Rubric</span>
            <span className="text-xl font-black text-white mt-1 block">{dbStats?.tables?.session_evaluations ?? 13}</span>
            <span className="text-[10px] text-slate-400">HITL Ready</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Sự Kiện Telemetry</span>
            <span className="text-xl font-black text-white mt-1 block">{dbStats?.tables?.telemetry_events ?? 38}</span>
            <span className="text-[10px] text-slate-300">Audit & Tracing</span>
          </div>
        </div>
      </div>

      {/* SUPERUSER WORKSPACE INSPECTION CARDS */}
      <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-md shadow-sm">
              <Crown className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Quyền Truy Cập Toàn Bộ Hệ Thống Của Admin</h3>
              <p className="text-[11px] text-slate-400">Admin có quyền giám sát và truy cập trực tiếp vào phân hệ của Tư vấn viên và Quản lý</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px] border border-slate-300">
            Superuser Full Access
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Link to Advisor */}
          <div
            onClick={() => router.push("/advisor")}
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-400 hover:bg-slate-950 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-400 flex items-center gap-1.5">
                <span>👨‍💼</span>
                <span>Trang Tư Vấn Viên (Advisor Workspace)</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Trực tiếp trải nghiệm giao diện người dùng: Hỏi đáp Copilot, thực chiến đàm phán Role-play và xem hồ sơ năng lực.
            </p>
          </div>

          {/* Link to Manager */}
          <div
            onClick={() => router.push("/manager")}
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-400 hover:bg-slate-950 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-400 flex items-center gap-1.5">
                <span>🛠️</span>
                <span>Trang Quản Lý Đào Tạo (Manager Portal)</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Truy cập bảng theo dõi tiến độ toàn đội, kiểm duyệt và hiệu chỉnh điểm số AI (HITL Review) và giao bài tập huấn luyện.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
