"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { VinFastLogo } from "@/components/ui/VinFastLogo";

export default function RootPage() {
  const { currentUser, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.accountStatus === "pending" || currentUser.role === "pending") {
      router.replace("/pending-approval");
      return;
    }

    if (role === "admin") {
      router.replace("/admin");
    } else if (role === "manager") {
      router.replace("/manager");
    } else {
      router.replace("/advisor");
    }
  }, [isLoading, isAuthenticated, currentUser, role, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B1220] text-slate-100 select-none">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 border border-blue-400/30 flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-pulse">
            <VinFastLogo size={32} variant="silver" />
          </div>
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-[#0B1220] animate-ping"></span>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-base font-black text-white tracking-wide">AI Sales Coach</h2>
          <p className="text-xs text-slate-400">Directing to your assigned workspace...</p>
        </div>

        <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden mt-2">
          <div className="h-full bg-blue-600 rounded-full animate-[pulse_1s_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
