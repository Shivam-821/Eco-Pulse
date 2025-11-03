import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import useToken from "../context/token";
import {
  FaTasks,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  border: "1px solid #e2e8f0",
};

const getColorForType = (type) => {
  switch (type) {
    case "Full Smart Bin":
      return "#ef4444";
    case "Nearly Full Bin":
      return "#f59e0b";
    case "User Reported Dump":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case "unassigned":
      return {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-300/20",
        borderColor: "border-red-200 dark:border-red-300",
        icon: FaExclamationTriangle,
      };
    case "assigned":
      return {
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-300/20",
        borderColor: "border-orange-200 dark:border-orange-300",
        icon: FaClock,
      };
    case "completed":
      return {
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-300/20",
        borderColor: "border-green-200 dark:border-green-300",
        icon: FaCheckCircle,
      };
    default:
      return {
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-300/20",
        borderColor: "border-gray-200 dark:border-gray-300",
        icon: FaTasks,
      };
  }
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { tokenId } = useToken();
  const token = tokenId;
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);

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
        console.log(err);
        setVerifiedUser(null);
      }
    };

    verify();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTeams();
        await fetchTasks();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
        setSnackbar({
          open: true,
          message: "Failed to fetch data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/tasks/get-all-assignteam`
      );
      setAvailableTeams(res.data.data);
    } catch (error) {
      console.error("Failed to fetch teams", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch teams",
        severity: "error",
      });
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/dump/getall-dump`
      );

      const tasksWithLocationNames = await Promise.all(
        response.data.data.map(async (dump) => {
          return {
            id: dump._id,
            locationName: dump.address,
            lat: dump.location.coordinates[0],
            lng: dump.location.coordinates[1],
            coordinates: dump.location?.coordinates || null,
            type: dump.type || "User Reported Dump",
            color: getColorForType(dump.type),
            timestamp: dump.createdAt,
            assigned: dump.teamAssigned || false,
            completed: dump.completed || false,
            description: dump.description || "No description provided",
            uniqueCode: dump.uniqueNumber,
            team: dump.assignedTeam?.teamname || "",
            deadline: dump.deadline || "",
            reported: dump.complainLodge,
          };
        })
      );

      setTasks(tasksWithLocationNames);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch tasks");
    }
  };

  const handleAssign = (task) => {
    setSelectedTask(task);
    setSelectedTeam("");
    setSelectedDate(dayjs());
    setSelectedTime(dayjs());
    setOpen(true);
  };

  const handleAssignConfirm = async () => {
    if (!selectedTask || !selectedTeam) {
      setSnackbar({
        open: true,
        message: "Please select a team",
        severity: "error",
      });
      return;
    }

    const deadline = dayjs(selectedDate)
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .toISOString();

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/tasks/assign-task`,
        {
          teamName: selectedTeam,
          dumpId: selectedTask.id,
          location: selectedTask.coordinates,
          deadline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id
          ? { ...task, assigned: true, team: selectedTeam, deadline }
          : task
      );

      setTasks(updatedTasks);
      setOpen(false);
      setSnackbar({
        open: true,
        message: "Task assigned successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to assign task",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const unassignedTasks = tasks.filter((task) => !task.assigned);
  const assignedTasks = tasks.filter(
    (task) => task.assigned && !task.completed
  );
  const completedTasks = tasks.filter((task) => task.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading tasks...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-2xl" />
          </div>
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const TaskCard = ({ task, status }) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    const isReportedAssigned = status === "assigned" && task.reported;

    const bgClass = isReportedAssigned
      ? "bg-red-200 dark:bg-red-800/30"
      : config.bgColor ?? "bg-white dark:bg-gray-900";

    const borderClass = isReportedAssigned
      ? "border-red-300 dark:border-red-600"
      : config.borderColor;

    return (
      <div
        className={`animate-fade-in hover:scale-105 transition-all duration-300
    ${
      status === "assigned" && task.reported
        ? "bg-red-200 dark:bg-red-800/30 border-red-400 dark:border-red-600"
        : `${config.bgColor ?? "bg-white dark:bg-gray-900"} ${
            config.borderColor ?? "border-gray-700"
          }`
    }
    shadow-lg hover:shadow-xl min-h-[280px] flex flex-col border-3
  `}
      >
        <CardContent className="p-5 pb-2 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-[10px]">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                <StatusIcon className={`text-lg ${config.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                  {task.type}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {task.locationName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-1 min-w-[48px] min-h-[55px] flex-1">
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed w-62">
              {task.description}
            </p>
          </div>

          {/* Unique code */}
          <div className="min-h-[30px] flex-1">
            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed w-50">
              <span className="font-bold">Unique Code:</span> {task.uniqueCode}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div
              className={`bg-white px-2 py-1 rounded-lg ${
                task.completed
                  ? "dark:bg-teal-700"
                  : task.team
                  ? "dark:bg-orange-400"
                  : "dark:bg-red-400"
              } w-33`}
            >
              <p className="text-xs text-gray-500 dark:text-gray-800">
                Coordinates
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {task.lat?.toFixed(4)}, {task.lng?.toFixed(4)}
              </p>
            </div>
            <div
              className={`bg-white ${
                task.completed
                  ? "dark:bg-teal-700"
                  : task.team
                  ? "dark:bg-orange-400"
                  : "dark:bg-red-400"
              } px-2 py-1 rounded-lg w-33`}
            >
              <p className="text-xs text-gray-500 dark:text-gray-800">
                Reported
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {dayjs(task.timestamp).format("DD MMM YY")}
              </p>
            </div>
          </div>

          {/* Team and Deadline Info */}
          {(task.team || task.deadline) && (
            <div
              className={`bg-white px-3 py-2 rounded-lg ${
                task.completed ? "dark:bg-teal-700" : "dark:bg-orange-400"
              } flex items-center`}
            >
              {task.team && (
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-gray-700 text-sm" />
                  <span className="text-sm text-gray-800 dark:text-white">
                    {task.team}
                  </span>
                </div>
              )}
              {task.deadline && (
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-800 dark:text-white">
                    {dayjs(task.deadline).format("MMM DD, hh:mm A")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {verifiedUser?.role === "admin" && status === "unassigned" && (
            <Button
              onClick={() => handleAssign(task)}
              variant="contained"
              fullWidth
              className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors duration-200 mt-auto"
            >
              Assign Team
            </Button>
          )}
        </CardContent>
      </div>
    );
  };

  const SectionHeader = ({ title, count, status }) => {
    const config = getStatusConfig(status);

    return (
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`p-3 rounded-xl ${config.bgColor} ${config.borderColor} border`}
        >
          <config.icon className={`text-2xl ${config.color}`} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${config.color}`}>{title}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {count} {count === 1 ? "task" : "tasks"} {status}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-14 pl-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
            Task Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Manage and assign cleanup tasks to teams. Monitor progress and
            completion status.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Unassigned Tasks Section */}
        <section>
          <SectionHeader
            title="Unassigned Tasks"
            count={unassignedTasks.length}
            status="unassigned"
          />
          {unassignedTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
                <FaTasks className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No Unassigned Tasks
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                All tasks have been assigned to teams.
              </p>
            </div>
          ) : (
            <Grid container spacing={3}>
              {unassignedTasks.map((task, index) => (
                <Grid item xs={12} md={6} lg={4} key={task.id}>
                  <TaskCard task={task} status="unassigned" />
                </Grid>
              ))}
            </Grid>
          )}
        </section>

        {/* Assigned Tasks Section */}
        <section>
          <SectionHeader
            title="Assigned Tasks"
            count={assignedTasks.length}
            status="assigned"
          />
          {assignedTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
                <FaClock className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No Assigned Tasks
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Assign tasks to see them here.
              </p>
            </div>
          ) : (
            <Grid container spacing={3}>
              {assignedTasks.map((task, index) => (
                <Grid item xs={12} md={6} lg={4} key={task.id}>
                  <TaskCard task={task} status="assigned" />
                </Grid>
              ))}
            </Grid>
          )}
        </section>

        {/* Completed Tasks Section */}
        <section>
          <SectionHeader
            title="Completed Tasks"
            count={completedTasks.length}
            status="completed"
          />
          {completedTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
                <FaCheckCircle className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No Completed Tasks
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Completed tasks will appear here.
              </p>
            </div>
          ) : (
            <Grid container spacing={3}>
              {completedTasks.map((task, index) => (
                <Grid item xs={12} md={6} lg={4} key={task.id}>
                  <TaskCard task={task} status="completed" />
                </Grid>
              ))}
            </Grid>
          )}
        </section>
      </div>

      {/* Assign Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={style}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <FaUsers className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Assign Task
            </h2>
          </div>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel className="dark:text-gray-300">Select Team</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              label="Select Team"
              className="dark:text-white"
            >
              {availableTeams.map((team) => (
                <MenuItem key={team._id} value={team.teamname}>
                  {team.teamname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              sx={{ mb: 2, width: "100%" }}
            />
            <TimePicker
              label="Select Time"
              value={selectedTime}
              onChange={(newTime) => setSelectedTime(newTime)}
              sx={{ mb: 3, width: "100%" }}
            />
          </LocalizationProvider>

          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              fullWidth
              className="py-2"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAssignConfirm}
              fullWidth
              className="bg-green-500 hover:bg-green-600 py-2"
            >
              Assign Task
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
