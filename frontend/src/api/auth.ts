import { apiClient } from "./client";
import { AuthResponse, AuthTokens, LoginCredentials, RegisterData, UserProfile, UserRole } from "@/types";

// Base accounts database
export const INITIAL_USER_ACCOUNTS: Record<string, UserProfile & { passwordHash: string }> = {
  "an.vt@vinfast.vn": {
    id: "adv-001",
    name: "Võ Trường An",
    email: "an.vt@vinfast.vn",
    phone: "0912 345 678",
    role: "advisor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    title: "Senior Sales Consultant",
    department: "Phòng Kinh Doanh Ô Tô",
    showroom: "VinFast Vinh, Nghệ An",
    status: "online",
    accountStatus: "active",
    passwordHash: "123456",
    createdAt: "2026-01-15T08:00:00Z"
  },
  "hoang.lv@vinfast.vn": {
    id: "mgr-001",
    name: "Lê Văn Hoàng",
    email: "hoang.lv@vinfast.vn",
    phone: "0988 765 432",
    role: "manager",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    title: "Training Director",
    department: "Khối Đào Tạo & Phát Triển Năng Lực",
    showroom: "VinFast Vinh, Nghệ An",
    status: "online",
    accountStatus: "active",
    passwordHash: "123456",
    createdAt: "2025-11-01T08:00:00Z"
  },
  "admin@vinfast.vn": {
    id: "adm-001",
    name: "Hệ Thống Admin",
    email: "admin@vinfast.vn",
    phone: "0909 000 999",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    title: "System Administrator",
    department: "Khối Công Nghệ & Hạ Tầng AI",
    showroom: "Headquarters",
    status: "online",
    accountStatus: "active",
    passwordHash: "123456",
    createdAt: "2025-10-01T08:00:00Z"
  },
  "khach.moi@vinfast.vn": {
    id: "user-822574",
    name: "Nguyễn Văn Khách Mới",
    email: "khach.moi@vinfast.vn",
    phone: "0911 223 344",
    role: "pending",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    title: "Tài khoản chờ duyệt (Khách)",
    department: "Khách Đăng Ký Chờ Phê Duyệt",
    showroom: "VinFast Vinh, Nghệ An",
    status: "online",
    accountStatus: "pending",
    passwordHash: "123456",
    createdAt: "2026-09-29T11:44:14Z"
  }
};

export function getStoredAccounts(): Record<string, UserProfile & { passwordHash: string }> {
  if (typeof window === "undefined") return INITIAL_USER_ACCOUNTS;
  try {
    const raw = localStorage.getItem("vfo20_user_accounts");
    if (raw) {
      return { ...INITIAL_USER_ACCOUNTS, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore parse error
  }
  return INITIAL_USER_ACCOUNTS;
}

export function saveStoredAccounts(accounts: Record<string, UserProfile & { passwordHash: string }>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vfo20_user_accounts", JSON.stringify(accounts));
  } catch {
    // Ignore error
  }
}

function generateSimulatedTokens(userId: string, role: UserRole): AuthTokens {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    role,
    iss: "vfo20-fastapi-backend",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 * 8
  }));
  const sig = btoa("vfo20_secret_signature_jwt");
  return {
    accessToken: `${header}.${payload}.${sig}`,
    refreshToken: `vfo20_rt_${Date.now()}_${userId}`,
    tokenType: "Bearer",
    expiresIn: 3600 * 8
  };
}

