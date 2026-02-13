import { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import useToken from "../context/token";

const RegisterDump = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const { tokenId } = useToken();
  const token = tokenId;
  const [data, setData] = useState(null);
  const [address, setAddress] = useState("");
  const dataCardRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const notifyError = (msg) => toast.error(msg || "Error Registering Dump");
  const notifySuccess = () => {
    toast.success("Dump Registered Successfully");
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          toast.error(
            "Unable to retrieve location. Please allow location access.",
          );
          console.error(error);
        },
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("location", location);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("state", state);
    formData.append("district", district);
    if (image) formData.append("picture", image);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/dump/report-dump`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      if (res.status === 201) {
        setDescription("");
        setLocation("");
        setAddress("");
        setDistrict("");
        setState("");
        setImage(null);
        setData(res.data.data);
        notifySuccess();
        setTimeout(() => {
          dataCardRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      notifyError(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-15 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className={`mx-auto ${data ? "max-w-6xl" : "max-w-2xl"}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            <span className="text-red-500 dark:text-red-600">Report</span>{" "}
            Dumping
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Help keep our environment clean by reporting waste dumping sites
          </p>
        </div>

        <div
          className={`${
            data ? "grid lg:grid-cols-2 gap-6 lg:gap-8" : "flex justify-center"
          }`}
        >
          {/* Form Section */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 ${
              data ? "w-full" : "w-full max-w-2xl"
            }`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6">
              Dump Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Location Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location Coordinates
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                    placeholder="Latitude, Longitude"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Use GPS</span>
                    <span className="sm:hidden">GPS</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: latitude, longitude (e.g., 28.6139, 77.2090)
                </p>
              </div>

              {/* Address Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                  placeholder="Enter the complete address"
                  required
                  maxLength={50}
                />
              </div>

              <div className="flex gap:3 lg:gap-18">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                    placeholder="Enter State"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District
                  </label>
                  <input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                    placeholder="Enter District"
                    required
                  />
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 resize-none text-sm sm:text-base outline-none"
                  rows={3}
                  placeholder="Describe the dump site, type of waste, estimated size, etc."
                  required
                  maxLength={40}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-4 pb-5 sm:pt-5 sm:pb-6 px-2">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                        <span className="font-semibold">Click to upload</span>{" "}
                        <span className="hidden sm:inline">
                          or drag and drop
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                        PNG, JPG, JPEG
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                {image && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 truncate">
                    Selected: {image.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Register Dump"
                )}
              </button>
            </form>
          </div>

          {/* Results Section - Only show when data exists */}
          {data && (
            <div className="space-y-6">
              <div
                ref={dataCardRef}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-green-700 dark:text-green-300">
                    Dump Registered Successfully
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Dump ID
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white text-sm truncate">
                        {data._id}
                      </p>
                    </div>
                    {data.aiAnalysis && data.aiAnalysis.isWaste && (
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800 col-span-1 sm:col-span-2">
                        <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-semibold mb-1">
                          AI Analysis Result (+10 Credits Earned!)
                        </p>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded border border-red-200 dark:border-red-700">
                            Severity: {data.aiAnalysis.severity}/10
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded border border-blue-200 dark:border-blue-700">
                            {data.aiAnalysis.wasteType}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
                          "{data.aiAnalysis.summary}"
                        </p>
                      </div>
                    )}
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Unique Number
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">
                        {data.uniqueNumber}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Description
                    </p>
                    <p className="text-gray-800 dark:text-white text-sm">
                      {data.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="text-gray-800 dark:text-white text-sm">
                      {data.location?.coordinates?.[1]},{" "}
                      {data.location?.coordinates?.[0]}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="text-gray-800 dark:text-white text-sm">
                      {data.address}
                    </p>
                  </div>

                  {data.picture && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Uploaded Image
                      </p>
                      <img
                        src={data.picture}
                        alt="Dump site"
                        className="rounded-lg w-full h-40 sm:h-48 object-cover border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterDump;
