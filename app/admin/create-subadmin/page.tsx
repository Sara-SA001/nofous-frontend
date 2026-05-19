"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const permissionOptions = [
  { key: "MANAGE_REGISTRATION_REQUESTS", label: "طلبات التسجيل" },
  { key: "MANAGE_LINK_REQUESTS", label: "طلبات الارتباط" },
  { key: "MANAGE_DEATH_REQUESTS", label: "طلبات الوفاة" },
  { key: "MANAGE_USERS", label: "إدارة المستخدمين" },
] as const;

type PermissionKey = (typeof permissionOptions)[number]["key"];

export default function CreateSubAdminPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    permissions: [] as PermissionKey[],
  });
  const [loading, setLoading] = useState(false);

  const togglePermission = (permission: PermissionKey) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  const toggleAllPermissions = () => {
    setFormData((prev) => {
      const isAllSelected = prev.permissions.length === permissionOptions.length;
      return {
        ...prev,
        permissions: isAllSelected ? [] : permissionOptions.map((option) => option.key),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.permissions.length === 0) {
      toast.error("حدد صلاحية واحدة على الأقل");
      return;
    }

    setLoading(true);

    try {
      await api.post("/admin/create-subadmin", formData);
      toast.success("تم إنشاء حساب SubAdmin بنجاح");
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        permissions: [],
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في إنشاء SubAdmin");
    } finally {
      setLoading(false);
    }
  };

  const allSelected = formData.permissions.length === permissionOptions.length;

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

          <div className="border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">صلاحيات SubAdmin</h2>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAllPermissions}
                />
                كل الصلاحيات
              </label>
            </div>

            <div className="grid gap-2">
              {permissionOptions.map((option) => (
                <label key={option.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(option.key)}
                    onChange={() => togglePermission(option.key)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
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

