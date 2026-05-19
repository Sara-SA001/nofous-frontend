"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import {
  LogOut,
  Users,
  UserPlus,
  ClipboardCheck,
  Link as LinkIcon,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";
import { hasAdminPermission } from "../../lib/adminPermissions";

export default function AdminNavbar() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const canManageRegistrations = hasAdminPermission(
    user?.role,
    user?.adminPermissions,
    "MANAGE_REGISTRATION_REQUESTS",
  );
  const canManageLinks = hasAdminPermission(
    user?.role,
    user?.adminPermissions,
    "MANAGE_LINK_REQUESTS",
  );
  const canManageDeaths = hasAdminPermission(
    user?.role,
    user?.adminPermissions,
    "MANAGE_DEATH_REQUESTS",
  );
  const canManageUsers = hasAdminPermission(
    user?.role,
    user?.adminPermissions,
    "MANAGE_USERS",
  );

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <div className="font-bold text-2xl text-gray-800">نفوس - الأدمن</div>

          <div className="flex gap-8 text-sm font-medium">
            <Link href="/admin" className="flex items-center gap-2 hover:text-blue-600">
              <LayoutDashboard size={20} /> لوحة التحكم
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin/create-subadmin"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <UserPlus size={20} /> إنشاء SubAdmin
              </Link>
            )}

            {canManageRegistrations && (
              <Link
                href="/admin/registration-requests"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <ClipboardCheck size={20} /> طلبات التسجيل
              </Link>
            )}

            {canManageLinks && (
              <Link href="/admin/link-requests" className="flex items-center gap-2 hover:text-blue-600">
                <LinkIcon size={20} /> طلبات الارتباط
              </Link>
            )}

            {canManageDeaths && (
              <Link href="/admin/death-requests" className="flex items-center gap-2 hover:text-blue-600">
                <AlertTriangle size={20} /> طلبات الوفاة
              </Link>
            )}

            {canManageUsers && (
              <Link href="/admin/users" className="flex items-center gap-2 hover:text-blue-600">
                <Users size={20} /> إدارة المستخدمين
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            مرحبًا، <span className="font-semibold">{user?.firstName}</span>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut size={18} /> تسجيل خروج
          </button>
        </div>
      </div>
    </nav>
  );
}

