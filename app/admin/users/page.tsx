"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { Search, UserCheck, UserX, Eye } from "lucide-react";

interface User {
  id: number;
  nationalId: string;
  firstName: string;
  nisba?: string;
  fatherName: string;
  gender: "MALE" | "FEMALE";
  maritalStatus: string;
  isAlive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "alive" | "dead">(
    "all",
  );

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error("فشل في تحميل قائمة المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.nisba || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.nationalId.includes(searchTerm);

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "alive" && user.isAlive) ||
      (filterStatus === "dead" && !user.isAlive);

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث بالاسم أو الرقم الوطني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none"
          >
            <option value="all">الكل</option>
            <option value="alive">على قيد الحياة</option>
            <option value="dead">متوفين</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10">جاري تحميل المستخدمين...</p>
      ) : (
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right p-6 font-medium">الرقم الوطني</th>
                <th className="text-right p-6 font-medium">الاسم</th>
                <th className="text-right p-6 font-medium">الجنس</th>
                <th className="text-right p-6 font-medium">الحالة العائلية</th>
                <th className="text-right p-6 font-medium">الحالة</th>
                <th className="text-right p-6 font-medium">تاريخ التسجيل</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-6 font-mono">{user.nationalId}</td>
                  <td className="p-6 font-medium">
                    {user.firstName} {user.nisba}
                  </td>
                  <td className="p-6">
                    {user.gender === "MALE" ? "ذكر" : "أنثى"}
                  </td>
                  <td className="p-6">{user.maritalStatus}</td>
                  <td className="p-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                      ${user.isAlive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {user.isAlive ? "على قيد الحياة" : "متوفى"}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("ar-SY")}
                  </td>
                  <td className="p-6">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="text-center py-12 text-gray-500">
              لا توجد نتائج مطابقة
            </p>
          )}
        </div>
      )}
    </div>
  );
}
