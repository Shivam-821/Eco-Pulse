import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAddPhotoAlternate } from "react-icons/md";
import useToken from "../context/token";

const AssignedTask = () => {
  const [loading, setLoading] = useState(true);
  const [assignedTask, setAssignedTask] = useState(null);
  const [teamname, setTeamname] = useState("");
  const [markedCompleted, setMarkedCompleted] = useState(false);
  const [submitCompletedTask, setSubmitCompletedTask] = useState(false);
  const [markedTaskDetails, setMarkedTaskDetails] = useState({
    uniqueNumber: null,
    id: null,
  });
  const [image, setImage] = useState(null);
  const { tokenId, setTokenId } = useToken();

  useEffect(() => {
    const token = tokenId;
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchAssignedTask = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/task-data/task-assigned`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        // console.log(res?.data?.data?.task);
        setAssignedTask(res?.data?.data?.task);
        setTeamname(res?.data?.data?.name);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedTask();
  }, [markedCompleted]);

  useEffect(() => {
    const token = tokenId;
    if (!token) {
      return;
    }
    const taskCompleted = async () => {
      const formData = new FormData();
      formData.append("picture", image);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/tasks/completed/${
            markedTaskDetails.id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        // console.log(res);
        if (res.status === 200) {
          setMarkedCompleted(false);
          setSubmitCompletedTask(false);
        }
      } catch (error) {
        console.log(error);
        setMarkedCompleted(false);
        setSubmitCompletedTask(false);
      }
    };
    taskCompleted();
  }, [submitCompletedTask]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 bg-[#e8fff0] dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-2 text-blue-700 dark:text-green-400">
            Assigned Tasks
          </h1>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-400">
            {teamname ? `Hello, ${teamname}!` : "Hello there!"} Here are your
            assigned clean-up duties.
          </p>
        </div>

        {/* Task List */}
        {!markedCompleted && assignedTask && assignedTask.length > 0 ? (
          <div className="space-y-6">
            {assignedTask.map((task, index) => (
              <div
                key={task._id || index}
                className="bg-emerald-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-green-400">
                    Task {index + 1}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      task.status === "completed"
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {task.status || "Assigned"}
                  </span>
                </div>

                <div className="space-y-3 text-slate-700 dark:text-slate-300">
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {task.address || "Address Not Available"}
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="font-semibold">Coordinates:</span>
                    <span>
                      {task.location?.coordinates
                        ? `${task.location.coordinates[1]}, ${task.location.coordinates[0]}`
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Assigned by:</span>{" "}
                    {task.assignedBy?.fullname || "Admin"}
                  </p>
                  <p>
                    <span className="font-semibold">Unique Number:</span>{" "}
                    {task.uniqueNumber}
                  </p>
                </div>

                {/* Action button */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setMarkedTaskDetails({
                        uniqueNumber: task.uniqueNumber,
                        id: task._id,
                      });
                      setMarkedCompleted(!markedCompleted);
                    }}
                    className="px-6 py-3 bg-green-500 text-slate-950 rounded-xl font-semibold hover:bg-green-400 transition"
                  >
                    Mark as Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {!markedCompleted && (
              <div className="bg-emerald-200 dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  No new tasks assigned.
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Check back later for new clean-up duties.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {markedCompleted && (
        <div className="flex flex-col items-center z-10 w-full min-h-screen gap-5">
          <div className="text-xl bg-orange-500 p-1 px-3 font-semibold rounded-lg">
            Unique Number: {markedTaskDetails.uniqueNumber}
          </div>
          <div className="flex border-2 h-8 rounded border-green-300 px-1 pl-2">
            <input
              type="file"
              className=""
              onChange={(e) => setImage(e.target.files[0])}
            />
            <MdAddPhotoAlternate className="text-2xl" />
          </div>
          <button
            className="py-1 px-2 bg-green-500 rounded-xs cursor-pointer hover:bg-green-600"
            onClick={() => setSubmitCompletedTask(!submitCompletedTask)}
          >
            Mark Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignedTask;
