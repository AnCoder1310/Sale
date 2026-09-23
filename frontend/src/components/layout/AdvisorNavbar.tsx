"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import { 
  Home, 
  Bot, 
  Theater, 
  BookOpen, 
  TrendingUp, 
  History, 
  Settings, 
  Bell, 
  MapPin, 
  LogOut, 
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { VinFastLogo } from "@/components/ui/VinFastLogo";
import { NotificationDropdown } from "./NotificationDropdown";

interface AdvisorNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdvisorNavbar: React.FC<AdvisorNavbarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { currentUser, logout, loginAsDemo } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

 const navItems = [
  { id: "home", label: "Overview", icon: Home, badge: null },
  { id: "copilot", label: "AI Copilot", icon: Bot, badge: "RAG" },
  { id: "roleplay", label: "Role-play", icon: Theater, badge: "AI" },
  { id: "knowledge", label: "Products", icon: BookOpen, badge: null },
  { id: "progress", label: "Performance", icon: TrendingUp, badge: "Top 5%" },
  { id: "history", label: "History", icon: History, badge: null },
];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1220] border-b border-slate-800 text-slate-200 shadow-lg select-none">
      {/* Top micro status bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1.5 font-extrabold text-white tracking-wider">
            <VinFastLogo size={14} variant="silver" />
            VINFAST
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="h-3 w-3 text-blue-400" />
            {currentUser?.showroom || "VinFast Vinh, Nghệ An"}
          </span>
          <span className="hidden md:inline-block text-[11px] text-blue-400 font-medium bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
            {currentUser?.department || "Khối Kinh Doanh Ô Tô"}
          </span>
        </div>

        {/* Right user status */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="hidden sm:inline text-[11px]">Trực tuyến</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-300">
            Tư vấn viên: <strong className="text-white font-semibold">{currentUser?.name}</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange("home")}
            className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-700 to-slate-900 border border-blue-500/30 flex items-center justify-center text-white shadow-md shadow-blue-600/20 flex-shrink-0">
              <VinFastLogo size={24} variant="silver" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight whitespace-nowrap">VINFAST Sales Coach</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30 whitespace-nowrap">
                  Advisor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 whitespace-nowrap">Hệ thống Đào tạo Tư vấn viên Ô tô VinFast</p>
            </div>
          </div>

          {/* Horizontal Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 flex-shrink-0 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (item.id === "roleplay" && (activeTab === "practice_room" || activeTab === "session_result"));
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative inline-flex items-center gap-2 h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap leading-none ${
                        isActive
                          ? "bg-blue-800 text-blue-100"
                          : "bg-blue-950/80 text-blue-300 border border-blue-800/50"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Profile & Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onTabChange("settings")}
              title="Cài đặt"
              className={`p-2 rounded-xl transition flex-shrink-0 ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>

            <NotificationDropdown
              onNavigateTab={(tab, data) => onTabChange(tab)}
            />

            {/* Profile Dropdown */}
            <div className="relative pl-2 border-l border-slate-800 flex-shrink-0">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-slate-800/60 transition select-none"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                    alt={currentUser?.name || "Avatar"}
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-500/40"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B1220]"></span>
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight whitespace-nowrap">
                  <p className="font-bold text-white whitespace-nowrap">{currentUser?.name || "Võ Trường An"}</p>
                  <p className="text-[11px] text-slate-400 whitespace-nowrap">{currentUser?.title || "Senior Sales Consultant"}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1 hidden sm:block flex-shrink-0" />
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Tư vấn viên bán xe (Advisor)</p>
                  </div>
                  <div className="py-1 border-b border-slate-100 bg-slate-50/50">
                    <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Chuyển phân hệ làm việc:
                    </p>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        loginAsDemo("manager");
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-2 text-xs"
                    >
                      <span>🛠️</span>
                      <span>Trang Quản lý (Manager)</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        loginAsDemo("admin");
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-purple-50 text-purple-800 font-semibold flex items-center gap-2 text-xs"
                    >
                      <span>⚙️</span>
                      <span>Trang Quản trị (Admin)</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onTabChange("settings");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-500" />
                    <span>Cài đặt cá nhân</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2 border-t border-slate-100 whitespace-nowrap"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Đăng xuất (Về màn hình Login)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Menu */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-800/60 text-xs no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === "roleplay" && (activeTab === "practice_room" || activeTab === "session_result"));
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold flex-shrink-0 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
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
