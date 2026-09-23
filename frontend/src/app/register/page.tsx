"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Clock
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { VinFastLogo } from "@/components/ui/VinFastLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      errs.name = "Vui lòng nhập họ và tên của bạn.";
    }

    if (!email.trim()) {
      errs.email = "Vui lòng nhập địa chỉ email.";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Định dạng email không hợp lệ (ví dụ: yourname@vinfast.vn).";
    }

    if (!phone.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại liên hệ.";
    }

    if (!password) {
      errs.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 8) {
      errs.password = "Mật khẩu phải có tối thiểu 8 ký tự.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Vui lòng xác nhận lại mật khẩu.";
    } else if (confirmPassword !== password) {
      errs.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!agreedToTerms) {
      errs.terms = "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    if (!validate()) return;

    setIsLoading(true);
    const result = await register({
      name,
      email,
      phone,
      password,
      confirmPassword,
      agreedToTerms
    });
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(
        "Tạo tài khoản thành công! Hồ sơ của bạn đã được chuyển đến Quản trị viên (Admin) để xét duyệt và phân quyền. Đang chuyển hướng về trang đăng nhập..."
      );
      setTimeout(() => {
        router.push("/login?pending=true");
      }, 2500);
    } else if (result.message) {
      setGeneralError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[#F8FAFC] text-slate-900 select-none">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/login" className="inline-flex items-center gap-2 mb-1 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-900 border border-blue-400/30 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <VinFastLogo size={24} variant="silver" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Đăng ký tài khoản tham gia nền tảng Huấn luyện & Hỗ trợ Tư vấn viên VinFast.
          </p>
        </div>

        {/* Form Card (Radius 16px, clean shadow) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-8 shadow-xl space-y-5">
          {/* Admin Approval Notice Callout */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
            <Clock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Quy trình phân quyền:</strong> Mọi tài khoản mới đăng ký đều là <strong>Khách chờ duyệt</strong>. Quản trị viên (Admin) sẽ trực tiếp kiểm tra danh tính và phân quyền vai trò (Tư vấn viên / Quản lý) trước khi bạn bắt đầu làm việc.
            </p>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                    errors.name ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-red-600 pl-1">{errors.name}</p>}
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Email công việc</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advisor@vinfast.vn"
                    className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                      errors.email ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-600 pl-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                      errors.phone ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-600 pl-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Passwords grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className={`w-full rounded-xl border pl-10 pr-9 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                      errors.password ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-600 pl-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full rounded-xl border pl-10 pr-9 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                      errors.confirmPassword ? "border-red-400 bg-red-50/20" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-600 pl-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Checkbox Terms & Privacy */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded text-blue-600 accent-blue-600 mt-0.5"
                />
                <span>
                  Tôi đồng ý với{" "}
                  <span className="text-blue-600 font-semibold hover:underline">Điều khoản sử dụng</span> và{" "}
                  <span className="text-blue-600 font-semibold hover:underline">Chính sách bảo mật nội bộ VinFast</span>.
                </span>
              </label>
              {errors.terms && <p className="text-[11px] text-red-600 pl-1 pt-1">{errors.terms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Đang gửi hồ sơ...</span>
                </>
              ) : (
                <>
                  <span>Đăng Ký Tài Khoản</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Link back to Login */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Đã có tài khoản được duyệt?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
