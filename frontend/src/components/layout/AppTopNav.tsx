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
  Sparkles,
  Crown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { VinFastLogo } from "@/components/ui/VinFastLogo";
import { NotificationDropdown } from "./NotificationDropdown";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface AppTopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppTopNav: React.FC<AppTopNavProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, role, openSignoutModal } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || "";

  // Determine active workspace dynamically based on current page URL pathname
  const activeWorkspace: UserRole = pathname.startsWith("/manager")
    ? "manager"
    : pathname.startsWith("/admin")
    ? "admin"
    : "advisor";

  // Navigation items matching the active workspace page
  const getNavItems = () => {
    switch (activeWorkspace) {
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
    return {
      bg: "bg-white/10 text-white border-white/20",
      dot: "bg-white",
      activeTab: "bg-white text-slate-900 shadow-sm font-bold",
      label: userRole === "manager" ? "Manager" : userRole === "admin" ? "Admin" : "Advisor"
    };
  };

  const badgeConfig = getRoleBadgeStyle(activeWorkspace);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111111] border-b border-slate-800 text-slate-200 shadow-xl select-none">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Brand Logo & Role Badge */}
          <div 
            onClick={() => onTabChange(activeWorkspace === "advisor" ? "home" : "dashboard")}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer flex-shrink-0"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#111111] border border-[#262626] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <VinFastLogo size={22} variant="silver" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight whitespace-nowrap">
                  AI Sales Coach
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap hidden xs:inline-block ${badgeConfig.bg}`}>
                  {badgeConfig.label}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 whitespace-nowrap hidden md:block">
                {currentUser?.showroom || "VinFast Showroom"}
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
            {/* Dedicated Workspace Switcher (EXCLUSIVELY FOR ADMIN SUPERUSER) */}
            {role === "admin" && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-400 shadow-inner">
                <span className="text-[10px] font-extrabold text-slate-300 uppercase px-2 hidden sm:inline flex items-center gap-1">
                  <Crown className="h-3 w-3 text-slate-400" />
                  <span>Workspace:</span>
                </span>
                <button
                  onClick={() => router.push("/admin")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    pathname.startsWith("/admin")
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title="Chuyển đến trang Quản trị Admin"
                >
                  <span>⚙️</span>
                  <span className="hidden sm:inline">Admin</span>
                </button>
                <button
                  onClick={() => router.push("/manager")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    pathname.startsWith("/manager")
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title="Chuyển đến trang Quản lý đào tạo (Manager)"
                >
                  <span>🛠️</span>
                  <span className="hidden sm:inline">Manager</span>
                </button>
                <button
                  onClick={() => router.push("/advisor")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    pathname.startsWith("/advisor")
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title="Chuyển đến trang Tư vấn viên (Advisor)"
                >
                  <span>👨‍💼</span>
                  <span className="hidden sm:inline">Advisor</span>
                </button>
              </div>
            )}

            {/* Realtime Notification Bell */}
            <NotificationDropdown onNavigateTab={(tab) => onTabChange(tab)} />

            {/* Direct 1-Tap Logout */}
            <button
              type="button"
              onClick={() => openSignoutModal()}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Đăng xuất</span>
            </button>

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
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-slate-400"
                  />
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[#111111] ${badgeConfig.dot}`}></span>
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight whitespace-nowrap">
                  <p className="font-bold text-white whitespace-nowrap">{currentUser?.name || "User"}</p>
                  <span className={`inline-block px-1.5 py-0.2 text-[10px] font-semibold rounded ${
                    "text-slate-300 bg-white/10"
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
                          "bg-slate-100 text-slate-900 font-semibold"
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



                    {/* Admin Superuser Workspace Navigation (ONLY VISIBLE FOR ADMIN) */}
                    {role === "admin" && (
                      <div className="py-1.5 border-t border-slate-100 bg-slate-50">
                        <p className="px-4 py-1 text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <Crown className="h-3 w-3 text-slate-700" />
                          <span>Admin Workspace Access:</span>
                        </p>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            router.push("/admin");
                          }}
                          className={`w-full text-left px-4 py-1.5 font-bold flex items-center justify-between text-xs transition ${
                            pathname.startsWith("/admin") ? "text-slate-700 bg-slate-100/80 font-black" : "text-slate-700 hover:bg-slate-100/50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>⚙️</span>
                            <span>Admin Console (/admin)</span>
                          </span>
                          {pathname.startsWith("/admin") && <span className="text-[10px] text-slate-900 font-bold">Active</span>}
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            router.push("/manager");
                          }}
                          className={`w-full text-left px-4 py-1.5 font-bold flex items-center justify-between text-xs transition ${
                            pathname.startsWith("/manager") ? "text-slate-900 bg-slate-100 font-bold" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>🛠️</span>
                            <span>Manager Portal (/manager)</span>
                          </span>
                          {pathname.startsWith("/manager") && <span className="text-[10px] text-slate-900 font-bold">Active</span>}
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            router.push("/advisor");
                          }}
                          className={`w-full text-left px-4 py-1.5 font-bold flex items-center justify-between text-xs transition ${
                            pathname.startsWith("/advisor") ? "text-slate-900 bg-slate-100 font-bold" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>👨‍💼</span>
                            <span>Advisor Workspace (/advisor)</span>
                          </span>
                          {pathname.startsWith("/advisor") && <span className="text-[10px] text-slate-900 font-bold">Active</span>}
                        </button>
                      </div>
                    )}

                    {/* Divider & Sign Out Button per spec #3 & #5 */}
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          openSignoutModal();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-2.5"
                      >
                        <LogOut className="h-4 w-4 text-slate-700" />
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
        <div className="flex xl:hidden items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-800/60 text-xs no-scrollbar overscroll-x-contain touch-pan-x">
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
