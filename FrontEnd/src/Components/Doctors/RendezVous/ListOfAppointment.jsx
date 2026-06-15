import React, { useState } from "react";
import AnnulerModel from "../Includes/AnnulerModel";
import AjouterModel from "./AjouterModel";
import TableAppointment from "./TableAppointment";
import { Link } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, CalendarDaysIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import axiosClient from "../../../AxiosClient";

/*
 * ListOfAppointment.jsx — Doctor "Appointment Inbox" page layout
 * State:
 *   - show           : boolean — toggles the "Add Appointment" modal
 *   - showAnnuler    : boolean — toggles the cancel confirmation modal
 *   - idAppointment  : number|null — selected appointment DB id for cancel
 *   - refreshKey     : number — incremented after cancel to trigger re-fetch
 * AnnulerAppointment(id): calls the cancel API, closes modal on success.
 * Renders a breadcrumb header with a "Add Appointment" button, the
 * TableAppointment component, and both the AjouterModel (add) and
 * AnnulerModel (cancel) modals.
 */
const ListOfAppointment = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showAnnuler, setShowAnnuler] = useState(false);
  const [idAppointment, setIdAppointment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const AnnulerAppointment = (id) => {
    axiosClient
      .post("/appointment/cancel", { id })
      .then(() => {
        setShowAnnuler(false);
        setIdAppointment(null);
        setRefreshKey((k) => k + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header of Page */}
      <div className="bg-white px-8 py-8 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest">
              <li className="inline-flex items-center">
                <Link
                  to="/doctor/dashboard"
                  className="flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <HomeIcon className="w-3.5 h-3.5 mr-2" />
                  {t("dashboard.title")}
                </Link>
              </li>
              <li className="flex items-center text-brand-600">
                <ChevronRightIcon className="w-3 h-3 mx-1" />
                <span className="ml-1">{t("doctor.appointments", "Appointments")}</span>
              </li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start">
              <div className="p-3 bg-brand-50 rounded-2xl border border-brand-100 mr-4">
                <CalendarDaysIcon className="w-8 h-8 text-brand-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {t("doctor.appointment_inbox", "Appointment Inbox")}
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  {t("doctor.appointment_inbox_desc", "Manage your upcoming medical consultations and patient requests.")}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-brand-600 rounded-2xl hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95"
              onClick={() => setShow(!show)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t("doctor.add_appointment", "Add Appointment")}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow bg-slate-50/50">
        <div className="max-w-7xl mx-auto py-2">
          <TableAppointment
            refreshKey={refreshKey}
            showAnnuler={showAnnuler}
            setShowAnnuler={setShowAnnuler}
            setIdAppointment={setIdAppointment}
            AnnulerAppointment={AnnulerAppointment}
          />
        </div>
      </div>

      {/* Component Add New Appointment */}
      <AjouterModel show={show} setShow={setShow} />

      {/* Component Annuler Apointment */}
      <AnnulerModel
        showAnnuler={showAnnuler}
        setShowAnnuler={setShowAnnuler}
        AnnulerAppointment={AnnulerAppointment}
        idAppointment={idAppointment}
      />
    </div>
  );
};

export default ListOfAppointment;
