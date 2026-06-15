import { Modal } from "flowbite-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  UserPlusIcon,
  XMarkIcon,
  UserIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DataPicker, TimePicker } from "../../../Components";
import axiosClient from "../../../AxiosClient";

/* Reusable field wrapper: label with icon and children input */
const InputWrapper = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
      <Icon className="w-3.5 h-3.5 mr-2 text-brand-500" />
      {label}
    </label>
    {children}
  </div>
);

/* FormContent — isolated memoized form to keep inputs stable inside Modal's portal */
const FormContent = React.memo(({
  form, handleChange,
  selectedTime, handleTimeChange,
  selectedType, handleTypeChange,
  dateAp, doctorData,
  handleSubmit, handleClose, submitting, error, t,
  handleDateChange,
}) => (
  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputWrapper label={t("doctor.first_name", "First Name")} icon={UserIcon}>
        <input
          type="text"
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
          placeholder={t("doctor.eg_jean", "e.g. Jean")}
          required
        />
      </InputWrapper>

      <InputWrapper label={t("doctor.last_name", "Last Name")} icon={UserIcon}>
        <input
          type="text"
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
          placeholder={t("doctor.eg_dupont", "e.g. Dupont")}
          required
        />
      </InputWrapper>

      <InputWrapper label={t("doctor.phone_number", "Phone Number")} icon={BriefcaseIcon}>
        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
          placeholder="+212 6XX XXX XXX"
        />
      </InputWrapper>
    </div>

    <div className="border-t border-slate-100 pt-6">
      <p className="text-sm font-bold text-slate-900 mb-4">{t("doctor.appointment_details", "Appointment Details")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputWrapper label={t("doctor.consultation_date", "Consultation Date")} icon={CalendarDaysIcon}>
          <DataPicker setSelectedDate={handleDateChange} dayDebutWork={doctorData.doctor?.day_debut_work} dayFinWork={doctorData.doctor?.day_fin_work} />
        </InputWrapper>

        <InputWrapper label={t("doctor.preferred_slot", "Preferred Slot")} icon={ClockIcon}>
          <TimePicker
            DateAp={dateAp}
            minTime="09:00"
            maxTime="17:00"
            stepInMinutes={30}
            idDoctor={doctorData.doctor?.id}
            value={selectedTime}
            onChange={handleTimeChange}
          />
        </InputWrapper>

        <InputWrapper label={t("doctor.appointment_category", "Appointment Category")} icon={ClipboardDocumentCheckIcon}>
          <select
            required
            value={selectedType}
            onChange={handleTypeChange}
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">{t("doctor.select_category", "Select Category...")}</option>
            <option value="urgent">{t("doctor.urgent", "Urgent / Emergency")}</option>
            <option value="nouveau patient">{t("doctor.new_patient", "New Patient Consultation")}</option>
            <option value="suivi">{t("doctor.follow_up", "Follow-up Visit")}</option>
            <option value="diagnostic">{t("doctor.diagnostic", "Diagnostic Evaluation")}</option>
            <option value="consultation">{t("doctor.consultation", "Standard Consultation")}</option>
          </select>
        </InputWrapper>
      </div>
    </div>

    {error && (
      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
        <p className="text-sm font-bold text-rose-600">{error}</p>
      </div>
    )}

    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        className="px-6 py-3 text-sm font-bold text-slate-500 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
        onClick={handleClose}
        disabled={submitting}
      >
        {t("common.cancel")}
      </button>
      <button
        className="px-8 py-3 text-sm font-bold text-white bg-brand-600 rounded-2xl hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={submitting}
      >
        {submitting ? t("common.saving", "Saving...") : t("doctor.confirm_patient", "Confirm Patient")}
      </button>
    </div>
  </form>
));

const AjouterModel = ({ show, setShow }) => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleDateChange = useCallback((dateStr) => {
    if (!dateStr) return setSelectedDate("");
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      setSelectedDate(`${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`);
    }
  }, []);

  /* Update a single form field on user input */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const handleTimeChange = useCallback((e) => setSelectedTime(e.target.value), []);
  const handleTypeChange = useCallback((e) => setSelectedType(e.target.value), []);

  const dateAp = useMemo(() => {
    if (!selectedDate) return "";
    const p = selectedDate.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
  }, [selectedDate]);

  /* Reset all form state to defaults */
  const resetForm = useCallback(() => {
    setForm({ firstname: "", lastname: "", phoneNumber: "" });
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
    setSuccess(false);
    setError(null);
  }, []);

  /* Close modal and reset form */
  const handleClose = useCallback(() => {
    resetForm();
    setShow(false);
  }, [resetForm, setShow]);

  /* Validate, register user, then create appointment */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (
      !form.firstname ||
      !form.lastname ||
      !selectedDate ||
      !selectedTime ||
      !selectedType
    )
      return;

    setSubmitting(true);
    setError(null);

    axiosClient
      .post("/user/register", {
        firstname: form.firstname,
        lastname: form.lastname,
        cin: "guest_" + Date.now(),
        phoneNumber: form.phoneNumber,
        password: "password123",
        type: "guest",
      })
      .then((res) => {
        const newUser = res.data.user;
        return axiosClient.post("/take/appointment", {
          user_id: newUser.id,
          doctor_id: doctorData.doctor?.id,
          date_appointment: selectedDate,
          time_appointment: selectedTime,
          type_appointment: selectedType,
        });
      })
      .then(() => {
        setSuccess(true);
        setSubmitting(false);
        setTimeout(() => { handleClose(); window.location.reload(); }, 1500);
      })
      .catch((err) => {
        const data = err.response?.data;
        let msg;
        if (data?.errors) {
          msg = Object.values(data.errors).flat().join(". ");
        } else if (data?.message) {
          msg = data.message;
        } else if (data?.error) {
          msg = data.error;
        } else if (err.message) {
          msg = err.message;
        } else {
          msg = "Registration failed";
        }
        setError(msg);
        setSubmitting(false);
      });
  }, [form, selectedDate, selectedTime, selectedType, doctorData, handleClose]);

  return (
    <>
      <style>{`
        .datepicker-picker .datepicker-cell.disabled,
        .datepicker-picker .datepicker-cell.disabled:hover {
          color: #cbd5e1 !important;
          opacity: 0.25 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          background-color: transparent !important;
        }
        .datepicker,
        .datepicker-dropdown,
        .datepicker-picker {
          z-index: 999999 !important;
        }
      `}</style>
      <Modal show={show} size="2xl" onClose={handleClose}>
        <div className="relative bg-white rounded-[2.5rem] shadow-premium border border-slate-100">
          {/* Modal header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center">
              <div className="p-3 bg-brand-50 rounded-2xl border border-brand-100 mr-4">
                {success ? (
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                ) : (
                  <UserPlusIcon className="w-6 h-6 text-brand-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {success
                    ? t("doctor.patient_added", "Patient Added Successfully")
                    : t("doctor.add_new_patient", "Add New Patient")}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {success
                    ? t("doctor.patient_added_desc", "The patient has been registered.")
                    : t("doctor.add_new_patient_desc", "Register a new patient for your medical practice.")}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all"
              onClick={handleClose}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
            {success ? (
              <div className="flex flex-col items-center py-8">
                <div className="p-4 bg-emerald-50 rounded-3xl mb-4">
                  <CheckCircleIcon className="w-16 h-16 text-emerald-500" />
                </div>
                <p className="text-slate-900 font-bold text-lg">{t("doctor.patient_registered", "Patient registered!")}</p>
              </div>
            ) : (
            <FormContent
              form={form}
              handleChange={handleChange}
              selectedTime={selectedTime}
                handleTimeChange={handleTimeChange}
                selectedType={selectedType}
                handleTypeChange={handleTypeChange}
                dateAp={dateAp}
                doctorData={doctorData}
                handleSubmit={handleSubmit}
                handleClose={handleClose}
                submitting={submitting}
                error={error}
                t={t}
                handleDateChange={handleDateChange}
              />
            )}
          </div>

        </div>
      </Modal>
    </>
  );
};

export default AjouterModel;
