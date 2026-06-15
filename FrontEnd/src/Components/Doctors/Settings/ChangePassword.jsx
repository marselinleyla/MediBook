import React from "react";
import { LockClosedIcon, ShieldCheckIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * ChangePassword.jsx — Doctor password change form
 * Renders a security recommendation banner, a form with current password,
 * new password, and confirm new password fields, a visual password strength
 * indicator (static/mockup), and a submit button.
 * InputWrapper: helper that renders a labeled form group with an icon.
 */
const ChangePassword = () => {
  const { t } = useTranslation();
  const InputWrapper = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
        <Icon className="w-3.5 h-3.5 mr-2 text-brand-500" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 flex items-start">
         <ShieldCheckIcon className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0" />
         <div>
            <p className="text-sm font-bold text-slate-900">{t("doctor.security_recommendation", "Security Recommendation")}</p>
            <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
               {t("doctor.security_recommendation_desc", "Use a strong, unique password with at least 12 characters, including numbers and symbols to ensure maximum account security.")}
            </p>
         </div>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="md:col-span-2">
            <InputWrapper label={t("doctor.current_password", "Current Security Password")} icon={LockClosedIcon}>
              <input
                type="password"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-300"
                placeholder="••••••••••••"
                required
              />
            </InputWrapper>
           </div>

          <InputWrapper label={t("doctor.new_password", "New Security Password")} icon={KeyIcon}>
            <input
              type="password"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-300"
              placeholder="••••••••••••"
              required
            />
          </InputWrapper>

          <InputWrapper label={t("doctor.confirm_new_password", "Confirm New Password")} icon={KeyIcon}>
            <input
              type="password"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-300"
              placeholder="••••••••••••"
              required
            />
          </InputWrapper>
        </div>

        {/* Password Strength Indicator Visual */}
        <div className="space-y-3 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
           <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("doctor.password_strength", "Password Strength")}</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{t("doctor.moderate", "Moderate")}</span>
           </div>
           <div className="grid grid-cols-4 gap-2">
              <div className="h-1.5 rounded-full bg-amber-400"></div>
              <div className="h-1.5 rounded-full bg-amber-400"></div>
              <div className="h-1.5 rounded-full bg-slate-200"></div>
              <div className="h-1.5 rounded-full bg-slate-200"></div>
           </div>
           <p className="text-[10px] font-medium text-slate-400 italic">
              {t("doctor.add_symbols", "* Add symbols and numbers to improve security score.")}
           </p>
        </div>

        <div className="flex pt-4">
          <button
            type="submit"
            className="w-full md:w-64 flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-brand-600 rounded-[1.5rem] hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95"
          >
            {t("doctor.update_security", "Update Security Credentials")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
