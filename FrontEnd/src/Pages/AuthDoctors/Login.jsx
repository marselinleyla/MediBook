import React, { useEffect, useState } from "react";
import {
  AlertErrorMessage,
  AuthButton,
  Footer,
  Header,
} from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { get, storeInLocalStorage } from "../../Services/LocalStorageService";
import { useNavigate } from "react-router";
import axiosClient from "../../AxiosClient";
import { loginSuccess } from "../../Redux/SliceAuthDoctor";
import { Link } from "react-router-dom";
import { EnvelopeIcon, KeyIcon, ArrowRightOnRectangleIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * AuthDoctors Login — Doctor login page (public)
 * Provides email/password form for doctors to access their dashboard.
 * State:
 *   DataForm — { email, password } controlled form values
 *   loading — submit button spinner
 *   error — server error message on failed login
 * Redux: dispatches loginSuccess (SliceAuthDoctor), stores token as TOKEN_DOCTOR
 * API:
 *   POST /doctor/login — authenticates doctor, returns data + token
 * Redirects to /doctor/dashboard if already authenticated.
 */
const Login = () => {
  const { t } = useTranslation();
  document.title = t("doctor_login.title", "Doctor Access | MediBook");

  const doctorData = useSelector((state) => state.AuthDoctor);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  /* Redirect if already logged in */
  useEffect(() => {
    if (doctorData.isAuthenticated && get("TOKEN_DOCTOR")) {
      navigate("/doctor/dashboard");
    }
  }, [navigate, doctorData.isAuthenticated]);

  const [DataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  /* Updates form field on input change */
  const HandleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  /* Submits doctor login; on success dispatches Redux action and stores token */
  const HandleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axiosClient
      .post("/doctor/login", DataForm)
      .then(({ data }) => {
        dispatch(loginSuccess(data));
        storeInLocalStorage("TOKEN_DOCTOR", data.token);
        setLoading(false);
        navigate("/doctor/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setError(err.response.data.message);
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-50/50 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-medical-50/30 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none"></div>

      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
          <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 p-10 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 bg-brand-50 rounded-[1.5rem] mb-6 shadow-inner">
                <AcademicCapIcon className="w-10 h-10 text-brand-600" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                {t("doctor_login.professional_portal", "Professional Portal")}
              </h1>
              <p className="text-slate-500 font-medium text-sm">
                {t("doctor_login.subtitle", "Access your medical dashboard, manage patients, and coordinate your schedule.")}
              </p>
            </div>

            {error && (
              <div className="mb-6">
                 <AlertErrorMessage message={error} />
              </div>
            )}

            <form className="space-y-6" onSubmit={HandleSubmit}>
              <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <EnvelopeIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                    {t("doctor_login.medical_email", "Medical Email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                    placeholder={t("doctor_login.email_placeholder", "doctor@medibook.com")}
                    required
                    onChange={HandleChangeData}
                  />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <KeyIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                    {t("doctor_login.security_password", "Security Password")}
                  </label>
                  <a href="#" className="text-[10px] font-bold text-brand-600 uppercase tracking-wider hover:underline">
                    {t("doctor_login.forgot_key", "Forgot Key?")}
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                  placeholder={t("doctor_login.password_placeholder", "••••••••••••")}
                  required
                  onChange={HandleChangeData}
                />
              </div>

              <div className="pt-4">
                <AuthButton Text={t("doctor_login.secure_login", "Secure Login")} Loading={loading} />
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
               <p className="text-sm font-medium text-slate-500">
                  {t("doctor_login.new_practitioner", "New practitioner?")}{" "}
                  <Link to="/doctor/signup" className="text-brand-600 font-bold hover:underline underline-offset-4 decoration-2">
                   {t("doctor_login.request_membership", "Request Membership")}
                  </Link>
               </p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center justify-center gap-4">
               <span className="w-8 h-px bg-slate-200"></span>
               {t("doctor_login.security_protocol", "Security Protocol v4.0")}
               <span className="w-8 h-px bg-slate-200"></span>
             </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
