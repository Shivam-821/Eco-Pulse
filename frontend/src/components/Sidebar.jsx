import React, {useState, useEffect} from "react"
import { Link, useNavigate } from 'react-router-dom';
import { FaMap, FaTasks, FaUsers, FaBell, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import DarkMode from "./DarkMode";
import axios from 'axios'

export default function Sidebar ()  {
  const navigate = useNavigate()
  const token = localStorage.getItem("accessToken")
  const [verifiedUser, setVerifiedUser] = useState(null);

  useEffect(() => {
      const verify = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/auth/verify-token`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          setVerifiedUser(res.data);
        } catch (err) {
          setVerifiedUser(null);
        }
      };
  
      verify();
    }, [token]);
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <h2 className="logo">Eco Pulse</h2>
      </div>

      <div className="sidebar-scrollable">
        <ul className="nav-links">
          <li>
            <Link to="/map">
              <FaMap /> Map
            </Link>
          </li>
          <li>
            <Link to="/teams">
              <FaUsers /> Teams
            </Link>
          </li>
          <li>
            <Link to="/tasks">
              <FaTasks /> Tasks
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <FaBell /> Notifications
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-bottom">
        <div className="account-links">
          {verifiedUser?.role === "admin" && (
            <div
              className="cursor-pointer flex items-center gap-1"
              onClick={() => navigate("/auth")}
            >
              <FaSignInAlt /> SignUp Team
            </div>
          )}
          {verifiedUser?.role === "user" && (
            <div
              className="cursor-pointer flex items-center gap-1"
              onClick={() => navigate("/reportdump")}
            >
              <FaSignInAlt /> Report Dump
            </div>
          )}
          {!token && (
            <div
              className="cursor-pointer flex items-center gap-1"
              onClick={() => navigate("/auth")}
            >
              <FaSignInAlt /> Sign In
            </div>
          )}
          {!token && (
            <div
              className="cursor-pointer flex items-center gap-1"
              onClick={() => navigate("/auth")}
            >
              <FaUserPlus /> Sign Up
            </div>
          )}
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

