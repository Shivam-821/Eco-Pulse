import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMap,
  FaTasks,
  FaUsers,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaRecycle,
  FaInfoCircle,
  FaChartBar,
} from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import DarkMode from "./DarkMode";
import axios from "axios";
import gsap from "gsap";
import useToken from "../context/token";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokenId } = useToken();
  const token = tokenId;
  const [verifiedUser, setVerifiedUser] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Sidebar fade-in effect
    gsap.fromTo(
      sidebarRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  }, [collapsed]);

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
      } catch (err) {
        console.log(err);
        setVerifiedUser(null);
      }
    };

    verify();
  }, [token]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Active route highlight
  const getLinkClasses = (path) => {
    const base =
      "flex items-center h-[44px] rounded-xl transition-all duration-300 text-gray-700 dark:text-slate-200 hover:text-green-500 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-slate-700 px-3 relative group";
    const active =
      location.pathname === path
        ? "bg-green-100 dark:bg-slate-700 text-green-600 dark:text-green-300"
        : "";
    return `${base} ${active}`;
  };

  const NavItem = ({ icon: Icon, text, path, onClick }) => (
    <li className="relative">
      <div
        onClick={() => (onClick ? onClick() : navigate(path))}
        className={`${getLinkClasses(path)} cursor-pointer ${
          collapsed ? "justify-center" : "justify-start gap-3"
        }`}
      >
        <Icon className="text-[18px] shrink-0 leading-none" />
        <span
          className={`overflow-hidden transition-all duration-300 ${
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          {text}
        </span>
      </div>
    </li>
  );

  return (
    <div
      ref={sidebarRef}
      className={`bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-slate-800 shadow-lg h-screen p-4 pb-5 flex flex-col fixed border-r border-green-100 dark:border-slate-700 transition-all duration-500 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* 🌿 Top Section */}
      <div className="flex items-center justify-between mb-2 mt-11 min-h-[60px] transition-all duration-300">
        {!collapsed && (
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-wide">
            Eco Pulse
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="text-green-500 dark:text-green-300 text-2xl p-2 hover:rotate-180 transition-transform duration-500 cursor-pointer"
        >
          <FaBars />
        </button>
      </div>

      {/* 🌱 Sidebar Links */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <ul className="space-y-1">
          <NavItem icon={FaMap} text="Map" path="/map" />
          <NavItem icon={FaInfoCircle} text="About Us" path="/about" />
          <NavItem icon={FaUsers} text="Teams" path="/teams" />
          <NavItem icon={FaTasks} text="Tasks" path="/tasks" />
          <NavItem icon={FaRecycle} text="Recycle Items" path="/viewrecycle" />
          <NavItem icon={FaChartBar} text="Statistic" path="/stats" />
        </ul>
      </div>

      {/* 🌸 Bottom Section */}
      <div className="mt-2 pt-4 border-t border-green-100 dark:border-slate-700">
        <ul className="space-y-1">
          {verifiedUser?.role === "admin" && (
            <NavItem
              icon={FaSignInAlt}
              text="SignUp Team"
              onClick={() => navigate("/auth")}
            />
          )}

          {verifiedUser?.role === "user" && (
            <>
              <NavItem
                icon={FaSignInAlt}
                text="Report Dump"
                onClick={() => navigate("/reportdump")}
              />
              <NavItem
                icon={FaSignInAlt}
                text="Raise Complain"
                onClick={() => navigate("/loadge-complain")}
              />
              <NavItem
                icon={FaSignInAlt}
                text="Recycle"
                onClick={() => navigate("/register-recycle")}
              />
            </>
          )}

          {!token && (
            <>
              <NavItem
                icon={FaSignInAlt}
                text="Sign In"
                onClick={() => navigate("/auth")}
              />
              <NavItem
                icon={FaUserPlus}
                text="Sign Up"
                onClick={() => navigate("/auth")}
              />
            </>
          )}

          {verifiedUser?.role === "team" && (
            <NavItem
              icon={MdCleaningServices}
              text="Assigned Task"
              onClick={() =>
                navigate(`assigned-task/${verifiedUser?.data?.teamname}`)
              }
            />
          )}

          <div className="relative">
            <DarkMode isSidebarCollapsed={collapsed} />
          </div>
        </ul>
      </div>
    </div>
  );
}
