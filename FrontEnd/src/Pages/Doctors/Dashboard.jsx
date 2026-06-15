import {
  NavBarDoctors,
  SectionDoctor,
  SidebarDoctors,
  TableDashboard,
} from "../../Components";
import GetAuthDoctor from "../../hooks/GetAuthDoctor";
import { useTranslation } from "react-i18next";

/*
 * Doctors Dashboard — Main doctor dashboard page
 * Protected route (GetAuthDoctor guards authentication).
 * Composes NavBarDoctors, SidebarDoctors, SectionDoctor (stats/cards), and TableDashboard.
 * No local state — delegates to child components.
 */
const Dashboard = () => {
  const { t } = useTranslation();
  document.title = t("doctor_dashboard.title", "Doctor Dashboard");
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
            <SectionDoctor />
            <TableDashboard />
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
