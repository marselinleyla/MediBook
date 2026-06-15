import React, { useEffect, useState } from "react";
import { XCircleIcon, UserIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import { useTranslation } from "react-i18next";

/*
 * TableAppointment.jsx — Table listing upcoming/incoming appointments
 * Props:
 *   - showAnnuler    : boolean — visibility of the cancel modal (parent state)
 *   - setShowAnnuler : function — toggle cancel modal visibility
 *   - setIdAppointment : function — sets the ID of the appointment to cancel
 * State:
 *   - NewAppointment : array — list of upcoming appointments from API
 *   - Loading        : boolean — loading spinner state
 * Fetches new appointments via GET /doctor/newappointment/{doctorId} using
 * the authenticated doctor's ID from Redux. Each row shows patient identity,
 * CIN, phone, consultation type, schedule, and a cancel button that opens
 * the AnnulerModel via the parent state.
 */
const TableAppointment = ({
  refreshKey,
  showAnnuler,
  setShowAnnuler,
  setIdAppointment,
}) => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [NewAppointment, setNewAppointment] = useState([]);
  const [Loading, setLoading] = useState(true);

  /* Fetch upcoming appointments when doctor data is ready */
  useEffect(() => {
    if (doctorData.doctor) {
      setLoading(true);
      axiosClient
        .get("/doctor/newappointment/" + doctorData.doctor.id)
        .then((res) => {
          setNewAppointment(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [doctorData, refreshKey]);

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
            <h3 className="text-xl font-bold text-slate-900 leading-tight">{t("doctor.incoming_appointments", "Incoming Appointments")}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t("doctor.incoming_appointments_desc", "Your scheduled consultations for the upcoming sessions")}
            </p>
          </div>
          <div className="flex items-center space-x-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
               {t("doctor.total", "Total:")} {NewAppointment.length}
             </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {!Loading ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white">
                  <HeaderTh>{t("doctor.patient_identity", "Patient Identity")}</HeaderTh>
                  <HeaderTh>{t("doctor.reference_cin", "Reference / CIN")}</HeaderTh>
                  <HeaderTh>{t("doctor.contact_information", "Contact Information")}</HeaderTh>
                  <HeaderTh>{t("doctor.consultation_type", "Consultation Type")}</HeaderTh>
                  <HeaderTh>{t("doctor.schedule_details", "Schedule Details")}</HeaderTh>
                  <HeaderTh>{t("doctor.management", "Management")}</HeaderTh>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {NewAppointment.length > 0 ? NewAppointment.map((el, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 mr-4">
                          {el.user.firstname.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {el.user.firstname} {el.user.lastname}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{el.user.email}</p>
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
                      <div className="flex items-center text-brand-600 font-bold text-[13px]">
                        <PhoneIcon className="w-3.5 h-3.5 mr-2 text-brand-400" />
                        {el.user.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                        el.type_appointment === 'Urgent' 
                        ? 'bg-rose-50 border-rose-100 text-rose-600' 
                        : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      } uppercase tracking-wider`}>
                        {el.type_appointment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm font-bold text-slate-900">
                          <ClockIcon className="w-4 h-4 mr-2 text-brand-500" />
                          {el.time_appointment}
                        </div>
                        <div className="flex items-center text-[11px] font-medium text-slate-400">
                          <CalendarIcon className="w-3.5 h-3.5 mr-2" />
                          {el.date_appointment}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setIdAppointment(el.id);
                          setShowAnnuler(!showAnnuler);
                        }}
                        className="inline-flex items-center px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        {t("common.cancel")}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                       <ClockIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">{t("doctor.no_pending_appointments", "No pending appointments scheduled")}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">{t("doctor.synchronizing_schedule", "Synchronizing Schedule...")}</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div>{t("doctor.doctor_dashboard_version", "MediBook Doctor Dashboard v4.1")}</div>
          <div className="flex items-center space-x-4">
             <span className="flex items-center">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
               {t("doctor.connected_to_medical_cloud", "Connected to Medical Cloud")}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableAppointment;
