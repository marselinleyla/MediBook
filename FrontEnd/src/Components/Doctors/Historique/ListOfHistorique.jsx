import React from "react";
import TableHistorique from "./TableHistorique";
import { Link } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * ListOfHistorique.jsx — Doctor "Consultation History" page layout
 * Renders a breadcrumb header with an archive icon, page title,
 * search input, and the TableHistorique component below. Acts as the
 * page shell for browsing completed/past medical consultations.
 */
const ListOfHistorique = () => {
  const { t } = useTranslation();
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
                <span className="ml-1">{t("doctor.medical_archive", "Medical Archive")}</span>
              </li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mr-4">
                <ArchiveBoxIcon className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {t("doctor.consultation_history", "Consultation History")}
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  {t("doctor.consultation_history_desc", "A comprehensive record of all your past patient interactions and medical sessions.")}
                </p>
              </div>
            </div>

             {/* Search Input Section */}
             <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text"
                name="search"
                className="block w-full md:w-80 pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm font-bold rounded-2xl focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-400"
                placeholder={t("doctor.search_archive", "Search archive by patient CIN...")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow bg-slate-50/50">
        <div className="max-w-7xl mx-auto py-2">
          <TableHistorique />
        </div>
      </div>
    </div>
  );
};

export default ListOfHistorique;
