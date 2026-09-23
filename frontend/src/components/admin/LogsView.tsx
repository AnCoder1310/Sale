"use client";

import React, { useState } from "react";
import { Activity, Search, ShieldCheck } from "lucide-react";
import { mockAILogs, mockAuditLogs } from "@/data/mockAdmin";

export const LogsView: React.FC = () => {
  const [activeLogTab, setActiveLogTab] = useState<"ai" | "audit">("ai");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Nhật Ký Hệ Thống (System Logs)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giám sát độ trễ, số lượng token tiêu thụ và nhật ký bảo mật Audit Trail
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveLogTab("ai")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeLogTab === "ai"
                ? "bg-purple-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            AI Request Logs
          </button>
          <button
            onClick={() => setActiveLogTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeLogTab === "audit"
                ? "bg-purple-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Security Audit Logs
          </button>
        </div>
      </div>

      {activeLogTab === "ai" ? (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Request ID</th>
                <th className="px-6 py-3.5">Thời gian</th>
                <th className="px-6 py-3.5">Người dùng</th>
                <th className="px-6 py-3.5">Agent</th>
                <th className="px-6 py-3.5">Mô hình</th>
                <th className="px-6 py-3.5">Tokens (Prompt / Out)</th>
                <th className="px-6 py-3.5">Độ trễ</th>
                <th className="px-6 py-3.5">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockAILogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition font-mono text-[11px]">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{l.id}</td>
                  <td className="px-6 py-3.5 text-slate-500">{l.timestamp}</td>
                  <td className="px-6 py-3.5 font-sans font-medium text-slate-800">{l.userName}</td>
                  <td className="px-6 py-3.5 font-sans font-bold text-purple-700">{l.agent}</td>
                  <td className="px-6 py-3.5 text-slate-600">{l.model}</td>
                  <td className="px-6 py-3.5">{l.promptTokens} / {l.completionTokens}</td>
                  <td className="px-6 py-3.5 font-bold">{l.latencyMs}ms</td>
                  <td className="px-6 py-3.5">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Log ID</th>
                <th className="px-6 py-3.5">Thời gian</th>
                <th className="px-6 py-3.5">Tài khoản</th>
                <th className="px-6 py-3.5">Hành động</th>
                <th className="px-6 py-3.5">Tài nguyên tác động</th>
                <th className="px-6 py-3.5">IP Address</th>
                <th className="px-6 py-3.5">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockAuditLogs.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition font-mono text-[11px]">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{a.id}</td>
                  <td className="px-6 py-3.5 text-slate-500">{a.timestamp}</td>
                  <td className="px-6 py-3.5 font-sans font-medium text-slate-800">{a.user}</td>
                  <td className="px-6 py-3.5 font-bold text-indigo-700">{a.action}</td>
                  <td className="px-6 py-3.5 font-sans text-slate-600">{a.resource}</td>
                  <td className="px-6 py-3.5 text-slate-500">{a.ipAddress}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
