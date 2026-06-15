import React, { useState } from "react";
import { Footer, Header } from "../../Components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import AlertSucces from "../../Components/Alert/AlertSucces";
import { remove } from "../../Services/LocalStorageService";
import { logout } from "../../Redux/SliceAuthUser";
import { EnvelopeOpenIcon, ArrowPathIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * VerifeyEmail — User email verification page
 * Shown after user registration; prompts the user to verify their email address.
 * State:
 *   ShowAlertSucce — success toast visibility (auto-hides after 5s)
 *   loading — resend button spinner
 * API:
 *   GET /email/resend/:id — resends verification email
 *   POST /user/logout — logs out and clears token
 */
const VerifeyEmail = () => {
  const { t } = useTranslation();
  document.title = t("verification_user.title", "Verify Your Identity | MediBook");

  const UserData = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ShowAlertSucce, setShowAlertSucce] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Sends a new verification email, shows success toast for 5 seconds */
  const ResendVerificationEmail = () => {
    setLoading(true);
    axiosClient
      .get(`/email/resend/${UserData.user.id}`)
      .then(() => {
        setLoading(false);
        setShowAlertSucce(true);
        setTimeout(() => setShowAlertSucce(false), 5000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  /* Logs out the user, clears Redux + localStorage, redirects to login */
  const HandleLogout = () => {
    axiosClient
      .post("/user/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(logout());
          remove("TOKEN_USER");
          navigate("/Connexion");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decorative blur blobs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-100/50 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-medical-100/30 rounded-full blur-[100px] -ml-24 -mb-24"></div>

      <Header />
      
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-premium border border-slate-100 p-12 text-center animate-in fade-in zoom-in duration-700">
           <div className="w-24 h-24 bg-brand-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <EnvelopeOpenIcon className="w-12 h-12 text-brand-600 animate-bounce" />
           </div>

           <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
              {t("verification_user.confirm_identity", "Confirm Your Identity")}
           </h2>
           <p className="text-slate-500 font-medium leading-relaxed mb-10">
              {t("verification_user.sent_link", "We've dispatched a secure verification link to:")} <br/>
              <span className="font-bold text-brand-600 italic">
                {UserData.user && UserData.user.email}
              </span>
              <br/>
              {t("verification_user.check_inbox", "Please check your inbox (and spam folder) to activate your MediBook account.")}
           </p>

           <div className="flex flex-col gap-4">
              <button
                onClick={ResendVerificationEmail}
                disabled={loading}
                className="w-full py-4 bg-brand-600 text-white font-bold text-sm rounded-2xl hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 flex items-center justify-center"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                ) : (
                   <ArrowPathIcon className="w-5 h-5 mr-3" />
                )}
                {loading ? t("verification_user.reprocessing", "Re-processing...") : t("verification_user.resend_link", "Resend Verification Link")}
              </button>
              
              <button 
                onClick={HandleLogout}
                className="w-full py-4 text-slate-500 font-bold text-sm bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                {t("verification_user.sign_out", "Sign Out & Try Again")}
              </button>
           </div>

           <div className="mt-12 pt-8 border-t border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {t("verification_user.auth_protocol", "MediBook Authentication Protocol v4.0")}
              </p>
           </div>
        </div>
      </main>

      <Footer />

      {ShowAlertSucce && (
         <div className="fixed bottom-8 right-8 animate-in slide-in-from-right-8 duration-500 z-[100]">
            <AlertSucces Message={t("verification_user.alert_success", "A new verification link has been sent to your email.")} />
         </div>
      )}
    </div>
  );
};

export default VerifeyEmail;
