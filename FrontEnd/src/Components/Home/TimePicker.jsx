import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "../../AxiosClient";

/*
 * TimePicker.jsx — Appointment time slot selector with reservation check
 * Props:
 *   - minTime, maxTime : string — "HH:MM" boundaries for the time range
 *   - stepInMinutes    : number — interval between time slots (default 30)
 *   - DateAp           : string — selected date in "dd/mm/yyyy" format
 *   - idDoctor         : number — doctor ID to check reserved slots
 *   - onChange         : function(Event) — called when a time is selected
 *   - value            : string — currently selected time value
 * State:
 *   - reservedTime : string[] — array of already-booked time strings
 * formattedTimeOptions (useMemo): generates an array of "HH:MM" slots
 *   between minTime and maxTime at the configured interval.
 * Fetches reserved times via POST /appointment/reserved when DateAp or
 * idDoctor changes.
 * isToday (useMemo): checks if DateAp is the current date.
 * currentTimeStr (useMemo): captures the current "HH:MM" at render time
 *   for disabling past time slots on today's date.
 * Renders a <select> dropdown. If no DateAp is selected, shows a disabled
 * placeholder. Each option is disabled if reserved or (if today) in the past.
 */
function TimePicker({
  minTime,
  maxTime,
  stepInMinutes,
  DateAp,
  idDoctor,
  onChange,
  value,
}) {
  const { t } = useTranslation();
  const [reservedTime, setReservedTime] = useState([]);

  /* Generate time slot options between minTime and maxTime */
  const formattedTimeOptions = useMemo(() => {
    const minTimeDate = minTime
      ? new Date(`1970-01-01T${minTime}`)
      : null;
    const maxTimeDate = maxTime
      ? new Date(`1970-01-01T${maxTime}`)
      : null;
    const stepInSeconds = (stepInMinutes || 30) * 60;

    const options = [];
    if (minTimeDate && maxTimeDate) {
      let end = new Date(maxTimeDate);
      if (end <= minTimeDate) {
        end.setDate(end.getDate() + 1);
      }
      let currTime = minTimeDate;
      while (currTime <= end) {
        const h = currTime.getHours().toString().padStart(2, "0");
        const m = currTime.getMinutes().toString().padStart(2, "0");
        options.push(`${h}:${m}`);
        currTime = new Date(currTime.getTime() + stepInSeconds * 1000);
      }
    }
    return options;
  }, [minTime, maxTime, stepInMinutes]);

  /* Fetch already-reserved times for the selected date & doctor */
  useEffect(() => {
    if (!DateAp) return;

    const parts = DateAp.split("/");
    if (parts.length !== 3) return;
    const formattedDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;

    axiosClient
      .post("/appointment/reserved", {
        id: idDoctor,
        dateApointment: formattedDate,
      })
      .then((response) => {
        setReservedTime(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reserved time:", error);
      });
  }, [DateAp, idDoctor]);

  /* Check if the selected date is today */
  const isToday = useMemo(() => {
    if (!DateAp) return false;
    const parts = DateAp.split("/");
    if (parts.length !== 3) return false;
    const formatted = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    return formatted === todayStr;
  }, [DateAp]);

  /* Capture current time string for past-slot filtering */
  const currentTimeStr = useMemo(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }, []);

  const selectClasses =
    "w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm font-bold rounded-2xl focus:ring-brand-500 focus:border-brand-500 block pl-12 pr-4 py-3.5 transition-all group-hover:bg-white appearance-none cursor-pointer";

  return (
    <div className="relative w-full">
      {DateAp ? (
        <select
          onChange={onChange}
          value={value || ""}
          className={selectClasses}
        >
          <option value="">{t("common.select_time")}</option>
          {formattedTimeOptions.map((timeStr) => {
            const isReserved = reservedTime.includes(timeStr);
            const isPast = isToday && timeStr < currentTimeStr;
            const isDisabled = isReserved || isPast;
            return (
              <option key={timeStr} value={timeStr} disabled={isDisabled}>
                {timeStr}{" "}
                {isPast
                  ? `(${t("appointments.past", "Past")})`
                  : isReserved
                  ? `(${t("appointments.reserved", "Reserved")})`
                  : ""}
              </option>
            );
          })}
        </select>
      ) : (
        <select className={`${selectClasses} text-slate-400`} disabled>
          <option>
            {" "}
            {t(
              "appointments.select_date_to_view_time",
              "Select Date To View Time"
            )}{" "}
          </option>
        </select>
      )}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

export default TimePicker;
