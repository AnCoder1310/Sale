"use client";

import React, { useState } from "react";
import { Clock, ShieldAlert, LogOut, RotateCcw, CheckCircle2, User, Mail, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { VinFastLogo } from "@/components/ui/VinFastLogo";
import { authApi } from "@/api/auth";

export default function PendingApprovalPage() {
  const { currentUser, logout } = useAuth();
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMessage("");

    try {
      // Re-read stored accounts
      const allUsers = await authApi.getAllUsers();
      const current = allUsers.find((u) => u.email === currentUser?.email);

      if (current && (current.accountStatus === "active" || (current.role && current.role !== "pending"))) {
        localStorage.setItem("vfo20_user", JSON.stringify(current));
        setStatusMessage("Chúc mừng! Tài khoản của bạn đã được Admin phê duyệt. Đang chuyển hướng...");
        setTimeout(() => {
          if (current.role === "manager") router.push("/manager");
          else if (current.role === "admin") router.push("/admin");
          else router.push("/advisor");
        }, 1500);
      } else {
        setTimeout(() => {
          setStatusMessage("Tài khoản của bạn hiện vẫn đang trong hàng đợi chờ Quản trị viên (Admin) phê duyệt.");
          setChecking(false);
        }, 800);
      }
    } catch {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#111111] text-slate-100 select-none">
      <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        {/* Animated Clock / Review Icon */}
        <div className="inline-flex h-20 w-20 rounded-3xl bg-white/10 border border-white/20 items-center justify-center text-white shadow-sm">
          <Clock className="h-10 w-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs border border-white/20">
            TRẠNG THÁI: CHỜ ADMIN PHÂN QUYỀN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tài khoản đang chờ duyệt
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Hồ sơ của bạn đã được tiếp nhận thành công. Quản trị viên (Admin) đang xét duyệt thông tin để phân quyền vai trò (Advisor / Manager) và kích hoạt tài khoản của bạn.
          </p>
        </div>

        {/* User Card Info */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-left space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{currentUser?.name || "Khách hàng mới"}</p>
              <p className="text-slate-400 text-[11px]">{currentUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500 block">Số điện thoại:</span>
              <strong className="text-white">{currentUser?.phone || "Chưa cập nhật"}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Phân quyền:</span>
              <strong className="text-white">Chờ Admin chỉ định</strong>
            </div>
          </div>
        </div>

        {/* Status Feedback Message */}
        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 animate-fade-in">
            {statusMessage}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            <RotateCcw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
            <span>{checking ? "Đang kiểm tra..." : "Kiểm tra lại trạng thái duyệt"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-500">
          Cần hỗ trợ gấp? Vui lòng liên hệ phòng Công nghệ & Hạ tầng VinFast: <span className="text-slate-400">admin@vinfast.vn</span>
        </p>
      </div>
    </div>
  );
}
