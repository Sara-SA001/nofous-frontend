"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Upload,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";

export default function DeathRequestPage() {
  const [formData, setFormData] = useState({
    targetNationalId: "",
    deathDate: "",
    deathPlace: "",
    notes: "",
  });

  const [files, setFiles] = useState({
    document1: null as File | null, // خبر الوفاة
    document2: null as File | null, // تقرير طبي / شهادة وفاة
    document3: null as File | null, // صفحة من دفتر العائلة
  });

  const [previews, setPreviews] = useState({
    document1: null as string | null,
    document2: null as string | null,
    document3: null as string | null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "document1" | "document2" | "document3",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles({ ...files, [field]: file });

      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews({ ...previews, [field]: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.targetNationalId ||
      !formData.deathDate ||
      !formData.deathPlace
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      setLoading(false);
      return;
    }

    if (!files.document1 || !files.document2) {
      toast.error("يجب رفع خبر الوفاة وتقرير الوفاة على الأقل");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("targetNationalId", formData.targetNationalId);
    data.append("deathDate", formData.deathDate);
    data.append("deathPlace", formData.deathPlace);
    data.append("notes", formData.notes);

    if (files.document1) data.append("document1", files.document1);
    if (files.document2) data.append("document2", files.document2);
    if (files.document3) data.append("document3", files.document3);

    try {
      const res = await api.post("/death/request", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        res.data.message || "تم إرسال طلب الوفاة بنجاح، يرجى انتظار المراجعة",
      );

      // إعادة تعيين النموذج
      setFormData({
        targetNationalId: "",
        deathDate: "",
        deathPlace: "",
        notes: "",
      });
      setFiles({ document1: null, document2: null, document3: null });
      setPreviews({ document1: null, document2: null, document3: null });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-red-800 mb-3 flex items-center gap-3">
          <AlertTriangle className="w-9 h-9" />
          طلب تسجيل وفاة
        </h1>
        <p className="text-gray-600 text-lg">تقديم طلب تسجيل وفاة لشخص متوفى</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-10 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* الرقم الوطني للمتوفى */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              الرقم الوطني للمتوفى
            </label>
            <input
              type="text"
              name="targetNationalId"
              value={formData.targetNationalId}
              onChange={handleInputChange}
              className="form-input text-lg"
              placeholder="أدخل الرقم الوطني"
              required
            />
          </div>

          {/* تاريخ الوفاة */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar size={18} /> تاريخ الوفاة
            </label>
            <input
              type="date"
              name="deathDate"
              value={formData.deathDate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* مكان الوفاة */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin size={18} /> مكان الوفاة
            </label>
            <input
              type="text"
              name="deathPlace"
              value={formData.deathPlace}
              onChange={handleInputChange}
              className="form-input"
              placeholder="مثال: مستشفى الاسد - دمشق"
              required
            />
          </div>

          {/* ملاحظات */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-input h-28 resize-y"
              placeholder="أي تفاصيل إضافية عن الوفاة..."
            />
          </div>

          {/* رفع المستندات */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-4 flex items-center gap-2">
              <FileText size={20} /> رفع المستندات المطلوبة
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* خبر الوفاة */}
              <div>
                <p className="text-sm mb-2 font-medium">خبر الوفاة</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "document1")}
                  className="file-input"
                />
                {previews.document1 && (
                  <img
                    src={previews.document1}
                    className="mt-3 h-32 object-contain rounded-xl border"
                  />
                )}
              </div>

              {/* تقرير الوفاة الطبي */}
              <div>
                <p className="text-sm mb-2 font-medium">تقرير الوفاة الطبي</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "document2")}
                  className="file-input"
                />
                {previews.document2 && (
                  <img
                    src={previews.document2}
                    className="mt-3 h-32 object-contain rounded-xl border"
                  />
                )}
              </div>

              {/* صفحة دفتر العائلة */}
              <div>
                <p className="text-sm mb-2 font-medium">صفحة من دفتر العائلة</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "document3")}
                  className="file-input"
                />
                {previews.document3 && (
                  <img
                    src={previews.document3}
                    className="mt-3 h-32 object-contain rounded-xl border"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-12 w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition disabled:opacity-70"
        >
          {loading ? "جاري إرسال الطلب..." : "إرسال طلب تسجيل الوفاة"}
        </button>
      </form>
    </div>
  );
}
