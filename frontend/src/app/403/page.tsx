"use client";

import React from "react";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VinFastLogo } from "@/components/ui/VinFastLogo";

export default function ForbiddenPage() {
  const { currentUser, role } = useAuth();
  const router = useRouter();

  const getWorkspaceUrl = () => {
    if (role === "admin") return "/admin";
    if (role === "manager") return "/manager";
    return "/advisor";
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#111111] text-slate-100 select-none">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        {/* Shield Icon */}
        <div className="inline-flex h-20 w-20 rounded-3xl bg-white/10 border border-white/20 items-center justify-center text-white shadow-sm">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono font-bold text-xs border border-white/20">
            HTTP 403 • ACCESS FORBIDDEN
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Unauthorized Access
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            You do not have permission to access this workspace. Your account ({currentUser?.email || "User"}) is assigned to the{" "}
            <strong className="text-white capitalize">{role || "Advisor"}</strong> role.
          </p>
        </div>

        {/* Info card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-left space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Lock className="h-4 w-4 text-white" />
            <span>Role-Based Access Control Policy:</span>
          </div>
          <ul className="space-y-1 text-slate-400 pl-6 list-disc text-[11px]">
            <li>Advisors can only access the Advisor Workspace (<code className="text-slate-300">/advisor</code>).</li>
            <li>Managers can access Training Management (<code className="text-slate-300">/manager</code>).</li>
            <li>Admins have full access to system architecture (<code className="text-slate-300">/admin</code>).</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            href={getWorkspaceUrl()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Return to My Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
