import React from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

/*
 * Section.jsx — Doctor dashboard welcome section / hero banner
 * Reads the authenticated doctor's data from Redux (state.AuthDoctor)
 * and renders a greeting with the doctor's first name, a "Welcome to
 * MediBook" message, and a reference to today's appointments count.
 * Also displays a decorative illustration image.
 */
const Section = () => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);

  return (
    <>
      <div className="bg-white md:flex border drop-shadow-sm rounded-lg my-6 mx-4 overflow-hidden">
        <div className="mt-4 p-4 flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <p className="font-medium text-xl capitalize text-gray-900">
              {t("Section_Doctor.Welcome_Doctor")}{" "}
              <span className="px-2 text-white bg-[#0D63F3] font-semibold rounded dark:bg-blue-500">
                Dr.{" "}
                {doctorData.doctor != null ? doctorData.doctor.firstname : ""}{" "}
              </span>{" "}
              {t("Section_Doctor.in_MediBook")}
            </p>
            <HandThumbUpIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 pl-3 text-base mt-2 font-normal">
            {t("Section_Doctor.Appointments_Today")}
          </p>
        </div>
        <img
          src="/img/sammy-doctors-consultation.png"
          className="h-40 w-auto object-contain ml-auto"
          alt=""
        />
      </div>
    </>
  );
};

export default Section;
