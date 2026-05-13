// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nationalId: "",
    firstName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",
    governorate: "",
    gender: "MALE",
    religion: "MUSLIM",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", formData);

      if (res.data.success) {
        toast.success("تم إنشاء الحساب بنجاح");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8">إنشاء حساب جديد</h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                الرقم الوطني
              </label>
              <input
                name="nationalId"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                الاسم الأول
              </label>
              <input
                name="firstName"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">اسم الأب</label>
            <input
              name="fatherName"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">اسم الأم</label>
            <input
              name="motherName"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                تاريخ الميلاد
              </label>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                مكان الميلاد
              </label>
              <input
                name="placeOfBirth"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">الجنسية</label>
              <input
                name="nationality"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">المحافظة</label>
              <input
                name="governorate"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">الجنس</label>
              <select
                name="gender"
                onChange={handleChange}
                className="form-input"
              >
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الدين</label>
              <select
                name="religion"
                onChange={handleChange}
                className="form-input"
              >
                <option value="MUSLIM">مسلم</option>
                <option value="CHRISTIAN">مسيحي</option>
                <option value="OTHER">آخر</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          لديك حساب؟{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
