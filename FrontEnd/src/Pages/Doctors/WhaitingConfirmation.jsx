import React, { useState } from "react";
import { Footer, Header } from "../../Components";
import axiosClient from "../../AxiosClient";
import { logout } from "../../Redux/SliceAuthDoctor";
import { remove } from "../../Services/LocalStorageService";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import AlertSucces from "../../Components/Alert/AlertSucces";
import { useTranslation } from "react-i18next";

/*
 * WhaitingConfirmation — Doctor pending-approval page
 * Shown after a doctor registers but before admin verification.
 * Allows resending the verification email or logging out.
 * State:
 *   ShowAlertSucce — success toast visibility
 *   loading — button spinner while resending
 * API:
 *   GET /doctors/email/resend/:id — resends verification email
 *   POST /doctor/logout — logs out and clears token
 */
const WhaitingConfirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [ShowAlertSucce, setShowAlertSucce] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Logs out the doctor, clears Redux + localStorage, and redirects to login */
  const HandleLogout = () => {
    axiosClient
      .post("/doctor/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(logout());
          remove("TOKEN_DOCTOR");
          navigate("/Connexion");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* Sends a new verification email, shows a success alert for 5 seconds */
  const ResendVerificationEmail = () => {
    setLoading(true);
    axiosClient
      .get(`/doctors/email/resend/${doctorData.doctor.id}`)
      .then(() => {
        setLoading(false);
        setShowAlertSucce(true);
        setTimeout(() => setShowAlertSucce(false), 5000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className=" absolute w-[100%] h-[100vh]  img_bg">
        <div className=" relative bg-black  bg-opacity-75 ">
          <Header />
          <main className="h-[80.65vh] flex justify-center items-center ">
            <div className="  bg-slate-100 flex justify-center items-center  w-[40%] h-[35%] p-2 rounded-lg ">
              <div className="max-w-xl px-5 text-center">
                {/* Heading: waiting for admin approval */}
                <h2 className="mb-2 text-[23px] font-bold text-zinc-800">
                  {t("whaiting.title", "Waiting to Confirm Your Account")}
                </h2>
                {/* Explanation text */}
                <p className="mb-2 text-[16px] text-zinc-500">
                  {t("whaiting.description", "We will contact you by email when we need something.")}
                </p>
                {/* Resend verification email button */}
                <button
                  onClick={ResendVerificationEmail}
                  disabled={loading}
                  className="mt-3 inline-block text-[16px] w-72 rounded bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
                >
                  {loading ? t("whaiting.sending", "Sending...") : t("whaiting.resend_link", "Resend Verification Link")}
                </button>
                {/* Logout button */}
                <button
                  onClick={HandleLogout}
                  className=" mt-3 ml-7 px-4 mr-2  text-[14px] font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 "
                >
                  {t("whaiting.logout", "Logout")}
                </button>
              </div>
            </div>
          </main>
          <Footer colorText="white" />
        </div>
      </div>
      {ShowAlertSucce && (
        <AlertSucces Message={t("whaiting.alert_success", "Verification link sent successfully")} />
      )}
    </>
  );
};

export default WhaitingConfirmation;
