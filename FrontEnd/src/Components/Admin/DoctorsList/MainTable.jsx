import React, { useState } from "react";
import TableDoctors from "./TableDoctors";
import { Link } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * MainTable.jsx — Admin "Doctors Directory" page layout component
 * Props:
 *   - setShowAlertSucces : function — passed down to TableDoctors to
 *     trigger a success toast after verifying a doctor
 * State:
 *   - searchTerm : string — filters the doctors table by name, email
 * Renders a breadcrumb navigation header with a working search input
 * and the TableDoctors component below it.
 */
const MainTable = ({ setShowAlertSucces }) => {
  const { t } = useTranslation();

  /* Search state — filters the doctors table by name, email, or Matricule */
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header of Page */}
      <div className="bg-white px-8 py-8 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest">
              <li className="inline-flex items-center">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <HomeIcon className="w-3.5 h-3.5 mr-2" />
                  {t("admin.console", "Console")}
                </Link>
              </li>
              <li className="flex items-center text-slate-300">
                <ChevronRightIcon className="w-3 h-3 mx-1" />
                <Link
                  to="#"
                  className="text-slate-400 hover:text-brand-600 transition-colors ml-1"
                >
                  {t("admin.management", "Management")}
                </Link>
              </li>
              <li className="flex items-center text-brand-600">
                <ChevronRightIcon className="w-3 h-3 mx-1" />
                <span className="ml-1">{t("admin.doctors_directory", "Doctors Directory")}</span>
              </li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {t("admin.medical_registry", "Medical Registry")}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {t("admin.medical_registry_desc", "Manage and verify all medical practitioners on the MediBook platform.")}
              </p>
            </div>

            {/* Search Input Section — filters table by name, email, or Matricule */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full md:w-80 pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm font-bold rounded-2xl focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-400"
                placeholder={t("admin.search_doctors", "Search by name or email...")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow bg-slate-50/50">
        <div className="max-w-7xl mx-auto py-2">
          {/* Pass searchTerm down so TableDoctors can filter rows */}
          <TableDoctors setShowAlertSucces={setShowAlertSucces} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default MainTable;

