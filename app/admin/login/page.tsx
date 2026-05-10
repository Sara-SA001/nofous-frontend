"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { useAuthStore } from "../../../store/authStore";
import type { User } from "../../../types";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/admin/login", { email, password });

      if (res.data.success) {
        const adminUser = {
          id: res.data.admin.id,
          nationalId: res.data.admin.email,
          firstName: res.data.admin.username,
          role: "admin",
        } as User;

        login(adminUser, res.data.token);
        toast.success("تم تسجيل دخول الأدمن بنجاح");
        router.push("/admin");
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(
        apiError.response?.data?.message ||
          "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            تسجيل دخول الأدمن
          </h1>
          <p className="text-gray-600 mt-2">لوحة التحكم الإدارية</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold text-lg transition disabled:opacity-70"
          >
            {loading ? "جاري تسجيل الدخول..." : "دخول كأدمن"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          هل أنت مستخدم عادي؟{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            تسجيل دخول كمستخدم
          </a>
        </p>
      </div>
    </div>
  );
}
