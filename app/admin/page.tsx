import Link from "next/link";
import { Users, Link as LinkIcon, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">لوحة تحكم الأدمن</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          href="/admin/link-requests"
          className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition group"
        >
          <LinkIcon className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold">طلبات الارتباط</h3>
          <p className="text-gray-600 mt-2">
            مراجعة وموافقة طلبات ربط الأب أو الزوج
          </p>
        </Link>

        <Link
          href="/admin/death-requests"
          className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition group"
        >
          <AlertTriangle className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-2xl font-bold">طلبات الوفاة</h3>
          <p className="text-gray-600 mt-2">مراجعة طلبات تسجيل الوفيات</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition group"
        >
          <Users className="w-12 h-12 text-emerald-600 mb-4" />
          <h3 className="text-2xl font-bold">إدارة المستخدمين</h3>
          <p className="text-gray-600 mt-2">البحث عن المستخدمين وإدارتهم</p>
        </Link>
      </div>
    </div>
  );
}
