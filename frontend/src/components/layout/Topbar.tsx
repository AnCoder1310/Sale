"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import { 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationDropdown } from "./NotificationDropdown";

interface TopbarProps {
  currentRole: UserRole;
  currentTab: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRole,
  currentTab
}) => {
  const { currentUser, logout, loginAsDemo } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur transition-colors duration-200">
      {/* Left: Breadcrumbs & Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            VFO2O-20
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="capitalize text-slate-700 font-medium">
            {currentTab.replace("manager_", "").replace("admin_", "").replace("_", " ")}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 ml-4 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>{currentUser?.showroom || "VinFast Vinh, Nghệ An"}</span>
        </div>
      </div>

      {/* Right: User identity & Actions */}
      <div className="flex items-center gap-4">
        {/* Role Badge Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
            currentRole === "manager"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-purple-50 text-purple-800 border border-purple-200"
          }`}>
            {currentRole === "manager" ? "🛠️ Quản lý đào tạo (Manager)" : "⚙️ Quản trị hệ thống (Admin)"}
          </span>
        </div>

        {/* Notifications & Info */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 relative">
          <NotificationDropdown />
          
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 pl-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition select-none"
          >
            <div className={`h-8 w-8 rounded-full font-semibold flex items-center justify-center text-xs shadow-sm text-white ${
              currentRole === "manager" ? "bg-emerald-600" : "bg-purple-600"
            }`}>
              {currentUser?.name?.split(" ").slice(-1)[0]?.substring(0, 2).toUpperCase() || "LH"}
            </div>
            <div className="hidden sm:flex flex-col text-left text-xs">
              <span className="font-semibold text-slate-800 leading-tight">
                {currentUser?.name || "Lê Văn Hoàng"}
              </span>
              <span className="text-[11px] text-slate-500">
                {currentUser?.title || "Training Director"}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </div>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
              </div>
              <div className="py-1 border-b border-slate-100 bg-slate-50/50">
                <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Chuyển phân hệ:
                </p>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    loginAsDemo("advisor");
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-blue-50 text-blue-800 font-semibold flex items-center gap-2 text-xs"
                >
                  <span>👨‍💼</span>
                  <span>Trang Tư vấn viên (Advisor)</span>
                </button>
                {currentRole !== "manager" && (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      loginAsDemo("manager");
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-2 text-xs"
                  >
                    <span>🛠️</span>
                    <span>Trang Quản lý (Manager)</span>
                  </button>
                )}
                {currentRole !== "admin" && (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      loginAsDemo("admin");
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-purple-50 text-purple-800 font-semibold flex items-center gap-2 text-xs"
                  >
                    <span>⚙️</span>
                    <span>Trang Quản trị (Admin)</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Đăng xuất (Về màn hình Login)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
