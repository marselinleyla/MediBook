import React from "react";
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../../AxiosClient";
import { logout } from "../../../Redux/SliceAuthDoctor";
import { useDispatch } from "react-redux";
import { remove } from "../../../Services/LocalStorageService";
import { useTranslation } from "react-i18next";

/*
 * Sidebar.jsx — Doctor dashboard fixed sidebar navigation
 * Uses useLocation() to highlight the currently active route.
 * Logout(): POSTs to /doctor/logout, dispatches the Redux logout action,
 *   removes the stored TOKEN_DOCTOR, and redirects to "/".
 * linkClasses(active): returns conditional CSS for nav link items.
 * iconClasses(active): returns conditional CSS for nav link icons.
 * Navigation links: Dashboard, Appointments, History, Settings, Logout.
 */
const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const Logout = () => {
    axiosClient
      .post("/doctor/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(logout());
          remove("TOKEN_DOCTOR");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const linkClasses = (active) => 
    `flex items-center p-3 text-sm font-semibold rounded-2xl transition-all duration-200 group ${
      active 
        ? "bg-brand-50 text-brand-600 shadow-sm" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`;

  const iconClasses = (active) => 
    `w-5 h-5 transition-colors duration-200 ${
      active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
    }`;

  return (
    <aside className="fixed top-0 left-0 z-30 w-72 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-slate-100 sm:translate-x-0">
      <div className="h-full px-4 py-6 overflow-y-auto flex flex-col">
        <ul className="space-y-2 flex-grow">
          <li>
            <Link
              to="/doctor/dashboard"
              className={linkClasses(isActive("/doctor/dashboard"))}
            >
              <Squares2X2Icon className={iconClasses(isActive("/doctor/dashboard"))} />
              <span className="ml-3">{t("dashboard.overview")}</span>
            </Link>
          </li>

          <li>
            <Link
              to="/docotr/rendezvous"
              className={linkClasses(isActive("/docotr/rendezvous"))}
            >
              <CalendarDaysIcon className={iconClasses(isActive("/docotr/rendezvous"))} />
              <span className="ml-3">{t("doctor.appointments", "Appointments")}</span>
            </Link>
          </li>

          <li>
            <Link
              to="/doctor/historique"
              className={linkClasses(isActive("/doctor/historique"))}
            >
              <ClockIcon className={iconClasses(isActive("/doctor/historique"))} />
              <span className="ml-3">{t("doctor.history", "History")}</span>
            </Link>
          </li>

          <li>
            <Link
              to="/doctor/settings"
              className={linkClasses(isActive("/doctor/settings"))}
            >
              <Cog6ToothIcon className={iconClasses(isActive("/doctor/settings"))} />
              <span className="ml-3">{t("doctor.settings", "Settings")}</span>
            </Link>
          </li>
        </ul>

        <div className="mt-auto border-t border-slate-50 pt-4 pb-2">
          <button 
            onClick={Logout}
            className="flex items-center w-full p-3 text-sm font-bold text-rose-600 rounded-2xl hover:bg-rose-50 transition-all duration-200 group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-rose-500 group-hover:text-rose-600" />
            <span className="ml-3">{t("navbar.logout")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

