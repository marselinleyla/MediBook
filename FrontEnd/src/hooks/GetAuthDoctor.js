/* ============================================================
 * GetAuthDoctor.js – Custom hook that fetches the authenticated
 * doctor's profile from the API and saves it to Redux.
 *
 * Runs when the component mounts (or dependencies change) if
 * the doctor is marked as authenticated, has a stored token,
 * but the doctor profile hasn't been loaded yet.
 * ============================================================ */

import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addDoctorData } from "../Redux/SliceAuthDoctor";
import { get, remove } from "../Services/LocalStorageService";
import axiosClient from "../AxiosClient";

const GetAuthDoctor = () => {
  const dispatch = useDispatch();

  // doctorData – the current doctor auth state from Redux (SliceAuthDoctor)
  const doctorData = useSelector((state) => state.AuthDoctor);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor profile only when authenticated, token exists,
    // but doctor data hasn't been populated yet.
    if (
      doctorData.isAuthenticated &&
      get("TOKEN_DOCTOR") &&
      !doctorData.doctor
    ) {
      axiosClient
        .get("/doctor")
        .then((re) => {
          // Store the fetched doctor profile in Redux
          dispatch(addDoctorData(re.data));
          console.log(re);
        })
        .catch((er) => {
          console.log(er);
          // Token is invalid/expired – remove it and redirect to login
          remove("TOKEN_DOCTOR")
          navigate("/doctor/login");
        });
    }
    console.log(doctorData);
  }, [dispatch, navigate , doctorData]);
};

export default GetAuthDoctor;
