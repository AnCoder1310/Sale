"use client";

import React, { useState } from "react";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Clock, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { AppNotification } from "@/types";

interface NotificationDropdownProps {
  onNavigateTab?: (tab: string, extraData?: any) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onNavigateTab,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, triggerMockNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const displayedList = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    return true;
  });

  const handleItemClick = (n: AppNotification) => {
    markAsRead(n.id);
    setIsOpen(false);
    if (n.targetTab && onNavigateTab) {
      onNavigateTab(n.targetTab, n.targetData);
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Thông báo hệ thống"
        className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition flex-shrink-0"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-[#0B1220] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-slate-900 border border-slate-700/80 text-white shadow-2xl z-50 overflow-hidden animate-fade-in text-xs select-none">
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Thông báo</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                    {unreadCount} mới
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Đã đọc tất cả</span>
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-900 border-b border-slate-800/80 text-[11px]">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  activeFilter === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter("unread")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  activeFilter === "unread" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>

              <button
                onClick={() => triggerMockNotification("review")}
                className="ml-auto text-[10px] px-2 py-1 rounded bg-blue-500/10 text-cyan-300 hover:bg-blue-500/20 transition flex items-center gap-1 border border-blue-400/20"
                title="Tạo giả lập thông báo mới để kiểm tra âm thanh & toast"
              >
                <Sparkles className="h-3 w-3" />
                <span>Test Realtime</span>
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
              {displayedList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Không có thông báo nào
                </div>
              ) : (
                displayedList.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`p-3 rounded-2xl cursor-pointer transition flex items-start gap-3 ${
                      !n.read
                        ? "bg-blue-950/40 hover:bg-blue-950/60 border border-blue-500/30"
                        : "hover:bg-slate-800/50 text-slate-300"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      n.type === "review_approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : n.type === "practice_completed"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {n.type === "review_approved" ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : n.type === "practice_completed" ? (
                        <Zap className="h-4 w-4" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold text-xs truncate ${!n.read ? "text-white" : "text-slate-300"}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 flex-shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>

                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
