import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../../AxiosClient";
import { useTranslation } from "react-i18next";
import {
  UserGroupIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  EyeIcon,
  CalendarDaysIcon,
  XCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const AdminDashboardTable = () => {
  const { t } = useTranslation();
  const [DoctorsToday, setDoctorsToday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [LoadingButton, setLoadingButton] = useState({ loading: false, id: 0 });

  const VerifierDoctor = (idDoctor) => {
    setLoadingButton({ id: idDoctor, loading: true });
    axiosClient
      .post("/admin/verified", { id: idDoctor })
      .then(() => {
        return axiosClient.get("/admin/doctors/today");
      })
      .then((res) => {
        setDoctorsToday(res.data);
        setLoadingButton({ id: idDoctor, loading: false });
      })
      .catch((err) => {
        console.error(err);
        setLoadingButton({ id: idDoctor, loading: false });
      });
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosClient
      .get("/admin/doctors/today")
      .then((res) => {
        setDoctorsToday(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to load doctors");
        setLoading(false);
      });
  }, []);

  const HeaderTh = ({ children }) => (
    <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
      {children}
    </th>
  );

  return (
    <div className="mx-4 mt-8 mb-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-premium overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {t("admin.todays_registrations", "Today's Registrations")}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t("admin.new_doctors_today", "New doctors registered today")}: <span className="text-brand-600 font-bold">{DoctorsToday.length}</span>
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <HeaderTh>{t("admin.doctor_identity", "Doctor Identity")}</HeaderTh>
                <HeaderTh>{t("admin.medical_id", "Medical ID")}</HeaderTh>
                <HeaderTh>{t("admin.contact_info", "Contact Info")}</HeaderTh>
                <HeaderTh>{t("admin.status", "Status")}</HeaderTh>
                <HeaderTh>{t("admin.registered_at", "Registered At")}</HeaderTh>
                <HeaderTh>{t("admin.details", "Details")}</HeaderTh>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-50 rounded-3xl mb-4">
                        <svg className="animate-spin w-8 h-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                      <p className="text-slate-900 font-bold">{t("common.loading", "Loading...")}</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-rose-50 rounded-3xl mb-4">
                        <XCircleIcon className="w-12 h-12 text-rose-400" />
                      </div>
                      <p className="text-slate-900 font-bold">{t("admin.load_error", "Could not load data")}</p>
                      <p className="text-sm text-slate-400 mt-1">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : DoctorsToday.length > 0 ? (
                DoctorsToday.map((el, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 mr-4">
                          {el.firstname?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            Dr. {el.firstname} {el.lastname}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{el.specialite || t("admin.general_practitioner", "General Practitioner")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-600 font-medium text-sm">
                        <IdentificationIcon className="w-4 h-4 mr-2 text-slate-300" />
                        <code className="bg-slate-50 px-2 py-1 rounded text-[11px] font-bold text-slate-500">{el.Matricule || "—"}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-slate-600 font-medium text-[13px]">
                          <PhoneIcon className="w-3.5 h-3.5 mr-2 text-brand-400" />
                          {el.phoneNumber}
                        </div>
                        <div className="flex items-center text-slate-400 font-medium text-[12px]">
                          <EnvelopeIcon className="w-3.5 h-3.5 mr-2 text-slate-300" />
                          {el.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {el.verified === 1 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold uppercase tracking-wider">
                          {t("admin.verified", "Verified")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[11px] font-bold uppercase tracking-wider">
                          {t("admin.pending", "Pending")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-600">
                        <ClockIcon className="w-4 h-4 mr-2 text-slate-400" />
                        {el.created_at ? new Date(el.created_at).toLocaleTimeString() : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {el.verified !== 1 && (
                          <button
                            disabled={LoadingButton.loading && LoadingButton.id === el.id}
                            onClick={() => VerifierDoctor(el.id)}
                            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all bg-brand-600 text-white hover:bg-brand-700 shadow-premium shadow-brand-200/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {LoadingButton.loading && LoadingButton.id === el.id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {t("admin.processing", "Processing")}
                              </>
                            ) : (
                              <>
                                <ShieldCheckIcon className="w-4 h-4 mr-1.5" />
                                {t("admin.verify", "Verify")}
                              </>
                            )}
                          </button>
                        )}
                        <Link
                          to={`/doctor/View_Profile/${el.id}`}
                          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:shadow-sm"
                        >
                          <EyeIcon className="w-4 h-4 mr-1.5" />
                          {t("admin.view_profile", "View Profile")}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-50 rounded-3xl mb-4">
                        <CalendarDaysIcon className="w-12 h-12 text-slate-300" />
                      </div>
                      <p className="text-slate-900 font-bold">{t("admin.no_registrations_today", "No new registrations today")}</p>
                      <p className="text-sm text-slate-400 mt-1">{t("admin.check_back_later", "Check back later for new doctor registrations.")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <div>{t("admin.registry_management", "MediBook Registry Management v2.4")}</div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
              {t("admin.live_registry_status", "Live Registry Status")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardTable;
