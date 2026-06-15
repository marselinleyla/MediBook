/* ============================================================
 * Pages/index.js – Barrel export for all page-level components.
 *
 * Re-exports every page/route component, grouped by domain:
 * public pages, doctor dashboard pages, user pages, and admin
 * pages.
 * ============================================================ */

// ── Public Pages ───────────────────────────────────────────
export { default as Home } from "./Home";
export { default as SearchDoctors } from "./SearchDoctors";
export { default as Login } from "./Login.jsx";
export { default as Signup } from "./Signup.jsx";
export { default as BookingAppointment } from "./BookingAppointment";
export { default as DoctorProfile } from "./DoctorProfile";
export { default as Aboutus } from "./Aboutus";
export { default as ContactUs } from "./ContactUs";
export { default as DoctorPage } from "./DoctorPage";

// ── Doctor Dashboard Pages ─────────────────────────────────
export { default as DocotrDashboard } from "./Doctors/Dashboard.jsx";
export { default as DoctorRendezVous } from "./Doctors/RendezVous.jsx";
export { default as DoctorHistorique } from "./Doctors/Historique.jsx";
export { default as DocotrSettings } from "./Doctors/Settings.jsx";
export { default as DoctorsSignup } from "./AuthDoctors/Signup";
export { default as DoctorsLogin } from "./AuthDoctors/Login";
export { default as DoctorsVerificationEmail } from "./AuthDoctors/VerificationEmail";
export { default as DoctorsConfirmation } from "./Doctors/WhaitingConfirmation";

// ── User Pages ─────────────────────────────────────────────
export { default as UserProfile } from "./Users/Profile.jsx";
export { default as UserSettings } from "./Users/Settings.jsx";
export { default as UserChangePassword } from "./Users/ChangePassword";
export { default as UserVerifeyEmail } from "./Users/VerifeyEmail";
export { default as UserCancelledAppointments } from "./Users/CancelledAppointments";
export { default as UserAppointments } from "./Users/UserAppointments";

// ── Admin Pages ────────────────────────────────────────────
export { default as AuthAdmin } from "./Admin/Auth/AuthAdmin";
export { default as DashboardAdmin } from "./Admin/Dashboard";
export { default as DoctorsList } from "./Admin/DoctorsList";
export { default as NoVerifiedDoctors } from "./Admin/NoVerifiedDoctors";
export { default as AdminSettings } from "./Admin/Settings";
