"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import AdminNavbar from "./AdminNavbar";
import { hasAdminPermission, type AdminPermission } from "../../lib/adminPermissions";

const getRequiredPermissionForPath = (pathname: string): AdminPermission | null => {
  if (pathname.startsWith("/admin/registration-requests")) return "MANAGE_REGISTRATION_REQUESTS";
  if (pathname.startsWith("/admin/link-requests")) return "MANAGE_LINK_REQUESTS";
  if (pathname.startsWith("/admin/death-requests")) return "MANAGE_DEATH_REQUESTS";
  if (pathname.startsWith("/admin/users")) return "MANAGE_USERS";
  return null;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, checkAuth, checkAdminAuth } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const userRole = user?.role?.toLowerCase();
  const isAdminUser = userRole === "admin" || userRole === "sub_admin";
  const requiredPermission = getRequiredPermissionForPath(pathname);
  const canAccessPath =
    !requiredPermission ||
    hasAdminPermission(user?.role, user?.adminPermissions, requiredPermission);

  useEffect(() => {
    if (isLoginPage) return;

    if (checkAdminAuth) {
      (async () => {
        await checkAdminAuth();
      })();
      return;
    }

    (async () => {
      await checkAuth();
    })();
  }, [checkAuth, checkAdminAuth, isLoginPage]);

  useEffect(() => {
    if (isLoginPage) return;

    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      if (!isAdminUser) {
        router.push("/admin/login");
        return;
      }

      if (!canAccessPath) {
        router.push("/admin");
      }
    }
  }, [
    isAuthenticated,
    isAdminUser,
    isLoading,
    isLoginPage,
    user,
    router,
    canAccessPath,
  ]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحقق...
      </div>
    );
  }

  if (!isAuthenticated || !isAdminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-semibold text-gray-800">ممنوع الدخول</h2>
          <p className="mt-2 text-gray-600">
            ليس لديك صلاحية الوصول إلى لوحة الأدمن.
          </p>
          <div className="mt-4">
            <button
              onClick={() => router.push("/admin/login")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              اذهب لتسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccessPath) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-8">{children}</div>
    </div>
  );
}

