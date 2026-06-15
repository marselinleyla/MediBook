/* ============================================================
 * DoctorEmailVerification.jsx – Route guard for the doctor
 * email-verification page.
 *
 * If the doctor's email is already verified, they are
 * redirected to the dashboard. Otherwise the child component
 * (the verification form) renders. Also fetches the doctor
 * profile if it hasn't been loaded yet.
 * ============================================================ */

import React, { useEffect } from "react";
import { get, remove } from "../Services/LocalStorageService";
import { addDoctorData } from "../Redux/SliceAuthDoctor";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../AxiosClient";

const DoctorEmailVerification = ({ children }) => {
  const AuthDoctorData = useSelector((state) => state.AuthDoctor);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor profile if authenticated, token exists, but not yet loaded
    if (
      AuthDoctorData.isAuthenticated &&
      get("TOKEN_DOCTOR") &&
      !AuthDoctorData.doctor
    ) {
      axiosClient
        .get("/doctor")
        .then((re) => {
          dispatch(addDoctorData(re.data));
          console.log(re);
        })
        .catch((er) => {
          remove("TOKEN_DOCTOR")
          console.log(er);
          navigate("/doctor/login");
        });
    }
    console.log(AuthDoctorData);
  }, [dispatch, navigate, AuthDoctorData]);

  if (AuthDoctorData.doctor) {
    if (AuthDoctorData.doctor.email_verified_at) {
      // Email already verified – redirect to dashboard
      return navigate("/doctor/dashboard");
    } else {
      // Email not yet verified – show verification form
      return children;
    }
  }
};

export default DoctorEmailVerification;
