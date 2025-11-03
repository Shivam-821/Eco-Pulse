import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const RegisterRecycle = () => {
  const [recycableItems, setRecycableItems] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const token = localStorage.getItem("accessToken");
  const dataCardRef = useRef(null);
  const [guide, setGuide] = useState(false);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const notifyError = () => toast.error("Error Registering Recycle Item");
  const notifySuccess = () =>
    toast.success("Recycle Item Registered Successfully");

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          toast.error(
            "Unable to retrieve location. Please allow location access."
          );
          console.error(error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const [lat, lng] = location
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    const formData = new FormData();
    formData.append("recycableItems", recycableItems);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("address", address);
    form.append("district", district);
    from.append("state", state);
    formData.append("location[type]", "Point");
    formData.append("location[coordinates][]", lng);
    formData.append("location[coordinates][]", lat);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/recycle/create-recycle`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        setRecycableItems("");
        setDescription("");
        setQuantity("");
        setAddress("");
        setState("");
        setDistrict("");
        setLocation("");
        setImage(null);
        setData(res.data.data);
        notifySuccess();
        setTimeout(() => {
          dataCardRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      notifyError();
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
            <span className="text-green-500 dark:text-green-400">Register</span>{" "}
            Recyclable Items
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Help promote recycling by registering your recyclable materials
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6 flex justify-between items-center">
              <p>Item Information</p>
              <svg
                className="w-5 h-5 cursor-pointer hover:scale-105 hidden lg:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                onClick={() => setGuide(!guide)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Recyclable Items Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recyclable Items
                </label>
                <input
                  type="text"
                  value={recycableItems}
                  onChange={(e) => setRecycableItems(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                  placeholder="e.g., Plastic bottles, Paper, Glass, etc."
                  required
                />
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                  placeholder="Enter quantity"
                  required
                  min={1}
                />
              </div>

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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                    placeholder="Latitude, Longitude"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
                  placeholder="Enter complete pickup address"
                  required
                />
              </div>
              <div className="flex gap-3 lg:gap-18">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base outline-none"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 resize-none text-sm sm:text-base outline-none"
                  rows={3}
                  placeholder="Describe the items, condition, packaging, etc."
                  required
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
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm sm:text-base cursor-pointer"
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
                  "Register Recyclable Items"
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
                  <div className="w-2 h-6 sm:h-8 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                    Items Registered Successfully
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Item Type
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">
                        {data.recycableItems}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Quantity
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">
                        {data.quantity}
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

                  {data.image && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Uploaded Image
                      </p>
                      <img
                        src={data.image}
                        alt="Recyclable items"
                        className="rounded-lg w-full h-40 sm:h-48 object-cover border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Information Card for smaller screens when data exists */}
              <div className="lg:hidden bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2 text-sm">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recycling Tips
                </h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• Clean items before recycling</li>
                  <li>• Separate different material types</li>
                  <li>• Ensure items are dry and contamination-free</li>
                </ul>
              </div>
            </div>
          )}

          {/* Information Card for larger screens when no data */}
          {!data && guide && (
            <div className="hidden lg:block bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 ml-8">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Recycling Guidelines
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                <li>• Clean and dry items before recycling</li>
                <li>• Separate different material types</li>
                <li>• Remove any food residue or contaminants</li>
                <li>• Check local recycling guidelines</li>
                <li>• Flatten boxes and containers to save space</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterRecycle;
