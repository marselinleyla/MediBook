import React from "react";
import { useTranslation } from "react-i18next";

/*
 * Notification.jsx — Doctor notification dropdown panel
 * Renders a list of hardcoded notification items (Bonnie Green requested
 * an appointment, Robert Brown cancelled, Julia White sent a message),
 * each with a timestamp and read/unread indicator. Includes a "View all
 * patient activity" footer button. Used inside Flowbite Dropdown in
 * the doctor's NavBar.
 */
const Notification = () => {
  const { t } = useTranslation();
  const notifications = [
    { patient: "Bonnie Green", action: "requested an appointment", time: "just now", unread: true },
    { patient: "Robert Brown", action: "cancelled his appointment", time: "45 mins ago", unread: false },
    { patient: "Julia White", action: "sent you a message", time: "2 hours ago", unread: false },
  ];

  return (
    <div className="z-50 w-80 sm:w-96 overflow-hidden bg-white rounded-3xl shadow-premium border border-slate-100">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900">{t("doctor.notifications", "Notifications")}</h3>
        <span className="px-2 py-0.5 bg-brand-100 text-brand-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{t("doctor.new", "3 New")}</span>
      </div>
      
      <div className="max-h-[320px] overflow-y-auto">
        {notifications.map((notif, i) => (
          <div 
            key={i} 
            className={`flex px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group relative`}
          >
            {notif.unread && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-500 rounded-full" />
            )}
            <div className="flex-grow">
              <div className="text-slate-600 text-sm leading-snug">
                <span className="font-bold text-slate-900">{notif.patient}</span> {notif.action}
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {notif.time}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100">
        <button className="w-full py-2 text-xs font-bold text-brand-600 hover:bg-brand-100 rounded-xl transition-all flex justify-center items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {t("doctor.view_all_activity", "View all patient activity")}
        </button>
      </div>
    </div>
  );
};

export default Notification;

