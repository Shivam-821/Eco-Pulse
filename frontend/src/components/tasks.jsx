import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const getColorForType = (type) => {
  switch (type) {
    case "Full Smart Bin":
      return "red";
    case "Nearly Full Bin":
      return "orange";
    case "User Reported Dump":
      return "blue";
    default:
      return "gray";
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
  const token = localStorage.getItem("accessToken");
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
        console.log(err)
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
        `${import.meta.env.VITE_BASE_URL}/api/tasks/get-all-assignteam`,
      );
      setAvailableTeams(res.data.data);
      console.log(res.data.data)
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

  const unassignedTasks = tasks.filter(
    (task) => !task.assigned
  );
  const assignedTasks = tasks.filter(
    (task) => task.assigned
  );
  const completedTasks = tasks.filter((task) => task.completed);

  if (loading) {
    return (
      <div
        style={{
          padding: "90px 20px 20px 260px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "90px 20px 20px 260px" }}>
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: "90px 20px 20px 5px" }}>
      {/* Unassigned Tasks */}
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Unassigned Tasks
      </Typography>
      <Grid container direction={"column"} spacing={2}>
        {unassignedTasks.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ m: 2 }}>
              No unassigned tasks available.
            </Typography>
          </Grid>
        ) : (
          unassignedTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card sx={{ borderLeft: `6px solid ${task.color}` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Location: {task.locationName}
                  </Typography>
                  <Typography>
                    Coordinates: {task.lat}, {task.lng}
                  </Typography>
                  <Typography>Issue: {task.type}</Typography>
                  <Typography>Description: {task.description}</Typography>
                  <Typography>
                    Timestamp:{" "}
                    {dayjs(task.timestamp).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
                  {verifiedUser?.role === "admin" && (
                    <Button
                      onClick={() => handleAssign(task)}
                      sx={{ mt: 1 }}
                      variant="contained"
                    >
                      Assign Team
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Assigned Tasks */}
      <Typography variant="h5" mt={4} gutterBottom fontWeight={600}>
        Assigned Tasks
      </Typography>
      <Grid container direction={"column"} spacing={2}>
        {assignedTasks.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ m: 2 }}>
              No assigned tasks available.
            </Typography>
          </Grid>
        ) : (
          assignedTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                sx={{
                  borderLeft: `6px solid ${task.color}`,
                  backgroundColor: task.reported ? "#ffe5e5" : "white", 
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Location: {task.locationName}
                  </Typography>
                  <Typography>Issue: {task.type}</Typography>
                  <Typography>Description: {task.description}</Typography>
                  <Typography>
                    Timestamp:{" "}
                    {dayjs(task.timestamp).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
                  <Typography>Assigned Team: {task.team}</Typography>
                  {task.deadline && (
                    <Typography>
                      Deadline:{" "}
                      {dayjs(task.deadline).format("YYYY-MM-DD hh:mm A")}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Completed Tasks */}
      <Typography variant="h5" mt={4} gutterBottom fontWeight={600}>
        Completed Tasks
      </Typography>
      <Grid container direction={"column"} spacing={2}>
        {completedTasks.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ m: 2 }}>
              No completed tasks available.
            </Typography>
          </Grid>
        ) : (
          completedTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card sx={{ borderLeft: `6px solid ${task.color}` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Location: {task.locationName}
                  </Typography>
                  <Typography>Issue: {task.type}</Typography>
                  <Typography>Description: {task.description}</Typography>
                  <Typography>
                    Timestamp:{" "}
                    {dayjs(task.timestamp).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
                  <Typography>Completed By: {task.team}</Typography>
                  {task.deadline && (
                    <Typography>
                      Completed On:{" "}
                      {dayjs(task.deadline).format("YYYY-MM-DD hh:mm A")}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Assign Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Assign Task
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Team</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              label="Select Team"
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
              sx={{ mb: 2, width: "100%" }}
            />
          </LocalizationProvider>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAssignConfirm}>
              Assign
            </Button>
          </Box>
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
    </div>
  );
}
