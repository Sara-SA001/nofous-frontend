"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { Download, Users, User, Heart, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

export default function DocumentsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [deathTargetNationalId, setDeathTargetNationalId] = useState("");
  const [showDeathInput, setShowDeathInput] = useState(false);

  const generateDocument = async (
    endpoint: string,
    fileName: string,
    displayName: string,
  ) => {
    setLoading(endpoint);

    try {
      const res = await api.get(`/documents/${endpoint}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`تم تحميل ${displayName} بنجاح`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || `فشل في تحميل ${displayName}`,
      );
    } finally {
      setLoading(null);
    }
  };

  const generateDeathReportForOther = async () => {
    if (!deathTargetNationalId) {
      toast.error("يرجى إدخال الرقم الوطني للمتوفى");
      return;
    }

    setLoading("death-report-other");

    try {
      const res = await api.get(
        `/documents/death-report?nationalId=${encodeURIComponent(deathTargetNationalId.trim())}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `تقرير_وفاة_${deathTargetNationalId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("تم تحميل تقرير الوفاة بنجاح");
      setShowDeathInput(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في تحميل التقرير");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          الوثائق الرسمية
        </h1>
        <p className="text-gray-600 text-lg">استخرج وثائقك المدنية الرسمية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* بيان عائلي */}
        <div className="bg-white rounded-3xl p-8 shadow hover:shadow-2xl transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">بيان عائلي</h3>
            </div>
          </div>
          <button
            onClick={() =>
              generateDocument("family-record", "بيان_عائلي", "بيان عائلي")
            }
            disabled={loading === "family-record"}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition"
          >
            {loading === "family-record"
              ? "جاري التحميل..."
              : "تحميل بيان عائلي"}
          </button>
        </div>

        {/* بيان فردي */}
        <div className="bg-white rounded-3xl p-8 shadow hover:shadow-2xl transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">بيان قيد فردي</h3>
            </div>
          </div>
          <button
            onClick={() =>
              generateDocument("individual-record", "بيان_فردي", "بيان فردي")
            }
            disabled={loading === "individual-record"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition"
          >
            {loading === "individual-record"
              ? "جاري التحميل..."
              : "تحميل بيان فردي"}
          </button>
        </div>

        {/* بيان زواج - يظهر فقط إذا كان متزوج */}
        {user?.maritalStatus === "MARRIED" && (
          <div className="bg-white rounded-3xl p-8 shadow hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">بيان زواج</h3>
              </div>
            </div>
            <button
              onClick={() =>
                generateDocument(
                  "marriage-certificate",
                  "بيان_زواج",
                  "بيان زواج",
                )
              }
              disabled={loading === "marriage-certificate"}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 transition"
            >
              {loading === "marriage-certificate"
                ? "جاري التحميل..."
                : "تحميل بيان زواج"}
            </button>
          </div>
        )}

        {/* تقرير وفاة */}
        <div className="bg-white rounded-3xl p-8 shadow hover:shadow-2xl transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">تقرير وفاة</h3>
            </div>
          </div>

          <button
            onClick={() => setShowDeathInput(!showDeathInput)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium mb-4"
          >
            طلب تقرير وفاة
          </button>

          {showDeathInput && (
            <div className="mt-4 p-4 border border-red-200 rounded-xl bg-red-50">
              <input
                type="text"
                placeholder="الرقم الوطني للمتوفى"
                value={deathTargetNationalId}
                onChange={(e) => setDeathTargetNationalId(e.target.value)}
                className="form-input mb-3"
              />
              <button
                onClick={generateDeathReportForOther}
                disabled={
                  loading === "death-report-other" || !deathTargetNationalId
                }
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-xl"
              >
                {loading === "death-report-other"
                  ? "جاري التحميل..."
                  : "تحميل تقرير الوفاة"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
