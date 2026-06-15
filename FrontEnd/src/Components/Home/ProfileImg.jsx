import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * ProfileImg.jsx — Header user avatar / auth buttons component
 *
 * Behaviour by role on patient-facing pages:
 *   patient  →  avatar linking to /user/profile
 *   doctor   →  nothing (guest nav, Login/Register hidden)
 *   admin    →  nothing (guest nav, Login/Register hidden)
 *   guest    →  Login + Register buttons
 */
const ProfileImg = () => {
  const adminData = useSelector((state) => state.AuthAdmin);
  const doctorData = useSelector((state) => state.AuthDoctor);
  const userData = useSelector((state) => state.authUser);
  const { t } = useTranslation();

  const isAdmin =
    (adminData.isAuthenticated && adminData.adminToken) || adminData.admin;
  const isDoctor =
    (doctorData.isAuthenticated && doctorData.doctorToken) ||
    doctorData.doctor;
  const isPatient =
    (userData.isAuthenticated && userData.userToken) || userData.user;

  /* Already authenticated as doctor or admin — hide Login/Register */
  if (isAdmin || isDoctor) return null;

  /* Patient authenticated — show avatar linking to profile */
  if (isPatient) {
    return (
      <div className="flex items-center">
        <Link to="/user/profile" className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-primary-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
          <img
            className="relative w-10 h-10 p-0.5 rounded-full ring-2 ring-white bg-white object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
            src={
              userData?.user?.user_avatar
                ? "http://localhost:8000/storage/images/users/" +
                  userData.user.user_avatar
                : "/img/users/user_default_profile.png"
            }
            alt={t("ProfileRegister.user_profile", "User Profile")}
          />
        </Link>
      </div>
    );
  }

  /* Guest — show Login + Register */
  return (
    <div className="flex items-center space-x-3">
      <Link to="/Connexion">
        <button className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
          {t("ProfileRegister.Login")}
        </button>
      </Link>
      <Link to="/identifier">
        <button className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all duration-200 shadow-premium hover:shadow-premium-hover active:scale-[0.98]">
          {t("ProfileRegister.Register")}
        </button>
      </Link>
    </div>
  );
};

export default ProfileImg;

