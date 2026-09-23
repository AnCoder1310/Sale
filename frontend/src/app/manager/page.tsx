"use client";

import React, { useState } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppTopNav } from "@/components/layout/AppTopNav";

// Manager Views
import { ManagerDashboardView } from "@/components/manager/ManagerDashboardView";
import { TeamView } from "@/components/manager/TeamView";
import { AssignmentsView } from "@/components/manager/AssignmentsView";
import { SessionResultView } from "@/components/advisor/SessionResultView";
import { mockSampleSessionResult } from "@/data/mockPractice";

export default function ManagerWorkspacePage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ManagerDashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case "team":
        return (
          <TeamView
            onAssign={() => {
              setActiveTab("assignments");
            }}
          />
        );
      case "assignments":
        return <AssignmentsView />;
      case "performance":
      case "reports":
        return (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Team Training Performance & HITL Reports</h2>
              <p className="text-xs text-slate-500 mt-1">Audit trail of all 5-Rubric evaluation sessions verified by Training Director</p>
            </div>
            <SessionResultView
              result={mockSampleSessionResult}
              onBackToHome={() => setActiveTab("dashboard")}
              onRetry={() => {}}
            />
          </div>
        );
      case "profile":
      case "account":
      case "settings":
        return (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-2xl mx-auto text-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Training Management & HITL Settings</h2>
            <p className="text-slate-500">Department: Khối Đào Tạo & Phát Triển Năng Lực Bán Hàng</p>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <p className="font-bold">HITL Governance Policy:</p>
              <p>Every AI-evaluated session can be overridden with official manager scores and qualitative feedback before being logged into quarterly KPI records.</p>
            </div>
          </div>
        );
      default:
        return <ManagerDashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <RouteGuard allowedRoles={["manager", "admin"]}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <AppTopNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </RouteGuard>
  );
}
