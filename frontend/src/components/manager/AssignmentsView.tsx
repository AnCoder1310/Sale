"use client";

import React, { useState } from "react";
import { CheckSquare, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { mockManagerAssignments, mockManagerAdvisors } from "@/data/mockManager";
import { mockScenarios } from "@/data/mockScenarios";
import { Assignment } from "@/types";

export const AssignmentsView: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(mockManagerAssignments);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(mockManagerAdvisors[0].name);
  const [selectedScenario, setSelectedScenario] = useState(mockScenarios[0].title);
  const [dueDate, setDueDate] = useState("2026-09-30");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsg: Assignment = {
      id: "asg-" + Date.now(),
      title: "Luyện tập theo chỉ định Manager",
      scenarioTitle: selectedScenario,
      targetVehicle: "VinFast VF 8 Plus",
      assignedToAdvisor: selectedAdvisor,
      assignedByManager: "Lê Văn Hoàng",
      dueDate: dueDate,
      status: "pending"
    };
    setAssignments([newAsg, ...assignments]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Bài Tập & Phân Công (Assignments)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giao bài luyện tập theo từng mẫu xe và tình huống cụ thể cho nhân viên
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Assignment mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800">
                  {asg.targetVehicle}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  asg.status === "completed"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-amber-50 text-amber-800"
                }`}>
                  {asg.status === "completed" ? "Đã nộp bài" : "Đang thực hiện"}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                {asg.scenarioTitle}
              </h3>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                <p>Nhân viên: <strong className="text-slate-900">{asg.assignedToAdvisor}</strong></p>
                <p>Hạn chót: <strong className="text-slate-900">{asg.dueDate}</strong></p>
                {asg.score && (
                  <p>Điểm đạt: <strong className="text-emerald-700">{asg.score}/100</strong></p>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              Giao bởi {asg.assignedByManager}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Giao Bài Luyện Tập Cho Nhân Viên</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn nhân viên:</label>
                <select
                  value={selectedAdvisor}
                  onChange={(e) => setSelectedAdvisor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  {mockManagerAdvisors.map((a) => (
                    <option key={a.id} value={a.name}>{a.name} ({a.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn tình huống luyện tập:</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  {mockScenarios.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hạn chót hoàn thành:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow"
                >
                  Giao bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
