"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import AdminNavbar from "./AdminNavbar";

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

  useEffect(() => {
    if (isLoginPage) return;
    // Avoid returning a Promise from useEffect — call async checks internally
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

  // السماح لكل من ADMIN و SUB_ADMIN
  if (!isLoading && isAuthenticated && user) {
    if (!isAdminUser) {
      router.push("/admin/login");
    }
  }
}, [isAuthenticated, isAdminUser, isLoading, isLoginPage, user, router]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-8">{children}</div>
    </div>
  );
}
