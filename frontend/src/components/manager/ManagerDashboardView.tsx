"use client";

import React, { useState } from "react";
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Filter,
  BarChart3,
  Calendar
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from "recharts";
import { 
  mockManagerAdvisors, 
  mockManagerAssignments, 
  mockWeeklyTrainingTrend,
  mockSkillDistribution
} from "@/data/mockManager";
import { mockSampleSessionResult } from "@/data/mockPractice";
import { HITLReviewModal } from "./HITLReviewModal";
import { managerApi } from "@/api/manager";
import { useEffect } from "react";
import { PracticeSessionResult } from "@/types";

interface ManagerDashboardViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({ onNavigate }) => {
  const [selectedSessionForReview, setSelectedSessionForReview] = useState<PracticeSessionResult | null>(null);
  const [pendingReviewsList, setPendingReviewsList] = useState<PracticeSessionResult[]>([mockSampleSessionResult]);

  useEffect(() => {
    managerApi.getPendingReviews()
      .then((data) => {
        if (data && data.length > 0) {
          setPendingReviewsList(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleApproveSession = (updated: PracticeSessionResult) => {
    setPendingReviewsList((prev) =>
      prev.map((p) => (p.sessionId === updated.sessionId ? updated : p))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome & KPI Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1220] via-slate-900 to-emerald-950 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Sales Management Portal • VinFast Vinh, Nghệ An</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Sales Team Overview</h1>
            <p className="text-xs text-slate-300 mt-1">
              Báo cáo tiến độ đào tạo, phân tích khoảng cách kỹ năng (Skill Gaps) và danh sách chờ duyệt HITL
            </p>
          </div>

          <button
            onClick={() => onNavigate("manager_assignments")}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
          >
            <span>+ Giao bài luyện tập mới</span>
          </button>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Tổng số Tư vấn viên</span>
            <div className="text-3xl font-black text-white mt-1">24</div>
            <span className="text-[10px] text-emerald-400 mt-0.5 inline-block">100% Đã kích hoạt tài khoản</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Đang hoạt động hôm nay</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">19</div>
            <span className="text-[10px] text-slate-300 mt-0.5 inline-block">79.1% Tỷ lệ tham gia</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Hoàn thành bài tập tuần</span>
            <div className="text-3xl font-black text-white mt-1">87.5%</div>
            <span className="text-[10px] text-emerald-400 mt-0.5 inline-block">+5.2% so với tuần trước</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Điểm trung bình Đội</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">82.4<span className="text-sm font-normal text-slate-400">/100</span></div>
            <span className="text-[10px] text-emerald-400 mt-0.5 inline-block">Đạt chuẩn năng lực Sales</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Training Completion Weekly */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tiến độ Hoàn thành Đào tạo (Theo Tuần)</h3>
              <p className="text-xs text-slate-500">So sánh số lượt hoàn thành so với chỉ tiêu giao</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Đạt 92/90 bài
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyTrainingTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="target" name="Mục tiêu" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="Thực tế đạt" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Skill Distribution */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Năng Lực Toàn Đội Theo 5 Kỹ Năng</h3>
              <p className="text-xs text-slate-500">So sánh điểm trung bình với chuẩn Benchmark</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Benchmark: 80+</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSkillDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[50, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis dataKey="skill" type="category" width={130} tick={{ fill: "#475569", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" name="Điểm đội ngũ" fill="#10B981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* HITL Pending Review Queue (Human-In-The-Loop) */}
      <div className="rounded-3xl bg-white border border-emerald-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Danh Sách Chờ Duyệt Đánh Giá (HITL Review Queue)</h3>
              <p className="text-xs text-slate-500">Xác nhận hoặc hiệu chỉnh điểm số do AI tạo ra</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            {pendingReviewsList.filter((r) => !r.managerReviewed).length} phiên đang chờ duyệt
          </span>
        </div>

        <div className="space-y-3">
          {pendingReviewsList.map((item) => (
            <div
              key={item.sessionId}
              className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Advisor"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-300 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">{item.advisorName}</h4>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                      {item.vehicleModel}
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                    {item.managerReviewed && (
                      <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        Đã duyệt ({item.managerScore}/100)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Kịch bản: <strong>{item.scenarioTitle}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 italic">
                    AI đánh giá: {item.overallScore}/100 • {item.aiSummary.slice(0, 100)}...
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSessionForReview(item)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition flex-shrink-0"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{item.managerReviewed ? "Xem lại đánh giá" : "Thẩm định điểm"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Team Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Đội Ngũ Tư Vấn Viên (Team Roster)</h3>
            <p className="text-xs text-slate-500">Theo dõi điểm trung bình, tiến độ luyện tập và cảnh báo kỹ năng yếu</p>
          </div>

          <button
            onClick={() => onNavigate("manager_team")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Xem toàn bộ 24 nhân viên</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Tư vấn viên</th>
                <th className="px-6 py-3.5">Chức danh</th>
                <th className="px-6 py-3.5">Phiên hoàn thành</th>
                <th className="px-6 py-3.5">Điểm TB</th>
                <th className="px-6 py-3.5">Policy Accuracy</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {mockManagerAdvisors.map((adv) => (
                <tr key={adv.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={adv.avatar}
                      alt={adv.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{adv.name}</p>
                      <p className="text-[11px] text-slate-400">{adv.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{adv.title}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{adv.completedSessions} bài</td>
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {adv.averageScore}/100
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${adv.skills.policyAccuracy < 70 ? "text-red-600" : "text-slate-800"}`}>
                      {adv.skills.policyAccuracy}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {adv.status === "high_performer" ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-[10px]">
                        ★ Top Performer
                      </span>
                    ) : adv.status === "on_track" ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px]">
                        ✓ On Track
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <AlertTriangle className="h-3 w-3" /> Cần Hỗ Trợ
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onNavigate("manager_assignments", { advisor: adv })}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      Giao bài
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSessionForReview && (
        <HITLReviewModal
          session={selectedSessionForReview}
          onClose={() => setSelectedSessionForReview(null)}
          onApprove={handleApproveSession}
        />
      )}
    </div>
  );
};
