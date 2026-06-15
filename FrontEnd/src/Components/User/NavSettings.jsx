import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircleIcon, Cog6ToothIcon, LockClosedIcon, CalendarDaysIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * NavSettings.jsx — User settings sidebar navigation component
 * Uses useLocation() to highlight the currently active route.
 * menuItems: defines 3 navigation links — Personal Profile (/user/profile),
 *   Account Settings (/user/settings), and Security & Privacy
 *   (/user/changepassword), each with a Heroicon.
 * Renders a vertical list of link items with active state styling
 * (brand-600 background when active, subtle hover otherwise) and a
 * "Support Center" footer hint.
 */
const NavSettings = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { title: t("user.personal_profile", "Personal Profile"), path: "/user/profile", icon: UserCircleIcon },
    { title: t("user.my_appointments", "My Appointments"), path: "/user/appointments", icon: CalendarDaysIcon },
    { title: t("user.account_settings", "Account Settings"), path: "/user/settings", icon: Cog6ToothIcon },
    { title: t("user.security_privacy", "Security & Privacy"), path: "/user/changepassword", icon: LockClosedIcon },
    { title: t("user.cancelled_appointments", "Cancelled Appointments"), path: "/user/cancelled-appointments", icon: XCircleIcon },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium p-3 space-y-1 overflow-hidden h-fit animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="px-6 pt-6 pb-4">
         <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{t("user.patient_center", "Patient Center")}</h3>
      </div>
      
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all group ${
              isActive 
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-200/50' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-brand-600'
            }`}
          >
            <item.icon className={`w-5 h-5 mr-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'}`} />
            <span className="truncate">{item.title}</span>
            {isActive && (
               <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
          </Link>
        );
      })}

    </div>
  );
};

export default NavSettings;
