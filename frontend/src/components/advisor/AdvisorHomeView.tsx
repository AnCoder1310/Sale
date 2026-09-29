"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Bot, 
  Theater, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Award, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";
import { mockScenarios } from "@/data/mockScenarios";
import { mockSampleSessionResult } from "@/data/mockPractice";

interface AdvisorHomeViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const AdvisorHomeView: React.FC<AdvisorHomeViewProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.name ? currentUser.name.split(" ").slice(-1)[0] : "Bạn";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#111111] p-7 sm:p-8 text-white shadow-sm border border-[#262626]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span>AI Sales Enablement Coach • Sẵn sàng hỗ trợ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Chào buổi sáng, {userName}! 👋
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
            Tra cứu thông số, chính sách bán hàng hoặc bước vào phòng thực chiến đàm phán cùng AI Customer.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("roleplay")}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-4 py-2 text-xs font-bold shadow hover:bg-slate-100 transition active:scale-[0.98]"
            >
              <Theater className="h-4 w-4" />
              <span>Phòng Thực chiến</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate("copilot")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white border border-white/20 hover:bg-white/20 transition"
            >
              <Bot className="h-4 w-4 text-slate-300" />
              <span>Tra cứu Copilot</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Element */}
        
        
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Khởi động nhanh</span>
          <span className="text-xs font-normal text-slate-500">Chọn phương thức học tập bạn muốn</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Ask AI Copilot */}
          <div 
            onClick={() => onNavigate("copilot")}
            className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-200 transition-all duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-900 transition-colors flex items-center justify-between">
              <span>Trợ lý Copilot</span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tra cứu thông số xe, biểu phí pin và ưu đãi trước bạ 0%.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-900">
              <span>Mở phòng hội thoại AI</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Card 2: Role-play Training */}
          <div 
            onClick={() => onNavigate("roleplay")}
            className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-200 transition-all duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Theater className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-900 transition-colors flex items-center justify-between">
              <span>Thực chiến Role-play</span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Mô phỏng tư vấn khách hàng thực tế và chấm điểm 5 tiêu chí Rubric.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-900">
              <span>Chọn kịch bản & Bắt đầu</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Card 3: Explore Knowledge */}
          <div 
            onClick={() => onNavigate("knowledge")}
            className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-200 transition-all duration-200"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-900 transition-colors flex items-center justify-between">
              <span>Cẩm nang Sản phẩm & Chính sách</span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Thông số kỹ thuật dải xe VF 3 - VF 9 và bài so sánh xe xăng đối thủ.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-900">
              <span>Xem danh mục tài liệu</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Scenarios & Recent Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Scenarios (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Kịch bản Luyện tập Đề xuất</h2>
              <p className="text-xs text-slate-500">Dựa trên mục tiêu rèn luyện và các kỹ năng cần củng cố</p>
            </div>
            <button 
              onClick={() => onNavigate("roleplay")}
              className="text-xs font-semibold text-slate-900 hover:text-slate-800 flex items-center gap-1"
            >
              <span>Xem tất cả (6)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {mockScenarios.slice(0, 3).map((scenario) => (
              <div
                key={scenario.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-200 hover:shadow transition"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={scenario.customerPersona.avatar}
                    alt={scenario.customerPersona.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900">
                        {scenario.vehicleModel}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        scenario.difficulty === "Cơ bản"
                          ? "bg-slate-100 text-slate-900"
                          : scenario.difficulty === "Tiêu chuẩn"
                          ? "bg-slate-100 text-slate-900"
                          : "bg-slate-100 text-slate-900"
                      }`}>
                        Độ khó: {scenario.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {scenario.durationMinutes} phút
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-1">
                      {scenario.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      Khách hàng: <span className="font-semibold text-slate-700">{scenario.customerPersona.name}</span> ({scenario.customerPersona.occupation})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("practice_room", { scenario })}
                  className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900 transition shadow-sm"
                >
                  <span>Bắt đầu</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Advisor Performance Highlight & Recent Activities (1 Col) */}
        <div className="space-y-6">
          {/* Skill Performance Card */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-900" />
                <span>Năng lực Tư vấn của Bạn</span>
              </h3>
              <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-full">
                88.5 / 100
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Product Knowledge</span>
                  <span className="font-bold text-slate-900">94%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Policy Accuracy</span>
                  <span className="font-bold text-slate-900">95%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Objection Handling</span>
                  <span className="font-bold text-slate-900">89%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: "89%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Need Discovery</span>
                  <span className="font-bold text-slate-900">87%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: "87%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Closing / Next Step</span>
                  <span className="font-bold text-slate-800">72% (Cần rèn luyện)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate("progress")}
              className="mt-4 w-full py-2 text-center text-xs font-semibold text-slate-900 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
            >
              Xem chi tiết Hồ sơ năng lực
            </button>
          </div>

          {/* Recent Session Result Preview */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>Phiên luyện tập gần nhất</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                <ShieldCheck className="h-3 w-3 text-slate-900" />
                Manager đã duyệt
              </span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                {mockSampleSessionResult.scenarioTitle}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-slate-500">{mockSampleSessionResult.date}</span>
                <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  Điểm: {mockSampleSessionResult.managerScore ?? mockSampleSessionResult.overallScore}/100
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 italic line-clamp-2">
              "{mockSampleSessionResult.managerNote}"
            </p>

            <button
              onClick={() => onNavigate("session_result", { result: mockSampleSessionResult })}
              className="mt-4 w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Xem kết quả chi tiết & Transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};