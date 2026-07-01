"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { Search, Edit2, Trash2, X } from "lucide-react";

type UserStatus = "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
type Gender = "MALE" | "FEMALE";
type Religion = "MUSLIM" | "CHRISTIAN" | "OTHER";
type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";

interface UserRow {
  id: number;
  nationalId: string;
  firstName: string;
  nisba?: string;
  fatherName: string;
  grandfatherName?: string;
  motherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  governorate: string;
  amanah?: string;
  registrationPlace: string;
  registrationNumber: string;
  registrationDate: string;
  issueDate?: string;
  gender: Gender;
  religion: Religion;
  maritalStatus: MaritalStatus;
  cardNumber?: string;
  fatherId?: number | null;
  husbandId?: number | null;
  status: UserStatus;
  isAlive: boolean;
  createdAt: string;
}

type EditableUser = {
  nationalId: string;
  firstName: string;
  nisba: string;
  fatherName: string;
  grandfatherName: string;
  motherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  governorate: string;
  amanah: string;
  registrationPlace: string;
  registrationNumber: string;
  registrationDate: string;
  issueDate: string;
  gender: Gender;
  religion: Religion;
  maritalStatus: MaritalStatus;
  cardNumber: string;
  fatherId: string;
  husbandId: string;
  status: UserStatus;
  isAlive: boolean;
};

const toInputDate = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

