import React from "react";
import { Modal } from "flowbite-react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

/*
 * ComplitedAppointment — Success confirmation modal (child of BookingAppointment)
 * Displays after a successful booking. Shows a checkmark, congratulatory message,
 * and a download link for the prescription PDF returned by the server.
 * Props:
 *   showComplitedAppointment — boolean controlling modal visibility
 *   setShowComplitedAppointment — toggle function
 *   FilePath — filename returned from POST /take/appointment, used to build PDF URL
 */
const ComplitedAppointment = ({
  setShowComplitedAppointment,
  showComplitedAppointment,
  FilePath,
}) => {
  const { t } = useTranslation();
  console.log(FilePath);

  return (
    <>
      <Modal
        show={showComplitedAppointment}
        size="md"
        popup={true}
        onClose={() => setShowComplitedAppointment(!showComplitedAppointment)}
      >
        {/* <!-- Modal content --> */}
        <div
          data-te-animation-init
          data-te-animation="[fade-in_1s_ease-in-out]"
          className="relative  bg-white rounded-lg shadow dark:bg-gray-800"
        >
          {/* <!-- Modal header --> */}
          <div className="flex justify-end p-2">
            <button
              onClick={() =>
                setShowComplitedAppointment(!showComplitedAppointment)
              }
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          {/* <!-- Modal body: success icon, message, and PDF download link --> */}
          <div className="p-6 pt-0 text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-primary-600 " />

            <h3 className="mt-5 mb-6 text-lg text-gray-700 dark:text-gray-300 font-bold">
              {t("booking.appointment_booked", "Your appointment has been booked successfully!")}
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {t("booking.download_prescription", "You can download your prescription below.")}
            </p>
            {/* Download link pointing to the generated PDF on the server */}
            <a
              href={"http://localhost:8000/storage/storage/pdf/" + FilePath}
              download={"FilePath"}
              target="_blank"
              className="text-white  bg-primary-600 hover:bg-primary-700  focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-800"
            >
              {t("booking.print", "Print")}
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ComplitedAppointment;
