"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { UserPlus, Upload, Calendar, MapPin } from "lucide-react";

export default function LinkRequestPage() {
  const [formData, setFormData] = useState({
    targetNationalId: "",
    type: "FATHER_LINK" as "FATHER_LINK" | "HUSBAND_LINK",
    notes: "",
    marriageDate: "",
    marriagePlace: "",
  });

  const [files, setFiles] = useState({
    document1: null as File | null,
    document2: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "document1" | "document2",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles({ ...files, [field]: file });

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === "document1") setPreview1(e.target?.result as string);
        else setPreview2(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.targetNationalId) {
      toast.error("يرجى إدخال الرقم الوطني للشخص المراد الارتباط به");
      setLoading(false);
      return;
    }

    if (
      formData.type === "HUSBAND_LINK" &&
      (!formData.marriageDate || !formData.marriagePlace)
    ) {
      toast.error("يرجى إدخال تاريخ ومكان الزواج");
      setLoading(false);
      return;
    }

    if (!files.document1 || !files.document2) {
      toast.error("يجب رفع صورتين من دفتر العائلة");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("targetNationalId", formData.targetNationalId);
    data.append("type", formData.type);
    data.append("notes", formData.notes);

    if (formData.type === "HUSBAND_LINK") {
      data.append("marriageDate", formData.marriageDate);
      data.append("marriagePlace", formData.marriagePlace);
    }

    if (files.document1) data.append("document1", files.document1);
    if (files.document2) data.append("document2", files.document2);

    try {
      const res = await api.post("/link/request", data);

      toast.success(res.data.message || "تم إرسال طلب الارتباط بنجاح");

      // Reset form
      setFormData({
        targetNationalId: "",
        type: "FATHER_LINK",
        notes: "",
        marriageDate: "",
        marriagePlace: "",
      });
      setFiles({ document1: null, document2: null });
      setPreview1(null);
      setPreview2(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          طلب ارتباط عائلي
        </h1>
        <p className="text-gray-600">اربط حسابك بوالدك أو زوجك/زوجتك</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-10 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* الرقم الوطني للشخص المستهدف */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              الرقم الوطني للشخص المراد الارتباط به
            </label>
            <input
              type="text"
              name="targetNationalId"
              value={formData.targetNationalId}
              onChange={handleInputChange}
              className="form-input text-lg"
              placeholder="مثال: 1234567890"
              required
            />
          </div>

          {/* نوع الارتباط */}
          <div>
            <label className="block text-sm font-medium mb-2">
              نوع الارتباط
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="FATHER_LINK">ارتباط بوالد (أب)</option>
              <option value="HUSBAND_LINK">ارتباط بزوج / زوجة</option>
            </select>
          </div>

          {/* تاريخ ومكان الزواج (يظهر فقط للزواج) */}
          {formData.type === "HUSBAND_LINK" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={18} /> تاريخ الزواج
                </label>
                <input
                  type="date"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin size={18} /> مكان الزواج
                </label>
                <input
                  type="text"
                  name="marriagePlace"
                  value={formData.marriagePlace}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="مثال: دمشق"
                  required
                />
              </div>
            </>
          )}

          {/* ملاحظات */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-input h-24 resize-y"
              placeholder="أي معلومات إضافية..."
            />
          </div>

          {/* رفع الصور */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-4">
              رفع صورتين من دفتر العائلة
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">
                  الصورة الأولى (صفحة صاحب الطلب)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "document1")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview1 && (
                  <img
                    src={preview1}
                    alt="preview1"
                    className="mt-3 h-40 object-contain rounded-xl border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">
                  الصورة الثانية (صفحة الشخص المراد الارتباط به)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "document2")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview2 && (
                  <img
                    src={preview2}
                    alt="preview2"
                    className="mt-3 h-40 object-contain rounded-xl border"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-70"
        >
          {loading ? (
            "جاري إرسال الطلب..."
          ) : (
            <>
              <UserPlus size={24} />
              إرسال طلب الارتباط
            </>
          )}
        </button>
      </form>
    </div>
  );
}
