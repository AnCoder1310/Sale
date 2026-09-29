"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthTokens, LoginCredentials, RegisterData, UserProfile, UserRole } from "@/types";
import { authApi, INITIAL_USER_ACCOUNTS } from "@/api/auth";

interface AuthContextType {
  currentUser: UserProfile | null;
  accessToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  signoutModalOpen: boolean;
  openSignoutModal: () => void;
  closeSignoutModal: () => void;
  dismissSessionExpired: () => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  loginAsDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [signoutModalOpen, setSignoutModalOpen] = useState<boolean>(false);

  // Restore stored authentication session from browser storage if available
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedToken = localStorage.getItem("vfo20_access_token") || sessionStorage.getItem("vfo20_access_token");
      const storedUser = localStorage.getItem("vfo20_user") || sessionStorage.getItem("vfo20_user");

      if (storedToken && storedUser && storedToken !== "vfo20_demo_token_advisor") {
        const parsedUser = JSON.parse(storedUser) as UserProfile;
        setCurrentUser(parsedUser);
        setAccessToken(storedToken);
      } else {
        setCurrentUser(null);
        setAccessToken(null);
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
      setCurrentUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setSessionExpired(false);
    try {
      const res = await authApi.login(credentials);
      setCurrentUser(res.user);
      setAccessToken(res.tokens.accessToken);

      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem("vfo20_access_token", res.tokens.accessToken);
      storage.setItem("vfo20_refresh_token", res.tokens.refreshToken);
      storage.setItem("vfo20_user", JSON.stringify(res.user));

      localStorage.setItem("vfo20_user", JSON.stringify(res.user));
      localStorage.setItem("vfo20_access_token", res.tokens.accessToken);

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Đăng nhập thất bại. Vui lòng thử lại." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      return { success: true, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Đăng ký tài khoản thất bại." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setSignoutModalOpen(false);
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setCurrentUser(null);
      setAccessToken(null);
      localStorage.removeItem("vfo20_access_token");
      localStorage.removeItem("vfo20_refresh_token");
      localStorage.removeItem("vfo20_user");
      sessionStorage.removeItem("vfo20_access_token");
      sessionStorage.removeItem("vfo20_refresh_token");
      sessionStorage.removeItem("vfo20_user");
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("vfo20_refresh_token") || sessionStorage.getItem("vfo20_refresh_token");
    if (!refreshToken) {
      setSessionExpired(true);
      return false;
    }

    try {
      const tokens = await authApi.refresh(refreshToken);
      setAccessToken(tokens.accessToken);
      localStorage.setItem("vfo20_access_token", tokens.accessToken);
      return true;
    } catch {
      setSessionExpired(true);
      await logout();
      return false;
    }
  };

  const loginAsDemo = (targetRole: UserRole) => {
    let email = "an.vt@vinfast.vn";
    if (targetRole === "manager") email = "hoang.lv@vinfast.vn";
    if (targetRole === "admin") email = "admin@vinfast.vn";

    const record = INITIAL_USER_ACCOUNTS[email];
    if (record) {
      const { passwordHash: _pHash, ...profile } = record;
      setCurrentUser(profile);
      const token = `vfo20_demo_token_${targetRole}`;
      setAccessToken(token);
      localStorage.setItem("vfo20_user", JSON.stringify(profile));
      localStorage.setItem("vfo20_access_token", token);
    }
  };

  const openSignoutModal = () => setSignoutModalOpen(true);
  const closeSignoutModal = () => setSignoutModalOpen(false);
  const dismissSessionExpired = () => setSessionExpired(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        accessToken,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser && !!accessToken,
        isLoading,
        sessionExpired,
        signoutModalOpen,
        openSignoutModal,
        closeSignoutModal,
        dismissSessionExpired,
        login,
        register,
        logout,
        refreshSession,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
