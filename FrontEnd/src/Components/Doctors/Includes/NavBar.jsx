import { Dropdown, Avatar } from "flowbite-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../AxiosClient";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Redux/SliceAuthDoctor";
import { remove } from "../../../Services/LocalStorageService";
import { useTranslation } from "react-i18next";
import SelelctLang from "../../Home/SelelctLang";

/*
 * NavBar.jsx — Doctor dashboard top navigation bar
 * Reads the authenticated doctor's data from Redux. Includes the MediBook
 * logo, language selector, and a user dropdown showing the doctor's
 * avatar, name, and speciality.
 * Removed Tooltip import, Notification import, quick-stats button block,
 * and notifications dropdown block to simplify the nav bar.
 * Logout(): POSTs to /doctor/logout, dispatches the Redux logout action,
 *   removes the stored TOKEN_DOCTOR from localStorage, and navigates to "/".
 */
const NavBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctorData = useSelector((state) => state.AuthDoctor);

  /* Log out the doctor: API call, Redux dispatch, token removal, redirect */
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

  return (
    <nav className="fixed z-[40] w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
                Medi<span className="text-brand-600">Book</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 rounded-lg hidden lg:block">{t("doctor.doctor", "Doctor")}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <SelelctLang />
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* User Dropdown */}
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <button className="flex items-center space-x-3 p-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <Avatar 
                    img={doctorData?.doctor?.avatar_doctor ? "http://localhost:8000/storage/images/doctors/" + doctorData.doctor.avatar_doctor : "/img/doctors/doctor-default-avatar.png"} 
                    rounded={true} 
                    size="sm"
                  />
                  <div className="hidden lg:block text-left pr-2">
                    <p className="text-sm font-bold text-slate-900 leading-none mb-0.5">Dr. {doctorData?.doctor?.firstname || "Neil"} {doctorData?.doctor?.lastname || "Sims"}</p>
                    <p className="text-[10px] font-medium text-slate-400 leading-none">{doctorData?.doctor?.specialite || t("doctor.cardiologist", "Cardiologist")}</p>
                  </div>
                </button>
              }
            >
              <div className="w-56 p-2 bg-white rounded-2xl shadow-premium border border-slate-100">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-sm font-bold text-slate-900">Dr. {doctorData?.doctor?.firstname || "Neil"} {doctorData?.doctor?.lastname || "Sims"}</p>
                  <p className="text-xs text-slate-500 truncate">{doctorData?.doctor?.email || "neil.sims@medibook.com"}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/doctor/dashboard"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all font-medium"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {t("dashboard.title")}
                  </Link>
                  <Link
                    to="/doctor/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all font-medium"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t("doctor.account_settings", "Account Settings")}
                  </Link>
                </div>
                <div className="pt-1 mt-1 border-t border-slate-50">
                  <button
                    onClick={Logout}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t("navbar.logout")}
                  </button>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

