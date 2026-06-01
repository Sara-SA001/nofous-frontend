"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock, UserCheck } from "lucide-react";

interface RegistrationRequest {
  id: number;
  nationalId: string;
  firstName: string;
  nisba?: string;
  gender: string;
  dateOfBirth: string;
  createdAt: string;
  personalPhoto?: string | null;
  idFrontPhoto?: string | null;
  idBackPhoto?: string | null;
}

const getFileUrl = (url?: string | null) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `http://localhost:5000${url}`;
};

export default function RegistrationRequestsPage() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/admin/registration-requests");
      setRequests(res.data.requests || []);
    } catch (error) {
      toast.error("فشل في تحميل طلبات التسجيل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm("هل أنت متأكد من الموافقة على هذا الحساب؟")) return;
    setProcessingId(id);
    try {
      await api.put(`/admin/registration-requests/${id}/approve`);
      toast.success("✅ تمت الموافقة على الحساب");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في الموافقة");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("هل أنت متأكد من رفض هذا الحساب؟")) return;
    setProcessingId(id);
    try {
      await api.put(`/admin/registration-requests/${id}/reject`);
      toast.success("❌ تم رفض الحساب");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في الرفض");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <UserCheck className="w-9 h-9 text-blue-600" />
        <h1 className="text-3xl font-bold">طلبات التسجيل المعلقة</h1>
      </div>

      {loading ? (
        <p className="text-center py-12">جاري التحميل...</p>
      ) : requests.length === 0 ? (
        <p className="text-center py-12 text-gray-500">
          لا توجد طلبات تسجيل معلقة حالياً
        </p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-8 shadow border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    {req.firstName} {req.nisba}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    الرقم الوطني:{" "}
                    <span className="font-mono">{req.nationalId}</span>
                  </p>
                  <p className="text-gray-600">
                    تاريخ الميلاد:{" "}
                    {new Date(req.dateOfBirth).toLocaleDateString("ar-SY")}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(req.createdAt).toLocaleDateString("ar-SY")}
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {["personalPhoto", "idFrontPhoto", "idBackPhoto"].map(
                    (field) => {
                      const label =
                        field === "personalPhoto"
                          ? "الصورة الشخصية"
                          : field === "idFrontPhoto"
                            ? "صورة هوية أمامية"
                            : "صورة هوية خلفية";
                      const url =
                        field === "personalPhoto"
                          ? getFileUrl(req.personalPhoto)
                          : field === "idFrontPhoto"
                            ? getFileUrl(req.idFrontPhoto)
                            : getFileUrl(req.idBackPhoto);

                      return (
                        <div
                          key={field}
                          className="rounded-3xl border p-4 bg-slate-50 text-center"
                        >
                          <div className="text-sm font-medium text-slate-700 mb-2">
                            {label}
                          </div>
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-blue-500"
                            >
                              <img
                                src={url}
                                alt={label}
                                className="h-36 w-full object-cover"
                              />
                            </a>
                          ) : (
                            <div className="py-10 text-sm text-slate-500">
                              لا توجد صورة
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={processingId === req.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium disabled:opacity-50"
                  >
                    ✅ الموافقة على الحساب
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={processingId === req.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium disabled:opacity-50"
                  >
                    ❌ رفض الحساب
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
