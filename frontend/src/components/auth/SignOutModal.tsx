"use client";

import React, { useState } from "react";
import { LogOut, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const SignOutModal: React.FC = () => {
  const { signoutModalOpen, closeSignoutModal, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!signoutModalOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await logout();
      closeSignoutModal();
      router.push("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 animate-scale-up text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="h-11 w-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <LogOut className="h-5 w-5" />
          </div>
          <button
            onClick={closeSignoutModal}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900">Sign out?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Are you sure you want to sign out of your workspace?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={closeSignoutModal}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isSubmitting ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
