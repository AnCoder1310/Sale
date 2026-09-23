"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import { 
  Home, 
  Bot, 
  Theater, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  User, 
  CreditCard, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Users,
  CheckSquare,
  BarChart3,
  FileText,
  ShieldCheck,
  Server,
  Cpu,
  FileCode,
  Activity,
  FileLock,
  Zap,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { VinFastLogo } from "@/components/ui/VinFastLogo";
import { NotificationDropdown } from "./NotificationDropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppTopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppTopNav: React.FC<AppTopNavProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, role, openSignoutModal, loginAsDemo } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();

  // Role-specific navigation items per requirement #5
  const getNavItems = () => {
    switch (role) {
      case "manager":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "team", label: "Team", icon: Users },
          { id: "assignments", label: "Assignments", icon: CheckSquare },
          { id: "performance", label: "Performance", icon: BarChart3 },
          { id: "reports", label: "Reports", icon: FileText },
        ];
      case "admin":
        return [
          { id: "dashboard", label: "Dashboard", icon: Server },
          { id: "users", label: "Users", icon: Users },
          { id: "knowledge", label: "Knowledge", icon: BookOpen },
          { id: "ai_config", label: "AI Configuration", icon: Cpu },
          { id: "scenarios", label: "Scenarios", icon: FileCode },
          { id: "ai_logs", label: "AI Logs", icon: Activity },
          { id: "audit_logs", label: "Audit Logs", icon: FileLock },
          { id: "settings", label: "Settings", icon: Settings },
        ];
      case "advisor":
      default:
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "copilot", label: "AI Copilot", icon: Bot },
          { id: "roleplay", label: "Role-play", icon: Theater },
          { id: "knowledge", label: "Knowledge", icon: BookOpen },
          { id: "charging_stations", label: "Charging Stations", icon: Zap },
          { id: "progress", label: "Progress", icon: TrendingUp },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadgeStyle = (userRole?: UserRole | null) => {
    switch (userRole) {
      case "manager":
        return {
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
          dot: "bg-emerald-500",
          activeTab: "bg-emerald-600 text-white shadow-emerald-600/30",
          label: "Manager"
        };
      case "admin":
        return {
          bg: "bg-purple-500/20 text-purple-300 border-purple-400/40",
          dot: "bg-purple-500",
          activeTab: "bg-purple-600 text-white shadow-purple-600/30",
          label: "Admin"
        };
      case "advisor":
      default:
        return {
          bg: "bg-blue-500/20 text-blue-300 border-blue-400/40",
          dot: "bg-blue-500",
          activeTab: "bg-blue-600 text-white shadow-blue-600/30",
          label: "Advisor"
        };
    }
  };

  const badgeConfig = getRoleBadgeStyle(role);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1220] border-b border-slate-800 text-slate-200 shadow-xl select-none">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Brand Logo & Role Badge */}
          <div 
            onClick={() => onTabChange(role === "advisor" ? "home" : "dashboard")}
            className="flex items-center gap-3 cursor-pointer flex-shrink-0"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 border border-blue-400/30 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 flex-shrink-0">
              <VinFastLogo size={24} variant="silver" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight whitespace-nowrap">
                  AI Sales Coach
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${badgeConfig.bg}`}>
                  {badgeConfig.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 whitespace-nowrap">
                {currentUser?.showroom || "VinFast Vinh, Nghệ An"}
              </p>
            </div>
          </div>

          {/* Center: Horizontal Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1.5 flex-shrink-0 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (item.id === "roleplay" && (activeTab === "practice_room" || activeTab === "session_result"));

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative inline-flex items-center gap-2 h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? `${badgeConfig.activeTab} shadow-lg ring-1 ring-white/20`
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Realtime Notification Bell */}
            <NotificationDropdown onNavigateTab={(tab) => onTabChange(tab)} />

            {/* User Profile Dropdown Button */}
            <div className="relative pl-2 border-l border-slate-800 flex-shrink-0">
              <div
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-slate-800/60 transition select-none"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                    alt={currentUser?.name || "Avatar"}
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-500/40"
                  />
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[#0B1220] ${badgeConfig.dot}`}></span>
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight whitespace-nowrap">
                  <p className="font-bold text-white whitespace-nowrap">{currentUser?.name || "User"}</p>
                  <span className={`inline-block px-1.5 py-0.2 text-[10px] font-semibold rounded ${
                    role === "manager" ? "text-emerald-400 bg-emerald-950/60" : role === "admin" ? "text-purple-400 bg-purple-950/60" : "text-blue-400 bg-blue-950/60"
                  }`}>
                    {badgeConfig.label}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1 hidden sm:block flex-shrink-0" />
              </div>

              {/* Avatar Dropdown Menu per requirement #5 */}
              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 py-1.5 z-50 text-xs animate-fade-in">
                    {/* User info card */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-xs">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          role === "manager" ? "bg-emerald-100 text-emerald-800" : role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {badgeConfig.label}
                        </span>
                        <span className="text-[10px] text-slate-400">• {currentUser?.showroom?.split(",")[0]}</span>
                      </div>
                    </div>

                    {/* Menu items per spec #5 */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onTabChange("profile");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 font-medium"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onTabChange("account");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 font-medium"
                      >
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span>My Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onTabChange("settings");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 font-medium"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span>Settings</span>
                      </button>
                    </div>

                    {/* Switch role shortcut for quick testing */}
                    <div className="py-1 border-t border-slate-100 bg-slate-50/70">
                      <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Quick Workspace Switch:
                      </p>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          loginAsDemo("advisor");
                          router.push("/advisor");
                        }}
                        className="w-full text-left px-4 py-1.5 hover:bg-blue-50 text-blue-700 font-semibold flex items-center gap-2 text-xs"
                      >
                        <span>👨‍💼</span>
                        <span>Advisor Workspace</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          loginAsDemo("manager");
                          router.push("/manager");
                        }}
                        className="w-full text-left px-4 py-1.5 hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-2 text-xs"
                      >
                        <span>🛠️</span>
                        <span>Manager Workspace</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          loginAsDemo("admin");
                          router.push("/admin");
                        }}
                        className="w-full text-left px-4 py-1.5 hover:bg-purple-50 text-purple-700 font-semibold flex items-center gap-2 text-xs"
                      >
                        <span>⚙️</span>
                        <span>Admin Workspace</span>
                      </button>
                    </div>

                    {/* Divider & Sign Out Button per spec #3 & #5 */}
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          openSignoutModal();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-bold flex items-center gap-2.5"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span>🚪 Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Menu */}
        <div className="flex xl:hidden items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-800/60 text-xs no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold flex-shrink-0 transition ${
                  isActive
                    ? `${badgeConfig.activeTab}`
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
