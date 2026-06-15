import React, { useEffect, useState } from "react";
import axiosClient from "../../../AxiosClient";
import { useSelector } from "react-redux";
import { UserIcon, IdentificationIcon, PhoneIcon, CheckBadgeIcon, XCircleIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * TableHistorique.jsx — Table displaying completed/past appointments
 * State:
 *   - AppointmentHistorique : array — old appointments fetched from API
 *   - Loading               : boolean — spinner state during fetch
 * Fetches historical appointments via GET /doctor/appointmentoldday/{doctorId}
 * using the authenticated doctor's ID from Redux. Each row shows patient
 * details, CIN, phone, session type, date/time, and a "Completed" status badge.
 * Shows loading spinner, populated table, or empty state message.
 */
const TableHistorique = () => {
  const { t } = useTranslation();
  const [AppointmentHistorique, setAppointmentHistorique] = useState([]);
  const [Loading, setLoading] = useState(true);
  const doctorData = useSelector((state) => state.AuthDoctor);

  /* Fetch historical (past) appointments on mount */
  useEffect(() => {
    if (doctorData.doctor) {
      setLoading(true);
      axiosClient
        .get("/doctor/appointmentoldday/" + doctorData.doctor.id)
        .then((res) => {
          setAppointmentHistorique(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [doctorData]);

  const HeaderTh = ({ children }) => (
    <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
      {children}
    </th>
  );

  return (
    <div className="mx-4 mt-8 mb-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-premium overflow-hidden">
        {/* Table Header Section */}
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">{t("doctor.interaction_history", "Interaction History")}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t("doctor.interaction_history_desc", "Archive of all past medical consultations and completed sessions")}
            </p>
          </div>
          <div className="flex items-center space-x-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
               {t("doctor.total_records", "Total Records:")} {AppointmentHistorique.length}
             </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {!Loading ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white">
                  <HeaderTh>{t("doctor.patient_details", "Patient Details")}</HeaderTh>
                  <HeaderTh>{t("doctor.reference", "Reference")}</HeaderTh>
                  <HeaderTh>{t("doctor.contact", "Contact")}</HeaderTh>
                  <HeaderTh>{t("doctor.session_type", "Session Type")}</HeaderTh>
                  <HeaderTh>{t("doctor.date_time", "Date & Time")}</HeaderTh>
                  <HeaderTh>{t("doctor.status", "Status")}</HeaderTh>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {AppointmentHistorique.length > 0 ? AppointmentHistorique.map((el, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 mr-4 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-100 transition-all">
                          {el.user.firstname.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {el.user.firstname} {el.user.lastname}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{t("doctor.patient_id", "Patient ID: #")}{el.user.id || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-600 font-medium text-sm">
                        <IdentificationIcon className="w-4 h-4 mr-2 text-slate-300" />
                        <code className="bg-slate-50 px-2 py-1 rounded text-[11px] font-bold text-slate-500">{el.user.cin}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-600 font-medium text-[13px]">
                        <PhoneIcon className="w-3.5 h-3.5 mr-2 text-slate-400 group-hover:text-brand-400 transition-colors" />
                        {el.user.phoneNumber || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-slate-50 border border-slate-100 text-slate-600 uppercase tracking-wider group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-100 transition-all">
                        {el.type_appointment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
                          {el.date_appointment}
                        </div>
                        <div className="flex items-center text-[11px] font-medium text-slate-400">
                          <ClockIcon className="w-3.5 h-3.5 mr-2" />
                          {el.time_appointment || el.type_appointment}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {el.cancel_appointment ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold uppercase tracking-wider">
                          <XCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                          {t("doctor.cancelled", "Cancelled")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                          <CheckBadgeIcon className="w-3.5 h-3.5 mr-1.5" />
                          {t("doctor.completed", "Completed")}
                        </span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                       <ClockIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">{t("doctor.no_historical_records", "No historical records found")}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">{t("doctor.retrieving_history", "Retrieving History...")}</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div>{t("doctor.compliance_version", "MediBook Compliance v2.4")}</div>
          <div className="flex items-center space-x-4">
             <span className="flex items-center">
               <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-2" />
               {t("doctor.historical_data_vault", "Historical Data Vault")}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHistorique;
