/* ============================================================
 * DoctorsConfirmationGuard.jsx – Route guard for the doctor
 * waiting-for-confirmation page.
 *
 * If the doctor's account has already been verified by an admin
 * (verified === 1), they are redirected to the dashboard.
 * Otherwise the child component renders. Also fetches the
 * doctor profile if it hasn't been loaded yet.
 * ============================================================ */

import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { get, remove } from "../Services/LocalStorageService";
import axiosClient from "../AxiosClient";
import { addDoctorData } from "../Redux/SliceAuthDoctor";

const DoctorsConfirmationGuard = ({children}) => {
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
          console.log(er);
          remove("TOKEN_DOCTOR")
          navigate("/doctor/login");
        });
    }
    console.log(AuthDoctorData);
  }, [dispatch, navigate, AuthDoctorData]);

  if (AuthDoctorData.doctor) {
    if (AuthDoctorData.doctor.verified === 1) {
      // Admin has confirmed the account – redirect to dashboard
      return navigate("/doctor/dashboard");
    } else {
      // Not yet confirmed – show "waiting for confirmation" page
      return children;
    }
  }
};

export default DoctorsConfirmationGuard;
