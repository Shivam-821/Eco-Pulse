import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const token = localStorage.getItem("accessToken")


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
      }
    );
  }
}, []);


  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/complain/view-complain`
      );
      setComplaints(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
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
      const sentData = {
        complaintType,
        description,
        location,
        pincode,
        uniqueNumber,
        binUniqueCode,
      };

      if (complaintType === "bin-issue") {
        sentData.binUniqueCode = binUniqueCode;
      } else if (complaintType === "dump-inaction") {
        sentData.uniqueNumber = uniqueNumber;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/complain/loadge-complain`,
        sentData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setMessage(res.data?.message || "Complaint submitted successfully!");
      
      setComplaints([res.data?.data, ...complaints]);

      setDescription("");
      setPincode("");
      setBinUniqueCode("");
      setUniqueNumber("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex md:justify-center justify-end">
      <div className="max-w-2xl p-4 dark:bg-red-950 mt-18 dark:text-gray-200 md:w-[550px] w-auto sm:mr-9 mr-5 rounded-lg">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 dark:bg-pink-900">
          <h2 className="text-2xl font-bold mb-4 text-rose-600 dark:text-red-400">
            Register a Complaint
            <a
              className="bg-red-500 ml-10 md:ml-15 p-2 rounded-lg text-lg font-semibold hover:bg-red-600 scroll-smooth text-white"
              href="#view-complain"
            >
              View Complains
            </a>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Complaint Type:</label>
              <select
                className="w-full border p-2 rounded outline-none focus:border-2 focus:border-red-400"
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
              >
                <option className="dark:bg-red-900" value="bin-issue">
                  Bin Issue
                </option>
                <option className="dark:bg-red-900" value="dump-inaction">
                  Dump Inaction
                </option>
              </select>
            </div>

            {complaintType === "bin-issue" && (
              <div>
                <label className="block font-medium">Bin Unique Code:</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded outline-none focus:border-2 focus:border-red-400"
                  value={binUniqueCode}
                  onChange={(e) => setBinUniqueCode(e.target.value)}
                  required
                />
              </div>
            )}

            {complaintType === "dump-inaction" && (
              <div>
                <label className="block font-medium">Dump Unique Number:</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded outline-none focus:border-2 focus:border-red-400"
                  value={uniqueNumber}
                  onChange={(e) => setUniqueNumber(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block font-medium">Description:</label>
              <textarea
                className="w-full border p-2 rounded outline-none focus:border-2 focus:border-red-400"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Pincode:</label>
              <input
                type="text"
                className="w-full border p-2 rounded outline-none focus:border-2 focus:border-red-400"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Coordinates:</label>
              <p className="text-sm text-gray-600 dark:text-white">
                {location.coordinates.length > 0
                  ? `Longitude: ${location.coordinates[0]}, Latitude: ${location.coordinates[1]}`
                  : "Fetching current location..."}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-blue-700 font-medium">
              {message}
            </p>
          )}
        </div>

        {/* Complaints Section */}
        <div
          id="view-complain"
          className="bg-white rounded-xl shadow-md p-6 dark:bg-red-700 dark:text-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4 ">All Complaints</h2>
          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints found.</p>
          ) : (
            <ul className="space-y-4">
              {complaints.map((comp) => (
                <li key={comp._id} className="border p-4 rounded-lg border-red-400">
                  <p className="font-semibold text-gray-800">
                    Type: {comp.complaintType}
                  </p>
                  {comp.uniqueNumber && (
                    <p>Unique-Number: {comp.relatedDump?.uniqueNumber}</p>
                  )}
                  <p>Description: {comp.description}</p>
                  <p>Pincode: {comp.pincode}</p>
                  <p>Address: {comp.address || "Unknown"}</p>
                  <p className="text-green-400">Assigned-Team: {comp.assignedTeam?.teamname}</p>
                  <p className="text-sm text-gray-400">
                    Created at: {new Date(comp.createdAt).toLocaleString()}
                  </p>
                  {comp.resolved && (
                    <span className="text-green-700 font-medium">Resolved</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaint;
