import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../../../AxiosClient";
import {
  AlertErrorMessage,
  AuthButton,
  Header,
  Footer,
} from "../../../Components";
import { loginSuccess } from "../../../Redux/SliceAuthAdmin";
import {
  get,
  storeInLocalStorage,
} from "../../../Services/LocalStorageService";
import { ShieldCheckIcon, KeyIcon, EnvelopeIcon, CommandLineIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * AuthAdmin — Admin login page (public, dark-themed)
 * Provides email/password form for administrator authentication.
 * State:
 *   DataForm — pre-filled with default admin credentials
 *   loading — submit button spinner
 *   error — server error message on failed login
 * Redux: dispatches loginSuccess, stores token as TOKEN_ADMIN
 * API:
 *   POST /admin/login — authenticates admin, returns data + token
 * Redirects to /admin/dashboard if already authenticated.
 */
const AuthAdmin = () => {
  const { t } = useTranslation();
  document.title = t("admin_auth.title", "Executive Administration | MediBook");

  const adminData = useSelector((state) => state.AuthAdmin);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  /* Redirect to dashboard if already logged in */
  useEffect(() => {
    if (adminData.isAuthenticated && get("TOKEN_ADMIN")) {
      navigate("/admin/dashboard");
    }
  }, [navigate, adminData.isAuthenticated]);

  /* Pre-filled form with default admin credentials for convenience */
  const [DataForm, setDataForm] = useState({
    email: "admin@example.com",
    password: "admin_password",
  });

  const [error, setError] = useState("");

  /* Updates form field on input change */
  const HandleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  /* Submits admin login; on success dispatches Redux action and stores token */
  const HandleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axiosClient
      .post("/admin/login", DataForm)
      .then(({ data }) => {
        dispatch(loginSuccess(data));
        storeInLocalStorage("TOKEN_ADMIN", data.token);
        setLoading(false);
        navigate("/admin/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setError(err.response.data.error);
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col relative overflow-hidden">
      {/* High-tech background effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
          <div className="bg-white/10 backdrop-blur-3xl rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/10 p-10 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-5 bg-white/5 rounded-[2rem] mb-6 border border-white/10 shadow-xl">
                 <ShieldCheckIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                {t("admin_auth.executive_portal", "Executive Portal")}
              </h1>
              <p className="text-slate-400 font-medium text-sm">
                {t("admin_auth.restricted_access", "Restricted access for system administrators only. Authorization required.")}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center text-rose-400 text-xs font-bold uppercase tracking-widest animate-in shake">
                 <CommandLineIcon className="w-5 h-5 mr-3" />
                 {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={HandleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                  <EnvelopeIcon className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  {t("admin_auth.admin_identifier", "Admin Identifier")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={DataForm.email}
                  className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-600"
                  placeholder={t("admin_auth.email_placeholder", "admin@system.io")}
                  required
                  onChange={HandleChangeData}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                  <KeyIcon className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  {t("admin_auth.privileged_key", "Privileged Access Key")}
                </label>
                <input
                  type="password"
                  name="password"
                  value={DataForm.password}
                  className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-600"
                  placeholder={t("admin_auth.password_placeholder", "••••••••••••")}
                  required
                  onChange={HandleChangeData}
                />
              </div>

              <div className="pt-6">
                 <button 
                   disabled={loading}
                   className="w-full py-5 bg-blue-600 text-white font-black text-sm rounded-[2rem] hover:bg-blue-500 shadow-2xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center group uppercase tracking-widest"
                 >
                   {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                   ) : (
                      <CommandLineIcon className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                   )}
                   {loading ? t("admin_auth.authenticating", "Authenticating...") : t("admin_auth.establish_session", "Establish Secure Session")}
                 </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("admin_auth.system_status", "System Status: Optimal")}</span>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer colorText="slate-400" />
    </div>
  );
};

export default AuthAdmin;