const toEditable = (user: UserRow): EditableUser => ({
  nationalId: user.nationalId || "",
  firstName: user.firstName || "",
  nisba: user.nisba || "",
  fatherName: user.fatherName || "",
  grandfatherName: user.grandfatherName || "",
  motherName: user.motherName || "",
  dateOfBirth: toInputDate(user.dateOfBirth),
  placeOfBirth: user.placeOfBirth || "",
  nationality: user.nationality || "",
  governorate: user.governorate || "",
  amanah: user.amanah || "",
  registrationPlace: user.registrationPlace || "",
  registrationNumber: user.registrationNumber || "",
  registrationDate: toInputDate(user.registrationDate),
  issueDate: toInputDate(user.issueDate),
  gender: user.gender || "MALE",
  religion: user.religion || "MUSLIM",
  maritalStatus: user.maritalStatus || "SINGLE",
  cardNumber: user.cardNumber || "",
  fatherId: user.fatherId ? String(user.fatherId) : "",
  husbandId: user.husbandId ? String(user.husbandId) : "",
  status: user.status || "PENDING",
  isAlive: Boolean(user.isAlive),
});

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [formData, setFormData] = useState<EditableUser | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch {
      toast.error("فشل في تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(normalized) ||
        (user.nisba || "").toLowerCase().includes(normalized) ||
        user.nationalId.includes(normalized),
    );
  }, [searchTerm, users]);

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.",
      )
    )
      return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("تم حذف المستخدم بنجاح");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في حذف المستخدم");
    }
  };

  const openEdit = (user: UserRow) => {
    setEditingUser(user);
    setFormData(toEditable(user));
  };

  const closeEdit = () => {
    if (saving) return;
    setEditingUser(null);
    setFormData(null);
  };

  const setField = (field: keyof EditableUser, value: string | boolean) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value } as EditableUser);
  };

  const handleSave = async () => {
    if (!editingUser || !formData) return;
    setSaving(true);
    try {
      const payload = {
        ...formData,
        nisba: formData.nisba || null,
        grandfatherName: formData.grandfatherName || null,
        amanah: formData.amanah || null,
        issueDate: formData.issueDate || null,
        cardNumber: formData.cardNumber || null,
        fatherId: formData.fatherId || null,
        husbandId: formData.husbandId || null,
      };

      await api.put(`/admin/users/${editingUser.id}`, payload);
      toast.success("تم تعديل بيانات المستخدم");
      closeEdit();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في تعديل المستخدم");
    } finally {
      setSaving(false);
    }
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
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right p-6">الرقم الوطني</th>
                <th className="text-right p-6">الاسم</th>
                <th className="text-right p-6">الجنس</th>
                <th className="text-right p-6">الحالة</th>
                <th className="text-right p-6">حالة الحساب</th>
                <th className="text-right p-6">تاريخ التسجيل</th>
                <th className="p-6 w-32">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-6 font-mono">{user.nationalId}</td>
                  <td className="p-6 font-medium">
                    {user.firstName} {user.nisba || ""}
                  </td>
                  <td className="p-6">
                    {user.gender === "MALE" ? "ذكر" : "أنثى"}
                  </td>
                  <td className="p-6">
                    {user.isAlive ? user.maritalStatus : "متوفى"}
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : user.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("ar-SY")}
                  </td>
                  <td className="p-6 flex gap-3">
                    <button
                      onClick={() => openEdit(user)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && formData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">تعديل بيانات المستخدم</h2>
              <button
                onClick={closeEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="form-input"
                placeholder="الرقم الوطني"
                value={formData.nationalId}
                onChange={(e) => setField("nationalId", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="الاسم الأول"
                value={formData.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="النسبة"
                value={formData.nisba}
                onChange={(e) => setField("nisba", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="اسم الأب"
                value={formData.fatherName}
                onChange={(e) => setField("fatherName", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="اسم الجد"
                value={formData.grandfatherName}
                onChange={(e) => setField("grandfatherName", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="اسم الأم"
                value={formData.motherName}
                onChange={(e) => setField("motherName", e.target.value)}
              />
              <input
                type="date"
                className="form-input"
                value={formData.dateOfBirth}
                onChange={(e) => setField("dateOfBirth", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="مكان الولادة"
                value={formData.placeOfBirth}
                onChange={(e) => setField("placeOfBirth", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="الجنسية"
                value={formData.nationality}
                onChange={(e) => setField("nationality", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="المحافظة"
                value={formData.governorate}
                onChange={(e) => setField("governorate", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="الأمانة"
                value={formData.amanah}
                onChange={(e) => setField("amanah", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="محل القيد"
                value={formData.registrationPlace}
                onChange={(e) => setField("registrationPlace", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="رقم القيد"
                value={formData.registrationNumber}
                onChange={(e) => setField("registrationNumber", e.target.value)}
              />
              <input
                type="date"
                className="form-input"
                value={formData.registrationDate}
                onChange={(e) => setField("registrationDate", e.target.value)}
              />
              <input
                type="date"
                className="form-input"
                value={formData.issueDate}
                onChange={(e) => setField("issueDate", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="رقم البطاقة"
                value={formData.cardNumber}
                onChange={(e) => setField("cardNumber", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Father ID"
                value={formData.fatherId}
                onChange={(e) => setField("fatherId", e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Husband ID"
                value={formData.husbandId}
                onChange={(e) => setField("husbandId", e.target.value)}
              />

              <select
                className="form-input"
                value={formData.gender}
                onChange={(e) => setField("gender", e.target.value)}
              >
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
              </select>
              <select
                className="form-input"
                value={formData.religion}
                onChange={(e) => setField("religion", e.target.value)}
              >
                <option value="MUSLIM">مسلم</option>
                <option value="CHRISTIAN">مسيحي</option>
                <option value="OTHER">آخر</option>
              </select>
              <select
                className="form-input"
                value={formData.maritalStatus}
                onChange={(e) => setField("maritalStatus", e.target.value)}
              >
                <option value="SINGLE">أعزب/عزباء</option>
                <option value="MARRIED">متزوج/متزوجة</option>
                <option value="DIVORCED">مطلق/مطلقة</option>
                <option value="WIDOWED">أرمل/أرملة</option>
              </select>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="BANNED">BANNED</option>
              </select>
              <select
                className="form-input"
                value={formData.isAlive ? "true" : "false"}
                onChange={(e) => setField("isAlive", e.target.value === "true")}
              >
                <option value="true">حي</option>
                <option value="false">متوفى</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>
              <button
                onClick={closeEdit}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300"
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
