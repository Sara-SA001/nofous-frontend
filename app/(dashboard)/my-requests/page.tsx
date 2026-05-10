"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import {
  Clock,
  CheckCircle,
  XCircle,
  Users,
  AlertTriangle,
  Calendar,
} from "lucide-react";

interface LinkRequest {
  id: number;
  type: "FATHER_LINK" | "HUSBAND_LINK";
  targetNationalId: string;
  targetName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  marriageDate?: string;
  marriagePlace?: string;
  notes?: string;
  createdAt: string;
}

interface DeathRequest {
  id: number;
  targetNationalId: string;
  targetName?: string;
  deathDate: string;
  deathPlace: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes?: string;
  createdAt: string;
}

export default function MyRequestsPage() {
  const [linkRequests, setLinkRequests] = useState<LinkRequest[]>([]);
  const [deathRequests, setDeathRequests] = useState<DeathRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "link" | "death">("all");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [linkRes, deathRes] = await Promise.all([
        api.get("/link/my-requests"),
        api.get("/death/my-requests"),
      ]);

      setLinkRequests(linkRes.data.requests || []);
      setDeathRequests(deathRes.data.requests || []);
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusInfo = (status: string) => {
    if (status === "APPROVED")
      return {
        color: "text-green-600",
        icon: CheckCircle,
        label: "موافق عليه",
      };
    if (status === "REJECTED")
      return { color: "text-red-600", icon: XCircle, label: "مرفوض" };
    return { color: "text-amber-600", icon: Clock, label: "قيد المراجعة" };
  };

  const filteredRequests = () => {
    if (activeTab === "link") return linkRequests;
    if (activeTab === "death") return deathRequests;
    return [...linkRequests, ...deathRequests];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">طلباتي</h1>
          <p className="text-gray-600 mt-1">
            متابعة جميع طلبات الارتباط والوفاة
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition"
        >
          تحديث
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 font-medium rounded-t-xl transition ${activeTab === "all" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >
          الكل
        </button>
        <button
          onClick={() => setActiveTab("link")}
          className={`px-6 py-3 font-medium rounded-t-xl transition ${activeTab === "link" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >
          طلبات الارتباط
        </button>
        <button
          onClick={() => setActiveTab("death")}
          className={`px-6 py-3 font-medium rounded-t-xl transition ${activeTab === "death" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >
          طلبات الوفاة
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : filteredRequests().length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          لم تقم بإرسال أي طلبات بعد
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests().map((req: any, index: number) => {
            const isLink = "type" in req;
            const statusInfo = getStatusInfo(req.status);

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isLink ? "bg-blue-100" : "bg-red-100"}`}
                    >
                      {isLink ? (
                        <Users className="w-8 h-8 text-blue-600" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        {isLink
                          ? req.type === "FATHER_LINK"
                            ? "طلب ارتباط بوالد"
                            : "طلب ارتباط بزوج/زوجة"
                          : "طلب تسجيل وفاة"}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        الرقم الوطني:{" "}
                        <span className="font-mono">
                          {req.targetNationalId}
                        </span>
                        {req.targetName && ` - ${req.targetName}`}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl ${statusInfo.color} bg-gray-50`}
                  >
                    <statusInfo.icon className="w-5 h-5" />
                    <span className="font-semibold">{statusInfo.label}</span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">تاريخ التقديم</p>
                    <p className="font-medium">
                      {new Date(req.createdAt).toLocaleDateString("ar-SY")}
                    </p>
                  </div>

                  {isLink && req.marriageDate && (
                    <div>
                      <p className="text-gray-500">تاريخ الزواج</p>
                      <p className="font-medium">
                        {new Date(req.marriageDate).toLocaleDateString("ar-SY")}
                      </p>
                    </div>
                  )}

                  {isLink && req.marriagePlace && (
                    <div>
                      <p className="text-gray-500">مكان الزواج</p>
                      <p className="font-medium">{req.marriagePlace}</p>
                    </div>
                  )}

                  {!isLink && req.deathDate && (
                    <div>
                      <p className="text-gray-500">تاريخ الوفاة</p>
                      <p className="font-medium">
                        {new Date(req.deathDate).toLocaleDateString("ar-SY")}
                      </p>
                    </div>
                  )}

                  {!isLink && req.deathPlace && (
                    <div>
                      <p className="text-gray-500">مكان الوفاة</p>
                      <p className="font-medium">{req.deathPlace}</p>
                    </div>
                  )}
                </div>

                {req.notes && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-gray-500 text-sm">ملاحظات</p>
                    <p className="mt-1 text-gray-700">{req.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
