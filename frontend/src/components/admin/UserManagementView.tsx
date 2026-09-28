"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  Lock,
  ChevronRight
} from "lucide-react";
import { authApi, getStoredAccounts } from "@/api/auth";
import { UserProfile, UserRole } from "@/types";

export const UserManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [actionNotice, setActionNotice] = useState<string>("");

  // Role assignment state mapped by userId
  const [assignedRoles, setAssignedRoles] = useState<Record<string, "advisor" | "manager">>({});
  const [assignedShowrooms, setAssignedShowrooms] = useState<Record<string, string>>({});

  const loadData = async () => {
    try {
      const pending = await authApi.getPendingUsers();
      const all = await authApi.getAllUsers();
      setPendingUsers(pending);
      setAllUsers(all.filter((u) => u.accountStatus !== "pending" && u.role !== "pending"));

      // Default role assignments for pending users
      const rolesMap: Record<string, "advisor" | "manager"> = {};
      const showroomsMap: Record<string, string> = {};
      pending.forEach((u) => {
        rolesMap[u.id] = "advisor";
        showroomsMap[u.id] = "VinFast Vinh, Nghệ An";
      });
      setAssignedRoles(rolesMap);
      setAssignedShowrooms(showroomsMap);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (user: UserProfile) => {
    const roleToAssign = assignedRoles[user.id] || "advisor";
    const showroomToAssign = assignedShowrooms[user.id] || "VinFast Vinh, Nghệ An";

    try {
      await authApi.approveUser(user.id, roleToAssign, showroomToAssign);
      setActionNotice(`✓ Đã duyệt và phân quyền thành công: ${user.name} thành [${roleToAssign === "manager" ? "Quản lý đào tạo (Manager)" : "Tư vấn viên (Advisor)"}] tại showroom ${showroomToAssign}!`);
      setTimeout(() => setActionNotice(""), 5000);
      loadData();
    } catch (err: any) {
      alert("Lỗi khi duyệt: " + err.message);
    }
  };

  const handleReject = async (user: UserProfile) => {
    if (confirm(`Bạn có chắc chắn muốn từ chối tài khoản của ${user.name}?`)) {
      await authApi.rejectUser(user.id);
      setActionNotice(`✕ Đã từ chối cấp quyền cho tài khoản: ${user.email}`);
      setTimeout(() => setActionNotice(""), 4000);
      loadData();
    }
  };

  const filteredActive = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Trị Người Dùng & Phê Duyệt Tài Khoản
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình kiểm soát: Mọi tài khoản mới đăng ký đều là Khách và chỉ được kích hoạt sau khi Admin phân quyền vai trò.
          </p>
        </div>

        {/* Tab switcher: Pending vs Active */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === "pending"
                ? "bg-slate-900 text-white shadow-md shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Chờ duyệt</span>
            {pendingUsers.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-950 font-black text-[10px] animate-pulse">
                {pendingUsers.length} mới
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === "active"
                ? "bg-slate-900 text-white shadow-md shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Đã kích hoạt ({allUsers.length})</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-sm">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-slate-900" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* TAB 1: PENDING APPROVAL QUEUE */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">
              Danh sách tài khoản vừa đăng ký đang chờ xét duyệt ({pendingUsers.length}):
            </span>
            <span className="text-[11px] text-slate-900 font-medium">
              * Admin có toàn quyền quyết định tài khoản làm Tư vấn viên (Advisor) hay Quản lý (Manager)
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-900 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Hàng đợi trống</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hiện không có tài khoản khách nào đang chờ duyệt. Khi có nhân sự đăng ký mới, hồ sơ sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition hover:border-slate-300"
                >
                  {/* Left: User details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-800 flex items-center justify-center font-bold text-base flex-shrink-0 ring-2 ring-slate-200">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm truncate">{u.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 font-bold text-[10px] uppercase tracking-wider">
                          Khách chờ duyệt
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Email: <strong className="text-slate-700">{u.email}</strong> • SĐT:{" "}
                        <strong className="text-slate-700">{u.phone || "Chưa cung cấp"}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Đăng ký lúc: {u.createdAt ? new Date(u.createdAt).toLocaleString("vi-VN") : "Hôm nay"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Admin Role & Showroom Assignment Form */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Role Dropdown */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">
                        Giao vai trò:
                      </label>
                      <select
                        value={assignedRoles[u.id] || "advisor"}
                        onChange={(e) =>
                          setAssignedRoles({
                            ...assignedRoles,
                            [u.id]: e.target.value as "advisor" | "manager",
                          })
                        }
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                      >
                        <option value="advisor">👨‍💼 Tư vấn viên (Advisor)</option>
                        <option value="manager">🛠️ Quản lý đào tạo (Manager)</option>
                      </select>
                    </div>

                    {/* Showroom Dropdown */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">
                        Showroom công tác:
                      </label>
                      <select
                        value={assignedShowrooms[u.id] || "VinFast Vinh, Nghệ An"}
                        onChange={(e) =>
                          setAssignedShowrooms({
                            ...assignedShowrooms,
                            [u.id]: e.target.value,
                          })
                        }
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                      >
                        <option value="VinFast Vinh, Nghệ An">VinFast Vinh, Nghệ An</option>
                        <option value="VinFast Landmark 81">VinFast Landmark 81</option>
                        <option value="VinFast Cầu Giấy">VinFast Cầu Giấy</option>
                        <option value="VinFast Long Biên">VinFast Long Biên</option>
                      </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-3 sm:pt-4">
                      <button
                        onClick={() => handleApprove(u)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Duyệt & Phân Quyền</span>
                      </button>

                      <button
                        onClick={() => handleReject(u)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
                        title="Từ chối tài khoản này"
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Từ chối</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE USERS TABLE */}
      {activeTab === "active" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nhân sự theo tên hoặc email..."
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Họ và tên</th>
                  <th className="px-6 py-3.5">Vai trò (Role)</th>
                  <th className="px-6 py-3.5">Showroom</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredActive.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p>{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === "advisor"
                          ? "bg-slate-50 text-slate-900"
                          : u.role === "manager"
                          ? "bg-slate-50 text-slate-900"
                          : "bg-slate-50 text-slate-900"
                      }`}>
                        {u.role === "advisor" ? "👨‍💼 Advisor" : u.role === "manager" ? "🛠️ Manager" : "⚙️ Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.showroom || "VinFast Vinh, Nghệ An"}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-800 bg-slate-50 px-2 py-0.5 rounded-full font-semibold text-[10px] flex items-center gap-1 w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
                        Đã kích hoạt
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => alert(`Cập nhật thông tin nhân sự ${u.name}`)}
                        className="text-slate-900 hover:text-slate-900 font-semibold"
                      >
                        Chỉnh sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
