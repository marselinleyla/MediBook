import { Footer, Header, UserNavSettings } from "../../Components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import GetAuthUser from "../../hooks/GetAuthUser";
import {
  XCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const CancelledAppointments = () => {
  const { t } = useTranslation();
  const userData = useSelector((state) => state.authUser);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  GetAuthUser();

  useEffect(() => {
    if (userData?.user?.id) {
      setLoading(true);
      axiosClient
        .get("/user/appointments/cancelled/" + userData.user.id)
        .then((res) => {
          setAppointments(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <UserNavSettings />
          </div>

          <div className="lg:w-3/4">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-rose-50 rounded-2xl">
                    <XCircleIcon className="w-7 h-7 text-rose-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {t("user.cancelled_appointments", "Cancelled Appointments")}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                      {t("user.cancelled_appointments_desc", "Appointments that have been cancelled by your doctor")}
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="bg-white rounded-[2.5rem] p-20 border border-slate-100 shadow-premium flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
                  <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                    {t("common.loading", "Loading...")}
                  </p>
                </div>
              ) : appointments.length > 0 ? (
                appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-premium hover:border-rose-100 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
                          <XCircleIcon className="w-8 h-8" />
                        </div>
                      </div>

                      <div className="flex-grow space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-rose-100">
                            {t("user.cancelled", "Cancelled")}
                          </span>
                          <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-100">
                            {appt.type_appointment}
                          </span>
                        </div>

                        <div className="flex items-center text-slate-900 font-bold">
                          <BuildingOffice2Icon className="w-4 h-4 mr-2 text-slate-400" />
                          {t("user.doctor", "Dr.")} {appt.doctor?.firstname} {appt.doctor?.lastname}
                        </div>

                        <div className="flex items-center text-sm text-slate-500">
                          <CalendarDaysIcon className="w-4 h-4 mr-2 text-rose-400" />
                          {appt.date_appointment}
                          <span className="mx-2">—</span>
                          <ClockIcon className="w-4 h-4 mr-2 text-rose-400" />
                          {appt.time_appointment}
                        </div>

                        {appt.doctor?.specialite && (
                          <p className="text-sm text-slate-400">
                            {appt.doctor.specialite}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[2.5rem] p-20 border border-slate-100 shadow-premium flex flex-col items-center text-center">
                  <div className="p-4 bg-slate-50 rounded-3xl mb-4">
                    <CalendarDaysIcon className="w-12 h-12 text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-bold">
                    {t("user.no_cancelled_appointments", "No cancelled appointments")}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {t("user.no_cancelled_appointments_desc", "You have no appointments that have been cancelled.")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CancelledAppointments;
