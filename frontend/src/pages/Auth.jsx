import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Auth() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // default role
  const [mode, setMode] = useState("login"); // login | signup
  const [locating, setLocating] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);

  const token = localStorage.getItem("accessToken");

  const notifyError = (msg) => toast.error(msg || "Something went wrong!");
  const notifySuccess = (msg) => toast.success(msg);

  // Form state
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

  // 🔹 Reset form whenever role/mode changes
  useEffect(() => {
    setForm((prev) => ({
      fullname: "",
      email: prev.email, // keep email
      password: prev.password, // keep password
      phone: "",
      district: "",
      state: "",
      adminOfficer: "",
      pincode: "",
      location: null,
      address: "",
    }));
  }, [role, mode]);

  // Handle geolocation for team signup
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
            alert("Location permission denied. Team signup needs location.");
            setLocating(false);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  }, [role, mode]);

  // Verify token (on mount)
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
        console.log(res);
        setVerifiedUser(res.data.data);
      } catch (err) {
        console.log("Token verification failed:", err);
        setVerifiedUser(null);
      }
    };
    verify();
  }, [token]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    let endpoint = "";
    if (role === "admin") {
      endpoint = `api/auth/admin/${mode}`;
    } else if (role === "user") {
      endpoint = `api/auth/user/${mode}`;
    } else if (role === "team") {
      if (mode === "signup" && !form.location) {
        return alert("Location required to sign up as Cleaning Team.");
      }
      endpoint = `api/auth/team/${mode}`;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/${endpoint}`,
        form,
        {
          headers:
            role === "team" && mode === "signup"
              ? {} // no token needed for signup
              : token
              ? { Authorization: `Bearer ${token}` }
              : {},
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        const accessToken = res.data?.data?.accessToken;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }

        notifySuccess(
          mode === "signup" ? "Signup successful!" : "Login successful!"
        );

        setTimeout(() => navigate("/map"), 1000);
      } else {
        notifyError(res.data?.message || "Request failed");
      }
    } catch (error) {
      console.error("Error:", error);
      notifyError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex md:items-center md:justify-center justify-end bg-gray-100 dark:bg-slate-900 sm:pr-2 pt-10">
      <ToastContainer />
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md flex flex-col justify-center dark:bg-gray-700 dark:text-white">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {/* Role buttons */}
        <div className="flex justify-center mb-4">
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
              className={`px-4 py-2 mx-1 rounded-full text-sm font-medium transition ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:text-black"
              }`}
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

        {/* Mode buttons */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 mr-2 rounded ${
              mode === "login"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:text-gray-800"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mode === "signup"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:text-gray-800"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              {/* Common signup fields */}
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={form.fullname}
                onChange={handleChange}
                className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                required
              />

              {/* Admin signup fields */}
              {role === "admin" && (
                <>
                  <input
                    type="text"
                    name="district"
                    placeholder="District"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                  />
                  <input
                    type="text"
                    name="adminOfficer"
                    placeholder="Admin Officer Name"
                    value={form.adminOfficer}
                    onChange={handleChange}
                    className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                  />
                </>
              )}

              {/* Team signup fields */}
              {role === "team" && locating && (
                <p className="text-sm text-blue-500 font-medium">
                  Fetching location...
                </p>
              )}

              {role === "team" && form.location && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={form.location.coordinates[1]}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
                    />
                  </div>
                </div>
              )}

              {role === "team" && (
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                  required
                />
              )}

              {/* User & Team phone field */}
              {(role === "user" || role === "team") && (
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  maxLength={10}
                  onChange={handleChange}
                  className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                  required
                />
              )}
            </>
          )}

          {/* Common fields for login + signup */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            {mode === "login" ? "Login" : "Signup"} as{" "}
            {role === "user"
              ? "User"
              : role === "admin"
              ? "Admin"
              : "Cleaning Team"}
          </button>
        </form>
      </div>
    </div>
  );
}
