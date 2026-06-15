import { Modal } from "flowbite-react";
import React from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * AnnulerModel.jsx — Appointment cancellation confirmation modal
 * Props:
 *   - showAnnuler       : boolean — controls modal visibility
 *   - setShowAnnuler    : function — toggles modal open/close
 *   - AnnulerAppointment: function(id) — called when user confirms cancellation
 *   - idAppointment     : any — identifier of the appointment to cancel
 * Renders a Flowbite Modal with a warning icon, confirmation text,
 * a red "Yes, Cancel" button that invokes AnnulerAppointment, and a
 * "No, Keep It" button that closes the modal.
 */
const AnnulerModel = ({
  showAnnuler,
  setShowAnnuler,
  AnnulerAppointment,
  idAppointment,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      show={showAnnuler}
      size="md"
      popup={true}
      onClose={() => setShowAnnuler(false)}
    >
      <div className="relative bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-rose-100">
        {/* Modal Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setShowAnnuler(false)}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-10 h-10 text-rose-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
            {t("doctor.confirm_cancellation", "Confirm Cancellation")}
          </h3>
          <p className="text-sm font-medium text-slate-500 mb-10 leading-relaxed px-4">
            {t("doctor.cancel_confirmation_desc", "Are you absolutely sure you want to cancel this appointment? This action will notify the patient and cannot be undone.")}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => AnnulerAppointment(idAppointment)}
              className="w-full py-4 text-sm font-bold text-white bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-premium shadow-rose-200/50 transition-all active:scale-95"
            >
              {t("doctor.yes_cancel", "Yes, Cancel Appointment")}
            </button>
            <button
              onClick={() => setShowAnnuler(false)}
              className="w-full py-4 text-sm font-bold text-slate-500 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
            >
              {t("doctor.no_keep", "No, Keep It")}
            </button>
          </div>
        </div>
        
        {/* Decorative footer */}
        <div className="h-2 bg-rose-600/5 w-full" />
      </div>
    </Modal>
  );
};

export default AnnulerModel;
