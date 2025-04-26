import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const RegisterDump = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [data, setData] = useState(null)
  const [address, setAddress] = useState("")
  const dataCardRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const notifyError = () => toast("Error Registring Dump");
    const notifySuccess = () => {
      toast("Dump Registered Successfully")
    }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)},${longitude.toFixed(6)}`);
        },
        (error) => {
          alert("Unable to retrieve location. Please allow location access.");
          console.error(error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("location", location);
    formData.append("description", description);
    formData.append("address", address);
    if (image) formData.append("picture", image);

    try {
      const res  = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/dump/report-dump`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if(res.status === 201){
        setDescription("");
        setLocation("");
        setAddress("")
        setImage(null);
        setData(res.data.data)
        notifySuccess();
         dataCardRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      
    } catch (error) {
      console.log(error)
      notifyError()
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col dark:bg-slate-950 ml-[230px] justify-center items-center py-10 min-h-screen">
      <ToastContainer />
      <div className="max-w-md mx-auto p-5 bg-white rounded-xl shadow-lg shadow-gray-300 space-y-6 mt-10 dark:bg-blue-950 dark:text-white dark:shadow-md dark:shadow-blue-900">
        <h2 className="text-2xl font-bold text-center">Register Dump</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded outline-none focus:border-blue-600"
              placeholder="Latitude,Longitude"
              required
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="bg-green-600 text-white w-20 px-3 py-2 rounded hover:bg-green-700 text-sm"
            >
              Use GPS
            </button>
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 border p-2 rounded outline-none focus:border-blue-600"
              placeholder="Enter the address"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded outline-none focus:border-blue-600"
              rows={3}
              placeholder="Describe the dump"
              required
            />
          </div>

          <div>
            <label className="block font-medium ">Upload Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full border-2 border-gray-500 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 px-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Register Dump"}
          </button>
        </form>
      </div>
      {data && (
        <div
          ref={dataCardRef}
          className="ml-6 mt-10 max-w-md bg-white dark:bg-blue-950 dark:text-white rounded-xl shadow-lg p-4 space-y-4"
        >
          <h3 className="text-xl font-bold">Submitted Dump Info</h3>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {data.description}
          </p>
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {data.location?.coordinates?.[1]}, {data.location?.coordinates?.[0]}
          </p>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {data.address}
          </p>
          {data.picture && (
            <div>
              <span className="font-semibold">Image:</span>
              <img
                src={data.picture}
                alt="Dump"
                className="mt-2 rounded-lg w-full h-48  contain-content border"
              />
            </div>
          )}
          <p>
            <span className="font-semibold">Dump ID:</span> {data._id}
          </p>
          <p>
            <span className="font-semibold">Unique Number:</span>{" "}
            {data.uniqueNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterDump;
