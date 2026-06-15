/* ============================================================
 * Routes.jsx – Application route definitions.
 *
 * Defines all the routes for the MediBook app using
 * createBrowserRouter. Each route can be:
 *   - Public (no guard)
 *   - Guarded by an auth guard (user, doctor, or admin)
 *   - Guarded by a verification/confirmation redirect guard
 *
 * Guards are wrapped around the page component as layout
 * components that either render children or redirect.
 * ============================================================ */

import { PageNotfond } from "../Components";
import AuthGuard from "../Middleware/AuthGuard";
import AppointmentGuard from "../Middleware/AppointmentGuard";
import {
  SearchDoctors,
  Home,
  Login,
  Signup,
  DocotrDashboard,
  DoctorRendezVous,
  DoctorHistorique,
  DocotrSettings,
  UserSettings,
  UserProfile,
  UserChangePassword,
  UserCancelledAppointments,
  UserAppointments,
  BookingAppointment,
  DoctorsLogin,
  DoctorsSignup,
  AuthAdmin,
  DashboardAdmin,
  DoctorsList,
  NoVerifiedDoctors,
  AdminSettings,
  UserVerifeyEmail,
  DoctorsVerificationEmail,
  DoctorsConfirmation,
  Aboutus,
  ContactUs,
  DoctorPage,
} from "../Pages";
import AuthDoctorGuard from "../Middleware/AuthDoctorGuard";
import GuardAdmin from "../Middleware/GuardAdmin";
import VerificationEmailGuard from "../Middleware/VerificationEmailGuard";
import DoctorEmailVerification from "../Middleware/DoctorEmailVerification";
import DoctorsConfirmationGuard from "../Middleware/DoctorsConfirmationGuard";

import { Navigate } from "react-router-dom";
const { createBrowserRouter } = require("react-router-dom");

const router = createBrowserRouter([
  // ── Public Routes ────────────────────────────────────────
  {
    path: "/",
    errorElement: <PageNotfond />,
    element: <Home />,
  },
  {
    path: "/About",
    element: <Aboutus />,
  },
  {
    path: "/Contact",
    element: <ContactUs />,
  },
  {
    path: "/doctor/View_Profile/:id",
    element: <DoctorPage />,
  },
  {
    path: "/recherche",
    element: <SearchDoctors />,
  },
  {
    path: "/Connexion",
    element: <Login />,
  },
  {
    path: "/identifier",
    element: <Signup />,
  },
  // Booking – requires user authentication (via AppointmentGuard)
  {
    path: "/bookingappointment/:id",
    element: (
      <AppointmentGuard>
        <BookingAppointment />
      </AppointmentGuard>
    ),
  },

  // ── User Routes ─────────────────────────────────────────
  // Email verification page; redirects to profile if already verified
  {
    path: "/user/verifeyemail",
    element: (
      <VerificationEmailGuard>
        <UserVerifeyEmail />
      </VerificationEmailGuard>
    ),
  },
  // User-protected pages (requires auth + email verification)
  {
    path: "/user/profile",
    element: (
      <AuthGuard>
        <UserProfile />
      </AuthGuard>
    ),
  },
  {
    path: "/user/settings",
    element: (
      <AuthGuard>
        <UserSettings />
      </AuthGuard>
    ),
  },
  {
    path: "/user/changepassword",
    element: (
      <AuthGuard>
        <UserChangePassword />
      </AuthGuard>
    ),
  },
  {
    path: "/user/cancelled-appointments",
    element: (
      <AuthGuard>
        <UserCancelledAppointments />
      </AuthGuard>
    ),
  },
  {
    path: "/user/appointments",
    element: (
      <AuthGuard>
        <UserAppointments />
      </AuthGuard>
    ),
  },

  // ── Doctor Routes ───────────────────────────────────────
  // Public auth pages for doctors
  {
    path: "/doctor/login",
    element: <DoctorsLogin />,
  },
  {
    path: "/doctor/profile",
    element: <Navigate to="/doctor/settings" replace />,
  },
  {
    path: "/doctor/signup",
    element: <DoctorsSignup />,
  },
  // Doctor-protected dashboard pages (requires auth + email + admin confirmation)
  {
    path: "/doctor/dashboard",
    element: (
      <AuthDoctorGuard>
        <DocotrDashboard />
      </AuthDoctorGuard>
    ),
  },
  {
    path: "/docotr/rendezvous",
    element: (
      <AuthDoctorGuard>
        <DoctorRendezVous />
      </AuthDoctorGuard>
    ),
  },
  {
    path: "/doctor/historique",
    element: (
      <AuthDoctorGuard>
        <DoctorHistorique />
      </AuthDoctorGuard>
    ),
  },
  {
    path: "/doctor/settings",
    element: (
      <AuthDoctorGuard>
        <DocotrSettings />
      </AuthDoctorGuard>
    ),
  },
  // Email verification – redirects to dashboard if already verified
  {
    path: "/doctor/verifyemail",
    element: (
      <DoctorEmailVerification>
        <DoctorsVerificationEmail />
      </DoctorEmailVerification>
    ),
  },
  // Waiting for admin confirmation – redirects to dashboard if confirmed
  {
    path: "/doctor/confirmation",
    element: (
      <DoctorsConfirmationGuard>
        <DoctorsConfirmation />
      </DoctorsConfirmationGuard>
    ),
  },

  // ── Admin Routes ────────────────────────────────────────
  {
    path: "/admin/login",
    element: <AuthAdmin />,
  },
  // Admin-protected pages
  {
    path: "/admin/dashboard",
    element: (
      <GuardAdmin>
        <DashboardAdmin />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <GuardAdmin>
        <AdminSettings />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/doctors",
    element: (
      <GuardAdmin>
        <DoctorsList />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/doctors/noverified",
    element: (
      <GuardAdmin>
        <NoVerifiedDoctors />
      </GuardAdmin>
    ),
  },
]);

export default router;
