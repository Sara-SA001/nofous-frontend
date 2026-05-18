"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import { Link2, FileText } from "lucide-react";

const API_ORIGIN = "http://localhost:5000";
const getFileUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

interface PersonSummary {
  id: number;
  firstName: string;
  nisba?: string;
  nationalId: string;
  gender?: "MALE" | "FEMALE";
  maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  isAlive?: boolean;
}

interface LinkRequest {
  id: number;
  type: "FATHER_LINK" | "HUSBAND_LINK";
  requester: PersonSummary;
  target: PersonSummary;
  status: "PENDING" | "APPROVED" | "REJECTED";
  marriageDate?: string;
  marriagePlace?: string;
  notes?: string;
  adminNotes?: string;
  checkedAt?: string;
  createdAt?: string;
  document1Url?: string;
  document2Url?: string;
  checkedBy?: {
    id: number;
    username: string;
    fullName?: string;
    role: "ADMIN" | "SUB_ADMIN";
  };
}

const relationTypeLabel = (type: LinkRequest["type"]) =>
  type === "FATHER_LINK" ? "ارتباط أب" : "ارتباط زواج";

const statusLabel = (status: LinkRequest["status"]) =>
  status === "PENDING" ? "قيد المراجعة" : status === "APPROVED" ? "مقبول" : "مرفوض";

const statusClass = (status: LinkRequest["status"]) =>
  status === "PENDING"
    ? "bg-amber-100 text-amber-700"
    : status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

const personFullName = (person?: PersonSummary) =>
  person ? `${person.firstName}${person.nisba ? ` ${person.nisba}` : ""}` : "—";

export default function LinkRequestsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [requests, setRequests] = useState<LinkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const hasFetched = useRef(false);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await api.get("/admin/link-requests");
      setRequests(res.data.requests || []);
    } catch (error) {
      const apiError = error as ApiError;
      const status = apiError.response?.status;

      if (status === 401 || status === 403) {
        logout();
        router.push("/admin/login");
      }

      toast.error(apiError.response?.data?.message || "فشل في تحميل طلبات الارتباط");
    } finally {
      setLoading(false);
    }
  }, [logout, router]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      await api.put(`/admin/link-requests/${id}/${action}`, {});
      toast.success(action === "approve" ? "تمت الموافقة على الطلب" : "تم رفض الطلب");
      fetchRequests();
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || "حدث خطأ أثناء المعالجة");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link2 className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold">كافة طلبات الارتباط (أب / زوج)</h1>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات ارتباط حاليًا</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-3xl p-8 shadow border">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold">{relationTypeLabel(req.type)}</h2>
                  <p className="mt-2 text-gray-700">
                    من: <strong>{personFullName(req.requester)}</strong> ({req.requester?.nationalId || "—"})
                  </p>
                  <p className="text-gray-700">
                    إلى: <strong>{personFullName(req.target)}</strong> ({req.target?.nationalId || "—"})
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    تاريخ الطلب:{" "}
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString("ar-SY") : "—"}
                  </p>
                </div>

                <span className={`rounded-full px-4 py-2 text-sm font-medium ${statusClass(req.status)}`}>
                  {statusLabel(req.status)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-2xl p-5">
                <div>
                  <p className="text-gray-500 text-sm">حالة مقدم الطلب</p>
                  <p>{req.requester?.isAlive === false ? "متوفى" : "حي"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">حالة الطرف الآخر</p>
                  <p>{req.target?.isAlive === false ? "متوفى" : "حي"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">الوضع العائلي للطرف الآخر</p>
                  <p>{req.target?.maritalStatus || "—"}</p>
                </div>
                {req.type === "HUSBAND_LINK" && (
                  <>
                    <div>
                      <p className="text-gray-500 text-sm">تاريخ الزواج</p>
                      <p>{req.marriageDate ? new Date(req.marriageDate).toLocaleDateString("ar-SY") : "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">مكان الزواج</p>
                      <p>{req.marriagePlace || "—"}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-gray-500 text-sm">ملاحظات الطلب</p>
                  <p>{req.notes || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">ملاحظات الإدارة</p>
                  <p>{req.adminNotes || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">تاريخ المعالجة</p>
                  <p>{req.checkedAt ? new Date(req.checkedAt).toLocaleDateString("ar-SY") : "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">تمت المعالجة بواسطة</p>
                  <p>{req.checkedBy?.fullName || req.checkedBy?.username || "—"}</p>
                </div>
              </div>

              {(req.document1Url || req.document2Url) && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <FileText size={18} /> المستندات المرفقة
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {req.document1Url && (
                      <a
                        href={getFileUrl(req.document1Url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        المستند الأول
                      </a>
                    )}
                    {req.document2Url && (
                      <a
                        href={getFileUrl(req.document2Url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        المستند الثاني
                      </a>
                    )}
                  </div>
                </div>
              )}

              {req.status === "PENDING" && (
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => handleAction(req.id, "approve")}
                    disabled={processingId === req.id}
                    className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    موافقة
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "reject")}
                    disabled={processingId === req.id}
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    رفض
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
