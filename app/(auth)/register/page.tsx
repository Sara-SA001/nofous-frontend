"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type ApiError = {
  response?: {
    data?: {
      message?: string;
      errors?: Array<{
        path?: string[];
        field?: string;
        message: string;
      }>;
    };
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nationalId: "",
    firstName: "",
    nisba: "",
    fatherName: "",
    grandfatherName: "",
    motherName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",
    governorate: "",
    gender: "MALE",
    religion: "MUSLIM",
    maritalStatus: "SINGLE",
    password: "",
    amanah: "",
    registrationPlace: "",
    registrationNumber: "",
    cardNumber: "",
    issueDate: "",
  });

  const [files, setFiles] = useState({
    personalPhoto: null as File | null,
    idFrontPhoto: null as File | null,
    idBackPhoto: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    // إضافة الحقول النصية
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    // إضافة الصور
    if (files.personalPhoto) data.append("personalPhoto", files.personalPhoto);
    if (files.idFrontPhoto) data.append("idFrontPhoto", files.idFrontPhoto);
    if (files.idBackPhoto) data.append("idBackPhoto", files.idBackPhoto);

    try {
      const res = await api.post("/auth/register", data);

      if (res.data.success) {
        toast.success("تم إنشاء الحساب بنجاح");
        router.push("/login");
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorData = apiError.response?.data;

      if (errorData?.errors) {
        errorData.errors.forEach((err) => {
          const field = err.path?.join(" → ") || err.field || "field";
          toast.error(`${field}: ${err.message}`);
        });
      } else {
        toast.error(errorData?.message || "حدث خطأ أثناء التسجيل");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          إنشاء حساب جديد
        </h1>

        <form onSubmit={handleRegister} className="space-y-8">
          {/* معلومات شخصية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                الرقم الوطني
              </label>
              <input
                name="nationalId"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                الاسم الأول
              </label>
              <input
                name="firstName"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                النسبة (اللقب)
              </label>
              <input
                name="nisba"
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اسم الأب</label>
              <input
                name="fatherName"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اسم الجد</label>
              <input
                name="grandfatherName"
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اسم الأم</label>
              <input
                name="motherName"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* تاريخ ومكان الولادة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                تاريخ الولادة
              </label>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                مكان الولادة
              </label>
              <input
                name="placeOfBirth"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* الجنسية والمحافظة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">الجنسية</label>
              <input
                name="nationality"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المحافظة</label>
              <input
                name="governorate"
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الأمانة</label>
              <input
                name="amanah"
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* الجنس والدين والحالة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">الجنس</label>
              <select
                name="gender"
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الدين</label>
              <select
                name="religion"
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="MUSLIM">مسلم</option>
                <option value="CHRISTIAN">مسيحي</option>
                <option value="OTHER">آخر</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                الوضع العائلي
              </label>
              <select
                name="maritalStatus"
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="SINGLE">أعزب / عزباء</option>
                <option value="MARRIED">متزوج / متزوجة</option>
                <option value="DIVORCED">مطلق / مطلقة</option>
                <option value="WIDOWED">أرمل / أرملة</option>
              </select>
            </div>
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="form-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* معلومات القيد */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                محل القيد
              </label>
              <input
                name="registrationPlace"
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                رقم القيد
              </label>
              <input
                name="registrationNumber"
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                رقم البطاقة
              </label>
              <input
                name="cardNumber"
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                تاريخ الإصدار
              </label>
              <input
                type="date"
                name="issueDate"
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* رفع الصور */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">الصور المطلوبة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  الصورة الشخصية
                </label>
                <input
                  type="file"
                  name="personalPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  هوية - الوجه الأمامي
                </label>
                <input
                  type="file"
                  name="idFrontPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  هوية - الوجه الخلفي
                </label>
                <input
                  type="file"
                  name="idBackPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-xl transition disabled:opacity-70"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
          </button>
        </form>
      </div>
    </div>
  );
}