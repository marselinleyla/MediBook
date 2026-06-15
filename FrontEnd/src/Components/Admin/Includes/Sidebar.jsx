import React, { useState } from "react";
import { ArrowRightOnRectangleIcon, UserIcon, Squares2X2Icon, UserGroupIcon, IdentificationIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import axiosClient from "../../../AxiosClient";
import { remove } from "../../../Services/LocalStorageService";
import { logout } from "../../../Redux/SliceAuthAdmin";

/*
 * Sidebar.jsx — Admin fixed sidebar navigation component
 * State:
 *   - ShowDropDown : boolean — toggles the "Doctors" sub-menu (Manage Doctors
 *     and Verifications links)
 * Uses useLocation() to determine the active route and applies active/inactive
 * styling to navigation links. Includes links to Dashboard, a collapsible
 * Doctors section, Patients, Accounts (settings), and a Logout button.
 * Helper functions:
 *   - isActive(path)     : checks if the current pathname matches
 *   - linkClasses(active): returns conditional CSS for nav links
 *   - iconClasses(active): returns conditional CSS for nav icons
 */
const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ShowDropDown, setShowDropDown] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    axiosClient
      .post("/admin/logout")
      .then(() => {
        dispatch(logout());
        remove("TOKEN_ADMIN");
        navigate("/admin/login");
      })
      .catch(() => {
        dispatch(logout());
        remove("TOKEN_ADMIN");
        navigate("/admin/login");
      });
  };

  const isActive = (path) => location.pathname === path;

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
              to="/admin/dashboard"
              className={linkClasses(isActive("/admin/dashboard"))}
            >
              <Squares2X2Icon className={iconClasses(isActive("/admin/dashboard"))} />
              <span className="ml-3">{t("dashboard.overview")}</span>
            </Link>
          </li>
          
          <li>
            <button
              onClick={() => setShowDropDown(!ShowDropDown)}
              className={`flex items-center w-full p-3 text-sm font-semibold rounded-2xl transition-all duration-200 group ${
                ShowDropDown || location.pathname.includes("/admin/doctors")
                  ? "text-slate-900"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <UserGroupIcon className={iconClasses(location.pathname.includes("/admin/doctors"))} />
              <span className="flex-1 ml-3 text-left">{t("common.doctors", "Doctors")}</span>
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform duration-200 ${ShowDropDown ? "rotate-180" : ""}`} 
              />
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${ShowDropDown ? "max-h-40 mt-1" : "max-h-0"}`}>
              <ul className="pl-11 space-y-1">
                <li>
                  <Link
                    to="/admin/doctors"
                    className={`block p-2 text-sm rounded-xl transition-all ${
                      isActive("/admin/doctors") 
                        ? "text-brand-600 font-bold" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {t("admin.manage_doctors", "Manage Doctors")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/doctors/noverified"
                    className={`block p-2 text-sm rounded-xl transition-all ${
                      isActive("/admin/doctors/noverified") 
                        ? "text-brand-600 font-bold" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {t("admin.verifications", "Verifications")}
                  </Link>
                </li>
              </ul>
            </div>
          </li>


        </ul>

        <div className="mt-auto border-t border-slate-50 pt-4 pb-2">
          <Link
            to="/admin/settings"
            className={linkClasses(isActive("/admin/settings"))}
          >
            <UserIcon className={iconClasses(isActive("/admin/settings"))} />
            <span className="ml-3">{t("admin.accounts", "Accounts")}</span>
          </Link>
          
          <button onClick={handleLogout} className="flex items-center w-full p-3 mt-2 text-sm font-bold text-rose-600 rounded-2xl hover:bg-rose-50 transition-all duration-200 group">
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-rose-500 group-hover:text-rose-600" />
            <span className="ml-3">{t("navbar.logout")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

