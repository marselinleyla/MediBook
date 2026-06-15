import React, { useEffect, useState } from "react";
import axiosClient from "../../../AxiosClient";
import { CheckCircleIcon, UserIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, ShieldExclamationIcon, ClockIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * TableNoVerified.jsx — Table listing unverified doctor applicants
 * Props:
 *   - setShowAlertSucces : function — triggers success toast after approval
 *   - searchTerm        : string — (optional) filters rows by name/email/Matricule
 * State:
 *   - Doctors       : array — list of unverified doctors from API
 *   - Loading       : boolean — loading spinner state
 *   - LoadingButton : { loading, id } — per-row button loading state
 * Fetches unverified doctors on mount via POST /doctor/noverified.
 * VerifierDoctor(idDoctor): POSTs to /admin/verified to approve a doctor,
 *   then re-fetches the unverified list to keep the table in sync.
 */
const TableNoVerified = ({ setShowAlertSucces, searchTerm = "" }) => {
  const { t } = useTranslation();
  const [Doctors, setDoctors] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [LoadingButton, setLoadingButton] = useState({ loading: false, id: 0 });

  /* Fetch all unverified doctors on mount */
  useEffect(() => {
    setLoading(true);
    axiosClient
      .post("/doctor/noverified")
      .then((res) => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* Approve a doctor, then refresh the unverified list */
  const VerifierDoctor = (idDoctor) => {
    setLoadingButton({ id: idDoctor, loading: true });
    axiosClient
      .post("/admin/verified", { id: idDoctor })
      .then((res) => {
        setLoadingButton({ id: idDoctor, loading: false });
        setShowAlertSucces(true);
        // Refresh list
        axiosClient
          .post("/doctor/noverified")
          .then((res) => {
            setDoctors(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        setLoadingButton({ id: idDoctor, loading: false });
        console.error(err);
      });
  };

  const HeaderTh = ({ children }) => (
    <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
      {children}
    </th>
  );

  return (
    <div className="mx-4 mt-8 mb-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-premium overflow-hidden">
        {/* Table Header Section */}
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight flex items-center">
              {t("admin.pending_applications", "Pending Applications")}
              <span className="ml-3 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-widest">
                {t("admin.action_required", "Action Required")}
              </span>
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t("admin.pending_applications_desc", "Review and verify medical credentials for new practitioners")}
            </p>
          </div>
          <div className="flex items-center space-x-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
               {t("admin.queue", "Queue:")} {Doctors.length}
             </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {!Loading ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white">
                  <HeaderTh>{t("admin.candidate_identity", "Candidate Identity")}</HeaderTh>
                  <HeaderTh>{t("admin.medical_id", "Medical ID")}</HeaderTh>
                  <HeaderTh>{t("admin.contact_details", "Contact Details")}</HeaderTh>
                  <HeaderTh>{t("admin.application_status", "Application Status")}</HeaderTh>
                  <HeaderTh>{t("admin.verification_action", "Verification Action")}</HeaderTh>
                  <HeaderTh>{t("admin.details", "Details")}</HeaderTh>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* IIFE: filter doctors by searchTerm (name/email/Matricule), then render rows or empty state */}
                {(() => {
                  const filtered = Doctors.filter((el) =>
                    searchTerm
                      ? `${el.firstname} ${el.lastname} ${el.email} ${el.Matricule}`
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      : true
                  );
                  return filtered.length > 0 ? filtered.map((el, idx) => {
                  const isVerifying = LoadingButton.loading && LoadingButton.id === el.id;
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold border border-amber-100 mr-4">
                            {el.firstname.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                              Dr. {el.firstname} {el.lastname}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{t("admin.new_registrant", "New Registrant")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-slate-600 font-medium text-sm">
                          <IdentificationIcon className="w-4 h-4 mr-2 text-slate-300" />
                          <code className="bg-slate-50 px-2 py-1 rounded text-[11px] font-bold text-slate-500">{el.Matricule}</code>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-slate-600 font-medium text-[13px]">
                            <PhoneIcon className="w-3.5 h-3.5 mr-2 text-brand-400" />
                            {el.phoneNumber}
                          </div>
                          <div className="flex items-center text-slate-400 font-medium text-[12px]">
                            <EnvelopeIcon className="w-3.5 h-3.5 mr-2 text-slate-300" />
                            {el.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                         <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
                            {t("admin.awaiting_review", "Awaiting Review")}
                          </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          disabled={isVerifying}
                          onClick={() => VerifierDoctor(el.id)}
                          className={`inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-brand-600 text-white hover:bg-brand-700 shadow-premium shadow-brand-200/50 active:scale-95`}
                        >
                          {isVerifying ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              {t("admin.verifying", "Verifying...")}
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              {t("admin.approve_doctor", "Approve Doctor")}
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/doctor/View_Profile/${el.id}`}
                          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:shadow-sm"
                        >
                          <EyeIcon className="w-4 h-4 mr-1.5" />
                          {t("admin.view_profile", "View Profile")}
                        </Link>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                       <ShieldExclamationIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">{t("admin.no_pending_requests", "No pending verification requests")}</p>
                    </td>
                  </tr>
                )})()}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">{t("admin.fetching_records", "Fetching records...")}</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div>{t("admin.compliance_version", "MediBook Compliance v2.4")}</div>
          <div className="flex items-center space-x-4">
             <span className="flex items-center">
               <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
               {t("admin.compliance_active", "Compliance Protocol Active")}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableNoVerified;

