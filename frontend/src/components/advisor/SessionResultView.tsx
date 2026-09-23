"use client";

import React, { useState } from "react";
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  Sparkles,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Printer,
  FileCheck2
} from "lucide-react";
import { VinFastLogo } from "@/components/ui/VinFastLogo";
import { PracticeSessionResult } from "@/types";

interface SessionResultViewProps {
  result: PracticeSessionResult;
  onBackToHome: () => void;
  onRetry: () => void;
}

export const SessionResultView: React.FC<SessionResultViewProps> = ({
  result,
  onBackToHome,
  onRetry
}) => {
  const [showTranscript, setShowTranscript] = useState(true);
  const [activeCriterion, setActiveCriterion] = useState<string | null>(null);

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-amber-700 bg-amber-50 border-amber-200";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại Trang chủ</span>
        </button>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold shadow-md transition"
            title="In hoặc lưu phiếu đánh giá thành tệp PDF"
          >
            <Printer className="h-4 w-4" />
            <span>Xuất Phiếu / In PDF</span>
          </button>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Luyện tập lại</span>
          </button>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Hoàn tất phiên</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <Award className="h-3.5 w-3.5 text-blue-600" />
              <span>Đánh giá Phiên Luyện tập</span>
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              {result.scenarioTitle}
            </h1>
            <p className="text-xs text-slate-500">
              Thời gian thực hiện: {result.date} • Thời lượng: {result.duration} • Mẫu xe: {result.vehicleModel}
            </p>
          </div>

          {/* Big Score Badges */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {/* AI Score */}
            <div className="text-center p-4 px-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Score</p>
              <div className="text-4xl font-black text-slate-900 mt-1">
                {result.overallScore}
                <span className="text-sm font-semibold text-slate-400">/100</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-bold text-blue-600">
                Xuất sắc
              </span>
            </div>

            {/* Manager Review Score */}
            {result.managerReviewed && (
              <div className="text-center p-4 px-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1 justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Manager Duyệt
                </p>
                <div className="text-4xl font-black text-emerald-700 mt-1">
                  {result.managerScore ?? result.overallScore}
                  <span className="text-sm font-semibold text-emerald-400">/100</span>
                </div>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700">
                  Đã xác nhận (+2 điểm)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Manager Note Callout */}
        {result.managerReviewed && result.managerNote && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">
                Nhận xét từ {result.managerReviewerName} ({result.managerReviewedAt}):
              </p>
              <p className="mt-1 text-slate-700 italic leading-relaxed">
                "{result.managerNote}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5-Rubric Breakdown Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Chi tiết 5 Tiêu Chí Đánh Giá (Rubric Dimensions)</span>
          <span className="text-xs font-normal text-slate-500">Tiêu chuẩn nghiệp vụ AI20K & VinFast</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {result.rubricBreakdown.map((item) => (
            <div
              key={item.criterion}
              className="flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-4 hover:border-blue-300 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${getScoreBadge(item.score)}`}>
                    {item.score} / {item.maxScore} điểm
                  </span>
                  <span className="text-xs text-slate-400 font-medium capitalize">
                    {item.criterion.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3">
                  {item.criterionNameVi}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.definition}
                </p>

                {/* Evidence Quote */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <p className="font-semibold text-slate-800 text-[11px] mb-1">Căn cứ transcript:</p>
                  <ul className="space-y-1 italic text-slate-600">
                    {item.evidence.map((ev, i) => (
                      <li key={i}>"{ev}"</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improvement tip */}
              <div className="pt-3 border-t border-slate-100 text-xs">
                <p className="text-amber-800 font-semibold flex items-center gap-1">
                  <span>💡 Gợi ý cải thiện:</span>
                </p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {item.improvementTip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Accordion */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-200 text-left"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="font-bold text-slate-900 text-sm">Toàn bộ Hội thoại Phiên Luyện tập (Transcript)</span>
            <span className="text-xs text-slate-500">({result.transcript.length} lượt nói)</span>
          </div>
          {showTranscript ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {showTranscript && (
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto bg-slate-50/40">
            {result.transcript.map((turn) => (
              <div
                key={turn.id}
                className={`flex flex-col ${turn.sender === "advisor" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                    turn.sender === "advisor"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 font-bold mb-1 opacity-80 text-[11px]">
                    <span>{turn.sender === "advisor" ? "Tư vấn viên (Trường An)" : "Khách hàng"}</span>
                    <span>{turn.timestamp}</span>
                  </div>
                  <p>{turn.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

            {/* OFFICIAL VINFAST SCORECARD DOCUMENT (FORM CHUẨN IN PDF & HỒ SƠ LƯU TRỮ) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm text-slate-900 space-y-6 print-scorecard">
        {/* Header Document */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <VinFastLogo size={42} variant="silver" />
            <div>
              <p className="font-extrabold text-sm tracking-wider uppercase text-slate-900">
                TẬP ĐOÀN VINGROUP • VINFAST AUTO LTD.
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Khối Đào Tạo & Phát Triển Năng Lực Bán Hàng — Showroom VinFast Vinh
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="font-mono font-bold text-slate-500">MÃ HỒ SƠ: {result.sessionId}</span>
            <p className="text-emerald-700 font-bold mt-0.5">● CHỨNG NHẬN ĐẠT CHUẨN ĐÀO TẠO</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1 py-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            PHIẾU ĐÁNH GIÁ NĂNG LỰC TƯ VẤN BÁN HÀNG Ô TÔ (VFO2O-20)
          </h2>
          <p className="text-xs text-slate-500 italic">
            Áp dụng chuẩn khung năng lực 5 chiều VinFast AI20K • Đánh giá tự động & Kiểm duyệt HITL
          </p>
        </div>

        {/* Candidate Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Tư vấn viên:</span>
            <p className="font-black text-slate-900 text-sm mt-0.5">{result.advisorName}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Mã nhân sự:</span>
            <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{result.advisorId}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Dòng xe thực chiến:</span>
            <p className="font-bold text-blue-700 text-sm mt-0.5">{result.vehicleModel}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Thời gian hoàn thành:</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{result.date}</p>
          </div>
        </div>

        {/* Overall Score Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-slate-200 gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Xếp loại chung:</span>
            <h3 className="font-black text-xl text-slate-900 mt-0.5">
              {result.managerScore ?? result.overallScore >= 85 ? "XUẤT SẮC (ĐẠT CHUẨN BÁN HÀNG CAO CẤP)" : "ĐẠT YÊU CẦU"}
            </h3>
            <p className="text-xs text-slate-600 mt-1">{result.aiSummary}</p>
          </div>
          <div className="flex items-center gap-6 text-center flex-shrink-0">
            <div className="p-3 px-5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">AI Score</span>
              <p className="text-2xl font-black text-slate-900">{result.overallScore}/100</p>
            </div>
            <div className="p-3 px-5 rounded-xl bg-emerald-600 text-white shadow-md">
              <span className="text-[10px] font-bold text-emerald-200 uppercase">Điểm Duyệt (HITL)</span>
              <p className="text-2xl font-black text-white">{result.managerScore ?? result.overallScore}/100</p>
            </div>
          </div>
        </div>

        {/* Detailed 5-Rubric Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Tiêu chí năng lực (5 Dimensions)</th>
                <th className="p-3.5">Điểm số</th>
                <th className="p-3.5">Căn cứ trích xuất từ Transcript</th>
                <th className="p-3.5">Gợi ý cải thiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {result.rubricBreakdown.map((r) => (
                <tr key={r.criterion} className="hover:bg-slate-50/60">
                  <td className="p-3.5 font-bold text-slate-900 max-w-[200px]">
                    <p>{r.criterionNameVi}</p>
                    <span className="text-[10px] font-normal text-slate-400 capitalize">{r.criterion}</span>
                  </td>
                  <td className="p-3.5 font-black text-blue-700 whitespace-nowrap">
                    {r.score} / {r.maxScore}
                  </td>
                  <td className="p-3.5 italic text-[11px] text-slate-600 max-w-[260px]">
                    "{r.evidence.join('; ')}"
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-600 max-w-[240px]">
                    {r.improvementTip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Manager Review Sign-off */}
        {result.managerReviewed && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-slate-900">
              Nhận xét chính thức từ Quản lý đào tạo ({result.managerReviewerName || "Lê Văn Hoàng"}):
            </p>
            <p className="text-slate-700 italic">
              "{result.managerNote}"
            </p>
          </div>
        )}

        {/* Official Signatures Grid */}
        <div className="grid grid-cols-2 pt-8 text-center text-xs">
          <div className="space-y-16">
            <div>
              <p className="font-bold uppercase text-slate-900">TƯ VẤN VIÊN THỰC HIỆN</p>
              <p className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
            </div>
            <p className="font-bold text-slate-800 text-sm">{result.advisorName}</p>
          </div>

          <div className="space-y-16">
            <div>
              <p className="font-bold uppercase text-slate-900">TRƯỞNG BỘ PHẬN ĐÀO TẠO</p>
              <p className="text-[10px] text-slate-400 italic">(Ký duyệt và đóng dấu)</p>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded border border-emerald-600 text-emerald-700 font-extrabold text-[10px] uppercase mb-1">
                ✓ ĐÃ PHÊ DUYỆT ĐIỆN TỬ
              </span>
              <p className="font-bold text-slate-800 text-sm">{result.managerReviewerName || "Lê Văn Hoàng"}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Recommended Next Practice Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500 text-white uppercase">
            Khuyến nghị tiếp theo
          </span>
          <h3 className="font-bold text-white text-base mt-2">
            {result.recommendedNextPractice}
          </h3>
        </div>
        <button
          onClick={onRetry}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-slate-100 transition shadow"
        >
          Luyện tập bài tiếp theo
        </button>
      </div>
    </div>
  );
};
