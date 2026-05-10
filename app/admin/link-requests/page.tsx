"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

interface LinkRequest {
  id: number;
  type: "FATHER_LINK" | "HUSBAND_LINK";
  requester: { firstName: string; nationalId: string };
  target: { firstName: string; nationalId: string };
  status: "PENDING" | "APPROVED" | "REJECTED";
  marriageDate?: string;
  marriagePlace?: string;
  document1Url?: string;
  document2Url?: string;
}

export default function LinkRequestsPage() {
  const [requests, setRequests] = useState<LinkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/admin/link-requests");
      setRequests(res.data.requests || []);
    } catch {
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      await api.put(`/admin/link-requests/${id}/${action}`);
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
      <h1 className="text-3xl font-bold mb-8">طلبات الارتباط العائلي</h1>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات حالياً</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-3xl p-8 shadow">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {req.type === "FATHER_LINK" ? "طلب ارتباط بوالد" : "طلب ارتباط زواج"}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    من: {req.requester.firstName} ({req.requester.nationalId})
                  </p>
                  <p className="text-gray-600">
                    إلى: {req.target.firstName} ({req.target.nationalId})
                  </p>
                </div>
                <span className="h-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
                  {req.status}
                </span>
              </div>

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
