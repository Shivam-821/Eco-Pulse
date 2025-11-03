import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useToken from "../context/token";

const Auth = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [mode, setMode] = useState("login");
  const [locating, setLocating] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [showNotice, setShowNotice] = useState(false);
  const { tokenId, setTokenId } = useToken();

  useEffect(() => {
    const seen = sessionStorage.getItem("seenWakeMessage");
    if (!seen) {
      setShowNotice(true);
      sessionStorage.setItem("seenWakeMessage", "true");
    }
  }, []);

  useEffect(() => {
    if (showNotice) sessionStorage.setItem("seenWakeMessage", "true");
  }, [showNotice]);

  const token = tokenId;

  const notifyError = (msg) => toast.error(msg || "Something went wrong!");
  const notifySuccess = (msg) => toast.success(msg);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    district: "",
    state: "",
    adminOfficer: "",
    pincode: "",
    location: null,
    address: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      fullname: "",
      email: prev.email,
      password: prev.password,
      phone: "",
      district: "",
      state: "",
      adminOfficer: "",
      pincode: "",
      location: null,
      address: "",
    }));
  }, [role, mode]);

  useEffect(() => {
    if (role === "team" && mode === "signup") {
      if (navigator.geolocation) {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setForm((prevForm) => ({
              ...prevForm,
              location: {
                type: "Point",
                coordinates: [
                  position.coords.longitude,
                  position.coords.latitude,
                ],
              },
            }));
            setLocating(false);
          },
          (err) => {
            console.error("Geolocation error:", err.message);
            notifyError(
              "Location permission denied. Team signup requires location."
            );
            setLocating(false);
          }
        );
      } else {
        notifyError("Geolocation is not supported by your browser.");
      }
    }
  }, [role, mode]);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setVerifiedUser(null);
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        // console.log(res.data.role)
        setVerifiedUser(res.data);
      } catch (err) {
        setVerifiedUser(null);
      }
    };
    verify();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEnabled(false);
    if (!emailRegex.test(form.email)) {
      notifyError("Please enter a valid email address.");
      return;
    }

    if ((role === "user" || role === "team") && mode === "signup") {
      if (!phoneRegex.test(form.phone)) {
        notifyError(
          "Please enter a valid 10-digit phone number starting with 6–9."
        );
        return;
      }
    }

    let endpoint = "";
    if (role === "admin") {
      endpoint = `api/auth/admin/${mode}`;
    } else if (role === "user") {
      endpoint = `api/auth/user/${mode}`;
    } else if (role === "team") {
      if (mode === "signup" && !form.location) {
        notifyError("Location required to sign up as a Cleaning Team.");
        return;
      }
      endpoint = `api/auth/team/${mode}`;
    }
    if (
      role === "team" &&
      mode === "signup" &&
      (verifiedUser?.role !== "admin" || !verifiedUser.role)
    ) {
      notifyError("Admin is required to Register Cleaning Team");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/${endpoint}`,
        form,
        {
          headers:
            role === "team" && mode === "signup"
              ? { Authorization: `Bearer ${token}` }
              : {},
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        const accessToken = res.data?.data?.accessToken;
        if (accessToken) {
          setTokenId(accessToken);
        }
        notifySuccess(
          mode === "signup" ? "Signup successful!" : "Login successful!"
        );
        setTimeout(() => navigate("/map"), 1000);
      } else {
        console.error(error);
        notifyError(res.data?.message || "Request failed");
      }
    } catch (error) {
      console.log(error);
      notifyError(error.response?.data?.message || error.message);
    } finally {
      setEnabled(true);
      setForm({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        district: "",
        state: "",
        adminOfficer: "",
        pincode: "",
        location: null,
        address: "",
      });
    }
  };

  const roleButtonClass = (r) =>
    `px-4 py-2 mx-1 rounded-full text-sm font-medium transition-colors duration-200 ${
      role === r
        ? "bg-emerald-500 text-white dark:bg-emerald-500"
        : "bg-gray-200 text-slate-800 hover:bg-emerald-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
    }`;

  const modeButtonClass = (m) =>
    `px-4 py-2 rounded-md transition-colors duration-200 ${
      mode === m
        ? "bg-blue-500 text-white dark:bg-green-500"
        : "bg-gray-200 text-slate-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
    }`;

  const inputClass =
    "w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md outline-none transition-colors duration-200 dark:bg-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500";
  const disabledInputClass =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none bg-gray-200 dark:bg-slate-600 dark:text-slate-400 cursor-not-allowed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 md:px-6 pt-10 relative">
      <ToastContainer />
      {showNotice && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-400 absolute top-[49.7px]">
          <p className="text-sm">
            ⏳ This app runs on free hosting — it might take{" "}
            <strong>a few moments to wake up</strong> after inactivity. <br />
            Please wait while we get things ready!
          </p>
        </div>
      )}
      <div
        className={`bg-white dark:bg-slate-800 p-8 px-10 md:px-12 rounded-2xl shadow-lg w-[90%] max-w-[500px] ${
          showNotice && mode !== "login" ? "mt-22" : "mt-4"
        } text-slate-800 dark:text-slate-200`}
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-700 dark:text-green-400">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        <div className="flex justify-center mb-4 space-x-2">
          {[
            "user",
            "admin",
            ...(verifiedUser?.role === "admin" && mode === "signup"
              ? ["team"]
              : verifiedUser?.role !== "admin" && mode === "login"
              ? ["team"]
              : []),
          ].map((r) => (
            <button
              key={r}
              className={roleButtonClass(r)}
              onClick={() => setRole(r)}
            >
              {r === "user"
                ? "User"
                : r === "admin"
                ? "Admin"
                : "Cleaning Team"}
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-6 space-x-2">
          <button
            className={modeButtonClass("login")}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={modeButtonClass("signup")}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={form.fullname}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                type="text"
                name="district"
                readOnly={verifiedUser?.role === "admin"}
                placeholder="District"
                value={form.district}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                readOnly={verifiedUser?.role === "admin"}
                value={form.state}
                onChange={handleChange}
                className={inputClass}
                required
              />
              {role === "admin" && (
                <>
                  <input
                    type="text"
                    name="adminOfficer"
                    placeholder="Admin Officer Name"
                    value={form.adminOfficer}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </>
              )}

              {role === "team" && (
                <>
                  {locating && (
                    <p className="text-sm text-blue-500 font-medium dark:text-green-400">
                      Fetching location...
                    </p>
                  )}

                  {form.location && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={form.location.coordinates[1]}
                          readOnly
                          className={disabledInputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={form.location.coordinates[0]}
                          readOnly
                          className={disabledInputClass}
                        />
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </>
              )}

              {(role === "user" || role === "team") && (
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  maxLength={10}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              )}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-xl font-bold hover:bg-green-400 transition-colors duration-200"
            disabled={!enabled}
          >
            {mode === "login" ? "Login" : "Signup"} as{" "}
            {role === "user"
              ? "User"
              : role === "admin"
              ? "Admin"
              : "Cleaning Team"}
            {enabled ? "" : " ... "}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
