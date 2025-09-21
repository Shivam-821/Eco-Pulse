import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMap,
  FaTasks,
  FaUsers,
  FaBell,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaRecycle,
  FaInfoCircle,
  FaChartBar,
} from "react-icons/fa";
import DarkMode from "./DarkMode";
import axios from "axios";
import { MdCleaningServices } from "react-icons/md";

export default function Sidebar({ collapsed, setCollapsed }) {  // Use props here
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [verifiedUser, setVerifiedUser] = useState(null);

 useEffect(() => {
   if (!token) {
     setVerifiedUser(null);
     return;
   }

   const verify = async () => {
     try {
       const res = await axios.get(
         `${import.meta.env.VITE_BASE_URL}/api/auth/verify-token`,
         {
           headers: { Authorization: `Bearer ${token}` },
           withCredentials: true,
         }
       );
       setVerifiedUser(res?.data);
      //  console.log(verifiedUser?.data?.teamname);
     } catch (err) {
       console.log(err);
       setVerifiedUser(null);
     }
   };

   verify();
 }, [token]);


  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };


  return (
    <div
      className={`bg-white dark:bg-slate-800 h-screen p-4 flex flex-col transition-all duration-300 fixed ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between mb-6 mt-16">
        {!collapsed && (
          <h2 className="text-2xl font-bold text-green-400 dark:text-green-300">
            Eco Pulse
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="text-green-400 dark:text-green-300 text-xl"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="sidebar-scrollable flex-1 overflow-y-auto">
        <ul className="space-y-4">
          <li>
            <Link
              to="/map"
              className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
            >
              <FaMap /> {!collapsed && "Map"}
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
            >
              <FaInfoCircle /> {!collapsed && "About Us"}
            </Link>
          </li>
          <li>
            <Link
              to="/teams"
              className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
            >
              <FaUsers /> {!collapsed && "Teams"}
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
            >
              <FaTasks /> {!collapsed && "Tasks"}
            </Link>
          </li>
          <li>
            <Link
              to="/viewrecycle"
              className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
            >
              <FaRecycle /> {!collapsed && "Recycle Items"}
            </Link>
          </li>
          <li>
            <Link
              to="/stats"
              className="flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
            >
              <FaChartBar /> {!collapsed && "Statistic"}
            </Link>
          </li>
        </ul>
      </div>

      {/* Sidebar Bottom Section */}
      <div className="mt-auto">
        <div className="space-y-3">
          {verifiedUser?.role === "admin" && (
            <div
              className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
              onClick={() => navigate("/auth")}
            >
              <FaSignInAlt /> {!collapsed && "SignUp Team"}
            </div>
          )}
          {verifiedUser?.role === "user" && (
            <>
              <div
                className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
                onClick={() => navigate("/reportdump")}
              >
                <FaSignInAlt /> {!collapsed && "Report Dump"}
              </div>
              <div
                className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
                onClick={() => navigate("/loadge-complain")}
              >
                <FaSignInAlt /> {!collapsed && "Raise Complain"}
              </div>
              <div
                className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
                onClick={() => navigate("/register-recycle")}
              >
                <FaSignInAlt /> {!collapsed && "Recycle"}
              </div>
            </>
          )}
          {!token && (
            <>
              <div
                className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
                onClick={() => navigate("/auth")}
              >
                <FaSignInAlt /> {!collapsed && "Sign In"}
              </div>
              <div
                className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
                onClick={() => navigate("/auth")}
              >
                <FaUserPlus /> {!collapsed && "Sign Up"}
              </div>
            </>
          )}
          {verifiedUser?.role === "team" && (
            <div
              className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:text-green-400 dark:hover:text-green-300"
              onClick={() =>
                navigate(`assigned-task/${verifiedUser?.data?.teamname}`)
              }
            >
              <MdCleaningServices /> {!collapsed && "Assigned Task"}
            </div>
          )}
          <DarkMode isSidebarCollapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
