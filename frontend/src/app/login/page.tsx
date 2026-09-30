"use client";

import React, { useState, Suspense } from "react";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { VinFastLogo } from "@/components/ui/VinFastLogo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Email format validation
  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.trim()) {
      return "Please enter your email address.";
    }
    if (!emailRegex.test(val.trim())) {
      return "Invalid email address format (e.g. advisor@vinfast.vn).";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setEmailError("");

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    const result = await login({ email, password, rememberMe });
    setIsLoading(false);

    if (result.success) {
      // Check stored user status to route appropriately
      const stored = sessionStorage.getItem("vfo20_user") || localStorage.getItem("vfo20_user");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.accountStatus === "pending" || user.role === "pending") {
            router.push("/pending-approval/");
            return;
          }
          if (user.role === "admin") {
            router.push("/admin/");
            return;
          }
          if (user.role === "manager") {
            router.push("/manager/");
            return;
          }
          router.push("/advisor/");
          return;
        } catch {}
      }
      router.push("/advisor/");
    } else if (result.message) {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Mobile Header Logo */}
      <div className="lg:hidden flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
          <VinFastLogo size={22} variant="silver" />
        </div>
        <div>
          <h1 className="font-black text-slate-900 text-base">AI</h1>
          <p className="text-[11px] text-slate-500">Automotive Advisors Platform</p>
        </div>
      </div>

      {/* Form Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to continue to your workspace.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs flex items-start gap-2.5 animate-shake">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block font-bold text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="e.g. yourname@vinfast.vn"
              className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                emailError 
                  ? "border-slate-300 bg-slate-50 focus:ring-2 focus:ring-slate-200" 
                  : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-400"
              }`}
            />
          </div>
          {emailError && (
            <p className="text-[11px] text-slate-700 font-medium pl-1">{emailError}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-slate-700">Password</label>
            <button
              type="button"
              onClick={() => alert("Password recovery: Please contact your VinFast system administrator or showroom director.")}
              className="text-[11px] text-slate-900 hover:underline font-semibold"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-slate-900 accent-slate-900"
            />
            <span>Remember me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Social Login Button */}
        <div className="relative py-2 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-[#FFFFFF] px-3 text-[11px] text-slate-400 font-medium uppercase">
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={() => alert("Google SSO is configured for internal @vinfast.vn accounts. Please use email and password for direct login.")}
          className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 transition shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#111111"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#525252"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.37 24 12 24z"
            />
            <path
              fill="#737373"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#A3A3A3"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>

              {/* Quick Demo Accounts for Easy Login */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Tài khoản dùng thử (Bấm để điền nhanh):
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setEmail("an.vt@vinfast.vn");
                setPassword("123456");
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition flex flex-col items-center gap-0.5"
            >
              <span>👨‍💼</span>
              <span className="truncate w-full text-center">Advisor</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("hoang.lv@vinfast.vn");
                setPassword("123456");
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition flex flex-col items-center gap-0.5"
            >
              <span>🛠️</span>
              <span className="truncate w-full text-center">Manager</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@vinfast.vn");
                setPassword("123456");
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition flex flex-col items-center gap-0.5"
            >
              <span>⚙️</span>
              <span className="truncate w-full text-center">Admin</span>
            </button>
          </div>
        </div>

      {/* Link to Register */}
      <p className="text-center text-xs text-slate-500 pt-2">
        Don't have an account?{" "}
        <Link href="/register" className="text-slate-900 font-bold hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#FFFFFF] text-slate-900 select-none">
      {/* LEFT COLUMN: Premium Automotive Visual & Branding (Desktop >= lg) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[#111111] border-r border-[#262626] text-white overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-slate-800 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#111111] border border-[#262626] flex items-center justify-center text-white">
            <VinFastLogo size={24} variant="silver" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-lg tracking-tight">AI</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-extrabold border border-white/20">
                Automotive SaaS
              </span>
            </div>
            <p className="text-xs text-slate-400">VinFast Automotive Sales Enablement Platform</p>
          </div>
        </div>

        {/* Center: Hero Illustration & Showcase */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-slate-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
            <span>Next-Gen Automotive AI Assistant</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
            “Empower every conversation.<br />
            <span className="text-white">
              Train smarter. Sell better.
            </span>”
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Huấn luyện kỹ năng tư vấn bán xe điện qua hội thoại đa lượt với AI Customer, tra cứu thông số kỹ thuật chuẩn xác và thẩm định kết quả theo khung năng lực 5 chiều VinFast.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Zap className="h-4 w-4 text-slate-400" />
                <span>RAG Grounded Rerank</span>
              </div>
              <p className="text-[11px] text-slate-400">Trích dẫn chính sách & ưu đãi trước bạ 0% chính thức.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck className="h-4 w-4 text-white" />
                <span>Human-In-The-Loop</span>
              </div>
              <p className="text-[11px] text-slate-400">Quản lý duyệt và hiệu chỉnh điểm số AI minh bạch.</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span>VinFast Auto Ltd. • Đề án AI20K Team P-043</span>
          <span className="text-slate-400 font-medium">Enterprise Security Ready</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign In Form Card */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center p-12 text-xs text-slate-400">
            <span className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
            Loading workspace...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
