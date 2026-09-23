"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SignOutModal } from "@/components/auth/SignOutModal";

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
        <SignOutModal />
      </NotificationProvider>
    </AuthProvider>
  );
};
