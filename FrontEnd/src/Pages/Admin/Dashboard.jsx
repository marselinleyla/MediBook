import { NavBarAdmin, SidebarAdmin, AdminDashboardTable } from "../../Components";
import GetAuthAdmin from "../../hooks/GetAuthAdmin";
import { useTranslation } from "react-i18next";

/*
 * AdminDashboard — Main admin dashboard page
 * Protected route (GetAuthAdmin guards authentication).
 * Composes NavBarAdmin, SidebarAdmin, and the AdminDashboardTable component.
 * Shows a table of doctors who registered today.
 */
const Dashboard = () => {
  const { t } = useTranslation();
  document.title = t("admin_dashboard.title", "Admin Dashboard");

  GetAuthAdmin()

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
            <AdminDashboardTable />
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
