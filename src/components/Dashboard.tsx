"use client";

import { useState } from "react";
import Image from "next/image";
import TextGenerator from "./TextGenerator";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const navButtonClass = (section: string) =>
    `px-6 py-4 rounded-4xl font-semibold cursor-pointer flex items-center gap-2 bg-[#232a41] ${
      activeSection === section ? "bg-[#B9FF66] text-black" : "text-gray-300"
    }`;

  return (
    <div
      id="#dashboard"
      className="w-full flex flex-col xl:space-y-16 mx-auto min-h-screen py-10 px-12 2xl:px-30 font-[\'CoFo Sans\',sans-serif]"
      style={{
        background:
          "radial-gradient(ellipse at 60% 0%, #232a41 0%, #191E2C 70%, #191E2C 100%)",
      }}
    >
      <div className="text-[#ffffff] flex justify-between items-center">
        <div className="flex">
          {/* Responsive navigation: horizontal on lg+, vertical sidebar on <lg */}
          <div className="flex xl:flex-row flex-col xl:space-x-2 xl:space-y-0 space-y-4 xl:items-center items-start xl:w-auto w-16 fixed xl:static left-0 top-0 z-30 h-full bg-transparent xl:bg-transparent pt-33 xl:pt-0 ml-6">
            <button
              onClick={() => handleSectionChange("dashboard")}
              className={
                navButtonClass("dashboard") +
                " w-full justify-center xl:justify-start"
              }
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="4"
                  y="4"
                  width="5"
                  height="5"
                  rx="1.5"
                  stroke="currentColor"
                />
                <rect
                  x="15"
                  y="4"
                  width="5"
                  height="5"
                  rx="1.5"
                  stroke="currentColor"
                />
                <rect
                  x="15"
                  y="15"
                  width="5"
                  height="5"
                  rx="1.5"
                  stroke="currentColor"
                />
                <rect
                  x="4"
                  y="15"
                  width="5"
                  height="5"
                  rx="1.5"
                  stroke="currentColor"
                />
              </svg>
              <span className="hidden xl:inline">Dashboard</span>
            </button>
            <button
              onClick={() => handleSectionChange("user")}
              className={
                navButtonClass("user") +
                " w-full justify-center xl:justify-start"
              }
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" />
                <path d="M7 21v-2a4 4 0 0 1 3-3.87" stroke="currentColor" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" />
              </svg>
              <span className="hidden xl:inline">Users</span>
            </button>
            <button
              onClick={() => handleSectionChange("usage")}
              className={
                navButtonClass("usage") +
                " w-full justify-center xl:justify-start"
              }
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                  stroke="currentColor"
                />
                <path d="M12 6v6l4 2" stroke="currentColor" />
              </svg>
              <span className="hidden xl:inline">Usage</span>
            </button>
            <button
              onClick={() => handleSectionChange("templates")}
              className={
                navButtonClass("templates") +
                " w-full justify-center xl:justify-start"
              }
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                  stroke="currentColor"
                />
                <path
                  d="M20 2H6.5A2.5 2.5 0 0 0 4 4.5v15"
                  stroke="currentColor"
                />
              </svg>
              <span className="hidden xl:inline">Templates</span>
            </button>
            <button
              onClick={() => handleSectionChange("booking")}
              className={
                navButtonClass("booking") +
                " w-full justify-center xl:justify-start"
              }
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" stroke="currentColor" />
              </svg>
              <span className="hidden xl:inline">Booking</span>
            </button>
          </div>
        </div>
        <div className="flex space-x-4 items-center mb-10 xl:mb-0">
          <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#232a41] hover:bg-[#2c3450] transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-300 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#232a41]" />
          </button>
          <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#232a41] hover:bg-[#2c3450] transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-300 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#232a41]" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-[#232a41] hover:bg-[#2c3450] transition overflow-hidden">
            <Image
              src="/images/face-2.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              width={40}
              height={40}
            />
          </button>
        </div>
      </div>
      {activeSection === "dashboard" && (
        <div className="ml-14 md:ml-20 xl:ml-6 text-gray-300">
          {/* AI Tools below tiles */}
          <div className="flex flex-col gap-8 mt-8">
            <TextGenerator />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
