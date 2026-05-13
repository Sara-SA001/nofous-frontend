"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { Search, Edit2, Save, X, UserCheck } from "lucide-react";

interface User {
  id: number;
  nationalId: string;
  firstName: string;
  nisba?: string;
  fatherName: string;
  grandfatherName?: string;
  motherName: string;
  gender: "MALE" | "FEMALE";
  religion: string;
  maritalStatus: string;
  isAlive: boolean;
  dateOfBirth: string;
  placeOfBirth: string;
  governorate: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch (error) {
      toast.error("فشل في تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // البحث
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nationalId.includes(searchTerm),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const startEditing = (user: User) => {
    setEditingUser(user);
    setFormData({ ...user });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setFormData({});
  };

  const saveChanges = async () => {
    if (!editingUser) return;

    try {
      await api.put(`/admin/users/${editingUser.id}`, formData);
      toast.success("تم تحديث بيانات المستخدم بنجاح");
      setEditingUser(null);
      fetchUsers(); // تحديث القائمة
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في تحديث البيانات");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>

        <div className="relative w-96">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="بحث بالاسم أو الرقم الوطني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12">جاري التحميل...</p>
      ) : (
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right p-5">الرقم الوطني</th>
                <th className="text-right p-5">الاسم الكامل</th>
                <th className="text-right p-5">الجنس</th>
                <th className="text-right p-5">الحالة العائلية</th>
                <th className="text-right p-5">الحالة</th>
                <th className="text-right p-5">تاريخ التسجيل</th>
                <th className="p-5 w-32">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-5 font-mono">{user.nationalId}</td>
                  <td className="p-5 font-medium">
                    {user.firstName} {user.nisba}
                  </td>
                  <td className="p-5">
                    {user.gender === "MALE" ? "ذكر" : "أنثى"}
                  </td>
                  <td className="p-5">{user.maritalStatus}</td>
                  <td className="p-5">
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${user.isAlive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {user.isAlive ? "على قيد الحياة" : "متوفى"}
                    </span>
                  </td>
                  <td className="p-5 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("ar-SY")}
                  </td>
                  <td className="p-5">
                    <button
                      onClick={() => startEditing(user)}
                      className="text-blue-600 hover:text-blue-700 p-2"
                    >
                      <Edit2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal للتعديل */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-6">تعديل بيانات المستخدم</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1">الرقم الوطني</label>
                <input
                  type="text"
                  value={formData.nationalId}
                  disabled
                  className="form-input bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">الاسم الأول</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">الحالة العائلية</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus || ""}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="SINGLE">أعزب/عزباء</option>
                  <option value="MARRIED">متزوج/متزوجة</option>
                  <option value="DIVORCED">مطلق/مطلقة</option>
                  <option value="WIDOWED">أرمل/أرملة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">الحالة (حي/متوفى)</label>
                <select
                  name="isAlive"
                  value={formData.isAlive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAlive: e.target.value === "true",
                    }))
                  }
                  className="form-input"
                >
                  <option value="true">على قيد الحياة</option>
                  <option value="false">متوفى</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={saveChanges}
                className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2"
              >
                <Save size={20} /> حفظ التعديلات
              </button>
              <button
                onClick={cancelEditing}
                className="flex-1 bg-gray-500 text-white py-4 rounded-2xl font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
