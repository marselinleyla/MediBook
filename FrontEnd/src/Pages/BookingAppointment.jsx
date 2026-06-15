import React, { useCallback, useEffect, useState } from "react";
import { DataPicker, Footer, Header, TimePicker } from "../Components";
import ComplitedAppointment from "./ComplitedAppointment";
import {
  ClockIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router";
import axiosClient from "../AxiosClient";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../Redux/SliceAuthUser";
import { get } from "../Services/LocalStorageService";
import { useTranslation } from "react-i18next";

/*
 * BookingAppointment - Booking page (public)
 * Lets authenticated users book an appointment with a specific doctor.
 * State:
 *   selectedTime / SelectedDate / SelectedType — form field values
 *   DoctorData — doctor profile fetched by route param :id
 *   showComplitedAppointment / FilePath — controls post-booking PDF modal
 *   submitError — validation / server error display
 *   Loading — initial data fetch spinner
 *   userReady — ensures Redux user state is hydrated before submit
 * API calls:
 *   GET /user — re-fetch user profile if token exists but Redux is empty
 *   GET /doctor/:id — fetch doctor details
 *   POST /take/appointment — submit the booking, returns PDF filename
 */
const BookingAppointment = () => {
  const { t } = useTranslation();
  // Form field states
  const [selectedTime, setSelectedTime] = useState("");
  const [SelectedDate, setSelectedDate] = useState("");
  const [SelectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Builds a full URL for a doctor avatar image
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/img/doctors/doctor-default-avatar.png";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
      return imagePath;
    }
    return `http://localhost:8000/storage/images/doctors/${imagePath}`;
  };

  // Post-booking confirmation modal state
  const [showComplitedAppointment, setShowComplitedAppointment] =
    useState(false);

  const [FilePath, SetFilePath] = useState("");      // PDF filename from server
  const [submitError, setSubmitError] = useState(""); // inline error message

  const { id } = useParams();                        // doctor ID from URL
  const [DoctorData, setDoctorData] = useState({});  // fetched doctor info

  const UserData = useSelector((state) => state.authUser); // logged-in user from Redux

  const [Loading, setLoading] = useState(true);       // spinner until doctor data loads
  const [userReady, setUserReady] = useState(!!UserData.user); // true once user profile is confirmed

  /* Updates selected time slot from TimePicker child */
  const handleTimeChange = useCallback((e) => setSelectedTime(e.target.value), []);

  /* Updates selected appointment type from dropdown */
  const handleTypeChange = useCallback((e) => setSelectedType(e.target.value), []);

  /* 
   * On mount:
   * 1. If user is authenticated but Redux user is null, re-fetch from API
   * 2. Fetch doctor profile by :id
   */
  useEffect(() => {
    setLoading(true);

    if (
      UserData.isAuthenticated &&
      get("TOKEN_USER") &&
      UserData.user === null
    ) {
      axiosClient
        .get("/user")
        .then((re) => {
          dispatch(addUserData(re.data));
          setUserReady(true);
        })
        .catch((er) => {
          navigate("/Connexion");
        });
    } else if (UserData.user !== null) {
      setUserReady(true);
    }

    axiosClient
      .get("/doctor/" + id)
      .then((re) => {
        setDoctorData(re.data[0]);
        setLoading(false);
      })
      .catch((er) => {
        setLoading(false);
        console.error(er);
      });
  }, [dispatch, id, navigate, UserData.user, UserData.isAuthenticated]);

  /* 
   * Form submit handler:
   * Validates user session, formats date (MM/DD -> YYYY-MM-DD),
   * POSTs appointment data, on success shows the PDF modal.
   */
  const HandelSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!UserData.user || !UserData.user.id) {
      setSubmitError("Session utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }

    const parts = SelectedDate.split("/");
    if (parts.length !== 3) return;
    const formattedDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;

    axiosClient
      .post("/take/appointment", {
        user_id: UserData.user.id,
        doctor_id: id,
        date_appointment: formattedDate,
        time_appointment: selectedTime,
        type_appointment: SelectedType,
      })
      .then((res) => {
        SetFilePath(res.data.namefile);
        setShowComplitedAppointment(true);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Booking failed. Please try again.";
        setSubmitError(msg);
        console.error(err);
      });
  };

  /* Loading spinner while doctor data is being fetched */
  if (Loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">{t("booking.preparing", "Preparing booking terminal...")}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
      `}</style>
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button — navigates to previous page */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-brand-600 font-bold text-sm mb-8 transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t("booking.back_to_search", "Back to search")}
          </button>

          {/* Card container split into two columns: doctor info (5/12) and booking form (7/12) */}
          <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 overflow-hidden flex flex-col lg:row items-stretch">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Side: Doctor Info — avatar, specialty, name, schedule, fee */}
              <div className="lg:col-span-5 bg-slate-50/50 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="sticky top-12">
                  {/* Doctor avatar with verified badge overlay */}
                  <div className="relative inline-block mb-8">
                    <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={getImageUrl(DoctorData.avatar_doctor)} 
                        alt="Doctor" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                      <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Doctor name + specialty badge */}
                  <div className="mb-8">
                    <div className="inline-flex items-center px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                       {DoctorData.specialite}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                      Dr. {DoctorData.firstname} {DoctorData.lastname}
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">{t("booking.verified_professional", "Verified Healthcare Professional")}</p>
                  </div>

                  {/* Doctor working hours and consultation fee info cards */}
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mr-4">
                        <ClockIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("booking.schedule", "Schedule")}</p>
                        <p className="text-sm font-bold text-slate-700">
                          {DoctorData.day_debut_work ?? "---"}-{DoctorData.day_fin_work ?? "---"} | {DoctorData.time_debut_work ?? "---"}-{DoctorData.time_fin_work ?? "---"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mr-4">
                        <UserCircleIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("booking.consultation_fee", "Consultation Fee")}</p>
                        <p className="text-sm font-bold text-slate-700">{t("booking.verified_by_platform", "Verified by Platform")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Booking Form — date picker, time picker, category select, submit button */}
              <div className="lg:col-span-7 p-8 lg:p-12">
                <div className="max-w-lg">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{t("booking.configure_appointment", "Configure Appointment")}</h3>
                  <p className="text-slate-500 mb-10 font-medium">{t("booking.select_preferred", "Select your preferred time slot and appointment category below.")}</p>

                  {/* Server-side error message banner */}
                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl">
                      {submitError}
                    </div>
                  )}
                  <form onSubmit={HandelSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Date Selection — custom DataPicker component */}
                      <div className="space-y-2">
                        <label className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                          <CalendarDaysIcon className="w-4 h-4 mr-2 text-brand-500" />
                          {t("booking.consultation_date", "Consultation Date")}
                        </label>
                        <div className="relative group">
                          <DataPicker setSelectedDate={setSelectedDate} dayDebutWork={DoctorData.day_debut_work} dayFinWork={DoctorData.day_fin_work} />
                        </div>
                      </div>

                      {/* Time Selection — custom TimePicker filtered by doctor's working hours and existing bookings */}
                      <div className="space-y-2">
                        <label className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                          <ClockIcon className="w-4 h-4 mr-2 text-brand-500" />
                          {t("booking.preferred_slot", "Preferred Slot")}
                        </label>
                        <div className="relative">
                          <TimePicker
                            DateAp={SelectedDate}
                            minTime={DoctorData.time_debut_work}
                            maxTime={DoctorData.time_fin_work}
                            stepInMinutes={DoctorData.appointment_time}
                            idDoctor={id}
                            value={selectedTime}
                            onChange={handleTimeChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Type Selection — dropdown with urgent/new/follow-up/diagnostic/standard options */}
                    <div className="space-y-2">
                      <label className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        <ClipboardDocumentCheckIcon className="w-4 h-4 mr-2 text-brand-500" />
                        {t("booking.appointment_category", "Appointment Category")}
                      </label>
                      <div className="relative bg-slate-50 rounded-2xl border-2 border-slate-100 group focus-within:border-brand-500 transition-all">
                        <select
                          required
                          onChange={handleTypeChange}
                          value={SelectedType}
                          className="w-full bg-transparent border-0 p-4 pl-6 text-sm font-bold text-slate-900 focus:ring-0 appearance-none cursor-pointer"
                        >
                          <option value="">{t("booking.select_category", "Select Category...")}</option>
                          <option value="urgent">{t("booking.urgent", "Urgent / Emergency")}</option>
                          <option value="nouveau patient">{t("booking.new_patient", "New Patient Consultation")}</option>
                          <option value="suivi">{t("booking.follow_up", "Follow-up Visit")}</option>
                          <option value="diagnostic">{t("booking.diagnostic", "Diagnostic Evaluation")}</option>
                          <option value="consultation">{t("booking.standard", "Standard Consultation")}</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button — disabled until user profile is confirmed; shows spinner while loading */}
                    <div className="pt-6">
                      <button 
                        type="submit"
                        disabled={!userReady}
                        className="w-full py-5 font-bold rounded-2xl shadow-premium transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-brand-600 enabled:hover:bg-brand-700 text-white enabled:active:scale-95"
                      >
                        {!userReady ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("booking.loading_profile", "Loading Profile...")}
                          </>
                        ) : (
                          <>
                            {t("booking.confirm_booking", "Confirm Booking")}
                            <ArrowLeftIcon className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      {/* Security footer note */}
                      <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-6">
                        {t("booking.secured_system", "🔒 Secured healthcare booking system")}
                      </p>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
      {/* Post-booking success modal — displays download link for the prescription PDF */}
      <ComplitedAppointment
        showComplitedAppointment={showComplitedAppointment}
        setShowComplitedAppointment={setShowComplitedAppointment}
        FilePath={FilePath}
      />
    </div>
    </>
  );
};

export default BookingAppointment;

