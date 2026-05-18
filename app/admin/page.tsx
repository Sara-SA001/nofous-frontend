"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, UserPlus, Heart, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/axios";

type DashboardStats = {
  pendingRegistrationCount: number;
  pendingLinkRequestsCount: number;
  pendingDeathRequestsCount: number;
  totalUsersCount: number;
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    pendingRegistrationCount: 0,
    pendingLinkRequestsCount: 0,
    pendingDeathRequestsCount: 0,
    totalUsersCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        if (res.data?.success && res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch {
        // keep defaults on error
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">مرحبًا بك في نظام نفوس الإداري</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/registration-requests" className="group">
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-2xl transition-all border border-transparent hover:border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">معلقة</p>
                <p className="text-4xl font-bold mt-3">{stats.pendingRegistrationCount}</p>
              </div>
              <UserPlus className="w-14 h-14 text-amber-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-xl font-bold mt-6">طلبات التسجيل</h3>
          </div>
        </Link>

        <Link href="/admin/link-requests" className="group">
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-2xl transition-all border border-transparent hover:border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">معلقة</p>
                <p className="text-4xl font-bold mt-3">{stats.pendingLinkRequestsCount}</p>
              </div>
              <Heart className="w-14 h-14 text-purple-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-xl font-bold mt-6">طلبات الارتباط</h3>
          </div>
        </Link>

        <Link href="/admin/death-requests" className="group">
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-2xl transition-all border border-transparent hover:border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">معلقة</p>
                <p className="text-4xl font-bold mt-3">{stats.pendingDeathRequestsCount}</p>
              </div>
              <AlertTriangle className="w-14 h-14 text-red-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-xl font-bold mt-6">طلبات الوفاة</h3>
          </div>
        </Link>

        {user?.role === "admin" && (
          <Link href="/admin/create-subadmin" className="group">
            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-2xl transition-all border border-transparent hover:border-sky-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-600 text-sm font-medium">أدمن رئيسي</p>
                  <p className="text-2xl font-bold mt-3">Create</p>
                </div>
                <UserPlus className="w-14 h-14 text-sky-600 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xl font-bold mt-6">إنشاء SubAdmin</h3>
            </div>
          </Link>
        )}

        <Link href="/admin/users" className="group">
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-2xl transition-all border border-transparent hover:border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">إجمالي</p>
                <p className="text-4xl font-bold mt-3">{stats.totalUsersCount}</p>
              </div>
              <Users className="w-14 h-14 text-emerald-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-xl font-bold mt-6">إدارة المستخدمين</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
