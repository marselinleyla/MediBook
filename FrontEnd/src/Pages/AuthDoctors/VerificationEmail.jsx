import React, { useState } from "react";
import { Footer, Header } from "../../Components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import AlertSucces from "../../Components/Alert/AlertSucces";
import { remove } from "../../Services/LocalStorageService";
import { logout } from "../../Redux/SliceAuthDoctor";
import { useTranslation } from "react-i18next";

/*
 * VerificationEmail — Doctor email verification page
 * Shown after doctor registration before the account is fully verified.
 * Allows the doctor to resend the verification email or log out.
 * State:
 *   ShowAlertSucce — controls success toast visibility
 * API:
 *   GET /doctors/email/resend/:id — resends verification link
 *   POST /doctor/logout — logs out the doctor
 */
const VerificationEmail = () => {
  const { t } = useTranslation();
  document.title = t("verification.title", "Verify Email");

  const doctorData = useSelector((state) => state.AuthDoctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ShowAlertSucce, setShowAlertSucce] = useState(false);

  /* Requests a new verification email to be sent */
  const ResendVerificationEmail = () => {
    console.log(doctorData.doctor.id);
    axiosClient
      .get(`/doctors/email/resend/${doctorData.doctor.id}`)
      .then(() => {
        setShowAlertSucce(!ShowAlertSucce);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* Logs out the doctor, clears token, and redirects to login */
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

  return (
    <>
      <div className=" absolute w-[100%] h-[100vh]  img_bg">
        <div className=" relative bg-black  bg-opacity-75 ">
          <Header />
          <main className="h-[80.65vh] flex justify-center items-center ">
            <div className="  bg-slate-100  w-[40%] h-[35%] p-2 rounded-lg ">
              <div className="max-w-xl px-5 text-center">
                {/* Heading: asks doctor to check their email */}
                <h2 className="mb-2 text-[23px] font-bold text-zinc-800">
                  {t("verification.check_email", "Check your Email")}
                </h2>
                {/* Message showing which email the verification link was sent to */}
                <p className="mb-2 text-[16px] text-zinc-500">
                  {t("verification.sent_link", "We've sent you a verification link to the email address")}{" "}
                  <span className="font-medium text-indigo-500">
                    {doctorData.doctor && doctorData.doctor.email}
                  </span>
                  .
                </p>
                {/* Action buttons: Resend Verification + Logout (duplicate Logout button appears to be a bug) */}
                <div className=" flex ">
                  <button
                    onClick={ResendVerificationEmail}
                    className="mt-3 inline-block text-[16px] w-72 rounded bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
                  >
                    {t("verification.resend", "Resend Verification")} →
                  </button>
                  <button
                    onClick={HandleLogout}
                    className=" mt-3 ml-7 px-4 mr-2  text-[14px] font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 "
                  >
                    {t("verification.logout", "Logout")}
                  </button>

                </div>
              </div>
            </div>
          </main>
          <Footer colorText="white" />
        </div>
      </div>
      {ShowAlertSucce && (
        <AlertSucces Message={t("verification.alert_success", "Verification link sent successfully")} />
      )}
    </>
  );
};

export default VerificationEmail;
