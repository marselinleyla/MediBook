import React from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import { LockClosedIcon, ShieldCheckIcon, KeyIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * ChangePassword — User password change page (authenticated)
 * Allows the user to update their account password via an email verification flow.
 * Renders a security banner, a form with email + new password + confirm password,
 * and a sidebar navigation (<UserNavSettings />).
 * NOTE: The current form is static (no onSubmit handler wired) — ready for API integration.
 */
const ChangePassword = () => {
  const { t } = useTranslation();
  document.title = t("user_change_password.title");

  /* Reusable field wrapper with icon + label */
  const InputWrapper = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
        <Icon className="w-3.5 h-3.5 mr-2 text-brand-500" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Settings Sidebar — navigation links for profile/settings/security */}
          <div className="lg:w-1/4">
            <UserNavSettings />
          </div>

          {/* Change Password Content */}
          <div className="lg:w-3/4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Security Banner — branded header with shield icon and security advice */}
            <div className="bg-brand-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-premium relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 backdrop-blur-3xl"></div>
               <div className="relative p-4 bg-white/10 rounded-3xl border border-white/20">
                  <ShieldCheckIcon className="w-12 h-12 text-white" />
               </div>
               <div className="relative text-center md:text-left">
                   <h2 className="text-3xl font-black tracking-tight mb-2">{t("user_change_password.enhance_security")}</h2>
                   <p className="text-brand-100 font-medium max-w-lg leading-relaxed">
                      {t("user_change_password.security_description")}
                   </p>
               </div>
            </div>

            {/* Main Security Form */}
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-premium">
               <div className="mb-10">
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">{t("user_change_password.access_credentials")}</h3>
                   <p className="text-sm font-medium text-slate-500 mt-1">{t("user_change_password.access_credentials_desc")}</p>
               </div>

               {/* Password change form — email (identity verification), new password, confirm */}
               <form className="space-y-8 max-w-xl border-none">
                 <div className="space-y-6">
                    {/* Email field — used to verify account ownership */}
                    <InputWrapper label={t("user_change_password.current_email")} icon={LockClosedIcon}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                        placeholder={t("user_change_password.email_placeholder")}
                        required
                      />
                    </InputWrapper>

                    {/* New password input */}
                    <InputWrapper label={t("user_change_password.new_password")} icon={KeyIcon}>
                      <input
                        type="password"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                        placeholder={t("user_change_password.password_placeholder")}
                        required
                      />
                    </InputWrapper>

                    {/* Confirm new password input */}
                    <InputWrapper label={t("user_change_password.confirm_password")} icon={KeyIcon}>
                      <input
                        type="password"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                        placeholder={t("user_change_password.password_placeholder")}
                        required
                      />
                    </InputWrapper>
                 </div>

                 {/* Submit button with sync icon and hover rotation animation */}
                 <div className="flex pt-6">
                   <button 
                     type="submit"
                     className="w-full md:w-64 flex items-center justify-center px-8 py-4 bg-brand-600 text-white font-bold text-sm rounded-[1.5rem] hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 group"
                   >
                     <ArrowPathIcon className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-700" />
                      {t("user_change_password.synchronize")}
                   </button>
                 </div>
               </form>
            </div>

            {/* Security Footer Tip */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                   {t("user_change_password.security_footer")}
               </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChangePassword;
