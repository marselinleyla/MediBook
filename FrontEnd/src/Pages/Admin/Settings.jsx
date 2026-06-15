import React from "react";
import { NavBarAdmin, SidebarAdmin, AdminSetttings } from "../../Components";
import GetAuthAdmin from "../../hooks/GetAuthAdmin";
import { useTranslation } from "react-i18next";

const AdminSettings = () => {
  const { t } = useTranslation();
  document.title = t("admin_settings.title", "Admin Settings");

  GetAuthAdmin();

  return (
    <>
      <NavBarAdmin />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SidebarAdmin />
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
        >
          <main>
            <AdminSetttings />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
