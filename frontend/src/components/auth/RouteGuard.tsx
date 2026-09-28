"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { VinFastLogo } from "@/components/ui/VinFastLogo";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { currentUser, role, isAuthenticated, isLoading, sessionExpired, dismissSessionExpired } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "";
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const rolesKey = useMemo(() => (allowedRoles ? allowedRoles.join(",") : ""), [allowedRoles]);

  useEffect(() => {
    if (isLoading) return;

    // 1. Unauthenticated check -> redirect to /login/
    if (!isAuthenticated || !currentUser) {
      router.push(`/login/?redirect=${encodeURIComponent(pathname)}`);
      setAuthorized(false);
      return;
    }

    // 2. Pending account check -> users waiting for Admin approval cannot access any workspace!
    if (currentUser.accountStatus === "pending" || currentUser.role === "pending") {
      router.push("/pending-approval/");
      setAuthorized(false);
      return;
    }

    // 3. Role authorization check
    if (allowedRoles && allowedRoles.length > 0) {
      // Admin has full access to everything
      if (role === "admin") {
        setAuthorized(true);
        return;
      }

      // Check if user's role is permitted
      if (role && allowedRoles.includes(role)) {
        setAuthorized(true);
      } else {
        // Unauthorized -> redirect to /403/
        router.push("/403/");
        setAuthorized(false);
      }
    } else {
      setAuthorized(true);
    }
  }, [isLoading, isAuthenticated, currentUser, role, rolesKey, router, pathname]);

  if (isLoading || authorized === null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#111111] text-slate-200 select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-[#111111] border border-[#262626] flex items-center justify-center shadow-sm animate-pulse">
              <VinFastLogo size={32} variant="silver" />
            </div>
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white ring-4 ring-[#111111] animate-ping"></span>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-white tracking-wide">AI Sales Enablement Coach</h3>
            <p className="text-xs text-slate-400">Authenticating session & verifying workspace access...</p>
          </div>

          <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden mt-2">
            <div className="h-full bg-white rounded-full animate-[pulse_1s_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <>
      {sessionExpired && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-bounce">
          <div className="p-3.5 rounded-2xl bg-[#111111] text-white shadow-2xl flex items-center justify-between gap-3 text-xs font-bold border border-[#262626]">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/login/"
                className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-[11px] font-extrabold uppercase whitespace-nowrap"
              >
                Sign In
              </Link>
              <button 
                onClick={dismissSessionExpired}
                className="p-1 hover:bg-slate-800 rounded-lg text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
};
