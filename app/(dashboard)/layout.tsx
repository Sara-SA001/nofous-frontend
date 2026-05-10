// app/(dashboard)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // التحقق من المصادقة عند تحميل الصفحة
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // إعادة التوجيه إلى تسجيل الدخول إذا لم يكن المستخدم مصادقاً وانتهى التحقق
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      setIsNavigating(true);
    }
  };

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  // إعادة التوجيه إذا لم يكن مصادقاً
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>جاري إعادة التوجيه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            onClick={() => handleNavigation("/")}
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            نفوس
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              onClick={() => handleNavigation("/")}
              className={`hover:text-blue-600 transition-colors ${
                pathname === "/" ? "text-blue-600 font-medium" : ""
              } ${isNavigating ? "pointer-events-none opacity-50" : ""}`}
            >
              الرئيسية
            </Link>
            <Link
              href="/documents"
              onClick={() => handleNavigation("/documents")}
              className={`hover:text-blue-600 transition-colors ${
                pathname === "/documents" ? "text-blue-600 font-medium" : ""
              } ${isNavigating ? "pointer-events-none opacity-50" : ""}`}
            >
              الوثائق
            </Link>
            <Link
              href="/link-request"
              onClick={() => handleNavigation("/link-request")}
              className={`hover:text-blue-600 transition-colors ${
                pathname === "/link-request" ? "text-blue-600 font-medium" : ""
              } ${isNavigating ? "pointer-events-none opacity-50" : ""}`}
            >
              طلب ارتباط
            </Link>
            <Link
              href="/death-request"
              onClick={() => handleNavigation("/death-request")}
              className={`hover:text-blue-600 transition-colors ${
                pathname === "/death-request" ? "text-blue-600 font-medium" : ""
              } ${isNavigating ? "pointer-events-none opacity-50" : ""}`}
            >
              طلب وفاة
            </Link>

            <button
              onClick={() => {
                useAuthStore.getState().logout();
                router.push("/login");
              }}
              className="text-red-600 hover:text-red-700 transition-colors"
              disabled={isNavigating}
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </nav>

      {/* Loading overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* المحتوى */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
