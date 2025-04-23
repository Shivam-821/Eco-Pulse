import React, { useState } from "react";
import { Box, Typography, Grid, Chip, ToggleButtonGroup, ToggleButton, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { green, grey } from "@mui/material/colors";

const allTeams = [
  { name: "Aman's Team #1", phone: "+91 345678995", location: "Imphal West", status: "ASSIGNED", date: "23/04/18" },
  { name: "Zedane's Team #2", phone: "+91 345678996", location: "Imphal East", status: "NOT ASSIGNED", date: "11/01/19" },
  { name: "Pooja's Team #3", phone: "+91 012345878", location: "Ukhrul", status: "ASSIGNED", date: "19/09/17" },
  { name: "Levi's Team #4", phone: "+91 0123456789", location: "Senapati", status: "ASSIGNED", date: "24/12/08" },
  { name: "Tina's Team #5", phone: "+91 0123456789", location: "Tamenglong", status: "NOT ASSIGNED", date: "04/10/21" },
  { name: "Eric's Team #6", phone: "+91 0123456789", location: "Chandel", status: "NOT ASSIGNED", date: "14/09/20" }
];

const Teams = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredTeams = allTeams.filter(team => {
    const matchStatus = statusFilter === "ALL" || team.status === statusFilter;
    const matchSearch = team.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <Box sx={{ display: "flex", marginLeft: '240px' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Clean Up Teams
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(e, newValue) => newValue && setStatusFilter(newValue)}
            aria-label="team status filter"
          >
            <ToggleButton value="ALL">All</ToggleButton>
            <ToggleButton value="ASSIGNED">Assigned</ToggleButton>
            <ToggleButton value="NOT ASSIGNED">Not Assigned</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Search Teams"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Team Name</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date Assigned</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeams.map((team, index) => (
                <TableRow key={index}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.phone}</TableCell>
                  <TableCell>{team.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={team.status}
                      sx={{
                        bgcolor: team.status === "ASSIGNED" ? green[500] : grey[700],
                        color: "white"
                      }}
                    />
                  </TableCell>
                  <TableCell>{team.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Teams;
