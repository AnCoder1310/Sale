"use client";

import React from "react";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { VinFastLogo } from "@/components/ui/VinFastLogo";

export default function NotFound() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();

  const getHomeUrl = () => {
    if (!isAuthenticated) return "/login";
    if (role === "admin") return "/admin";
    if (role === "manager") return "/manager";
    return "/advisor";
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#0B1220] text-slate-100 select-none">
      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        <div className="inline-flex h-16 w-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 items-center justify-center text-blue-400 shadow-xl shadow-blue-500/20">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
            404 NOT FOUND
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            href={getHomeUrl()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Return to Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
