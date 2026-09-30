"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { AppNotification } from "@/types";
import { notificationApi } from "@/api/notification";
import { useAuth } from "@/context/AuthContext";
import { Bell, Check, X, ExternalLink, ShieldCheck, Zap, BookOpen, AlertCircle } from "lucide-react";

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  activeToast: AppNotification | null;
  dismissToast: () => void;
  triggerMockNotification: (type?: "review" | "assignment" | "policy") => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Subtle Web Audio Chime for real-time notification
function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio might be blocked by autoplay policy
  }
}

const getInitialNotificationsForRole = (userRole?: string): AppNotification[] => {
  if (userRole === "admin") {
    return [
      {
        id: "notif-adm-01",
        userId: "adm-001",
        userRole: "admin",
        title: "Tài khoản khách mới chờ phê duyệt",
        message: "Nguyễn Văn Khách Mới (khach.moi@vinfast.vn) vừa đăng ký tài khoản và đang chờ Admin xét duyệt phân quyền vai trò.",
        timestamp: "11:45 hôm nay",
        read: false,
        type: "user_approval_needed",
        targetTab: "users"
      },
      {
        id: "notif-adm-02",
        userId: "adm-001",
        userRole: "admin",
        title: "Kiểm toán an toàn hệ thống AI",
        message: "Cơ sở dữ liệu Vector Store và phân hệ xác thực phân quyền RBAC đang hoạt động ổn định 100%.",
        timestamp: "09:00 hôm nay",
        read: false,
        type: "system_audit",
        targetTab: "audit_logs"
      }
    ];
  }
  if (userRole === "manager") {
    return [
      {
        id: "notif-mgr-01",
        userId: "mgr-001",
        userRole: "manager",
        title: "Bài luyện roleplay cần phê duyệt",
        message: "Tư vấn viên Võ Trường An vừa hoàn thành bài luyện tập Tư vấn VF 8 Plus với điểm sơ bộ 88/100.",
        timestamp: "10:15 hôm nay",
        read: false,
        type: "review_needed",
        targetTab: "assignments"
      },
      {
        id: "notif-mgr-02",
        userId: "mgr-001",
        userRole: "manager",
        title: "Tiến độ showroom tuần này",
        message: "Showroom VinFast Vinh đạt tỷ lệ hoàn thành 92% chỉ tiêu đào tạo nhân viên tư vấn.",
        timestamp: "08:00 hôm nay",
        read: false,
        type: "performance",
        targetTab: "performance"
      }
    ];
  }
  return [
    {
      id: "notif-init-01",
      userId: "adv-001",
      userRole: "advisor",
      title: "Chính sách bán hàng VinFast 2026",
      message: "Nghị định miễn 100% lệ phí trước bạ xe điện và gói tặng 1 năm sạc pin V-GREEN đã có hiệu lực.",
      timestamp: "08:30 hôm nay",
      read: false,
      type: "policy_update",
      targetTab: "knowledge"
    },
    {
      id: "notif-init-02",
      userId: "adv-001",
      userRole: "advisor",
      title: "Manager đã phê duyệt điểm",
      message: "Lê Văn Hoàng (Training Director) đã duyệt phiên luyện tập VF 8 của bạn với điểm số 88/100.",
      timestamp: "10:15 hôm nay",
      read: false,
      type: "review_approved",
      targetTab: "progress"
    }
  ];
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getInitialNotificationsForRole(currentUser?.role)
  );

  useEffect(() => {
    if (currentUser?.role) {
      setNotifications(getInitialNotificationsForRole(currentUser.role));
    }
  }, [currentUser?.role]);

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const userId = currentUser?.id || "adv-001";

  // Fetch initial notifications via REST API
  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated || !currentUser) return;
    try {
      const res = await notificationApi.getNotifications(userId);
      if (res && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (e) {
      // Keep state
    }
  }, [currentUser, isAuthenticated, userId]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Establish live WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !currentUser || typeof window === "undefined") return;

    // Do not attempt local insecure WebSocket on deployed HTTPS origins
    if (window.location.protocol === "https:" && !process.env.NEXT_PUBLIC_WS_URL) {
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://${window.location.hostname}:8000/api/v1/ws/notifications/${userId}`;

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`[WebSocket] Connected to notification stream for ${userId}`);
      };

      ws.onmessage = (event) => {
        try {
          const newNotif: AppNotification = JSON.parse(event.data);
          // Play notification chime
          playNotificationSound();

          // Show floating toast
          setActiveToast(newNotif);
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          toastTimeoutRef.current = setTimeout(() => {
            setActiveToast(null);
          }, 6000);

          // Update notifications list
          setNotifications((prev) => [newNotif, ...prev]);
        } catch (e) {
          console.error("Error parsing websocket message:", e);
        }
      };

      ws.onerror = () => {
        // Fallback silently if backend ws is unavailable
      };
    } catch (e) {
      // Ignored
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentUser, isAuthenticated, userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await notificationApi.markRead(id, userId);
    } catch (e) {
      // Fallback
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationApi.markAllRead(userId);
    } catch (e) {
      // Fallback
    }
  };

  const dismissToast = () => {
    setActiveToast(null);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };

  const triggerMockNotification = (type: "review" | "assignment" | "policy" = "review") => {
    playNotificationSound();
    let mock: AppNotification;
    if (type === "review") {
      mock = {
        id: "mock-" + Date.now(),
        title: "Manager đã duyệt đánh giá",
        message: "Lê Văn Hoàng đã duyệt phiên luyện tập mới của bạn (+2 điểm!).",
        timestamp: "Vừa xong",
        read: false,
        type: "review_approved",
        targetTab: "session_result",
      };
    } else if (type === "assignment") {
      mock = {
        id: "mock-" + Date.now(),
        title: "Bài tập luyện tập mới",
        message: "Bạn được giao bài tập kịch bản VF 7 Plus AWD. Hạn chót: 30/09/2026.",
        timestamp: "Vừa xong",
        read: false,
        type: "new_assignment",
        targetTab: "roleplay",
      };
    } else {
      mock = {
        id: "mock-" + Date.now(),
        title: "Cập nhật chính sách VinFast",
        message: "Chính sách ưu đãi thuê pin mới nhất vừa được ban hành.",
        timestamp: "Vừa xong",
        read: false,
        type: "policy_update",
        targetTab: "knowledge",
      };
    }

    setActiveToast(mock);
    setNotifications((prev) => [mock, ...prev]);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 6000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        activeToast,
        dismissToast,
        triggerMockNotification,
      }}
    >
      {children}

      {/* Realtime Toast Popover on Top-Right */}
      {activeToast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white shadow-2xl animate-slide-left flex items-start gap-3 select-none">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            activeToast.type === "review_approved"
              ? "bg-white/10 text-white"
              : activeToast.type === "practice_completed"
              ? "bg-white/10 text-white"
              : "bg-white/10 text-white"
          }`}>
            {activeToast.type === "review_approved" ? (
              <ShieldCheck className="h-5 w-5" />
            ) : activeToast.type === "practice_completed" ? (
              <Zap className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-white truncate">{activeToast.title}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{activeToast.timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {activeToast.message}
            </p>
          </div>

          <button
            onClick={dismissToast}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
