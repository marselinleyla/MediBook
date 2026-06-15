import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GetAuthDoctor from "../../../hooks/GetAuthDoctor";
import axiosClient from "../../../AxiosClient";
import { CalendarIcon, ClockIcon, AdjustmentsHorizontalIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * TamingWork.jsx — Doctor's working hours and slot duration settings
 * State:
 *   - DataForm : object — holds start/end day, start/end time, and
 *     appointment slot duration (in minutes)
 *   - loading  : boolean — submit button loading state
 *   - success  : boolean — shows success feedback for 3 seconds
 * Populates DataForm from Redux doctorData on mount.
 * HandelChange(e): updates any form field by name attribute, resets success.
 * HandelSubmit(e): POSTs the schedule data to /doctor/update/info/time.
 * InputWrapper: renders a labeled form group with icon.
 * Renders three sections: Working Days (start/end day selects), Clinical
 * Hours (start/end time inputs), and Consultation Slot Duration (minutes
 * per patient input), plus a submit button with loading/success feedback.
 */
const TamingWork = () => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [DataForm, setDataForm] = useState({
    id: "",
    day_debut_work: "",
    day_fin_work: "",
    time_debut_work: "",
    time_fin_work: "",
    appointment_time: "",
  });

  GetAuthDoctor();

  /* Populate form from Redux store when doctor data is ready */
  useEffect(() => {
    if (doctorData.doctor !== null) {
      setDataForm({
        id: doctorData.doctor.id || "",
        day_debut_work: doctorData.doctor.day_debut_work || "",
        day_fin_work: doctorData.doctor.day_fin_work || "",
        time_debut_work: doctorData.doctor.time_debut_work || "",
        time_fin_work: doctorData.doctor.time_fin_work || "",
        appointment_time: doctorData.doctor.appointment_time || "",
      });
    }
  }, [doctorData]);

  /* Update form field on input change */
  const HandelChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...DataForm, [name]: value });
    setSuccess(false);
  };

  /* Submit working hours configuration */
  const HandelSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosClient
      .post("/doctor/update/info/time", DataForm)
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const InputWrapper = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 border-none uppercase tracking-widest flex items-center">
        <Icon className="w-3.5 h-3.5 mr-2 text-brand-500" />
        {label}
      </label>
      {children}
    </div>
  );

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={HandelSubmit} className="space-y-10">
        
        {/* Working Days Section */}
        <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
          <div className="flex items-center mb-6">
             <CalendarIcon className="w-6 h-6 text-brand-600 mr-3" />
             <h4 className="text-lg font-bold text-slate-900">{t("doctor.standard_working_week", "Standard Working Week")}</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputWrapper label={t("doctor.operations_start_day", "Operations Start Day")} icon={CalendarIcon}>
              <select
                name="day_debut_work"
                onChange={HandelChange}
                value={DataForm.day_debut_work}
                className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">{t("doctor.start_day", "Start Day")}</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </InputWrapper>

            <InputWrapper label={t("doctor.operations_end_day", "Operations End Day")} icon={CalendarIcon}>
              <select
                name="day_fin_work"
                value={DataForm.day_fin_work}
                onChange={HandelChange}
                className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">{t("doctor.end_day", "End Day")}</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </InputWrapper>
          </div>
        </div>

        {/* Operating Hours Section */}
        <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 border-none">
          <div className="flex items-center mb-6">
             <ClockIcon className="w-6 h-6 text-brand-600 mr-3" />
             <h4 className="text-lg font-bold text-slate-900">{t("doctor.clinical_hours", "Clinical Hours")}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputWrapper label={t("doctor.opening_time", "Opening Time")} icon={ClockIcon}>
              <input
                type="text"
                name="time_debut_work"
                value={DataForm.time_debut_work}
                onChange={HandelChange}
                className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
                placeholder="09:00"
                required
              />
            </InputWrapper>

            <InputWrapper label={t("doctor.closing_time", "Closing Time")} icon={ClockIcon}>
              <input
                type="text"
                name="time_fin_work"
                value={DataForm.time_fin_work}
                onChange={HandelChange}
                className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
                placeholder="18:00"
                required
              />
            </InputWrapper>
          </div>
        </div>

        {/* slot Duration Section */}
        <div className="bg-brand-50/30 p-8 rounded-3xl border border-brand-100/50">
          <InputWrapper label={t("doctor.consultation_slot_duration", "Consultation Slot Duration")} icon={AdjustmentsHorizontalIcon}>
            <div className="flex items-center">
               <input
                type="text"
                name="appointment_time"
                value={DataForm.appointment_time}
                onChange={HandelChange}
                className="w-48 px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all mr-4"
                placeholder="30"
                required
              />
              <span className="text-sm font-bold text-slate-500">{t("doctor.minutes_per_patient", "Minutes per patient")}</span>
            </div>
          </InputWrapper>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-6 border-none">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center px-10 py-4 text-sm font-bold text-white rounded-[1.5rem] transition-all active:scale-95 ${
              success ? 'bg-emerald-500 shadow-emerald-200' : 'bg-brand-600 shadow-brand-200/50 hover:bg-brand-700'
            } shadow-premium`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t("common.processing", "Processing...")}
              </>
            ) : success ? (
              <>
                <CheckCircleIcon className="w-5 h-5 mr-3" />
                {t("doctor.configuration_saved", "Configuration Saved")}
              </>
            ) : (
              t("doctor.apply_schedule", "Apply Schedule")
            )}
          </button>
          
          {success && (
             <div className="text-emerald-600 font-bold text-xs animate-pulse uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                {t("doctor.system_sync_complete", "System sync complete")}
             </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TamingWork;
