"use client";

import React from "react";
import { 
  Home, 
  Bot, 
  Theater, 
  BookOpen, 
  TrendingUp, 
  History, 
  Settings, 
  Sparkles,
  Zap,
  Car
} from "lucide-react";

interface AdvisorSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdvisorSidebar: React.FC<AdvisorSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home, badge: null },
    { id: "copilot", label: "AI Copilot", icon: Bot, badge: "RAG" },
    { id: "roleplay", label: "Role-play Training", icon: Theater, badge: "AI Coach" },
    { id: "knowledge", label: "Knowledge", icon: BookOpen, badge: null },
    { id: "progress", label: "My Progress", icon: TrendingUp, badge: "Top 5%" },
    { id: "history", label: "History", icon: History, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0B1220] text-slate-300 flex flex-col justify-between border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-base">AI Sales Coach</span>
            </div>
            <p className="text-[11px] text-blue-400 font-medium">VinFast Automotive P-043</p>
          </div>
        </div>

        {/* User Role Tag */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-blue-950/50 border border-blue-800/40">
            <span className="text-[11px] font-semibold tracking-wider text-blue-300 uppercase">
              Advisor Portal
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="px-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-blue-800 text-blue-100"
                        : "bg-slate-800 text-blue-300 border border-blue-900/40"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Helper Banner */}
      <div className="p-4 mx-3 mb-3 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-900/30">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Chính sách Pin 2026</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Đã cập nhật quy chế bảo hành dung lượng pin SOH &lt; 70%.
            </p>
          </div>
        </div>
      </div>

      {/* Advisor Profile Footprint */}
      <div className="p-4 border-t border-slate-800 bg-[#080d17]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Avatar"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500/40"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080d17]"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Võ Trường An</p>
            <p className="text-[11px] text-slate-400 truncate">Senior Sales Consultant</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
