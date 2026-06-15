import React, { useEffect, useState } from "react";
import { AuthButton, Footer, Header } from "../../Components";
import axiosClient from "../../AxiosClient.js";
import { useDispatch, useSelector } from "react-redux";
import { signUpSuccess } from "../../Redux/SliceAuthDoctor";
import { get, storeInLocalStorage } from "../../Services/LocalStorageService";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { 
  UserPlusIcon, 
  IdentificationIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  KeyIcon, 
  UserIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * AuthDoctors Signup — Doctor registration page (public)
 * Collects first name, last name, medical Matricule, phone, email, password + confirm.
 * State:
 *   DataForm — all registration field values
 *   error — per-field validation errors (from 422 response)
 *   loading — submit button spinner
 * Redux: dispatches signUpSuccess, stores token as TOKEN_DOCTOR
 * API:
 *   POST /doctor/register — creates doctor account, returns data + token
 * Redirects to /doctor/dashboard if already authenticated.
 */
/* Reusable field wrapper: label with icon, children input, and error message display */
const InputWrapper = ({ label, icon: Icon, errorMsg, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
      <Icon className="w-3.5 h-3.5 mr-2 text-brand-500" />
      {label}
    </label>
    {children}
    {errorMsg && (
      <p className="mt-2 text-[10px] font-bold text-rose-500 uppercase tracking-wider animate-in slide-in-from-top-1">
        {errorMsg[0]}
      </p>
    )}
  </div>
);

const Signup = () => {
  const { t } = useTranslation();
  document.title = t("doctor_signup.title", "Doctor Registration | MediBook");

  const doctorData = useSelector((state) => state.AuthDoctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* Redirect if already logged in */
  useEffect(() => {
    if (doctorData.isAuthenticated && get("TOKEN_DOCTOR")) {
      navigate("/doctor/dashboard");
    }
  }, [navigate, doctorData.isAuthenticated]);

  const [DataForm, setData] = useState({
    firstname: "",
    lastname: "",
    Matricule: "",
    phoneNumber: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState({
    firstname: "",
    lastname: "",
    Matricule: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  /* Updates a single form field on input change */
  const HandleChangeData = (e) => {
    const { name, value } = e.target;
    setData({ ...DataForm, [name]: value });
  };

  /* Submits doctor registration; on success dispatches Redux action and stores token */
  const HandleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axiosClient
      .post("/doctor/register", DataForm)
      .then(({ data }) => {
        dispatch(signUpSuccess(data));
        storeInLocalStorage("TOKEN_DOCTOR", data.token);
        setLoading(false);
navigate("/doctor/settings");
      })
      .catch((er) => {
        setLoading(false);
        if (er.response && er.response.status === 422) {
          setError({ ...error, ...er.response.data.errors });
        } else {
          console.error(er);
        }
      });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-50/50 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-medical-50/30 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10">
        <div className="max-w-2xl w-full animate-in fade-in zoom-in duration-700">
          <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 p-10 md:p-14">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-5 bg-brand-50 rounded-[2rem] mb-6 shadow-inner">
                 <UserPlusIcon className="w-10 h-10 text-brand-600" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                {t("doctor_signup.join_network", "Join the Network")}
              </h1>
              <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                {t("doctor_signup.subtitle", "Start providing world-class medical consultation through Morocco's premium health platform.")}
              </p>
            </div>

            <form className="space-y-8" onSubmit={HandleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-none">
                <InputWrapper label={t("doctor_signup.first_name", "First Name")} icon={UserIcon} errorMsg={error.firstname}>
                  <input
                    type="text"
                    name="firstname"
                    value={DataForm.firstname}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                    placeholder={t("doctor_signup.first_name_placeholder", "e.g. Samir")}
                    required
                    onChange={HandleChangeData}
                  />
                </InputWrapper>

                <InputWrapper label={t("doctor_signup.last_name", "Last Name")} icon={UserIcon} errorMsg={error.lastname}>
                  <input
                    type="text"
                    name="lastname"
                    value={DataForm.lastname}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                    placeholder={t("doctor_signup.last_name_placeholder", "e.g. Alami")}
                    required
                    onChange={HandleChangeData}
                  />
                </InputWrapper>

                <div className="md:col-span-2">
                  <InputWrapper label={t("doctor_signup.matricule", "Medical Registration / Matricule")} icon={IdentificationIcon} errorMsg={error.Matricule}>
                    <input
                      type="text"
                      name="Matricule"
                      value={DataForm.Matricule}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                      placeholder={t("doctor_signup.matricule_placeholder", "e.g. NAI-2026-0000")}
                      required
                      onChange={HandleChangeData}
                    />
                  </InputWrapper>
                </div>

                <InputWrapper label={t("doctor_signup.contact_phone", "Contact Phone")} icon={PhoneIcon} errorMsg={error.phoneNumber}>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={DataForm.phoneNumber}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                    placeholder={t("doctor_signup.phone_placeholder", "+212 600-000000")}
                    required
                    onChange={HandleChangeData}
                  />
                </InputWrapper>

                <InputWrapper label={t("doctor_signup.professional_email", "Professional Email")} icon={EnvelopeIcon} errorMsg={error.email}>
                  <input
                    type="email"
                    name="email"
                    value={DataForm.email}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                    placeholder={t("doctor_signup.email_placeholder", "dr.name@medibook.com")}
                    required
                    onChange={HandleChangeData}
                  />
                </InputWrapper>

                <InputWrapper label={t("doctor_signup.security_password", "Security Password")} icon={KeyIcon} errorMsg={error.password}>
                  <input
                    type="password"
                    name="password"
                    value={DataForm.password}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                    placeholder={t("doctor_signup.password_placeholder", "••••••••••••")}
                    required
                    onChange={HandleChangeData}
                  />
                </InputWrapper>

                <InputWrapper label={t("doctor_signup.confirm_secret", "Confirm Secret Key")} icon={ShieldCheckIcon}>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={DataForm.password_confirmation}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                    placeholder={t("doctor_signup.password_placeholder", "••••••••••••")}
                    required
                    onChange={HandleChangeData}
                  />
                </InputWrapper>
              </div>

              <div className="pt-8 border-none">
                <AuthButton Text={t("doctor_signup.create_account", "Inaugurate Practice Account")} Loading={loading} />
              </div>
            </form>

            <div className="mt-12 pt-10 border-t border-slate-50 text-center">
               <p className="text-sm font-medium text-slate-500">
                  {t("doctor_signup.already_member", "Already a member of our network?")}{" "}
                  <Link to="/doctor/login" className="text-brand-600 font-black hover:underline underline-offset-4 decoration-2">
                    {t("doctor_signup.access_portal", "Access Portal")}
                  </Link>
               </p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
             <div className="inline-flex items-center gap-6 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                   {t("doctor_signup.compliance", "Compliant with Healthcare Information Privacy Standards")}
                </p>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
