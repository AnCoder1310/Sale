"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Save 
} from "lucide-react";
import { PracticeSessionResult } from "@/types";
import { managerApi } from "@/api/manager";
import { trackEvent } from "@/telemetry";

interface HITLReviewModalProps {
  session: PracticeSessionResult;
  onClose: () => void;
  onApprove: (updatedSession: PracticeSessionResult) => void;
}

export const HITLReviewModal: React.FC<HITLReviewModalProps> = ({
  session,
  onClose,
  onApprove
}) => {
  const [managerScore, setManagerScore] = useState<number>(session.managerScore ?? session.overallScore);
  const [managerNote, setManagerNote] = useState<string>(
    session.managerNote ?? "Tư vấn viên nắm vững chính sách pin và kỹ năng phản hồi tốt. Cần lưu ý đẩy nhanh bước chốt cọc."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (score: number) => {
    setManagerScore(score);
    trackEvent("manager_score_edited", {
      sessionId: session.sessionId,
      oldScore: session.overallScore,
      newScore: score
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    trackEvent("manager_review_approved", {
      sessionId: session.sessionId,
      managerScore,
      advisorName: session.advisorName
    });

    try {
      await managerApi.updateReview(session.sessionId, {
        managerScore,
        managerNote
      });
    } catch {
      // Graceful offline fallback
    }

    const updated: PracticeSessionResult = {
      ...session,
      managerReviewed: true,
      managerScore,
      managerNote,
      managerReviewerName: "Lê Văn Hoàng (Training Director)",
      managerReviewedAt: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIsSubmitting(false);
    onApprove(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Human-in-the-Loop (HITL) Review</h2>
              <p className="text-[11px] text-emerald-400">
                Thẩm định & Hiệu chỉnh kết quả đánh giá AI • {session.advisorName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left: Transcript & AI Findings */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Thông tin phiên luyện tập
              </h3>
              <p className="text-xs font-semibold text-slate-800">{session.scenarioTitle}</p>
              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span>Mẫu xe: {session.vehicleModel}</span>
                <span>Thời gian: {session.duration}</span>
              </div>
            </div>

            {/* Rubric Breakdown by AI */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Điểm AI chấm từng tiêu chí</span>
                <span className="text-blue-600 font-extrabold">Tổng: {session.overallScore}/100</span>
              </h3>
              <div className="space-y-1.5">
                {session.rubricBreakdown.map((r) => (
                  <div key={r.criterion} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{r.criterionNameVi}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{r.reason}</p>
                    </div>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {r.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Transcript */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Lược trích hội thoại ({session.transcript.length} lượt)
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                {session.transcript.slice(0, 4).map((t) => (
                  <div key={t.id} className="leading-relaxed">
                    <strong className={t.sender === "advisor" ? "text-blue-600" : "text-slate-800"}>
                      {t.sender === "advisor" ? "Tư vấn viên:" : "Khách hàng:"}
                    </strong>{" "}
                    <span className="text-slate-600">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Manager Adjustment & Approval Form */}
          <form onSubmit={handleSubmit} className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Quyền hạn Quản lý Đào tạo (HITL)</span>
                </p>
                <p className="text-xs text-emerald-800 mt-1">
                  Manager có toàn quyền ghi đè điểm số của AI và bổ sung nhận xét thực tế để đưa vào báo cáo KPI chính thức của nhân viên.
                </p>
              </div>

              {/* Score adjustment */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Điểm số sau hiệu chỉnh của Manager (0 - 100):
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={managerScore}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="w-16 text-center text-xl font-black text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl py-1">
                    {managerScore}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Điểm AI gốc: {session.overallScore}</span>
                  <span>Chênh lệch: {managerScore - session.overallScore > 0 ? `+${managerScore - session.overallScore}` : managerScore - session.overallScore} điểm</span>
                </div>
              </div>

              {/* Manager Feedback Note */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Ghi chú & Lời khuyên của Quản lý:
                </label>
                <textarea
                  rows={5}
                  value={managerNote}
                  onChange={(e) => setManagerNote(e.target.value)}
                  placeholder="Nhập nhận xét chi tiết cho nhân viên..."
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                ></textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? "Đang lưu..." : "Phê duyệt & Lưu đánh giá"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
