"use client";

import React from "react";
import { 
  Server, 
  Users, 
  ShieldCheck, 
  Database, 
  Car, 
  FileCode, 
  Cpu, 
  Activity, 
  FileLock, 
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { VinFastLogo } from "@/components/ui/VinFastLogo";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { id: "admin_dashboard", label: "Dashboard", icon: Server, badge: "99.98%" },
    { id: "admin_users", label: "Users", icon: Users, badge: "128" },
    { id: "admin_roles", label: "Roles & Permissions", icon: ShieldCheck, badge: null },
    { id: "admin_knowledge", label: "Knowledge Base", icon: Database, badge: "RAG" },
    { id: "admin_vehicles", label: "Vehicles", icon: Car, badge: "6 Models" },
    { id: "admin_scenarios", label: "Role-play Scenarios", icon: FileCode, badge: "12" },
    { id: "admin_ai_config", label: "AI Configuration", icon: Cpu, badge: "GPT-4o" },
    { id: "admin_ai_logs", label: "AI Logs", icon: Activity, badge: "Live" },
    { id: "admin_audit_logs", label: "Audit Logs", icon: FileLock, badge: null },
    { id: "admin_settings", label: "Settings", icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0B1220] text-slate-300 flex flex-col justify-between border-r border-slate-800 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-slate-900 border border-purple-400/30 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <VinFastLogo size={20} variant="silver" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-base">VINFAST Admin</span>
            </div>
            <p className="text-[11px] text-purple-400 font-medium">Architecture Console</p>
          </div>
        </div>

        {/* User Role Tag */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-purple-950/50 border border-purple-800/40">
            <span className="text-[11px] font-semibold tracking-wider text-purple-300 uppercase">
              Admin Console
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
          </div>
        </div>

        {/* Menu Items */}
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
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
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
                        ? "bg-purple-800 text-purple-100"
                        : "bg-slate-800 text-purple-300 border border-purple-900/40"
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

      {/* Admin Profile Footer & Logout */}
      <div className="p-4 border-t border-slate-800 bg-[#080d17] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="h-10 w-10 rounded-xl bg-purple-700 text-white font-bold flex items-center justify-center text-sm shadow ring-2 ring-purple-500/40">
                AD
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080d17]"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name || "System Admin"}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser?.title || "VFO2O-20 Architect"}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Đăng xuất"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
