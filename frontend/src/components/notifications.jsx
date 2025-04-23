import React, { useState } from "react";
import { Box, Typography, Grid, Chip, Paper, TextField, List, ListItem, ListItemText, Divider } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";

const allNotifications = [
  { message: "Aman’s Team #1 has completed task at Imphal West.", timestamp: "2025-04-23 10:00 AM", type: "completed" },
  { message: "A dump has been reported at Imphal East.", timestamp: "2025-04-22 02:30 PM", type: "dump" },
  { message: "Zedane's Team #2 has completed task at Ukhrul.", timestamp: "2025-04-21 09:45 AM", type: "completed" },
  { message: "A dump has been reported at Senapati.", timestamp: "2025-04-20 06:00 PM", type: "dump" },
  { message: "Pooja’s Team #3 has completed task at Tamenglong.", timestamp: "2025-04-19 11:30 AM", type: "completed" },
];

const Notifications = () => {
  const [search, setSearch] = useState("");

  const filteredNotifications = allNotifications.filter(notification => 
    notification.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", marginLeft: '240px' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Notifications
        </Typography>

        {/* Search bar */}
        <TextField
          label="Search Notifications"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Notifications List */}
        <Paper elevation={3} sx={{ p: 2, maxHeight: '400px', overflow: 'auto' }}>
          <List>
            {filteredNotifications.map((notification, index) => (
              <div key={index}>
                <ListItem>
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>
                            {notification.message}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.875rem', color: grey[600] }}>
                            {notification.timestamp}
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Chip
                        label={notification.type === "dump" ? "Reported" : "Completed"}
                        sx={{
                          bgcolor: notification.type === "dump" ? red[500] : green[500],
                          color: "white",
                          width: "100%",
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
                {index !== filteredNotifications.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Notifications;
