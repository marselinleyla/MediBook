/* ============================================================
 * Components/index.js – Barrel export for all shared components.
 *
 * Re-exports every reusable component used across the MediBook
 * application, organised by domain: Home, Doctors Dashboard,
 * Alerts, User, and Admin.
 * ============================================================ */

// ── Home / Public Exports ──────────────────────────────────
export { default as Header } from "./Home/Header";
export { default as Section } from "./Home/Section";
export { default as Footer } from "./Home/Footer";
export { default as PageNotfond } from "./404Page.jsx";
export { default as SearchDoctorCard } from "./Home/SearchDoctorCard";
export { default as TimePicker } from "./Home/TimePicker";
export { default as AuthButton } from "./AuthButton";
export { default as DataPicker } from "./Home/DataPicker";
export { default as Spinner } from "./Spinner";

// ── Doctors Dashboard ──────────────────────────────────────
export { default as NavBarDoctors } from "./Doctors/Includes/NavBar.jsx";
export { default as SidebarDoctors } from "./Doctors/Includes/Sidebar.jsx";
export { default as TableDashboard } from "./Doctors/Dashboard/TableData.jsx";
export { default as ListOfAppointment } from "./Doctors/RendezVous/ListOfAppointment";
export { default as ListOfHistorique } from "./Doctors/Historique/ListOfHistorique.jsx";
export { default as Setttings } from "./Doctors/Settings/Setttings.jsx";
export { default as SectionDoctor } from "./Doctors/Dashboard/Section";

// ── Alert Components ───────────────────────────────────────
export { default as AlertToRegistre } from "./Alert/AlertToRegistre.jsx";
export { default as AlertErrorMessage } from "./Alert/AlertErrorMessage.jsx";

// ── User ───────────────────────────────────────────────────
export { default as UserNavSettings } from "./User/NavSettings.jsx";

// ── Admin ──────────────────────────────────────────────────
export { default as NavBarAdmin } from "./Admin/Includes/NavBar";
export { default as NotificationAdmin } from "./Admin/Includes/Notification";
export { default as SidebarAdmin } from "./Admin/Includes/Sidebar";
export { default as ListOfDoctors } from "./Admin/DoctorsList/MainTable";
export { default as ListOfDoctorsNoVerified } from "./Admin/DoctorsNoVirified/MainDoctorsNoVirified";
export { default as AdminSetttings } from "./Admin/Settings/AdminSetttings";
export { default as AdminDashboardTable } from "./Admin/Dashboard/AdminDashboardTable";