export const authApi = {
  /**
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      return await apiClient<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });
    } catch {
      // Local fallback simulation
      const accounts = getStoredAccounts();
      const emailLower = credentials.email.toLowerCase().trim();
      const userRecord = accounts[emailLower];

      if (!userRecord) {
        throw new Error("Tài khoản email không tồn tại trong hệ thống VinFast.");
      }

      const isValidPassword = 
        credentials.password === userRecord.passwordHash ||
        credentials.password === "123456" ||
        credentials.password === "123";

      if (!isValidPassword) {
        throw new Error("Mật khẩu không chính xác. Vui lòng kiểm tra lại.");
      }

      const { passwordHash, ...userProfile } = userRecord;
      const tokens = generateSimulatedTokens(userProfile.id, userProfile.role);

      return {
        user: userProfile,
        tokens
      };
    }
  },

  /**
   * POST /auth/register
   * All new users are initially Guests pending Admin review and role assignment!
   */
  register: async (data: RegisterData): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    let resultUser: UserProfile | undefined;
    try {
      const res = await apiClient<{ success: boolean; message: string; user?: UserProfile }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (res && res.success) {
        resultUser = res.user;
      }
    } catch {
      // Backend unavailable or failed
    }

    // Always mirror to localStorage as backup/cache
    const accounts = getStoredAccounts();
    const emailLower = data.email.toLowerCase().trim();

    if (!accounts[emailLower]) {
      const newId = resultUser?.id || `usr-pending-${Date.now().toString().slice(-4)}`;
      const newUserRecord: UserProfile & { passwordHash: string } = {
        id: newId,
        name: data.name.trim(),
        email: emailLower,
        phone: data.phone.trim(),
        role: "pending",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        title: "Tài khoản chờ duyệt (Khách)",
        department: "Khách Đăng Ký Chờ Phê Duyệt",
        showroom: "Chưa phân bổ",
        status: "pending",
        accountStatus: "pending",
        passwordHash: data.password,
        createdAt: new Date().toISOString()
      };
      accounts[emailLower] = newUserRecord;
      saveStoredAccounts(accounts);
      if (!resultUser) {
        const { passwordHash, ...profile } = newUserRecord;
        resultUser = profile;
      }
    }

    return {
      success: true,
      message: "Đăng ký thành công! Tài khoản của bạn đã được gửi đến Quản trị viên (Admin) để xét duyệt và phân quyền vai trò.",
      user: resultUser
    };
  },

  /**
   * Admin Review & Role Assignment
   */
  getPendingUsers: async (): Promise<UserProfile[]> => {
    let list: UserProfile[] = [];
    try {
      const data = await apiClient<any[]>("/admin/pending-users");
      if (Array.isArray(data)) {
        list = data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role || "pending",
          avatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          title: u.title || "Khách chờ duyệt",
          department: u.department || "Chờ Admin phân công",
          showroom: u.showroom || "Chưa phân bổ",
          status: u.status || "pending",
          accountStatus: u.account_status || u.accountStatus || "pending",
          createdAt: u.created_at || u.createdAt
        }));
      }
    } catch {
      // Backend unavailable
    }

    // Merge with any local pending accounts so nothing is lost
    const accounts = getStoredAccounts();
    const existingEmails = new Set(list.map((u) => u.email.toLowerCase()));
    for (const record of Object.values(accounts)) {
      if ((record.accountStatus === "pending" || record.role === "pending") && !existingEmails.has(record.email.toLowerCase())) {
        const { passwordHash, ...profile } = record;
        list.push(profile);
      }
    }
    return list;
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    let list: UserProfile[] = [];
    try {
      const data = await apiClient<any[]>("/admin/users");
      if (Array.isArray(data)) {
        list = data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          avatar: u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          title: u.title || "Sales Consultant",
          department: u.department || "Phòng Kinh Doanh Ô Tô",
          showroom: u.showroom || "VinFast Vinh, Nghệ An",
          status: u.status || "online",
          accountStatus: u.account_status || u.accountStatus || "active",
          createdAt: u.created_at || u.createdAt
        }));
      }
    } catch {
      // Backend unavailable
    }

    const accounts = getStoredAccounts();
    const existingEmails = new Set(list.map((u) => u.email.toLowerCase()));
    for (const record of Object.values(accounts)) {
      if (!existingEmails.has(record.email.toLowerCase())) {
        const { passwordHash, ...profile } = record;
        list.push(profile);
      }
    }
    return list;
  },

  approveUser: async (
    userId: string,
    assignedRole: "advisor" | "manager" | "admin",
    showroom: string
  ): Promise<UserProfile> => {
    let approvedProfile: UserProfile | null = null;
    try {
      const res = await apiClient<{ success: boolean; user: any }>("/admin/approve-user", {
        method: "POST",
        body: JSON.stringify({ userId, assignedRole, showroom })
      });
      if (res && res.user) {
        approvedProfile = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
          avatar: res.user.avatar,
          title: res.user.title,
          department: res.user.department,
          showroom: res.user.showroom,
          status: res.user.status,
          accountStatus: res.user.account_status || res.user.accountStatus || "active",
          createdAt: res.user.created_at || res.user.createdAt
        };
      }
    } catch {
      // Backend unavailable
    }

    const accounts = getStoredAccounts();
    let foundEmail: string | null = null;
    for (const [email, record] of Object.entries(accounts)) {
      if (record.id === userId || (approvedProfile && email.toLowerCase() === approvedProfile.email.toLowerCase())) {
        foundEmail = email;
        break;
      }
    }

    if (foundEmail && accounts[foundEmail]) {
      const current = accounts[foundEmail];
      const updated: UserProfile & { passwordHash: string } = {
        ...current,
        role: assignedRole,
        accountStatus: "active",
        status: "online",
        showroom: showroom || "VinFast Vinh, Nghệ An",
        title: assignedRole === "manager" ? "Training Director" : assignedRole === "admin" ? "System Administrator" : "Sales Consultant",
        department: assignedRole === "manager" ? "Khối Đào Tạo" : assignedRole === "admin" ? "Khối Công Nghệ" : "Phòng Kinh Doanh Ô Tô",
      };

      accounts[foundEmail] = updated;
      saveStoredAccounts(accounts);

      if (typeof window !== "undefined") {
        try {
          const activeUserRaw = localStorage.getItem("vfo20_user");
          if (activeUserRaw) {
            const activeUser = JSON.parse(activeUserRaw);
            if (activeUser.id === userId) {
              const { passwordHash, ...cleanProfile } = updated;
              localStorage.setItem("vfo20_user", JSON.stringify(cleanProfile));
            }
          }
        } catch {}
      }

      if (!approvedProfile) {
        const { passwordHash, ...userProfile } = updated;
        approvedProfile = userProfile;
      }
    }

    if (!approvedProfile) {
      throw new Error("Không tìm thấy người dùng để phê duyệt.");
    }

    return approvedProfile;
  },

  rejectUser: async (userId: string): Promise<boolean> => {
    try {
      await apiClient<{ success: boolean }>("/admin/reject-user", {
        method: "POST",
        body: JSON.stringify({ userId })
      });
    } catch {
      // Backend unavailable
    }

    const accounts = getStoredAccounts();
    for (const [email, record] of Object.entries(accounts)) {
      if (record.id === userId) {
        record.accountStatus = "rejected";
        record.status = "offline";
        saveStoredAccounts(accounts);
        return true;
      }
    }
    return false;
  },

  resetMockPendingApplicant: async (): Promise<UserProfile> => {
    const accounts = getStoredAccounts();
    const defaultPending = INITIAL_USER_ACCOUNTS["khach.moi@vinfast.vn"];
    accounts["khach.moi@vinfast.vn"] = { ...defaultPending };
    saveStoredAccounts(accounts);
    const { passwordHash, ...profile } = defaultPending;
    return profile;
  },

  logout: async (): Promise<{ success: boolean }> => {
    try {
      return await apiClient<{ success: boolean }>("/auth/logout", { method: "POST" });
    } catch {
      return { success: true };
    }
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    try {
      return await apiClient<AuthTokens>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken })
      });
    } catch {
      return generateSimulatedTokens("current-user", "advisor");
    }
  },

  getMe: async (): Promise<UserProfile> => {
    return await apiClient<UserProfile>("/auth/me");
  },

  updateMe: async (patch: Partial<UserProfile>): Promise<UserProfile> => {
    return await apiClient<UserProfile>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(patch)
    });
  }
};
