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
  fatherName: string;
  grandfatherName?: string;
  motherName: string;
  gender: string;
  religion: string;
  maritalStatus: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  governorate: string;
  amanah?: string;
  registrationPlace?: string;
  registrationNumber?: string;
  cardNumber?: string;
  issueDate?: string | null;
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

              <div className="mt-8 grid gap-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl border bg-slate-50 p-6">
                    <h4 className="text-lg font-semibold mb-4">
                      البيانات الشخصية
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { label: "الرقم الوطني", value: req.nationalId },
                        { label: "الاسم الأول", value: req.firstName },
                        { label: "النسبة", value: req.nisba || "غير محدد" },
                        { label: "اسم الأب", value: req.fatherName },
                        {
                          label: "اسم الجد",
                          value: req.grandfatherName || "غير محدد",
                        },
                        { label: "اسم الأم", value: req.motherName },
                        { label: "الجنس", value: req.gender },
                        { label: "الدين", value: req.religion },
                        {
                          label: "الحالة الاجتماعية",
                          value: req.maritalStatus,
                        },
                        {
                          label: "تاريخ الميلاد",
                          value: new Date(req.dateOfBirth).toLocaleDateString(
                            "ar-SY",
                          ),
                        },
                        { label: "مكان الميلاد", value: req.placeOfBirth },
                        { label: "الجنسية", value: req.nationality },
                        { label: "المحافظة", value: req.governorate },
                        { label: "الأمانة", value: req.amanah || "غير محدد" },
                        {
                          label: "مكان التسجيل",
                          value: req.registrationPlace || "غير محدد",
                        },
                        {
                          label: "رقم التسجيل",
                          value: req.registrationNumber || "غير محدد",
                        },
                        {
                          label: "رقم البطاقة",
                          value: req.cardNumber || "غير محدد",
                        },
                        {
                          label: "تاريخ الإصدار",
                          value: req.issueDate
                            ? new Date(req.issueDate).toLocaleDateString(
                                "ar-SY",
                              )
                            : "غير محدد",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-3xl border border-slate-200 bg-white p-4"
                        >
                          <div className="text-sm text-slate-500">
                            {item.label}
                          </div>
                          <div className="mt-2 font-medium text-slate-800">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border bg-slate-50 p-6">
                    <h4 className="text-lg font-semibold mb-4">
                      الوثائق والوسائط
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          label: "الصورة الشخصية",
                          url: getFileUrl(req.personalPhoto),
                        },
                        {
                          label: "هوية أمامية",
                          url: getFileUrl(req.idFrontPhoto),
                        },
                        {
                          label: "هوية خلفية",
                          url: getFileUrl(req.idBackPhoto),
                        },
                      ].map((file) => (
                        <div
                          key={file.label}
                          className="rounded-3xl border border-slate-200 bg-white overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-slate-200 bg-slate-100 text-sm font-medium text-slate-700">
                            {file.label}
                          </div>
                          {file.url ? (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block h-48 overflow-hidden"
                            >
                              <img
                                src={file.url}
                                alt={file.label}
                                className="h-full w-full object-cover"
                              />
                            </a>
                          ) : (
                            <div className="flex h-48 items-center justify-center text-sm text-slate-500">
                              لا توجد صورة
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
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
