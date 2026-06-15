import React from "react";
import {
  ListOfHistorique,
  NavBarDoctors,
  SidebarDoctors,
} from "../../Components";
import GetAuthDoctor from "../../hooks/GetAuthDoctor";
import { useTranslation } from "react-i18next";

/*
 * Doctors Historique — Appointment history page for doctors
 * Protected route. Shows past appointments via the <ListOfHistorique /> component.
 */
const Historique = () => {
  const { t } = useTranslation();
  document.title = t("doctor_history.title", "History");

  GetAuthDoctor();

  return (
    <>
      <NavBarDoctors />
      <div className="flex pt-16 overflow-x-hidden bg-gray-50 dark:bg-gray-900">
        <SidebarDoctors />
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 sm:ml-72 sm:w-[calc(100%-18rem)] dark:bg-gray-900"
        >
          <main>
            <ListOfHistorique />
          </main>
        </div>
      </div>
    </>
  );
};

export default Historique;
