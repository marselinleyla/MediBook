import React from "react";
import { NavBarDoctors, SidebarDoctors ,Setttings } from "../../Components";
import { useTranslation } from "react-i18next";

/*
 * Doctors Settings — Settings page for doctors
 * Composes NavBarDoctors, SidebarDoctors, and the <Setttings /> form component.
 * No auth hook — accessible after login via sidebar.
 */
const Settings = () => {
  const { t } = useTranslation();
  document.title = t("doctor_settings.title", "Settings");

  return (
    <>
      <NavBarDoctors />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SidebarDoctors />
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
        >
          <main>
            <Setttings />
          </main>
        </div>
      </div>
    </>
  );
};

export default Settings;
