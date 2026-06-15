import React from "react";

/*
 * AlertErrorMessage.jsx — Error alert banner component
 * Props:
 *   - message : string — the error text to display
 * Renders a red-tinted bordered alert with an error icon and the
 * provided message text. Used for form validation or API errors.
 */
const AlertErrorMessage = ({ message }) => {
  return (
    <div
      className="flex items-center p-4 mx-8 mt-4 text-sm text-rose-800 border-l-4 border-rose-500 rounded-xl bg-rose-50 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm"
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-5 h-5 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="sr-only">Error</span>
      <div className="font-medium">{message}</div>
    </div>
  );
};

export default AlertErrorMessage;

