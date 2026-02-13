import { useEffect, useState } from "react";
import axios from "axios";
import useToken from "../context/token";
import { toast, ToastContainer } from "react-toastify";

const Complaint = () => {
  const [complaintType, setComplaintType] = useState("bin-issue");
  const [description, setDescription] = useState("");
  const [binUniqueCode, setBinUniqueCode] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState({ coordinates: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [image, setImage] = useState(null); // New state for image
  const { tokenId } = useToken();
  const token = tokenId;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({
            type: "Point",
            coordinates: [longitude, latitude],
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
      );
    }
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/complain/view-complain`,
      );
      setComplaints(res.data?.data || []);
    } catch (err) {
      toast.error("Error fetching complaints");
      // console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("complaintType", complaintType);
      formData.append("description", description);
      // Ensure "location" is sent as a string if it's an object, or handle it in backend
      formData.append("location", JSON.stringify(location));
      formData.append("district", district);
      formData.append("state", state);
      formData.append("pincode", pincode);

      if (complaintType === "bin-issue") {
        formData.append("binUniqueCode", binUniqueCode);
      } else if (complaintType === "dump-inaction") {
        formData.append("uniqueNumber", uniqueNumber);
      }

      if (image) {
        formData.append("picture", image); // Append image
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/complain/loadge-complain`,
        formData, // Send FormData
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file upload
          },
          withCredentials: true,
        },
      );
      setMessage(res.data?.message || "Complaint submitted successfully!");

      setComplaints([res.data?.data, ...complaints]);

      setDescription("");
      setPincode("");
      setState("");
      setDistrict("");
      setBinUniqueCode("");
      setUniqueNumber("");
      setImage(null); // Reset image
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (resolved) => {
    return resolved
      ? "text-green-600 dark:text-green-400"
      : "text-orange-600 dark:text-orange-400";
  };

  const getStatusText = (resolved) => {
    return resolved ? "Resolved" : "In Progress";
  };

  return (
    <div className="min-h-screen bg-[#e8fff0] dark:bg-gray-900 py-15 px-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Complaint Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Report issues and track your complaints
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Complaint Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#f3fff7] dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Register Complaint
                </h2>
                <a
                  href="#view-complain"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  View Complaints
                </a>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Complaint Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 outline-none"
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                  >
                    <option value="bin-issue">Bin Issue</option>
                    <option value="dump-inaction">Dump Inaction</option>
                  </select>
                </div>

                {complaintType === "bin-issue" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bin Unique Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 outline-none"
                      value={binUniqueCode}
                      onChange={(e) => setBinUniqueCode(e.target.value)}
                      required
                    />
                  </div>
                )}

                {complaintType === "dump-inaction" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dump Unique Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 outline-none"
                      value={uniqueNumber}
                      onChange={(e) => setUniqueNumber(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 resize-none outline-none"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    maxLength={60}
                  />
                </div>
                <div className="flex gap:3 lg:gap-18">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 resize-none outline-none"
                      rows="4"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      District
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 resize-none outline-none"
                      rows="4"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 outline-none"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>

                {/* Image Upload UI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Image (Optional but Recommended)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, JPEG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </label>
                  </div>
                  {image && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Selected: {image.name}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Location
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {location.coordinates.length > 0
                      ? `Longitude: ${location.coordinates[0]?.toFixed(
                          6,
                        )}, Latitude: ${location.coordinates[1]?.toFixed(6)}`
                      : "Fetching your location..."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    "Submit Complaint"
                  )}
                </button>
              </form>

              {message && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center font-medium ${
                    message.includes("successfully")
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Complaints List Section */}
          <div className="lg:col-span-1">
            <div
              id="view-complain"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 h-fit sticky top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Your Complaints
                </h2>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
                  {complaints.length}
                </span>
              </div>

              {complaints.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No complaints found
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto">
                  {complaints.map((comp) => (
                    <div
                      key={comp._id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg py-4 px-3 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded capitalize">
                          {comp.complaintType?.replace("-", " ")}
                        </span>
                        <span
                          className={`text-xs font-medium ${getStatusColor(
                            comp.resolved,
                          )}`}
                        >
                          {getStatusText(comp.resolved)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                        {comp.description}
                      </p>

                      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        {comp.uniqueNumber && (
                          <p>
                            ID:{" "}
                            {comp.relatedDump?.uniqueNumber ||
                              comp.uniqueNumber}
                          </p>
                        )}
                        <p>Pincode: {comp.pincode}</p>
                        {comp.address && (
                          <p className="truncate">Address: {comp.address}</p>
                        )}
                        {comp.assignedTeam?.teamname && (
                          <p className="text-green-600 dark:text-green-400">
                            Team: {comp.assignedTeam.teamname}
                          </p>
                        )}
                        <p className="text-xs">
                          {new Date(comp.createdAt).toLocaleDateString()} at{" "}
                          {new Date(comp.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Show basic analysis tags if available */}
                      {comp.aiAnalysis && comp.aiAnalysis.isWaste && (
                        <div className="mt-2 flex gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Severity: {comp.aiAnalysis.severity}/10
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {comp.aiAnalysis.wasteType}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
