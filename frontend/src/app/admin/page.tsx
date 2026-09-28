"use client";

import React, { useState } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppTopNav } from "@/components/layout/AppTopNav";

// Admin Views
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { UserManagementView } from "@/components/admin/UserManagementView";
import { AIConfigView } from "@/components/admin/AIConfigView";
import { LogsView } from "@/components/admin/LogsView";
import { KnowledgeView } from "@/components/advisor/KnowledgeView";
import { RoleplayView } from "@/components/advisor/RoleplayView";

export default function AdminWorkspacePage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboardView onNavigate={(tab) => {
          if (tab === "admin_users") setActiveTab("users");
          else if (tab === "admin_ai_config") setActiveTab("ai_config");
          else if (tab === "admin_ai_logs") setActiveTab("ai_logs");
          else setActiveTab(tab);
        }} />;
      case "users":
        return <UserManagementView />;
      case "knowledge":
        return <KnowledgeView />;
      case "ai_config":
        return <AIConfigView />;
      case "scenarios":
        return (
          <RoleplayView
            onStartSession={() => {}}
            onViewHistory={() => {}}
          />
        );
      case "ai_logs":
      case "audit_logs":
        return <LogsView />;
      case "profile":
      case "account":
      case "settings":
        return (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-2xl mx-auto text-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">System Architecture & Database Configuration</h2>
            <p className="text-slate-500">Core connections for PostgreSQL, Qdrant Vector Cluster, and FastAPI Microservices.</p>
            <div className="space-y-2 font-mono text-[11px] bg-slate-900 text-slate-200 p-4 rounded-2xl">
              <p>DATABASE_URL=postgresql://vinfast_admin:***@10.0.1.20:5432/vfo20_sales</p>
              <p>VECTOR_STORE=qdrant://cluster-01.vfo20.internal:6333</p>
              <p>REDIS_CHECKPOINT_URL=redis://:***@10.0.1.25:6379/0</p>
              <p>LLM_GATEWAY_ENDPOINT=https://openrouter.ai/api/v1</p>
            </div>
          </div>
        );
      default:
        return <AdminDashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
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
