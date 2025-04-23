import React, { useState } from "react";
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
  TextField,
  Grid
} from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const dummyTasks = [
  {
    id: 1,
    location: "Imphal East",
    type: "Full Smart Bin",
    color: "red",
    timestamp: "2025-04-23T10:30",
    assigned: false,
    completed: false,
    description: "Smart bin reported full by sensor."
  },
  {
    id: 2,
    location: "Ukhrul",
    type: "User Reported Dump",
    color: "blue",
    timestamp: "2025-04-23T09:00",
    assigned: false,
    completed: false,
    description: "Local resident reported unauthorized garbage dumping."
  },
  {
    id: 3,
    location: "Imphal West",
    type: "Nearly Full Bin",
    color: "orange",
    timestamp: "2025-04-22T15:45",
    assigned: true,
    completed: true,
    team: "Team B",
    deadline: "2025-04-24T10:00",
    description: "Bin nearing full capacity, needs urgent clearance."
  },
  {
    id: 4,
    location: "Bishnupur",
    type: "User Reported Dump",
    color: "blue",
    timestamp: "2025-04-24T12:00",
    assigned: true,
    completed: false,
    team: "Team A",
    description: "Unauthorised garbage reported in a residential area."
  }
];

const availableTeams = ["Team A", "Team B", "Team C"];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const Tasks = () => {
  const [tasks, setTasks] = useState(dummyTasks);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());

  const handleOpen = (task) => {
    setSelectedTask(task);
    setSelectedTeam("");
    setSelectedDate(dayjs());
    setSelectedTime(dayjs());
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAssign = () => {
    const deadline = selectedDate
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .toISOString();

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? {
            ...task,
            assigned: true,
            team: selectedTeam,
            deadline
          }
        : task
    );
    setTasks(updatedTasks);
    setOpen(false);
  };

  const unassignedTasks = tasks.filter((task) => !task.assigned && !task.completed);
  const assignedTasks = tasks.filter((task) => task.assigned && !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div style={{ padding: "90px 20px 20px 260px" }}>
      {/* Unassigned Tasks */}
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Unassigned Tasks
      </Typography>
      <Grid container spacing={2}>
        {unassignedTasks.length === 0 ? (
          <Typography variant="body1" sx={{ m: 2 }}>
            No unassigned tasks available.
          </Typography>
        ) : (
          unassignedTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card sx={{ borderLeft: `6px solid ${task.color}` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Location: {task.location}
                  </Typography>
                  <Typography>Issue: {task.type}</Typography>
                  <Typography>Description: {task.description}</Typography>
                  <Typography>
                    Timestamp: {dayjs(task.timestamp).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
                  <Button onClick={() => handleOpen(task)} sx={{ mt: 1 }} variant="contained">
                    Assign Team
                  </Button>
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
      <Grid container spacing={2}>
        {assignedTasks.length === 0 ? (
          <Typography variant="body1" sx={{ m: 2 }}>
            No assigned tasks available.
          </Typography>
        ) : (
          assignedTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card sx={{ borderLeft: `6px solid ${task.color}` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Location: {task.location}
                  </Typography>
                  <Typography>Issue: {task.type}</Typography>
                  <Typography>Description: {task.description}</Typography>
                  <Typography>
                    Timestamp: {dayjs(task.timestamp).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
                  <Typography>Assigned Team: {task.team}</Typography>
                  <Typography>
                    Deadline: {dayjs(task.deadline).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
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
      <Grid container spacing={2}>
        {completedTasks.length === 0 ? (
          <Typography variant="body1" sx={{ m: 2 }}>
            No completed tasks available.
          </Typography>
        ) : (
          completedTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card sx={{ borderLeft: `6px solid ${task.color}` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Location: {task.location}
                  </Typography>
                  <Typography>Issue: {task.type}</Typography>
                  <Typography>Description: {task.description}</Typography>
                  <Typography>
                    Timestamp: {dayjs(task.timestamp).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
                  <Typography>Completed By: {task.team}</Typography>
                  <Typography>
                    Completed On: {dayjs(task.deadline).format("YYYY-MM-DD hh:mm A")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Modal for assigning task */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Assign Cleanup Team
          </Typography>
          <Typography>Location: {selectedTask?.location}</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeam}
              label="Team"
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {availableTeams.map((team, index) => (
                <MenuItem key={index} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Deadline Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              sx={{ mt: 2 }}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="Deadline Time"
              value={selectedTime}
              onChange={(newValue) => setSelectedTime(newValue)}
              sx={{ mt: 2 }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
          <Button
            onClick={handleAssign}
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!selectedTeam}
          >
            Assign
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Tasks;
