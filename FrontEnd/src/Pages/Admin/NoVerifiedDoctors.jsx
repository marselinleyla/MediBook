import React, { useState } from "react";
import {
  ListOfDoctorsNoVerified,
  NavBarAdmin,
  SidebarAdmin,
} from "../../Components";
import GetAuthAdmin from "../../hooks/GetAuthAdmin";
import AlertSucces from "../../Components/Alert/AlertSucces";

/*
 * NoVerifiedDoctors — Admin page listing doctors pending verification
 * Protected route. Shows a success alert when a doctor is verified.
 * Delegates the listing to <ListOfDoctorsNoVerified /> child component.
 * State:
 *   ShowAlertSucces — toggled by child to show/hide the green success toast
 */
const NoVerifiedDoctors = () => {
  const [ShowAlertSucces, setShowAlertSucces] = useState(false);

  GetAuthAdmin();

  return (
    <>
      <div className="  relative ">
        <NavBarAdmin />
        <div className="flex pt-16 overflow-hidden bg-gray-50 ">
          <SidebarAdmin />
          <div
            id="main-content"
            className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 "
          >
            <main>
              <ListOfDoctorsNoVerified
                setShowAlertSucces={setShowAlertSucces}
              />
            </main>
          </div>
        </div>
        {/* Success toast after approving a doctor */}
        {ShowAlertSucces && (
          <AlertSucces Message={"The Doctor Verified Succes"} />
        )}
      </div>
    </>
  );
};
export default NoVerifiedDoctors;
