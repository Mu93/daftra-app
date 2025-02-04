"use client";

import React, { useState } from "react";

function JobAlertCard() {
  const [alertSet, setAlertSet] = useState(false);

  const handleSetAlert = () => {
    setAlertSet(!alertSet);
  };

  return (
    <div className="flex items-center justify-center w-full mb-8">
      <JobAlertCardUI
        jobTitle="UI Designer in Egypt"
        jobCount={70}
        onSetAlert={handleSetAlert}
      />
    </div>
  );
}

const JobAlertCardUI = ({ jobTitle, jobCount, onSetAlert }) => {
  return (
    <div className="bg-green-600 text-white p-4 rounded-lg flex justify-between items-center w-full ">
      <div>
        <h2 className="text-xl font-semibold">{jobTitle}</h2>
        <p className="text-sm mt-1">{jobCount} job positions</p>
      </div>
      <div className="relative">
        <label htmlFor="alert-toggle" className="cursor-pointer">
          <input
            type="checkbox"
            id="alert-toggle"
            className="opacity-0 absolute"
            onChange={onSetAlert}
          />
          <span className="relative inline-block w-10 h-5 rounded-full bg-gray-200 transition duration-200 ease-in-out"></span>
        </label>
      </div>
    </div>
  );
};

export default JobAlertCard;
