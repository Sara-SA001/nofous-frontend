// app/(dashboard)/page.tsx
"use client";

import { useAuthStore } from "../../store/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">مرحباً، {user?.firstName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">الوثائق الرسمية</h3>
          <p className="text-gray-600 mb-6">
            استخراج بيان عائلي، بيان فردي، بيان زواج، تقرير وفاة
          </p>
          <a
            href="/documents"
            className="text-blue-600 font-medium hover:underline"
          >
            الذهاب إلى الوثائق →
          </a>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">طلب ارتباط</h3>
          <p className="text-gray-600 mb-6">ربط مع الأب أو الزوج/الزوجة</p>
          <a
            href="/link-request"
            className="text-blue-600 font-medium hover:underline"
          >
            تقديم طلب →
          </a>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">طلب وفاة</h3>
          <p className="text-gray-600 mb-6">تقديم طلب تسجيل وفاة</p>
          <a
            href="/death-request"
            className="text-blue-600 font-medium hover:underline"
          >
            تقديم طلب →
          </a>
        </div>
      </div>
    </div>
  );
}
