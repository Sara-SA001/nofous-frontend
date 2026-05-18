"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function CreateSubAdminPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/admin/create-subadmin", formData);
      toast.success("✅ تم إنشاء حساب SubAdmin بنجاح");
      setFormData({ username: "", email: "", password: "", fullName: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في إنشاء SubAdmin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">إنشاء حساب SubAdmin</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-10 shadow"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              الاسم الكامل (اختياري)
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء حساب SubAdmin"}
        </button>
      </form>
    </div>
  );
}
