"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";

interface DeathRequest {
  id: number;
  requester: { id: number; firstName: string; nationalId: string };
  target: {
    id: number;
    firstName: string;
    nationalId: string;
    maritalStatus: string;
    isAlive: boolean;
  };
  deathDate: string;
  deathPlace: string;
  notes?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  document1Url?: string;
  document2Url?: string;
  document3Url?: string;
  createdAt: string;
}

export default function DeathRequestsPage() {
  const [requests, setRequests] = useState<DeathRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/admin/death-requests");
      setRequests(res.data.requests || []);
    } catch (error) {
      toast.error("فشل في تحميل طلبات الوفاة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await api.put(`/admin/death-requests/${id}/approve`);
      toast.success("✅ تمت الموافقة على طلب الوفاة");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في الموافقة");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("هل أنت متأكد من رفض هذا الطلب؟")) return;

    setProcessingId(id);
    try {
      await api.put(`/admin/death-requests/${id}/reject`);
      toast.success("❌ تم رفض الطلب");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء رفض الطلب");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="w-9 h-9 text-red-600" />
        <h1 className="text-3xl font-bold">طلبات تسجيل الوفاة</h1>
      </div>

      {loading ? (
        <p className="text-center py-12 text-lg">جاري التحميل...</p>
      ) : requests.length === 0 ? (
        <p className="text-center py-12 text-gray-500">لا توجد طلبات حالياً</p>
      ) : (
        <div className="space-y-8">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-8 shadow border"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">طلب تسجيل وفاة</h3>
                    <p className="text-gray-600 mt-1">
                      مقدم الطلب: <strong>{req.requester.firstName}</strong> (
                      {req.requester.nationalId})
                    </p>
                    <p className="text-gray-600">
                      المتوفى: <strong>{req.target.firstName}</strong> (
                      {req.target.nationalId})
                    </p>
                  </div>
                </div>

                <div
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2
                  ${
                    req.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : req.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {req.status === "APPROVED" && <CheckCircle size={22} />}
                  {req.status === "REJECTED" && <XCircle size={22} />}
                  {req.status === "PENDING" && <Clock size={22} />}
                  <span>
                    {req.status === "APPROVED"
                      ? "موافق"
                      : req.status === "REJECTED"
                        ? "مرفوض"
                        : "قيد المراجعة"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm bg-gray-50 p-6 rounded-2xl">
                <div>
                  <p className="text-gray-500">تاريخ الوفاة</p>
                  <p className="font-medium">
                    {new Date(req.deathDate).toLocaleDateString("ar-SY")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">مكان الوفاة</p>
                  <p className="font-medium">{req.deathPlace}</p>
                </div>
                <div>
                  <p className="text-gray-500">الحالة قبل الوفاة</p>
                  <p className="font-medium">{req.target.maritalStatus}</p>
                </div>
              </div>

              {req.notes && (
                <div className="mt-6 p-5 bg-amber-50 rounded-2xl border border-amber-200">
                  <p className="text-amber-800 font-medium">ملاحظات:</p>
                  <p className="mt-1 text-gray-700">{req.notes}</p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-6 text-red-600 text-sm">
                {req.document1Url && (
                  <a
                    href={req.document1Url}
                    target="_blank"
                    className="hover:underline flex items-center gap-2"
                  >
                    <FileText size={18} /> خبر الوفاة
                  </a>
                )}
                {req.document2Url && (
                  <a
                    href={req.document2Url}
                    target="_blank"
                    className="hover:underline flex items-center gap-2"
                  >
                    <FileText size={18} /> تقرير طبي
                  </a>
                )}
                {req.document3Url && (
                  <a
                    href={req.document3Url}
                    target="_blank"
                    className="hover:underline flex items-center gap-2"
                  >
                    <FileText size={18} /> دفتر العائلة
                  </a>
                )}
              </div>

              {req.status === "PENDING" && (
                <div className="mt-10 flex gap-4">
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={processingId === req.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium transition disabled:opacity-70"
                  >
                    ✅ الموافقة وتسجيل الوفاة
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={processingId === req.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium transition disabled:opacity-70"
                  >
                    ❌ رفض الطلب
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
