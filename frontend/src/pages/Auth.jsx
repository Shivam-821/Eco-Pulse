import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";

export default function Auth() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [mode, setMode] = useState("login");
  const [locating, setLocating] = useState(false); 
  const [verifiedUser, setVerifiedUser] = useState(null);
  const token = localStorage.getItem("accessToken")
  const notifyerror = () => toast("Somthing went wrong");
  const notifySuccess = () => {
    if(mode === "signup"){
      toast("SignUp successfull");
    } 
    if(mode === 'login') toast("Login successfull")
  }

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    district: "",
    state: "",
    adminOfficer: "",
    pincode: "",
    teamname: "",
    location: null, 
    address: "",
  });

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

 useEffect(() => {
   const verify = async () => {
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
       setVerifiedUser(res.data); 
     } catch (err) {
      console.log(err)
       setVerifiedUser(null); 
     }
   };

   verify();
 }, []);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      let res;
      if (role === "team" && mode === 'signup'){
        res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/${endpoint}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/${endpoint}`,
          form
        );
      }
      

      
      if (res.status === 201) {
        const token = res.data.data.accessToken;
        if(token){
          localStorage.setItem("accessToken", token)
        }
        notifySuccess()
        setTimeout(() => navigate("/map"), 1000)
        
      } else {
        notifyerror();
      }
    } catch (error) {
      console.error("Error: ", error);
      notifyerror()
    }
  };

  return (
    <div className="min-h-screen flex md:items-center md:justify-center justify-end ml-[230px] bg-gray-100 dark:bg-slate-900 sm:pr-2 pt-10">
      <ToastContainer className="" />
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md flex flex-col justify-center dark:bg-gray-700 dark:text-white">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

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
              className={`px-4 py-2 mx-1 rounded-full text-sm font-medium transition dark:text-black ${
                role === r ? "bg-blue-600 text-white" : "bg-gray-200"
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
            } `}
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
                className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                required
              />

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

              {role === "team" && locating && (
                <p className="text-sm text-blue-500 font-medium">
                  Fetching location...
                </p>
              )}

              {role === "team" && mode === "signup" && form.location && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              {mode === "signup" && role === "team" && (
                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded outline-none focus:border-blue-400 focus:border-2"
                    required
                  />
                </div>
              )}
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
