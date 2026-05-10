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
  Eye,
} from "lucide-react";

interface DeathRequest {
  id: number;
  requester?: { firstName: string; nationalId: string };
  target?: { firstName: string; nationalId: string; maritalStatus?: string };
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
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm("هل أنت متأكد من الموافقة؟")) return;
    setProcessingId(id);
    try {
      await api.put(`/admin/death-requests/${id}/approve`);
      toast.success("✅ تمت الموافقة");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في الموافقة");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("هل أنت متأكد من رفض الطلب؟")) return;
    setProcessingId(id);
    try {
      await api.put(`/admin/death-requests/${id}/reject`);
      toast.success("❌ تم رفض الطلب");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في الرفض");
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
        <p className="text-center py-12">جاري التحميل...</p>
      ) : requests.length === 0 ? (
        <p className="text-center py-12 text-gray-500">لا توجد طلبات حالياً</p>
      ) : (
        <div className="space-y-8">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-8 shadow border"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-2xl font-bold">طلب تسجيل وفاة</h3>
                  <p className="mt-2">
                    مقدم الطلب:{" "}
                    <strong>{req.requester?.firstName || "غير متوفر"}</strong>(
                    {req.requester?.nationalId || "—"})
                  </p>
                  <p>
                    المتوفى:{" "}
                    <strong>{req.target?.firstName || "غير متوفر"}</strong>(
                    {req.target?.nationalId || "—"})
                  </p>
                </div>

                <div
                  className={`px-5 py-2 rounded-full text-sm font-medium
                  ${
                    req.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : req.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {req.status}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl">
                <div>
                  <p className="text-gray-500">تاريخ الوفاة</p>
                  <p>{new Date(req.deathDate).toLocaleDateString("ar-SY")}</p>
                </div>
                <div>
                  <p className="text-gray-500">مكان الوفاة</p>
                  <p>{req.deathPlace}</p>
                </div>
                <div>
                  <p className="text-gray-500">الحالة العائلية</p>
                  <p>{req.target?.maritalStatus || "—"}</p>
                </div>
              </div>

              {/* المستندات */}
              <div className="mt-8">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FileText size={20} /> المستندات المرفقة
                </h4>
                <div className="flex flex-wrap gap-4">
                  {req.document1Url && (
                    <a
                      href={req.document1Url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      📄 خبر الوفاة
                    </a>
                  )}
                  {req.document2Url && (
                    <a
                      href={req.document2Url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      📄 تقرير طبي
                    </a>
                  )}
                  {req.document3Url && (
                    <a
                      href={req.document3Url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      📄 دفتر العائلة
                    </a>
                  )}
                </div>
              </div>

              {req.status === "PENDING" && (
                <div className="mt-10 flex gap-4">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-medium"
                  >
                    ✅ الموافقة
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-medium"
                  >
                    ❌ رفض
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
