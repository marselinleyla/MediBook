import { Footer, Header, UserNavSettings } from "../../Components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import GetAuthUser from "../../hooks/GetAuthUser";
import { useTranslation } from "react-i18next";
import {
  CalendarDaysIcon,
  ClockIcon,
  XCircleIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

const UserAppointments = () => {
  const { t } = useTranslation();
  const userData = useSelector((state) => state.authUser);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  GetAuthUser();

  const fetchAppointments = () => {
    if (userData?.user?.id) {
      setLoading(true);
      axiosClient
        .get("/user/appointments/" + userData.user.id)
        .then((res) => {
          setAppointments(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userData]);

  const handleCancel = (id) => {
    setCancellingId(id);
    axiosClient
      .post("/appointment/cancel", { id })
      .then(() => {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setCancellingId(null);
      })
      .catch((err) => {
        console.error(err);
        setCancellingId(null);
      });
  };

  const isPast = (dateStr) => {
    const today = new Date();
    const apptDate = new Date(dateStr);
    return apptDate < new Date(today.toISOString().slice(0, 10));
  };

  const HeaderTh = ({ children }) => (
    <th className="px-4 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">
      {children}
    </th>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <UserNavSettings />
          </div>

          <div className="lg:w-3/4">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-50 rounded-2xl">
                    <CalendarDaysIcon className="w-7 h-7 text-brand-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {t("user.my_appointments", "My Appointments")}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                      {t("user.my_appointments_desc", "View and manage your upcoming and past appointments")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="py-20 flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                      {t("common.loading", "Loading...")}
                    </p>
                  </div>
                ) : appointments.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <HeaderTh>{t("user.doctor", "Doctor")}</HeaderTh>
                        <HeaderTh>{t("user.speciality", "Speciality")}</HeaderTh>
                        <HeaderTh>{t("user.date", "Date")}</HeaderTh>
                        <HeaderTh>{t("user.time", "Time")}</HeaderTh>
                        <HeaderTh>{t("user.type", "Type")}</HeaderTh>
                        <HeaderTh>{t("user.status", "Status")}</HeaderTh>
                        <HeaderTh></HeaderTh>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {appointments.map((appt) => {
                        const past = isPast(appt.date_appointment);
                        return (
                          <tr
                            key={appt.id}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 mr-3">
                                  {appt.doctor?.firstname?.charAt(0) || "D"}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">
                                    Dr. {appt.doctor?.firstname} {appt.doctor?.lastname}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                              {appt.doctor?.specialite || "—"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-slate-700 font-medium">
                                <CalendarDaysIcon className="w-4 h-4 mr-2 text-slate-300" />
                                {appt.date_appointment}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-slate-700 font-medium">
                                <ClockIcon className="w-4 h-4 mr-2 text-slate-300" />
                                {appt.time_appointment}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-emerald-50 border-emerald-100 text-emerald-600">
                                {appt.type_appointment}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {past ? (
                                <span className="px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-slate-50 border-slate-100 text-slate-500">
                                  {t("user.completed", "Completed")}
                                </span>
                              ) : (
                                <span className="px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-brand-50 border-brand-100 text-brand-600">
                                  {t("user.upcoming", "Upcoming")}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              {!past && (
                                <button
                                  onClick={() => handleCancel(appt.id)}
                                  disabled={cancellingId === appt.id}
                                  className="inline-flex items-center px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                                >
                                  {cancellingId === appt.id ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-rose-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                      </svg>
                                      {t("common.cancelling", "Cancelling...")}
                                    </>
                                  ) : (
                                    <>
                                      <XCircleIcon className="w-4 h-4 mr-1.5" />
                                      {t("common.cancel", "Cancel")}
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="p-4 bg-slate-50 rounded-3xl mb-4">
                      <CalendarDaysIcon className="w-12 h-12 text-slate-300" />
                    </div>
                    <p className="text-slate-900 font-bold">
                      {t("user.no_appointments", "No appointments yet")}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {t("user.no_appointments_desc", "Book an appointment with a doctor to get started.")}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t("user.total_count", "Total")}: {appointments.length} {t("user.appointments", "appointments")}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserAppointments;
