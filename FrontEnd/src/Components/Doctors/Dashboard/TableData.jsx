import React, { useEffect, useState } from "react";
import { XCircleIcon, ClockIcon, UserIcon, IdentificationIcon, PhoneIcon, ChevronRightIcon ,CalendarDaysIcon } from "@heroicons/react/24/outline";
import AnnulerModel from "../Includes/AnnulerModel";
import axiosClient from "../../../AxiosClient";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

/*
 * TableDashboard.jsx — Doctor dashboard table showing today's appointments
 * State:
 *   - AppointmentToday : array — list of appointments for the current day
 *   - idAppointment    : number|null — index of appointment to cancel
 *   - showAnnuler      : boolean — toggles the cancellation confirmation modal
 *   - loading          : boolean — spinner during data fetch
 *   - error            : string|null — error message from the API
 * Fetches today's appointments via GET /doctor/appointmenttoday/{doctorId}
 * using the authenticated doctor's ID from Redux.
 * AnnulerAppointment(): toggles the cancel modal and resets the selected
 *   appointment ID.
 * HeaderTh: styled table header cell wrapper.
 * Shows loading spinner, error state, empty state ("No appointments for
 * today"), and the AnnulerModel modal for cancellation flow.
 */
const TableDashboard = () => {
  const { t } = useTranslation();
  const [showAnnuler, setShowAnnuler] = useState(false);
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [AppointmentToday, setAppointmentToday] = useState([]);
  const [idAppointment, setIdAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doctorId = doctorData.doctor?.id;

  /* Cancel appointment API call, then re-fetch today's list */
  const AnnulerAppointment = (id) => {
    axiosClient
      .post("/appointment/cancel", { id })
      .then(() => {
        setShowAnnuler(false);
        setIdAppointment(null);
        if (doctorId) {
          axiosClient
            .get("/doctor/appointmenttoday/" + doctorId)
            .then((res) => setAppointmentToday(res.data))
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /* Fetch today's appointments when doctorId is available */
  useEffect(() => {
    if (doctorId) {
      setLoading(true);
      setError(null);
      axiosClient
        .get("/doctor/appointmenttoday/" + doctorId)
        .then((res) => {
          setAppointmentToday(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.response?.data?.message || err.message || "Failed to load appointments");
          setLoading(false);
        });
    }
  }, [doctorId]);

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
              {t("doctor.todays_schedule", "Today's Schedule")}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t("doctor.you_have", "You have")} <span className="text-brand-600 font-bold">{AppointmentToday.length}</span> {t("doctor.appointments_scheduled", "appointments scheduled for today")}
            </p>
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-brand-600 hover:border-brand-100 transition-all shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <HeaderTh>{t("doctor.patient_details", "Patient Details")}</HeaderTh>
                <HeaderTh>{t("doctor.id_cin", "ID / CIN")}</HeaderTh>
                <HeaderTh>{t("doctor.contact", "Contact")}</HeaderTh>
                <HeaderTh>{t("doctor.type", "Type")}</HeaderTh>
                <HeaderTh>{t("doctor.schedule", "Schedule")}</HeaderTh>
                <HeaderTh></HeaderTh>
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
                      <p className="text-slate-900 font-bold">{t("common.loading", "Loading appointments...")}</p>
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
                      <p className="text-slate-900 font-bold">{t("doctor.load_error", "Could not load appointments")}</p>
                      <p className="text-sm text-slate-400 mt-1">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : AppointmentToday.length > 0 ? (
                AppointmentToday.map((el, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 mr-4">
                          {el.user?.firstname?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {el.user?.firstname || "Unknown"} {el.user?.lastname || ""}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{t("doctor.patient", "Patient")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-600 font-medium text-sm">
                        <IdentificationIcon className="w-4 h-4 mr-2 text-slate-300" />
                        {el.user?.cin || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-600 font-medium text-sm text-brand-600">
                        <PhoneIcon className="w-4 h-4 mr-2 text-brand-300" />
                        {el.user?.phoneNumber || t("doctor.no_number", "No number")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${
                        el.type_appointment === 'Emergency' 
                        ? 'bg-rose-50 border-rose-100 text-rose-600' 
                        : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      }`}>
                        {el.type_appointment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm font-bold text-slate-900">
                          <ClockIcon className="w-4 h-4 mr-2 text-brand-500" />
                          {el.time_appointment}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400 pl-6">
                          {el.date_appointment}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setIdAppointment(el.id);
                          setShowAnnuler(!showAnnuler);
                        }}
                        className="inline-flex items-center px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        {t("common.cancel")}
                      </button>
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
                      <p className="text-slate-900 font-bold">{t("doctor.no_appointments_today", "No appointments for today")}</p>
                      <p className="text-sm text-slate-400 mt-1">{t("doctor.check_back_later", "Check back later or view your full history.")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <div>{t("doctor.clinical_data_management", "MediBook Clinical Data Management v1.0")}</div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
              {t("doctor.real_time_sync", "Real-time synchronization active")}
            </span>
          </div>
        </div>
      </div>

      <AnnulerModel
        showAnnuler={showAnnuler}
        setShowAnnuler={setShowAnnuler}
        AnnulerAppointment={AnnulerAppointment}
        idAppointment={idAppointment}
      />
    </div>
  );
};

export default TableDashboard;

