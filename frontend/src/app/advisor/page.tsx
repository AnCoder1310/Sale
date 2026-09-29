"use client";

import React, { useState } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppTopNav } from "@/components/layout/AppTopNav";
import { RoleplayScenario, PracticeSessionResult } from "@/types";

// Advisor Views
import { AdvisorHomeView } from "@/components/advisor/AdvisorHomeView";
import { CopilotView } from "@/components/advisor/CopilotView";
import { RoleplayView } from "@/components/advisor/RoleplayView";
import { PracticeRoomView } from "@/components/advisor/PracticeRoomView";
import { SessionResultView } from "@/components/advisor/SessionResultView";
import { KnowledgeView } from "@/components/advisor/KnowledgeView";
import { ChargingStationsView } from "@/components/advisor/ChargingStationsView";
import { ProgressView } from "@/components/advisor/ProgressView";
import { HistoryView } from "@/components/advisor/HistoryView";

import { mockScenarios } from "@/data/mockScenarios";
import { mockSampleSessionResult } from "@/data/mockPractice";

export default function AdvisorWorkspacePage() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentScenario, setCurrentScenario] = useState<RoleplayScenario>(mockScenarios[0]);
  const [currentResult, setCurrentResult] = useState<PracticeSessionResult>(mockSampleSessionResult);

  const handleStartPractice = (scenario: RoleplayScenario) => {
    setCurrentScenario(scenario);
    setActiveTab("practice_room");
  };

  const handleFinishPractice = (result: PracticeSessionResult) => {
    setCurrentResult(result);
    setActiveTab("session_result");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <AdvisorHomeView 
            onNavigate={(tab, data) => {
              if (tab === "practice_room" && data?.scenario) {
                handleStartPractice(data.scenario);
              } else if (tab === "session_result" && data?.result) {
                setCurrentResult(data.result);
                setActiveTab("session_result");
              } else {
                setActiveTab(tab);
              }
            }} 
          />
        );
      case "copilot":
        return <CopilotView onNavigate={(tab) => setActiveTab(tab)} />;
      case "roleplay":
        return (
          <RoleplayView 
            onStartSession={handleStartPractice} 
            onViewHistory={() => setActiveTab("history")} 
          />
        );
      case "practice_room":
        return (
          <PracticeRoomView
            scenario={currentScenario}
            onFinishSession={handleFinishPractice}
            onExit={() => setActiveTab("roleplay")}
          />
        );
      case "session_result":
        return (
          <SessionResultView
            result={currentResult}
            onBackToHome={() => setActiveTab("home")}
            onRetry={() => handleStartPractice(currentScenario)}
          />
        );
      case "knowledge":
        return <KnowledgeView />;
      case "charging_stations":
      case "charging_map":
        return <ChargingStationsView />;
      case "progress":
        return <ProgressView />;
      case "history":
        return (
          <HistoryView
            onSelectResult={(res) => {
              setCurrentResult(res);
              setActiveTab("session_result");
            }}
          />
        );
      case "profile":
      case "account":
      case "settings":
        return (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-2xl mx-auto text-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Advisor Profile & Workspace Settings</h2>
            <p className="text-slate-500">Manage notifications, practice preferences, and vehicle training targets.</p>
            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded text-slate-900 accent-slate-900" />
                <span>Receive real-time alerts when Training Manager approves practice sessions</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded text-slate-900 accent-slate-900" />
                <span>Get daily AI Copilot recommended vehicle policy talking points</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded text-slate-900 accent-slate-900" />
                <span>Enable speech-to-text microphone support during role-play</span>
              </label>
            </div>
          </div>
        );
      default:
        return <AdvisorHomeView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <RouteGuard allowedRoles={["advisor", "admin"]}>
      <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
        <AppTopNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </RouteGuard>
  );
}
