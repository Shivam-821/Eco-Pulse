import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/dump/getall-dump`
        );
        console.log(response.data.data);

        const extractedTeams = response.data.data.map((dump) => ({
          teamname: dump.assignedTeam?.teamname || "Not Assigned",
          phone: dump.assignedTeam?.phone || "N/A",
          location: dump.address || "N/A",
          status: dump.teamAssigned ? "ASSIGNED" : "NOT ASSIGNED",
          dateAssigned: dump.updatedAt || dump.createdAt,
        }));

        setTeams(extractedTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) => {
    const matchStatus = statusFilter === "ALL" || team.status === statusFilter;

    const matchSearch = team.teamname
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <Box
      sx={{ display: "flex", marginLeft: "230px" }}
      className="dark:bg-slate-950 min-h-screen"
    >
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Clean Up Teams
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            padding: 2,
          }}
        >
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

        <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Team Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Phone</strong>
                </TableCell>
                <TableCell>
                  <strong>Location</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Date Assigned</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeams.map((team, index) => (
                <TableRow key={index}>
                  <TableCell>{team.teamname}</TableCell>
                  <TableCell>{team.phone}</TableCell>
                  <TableCell>
                    {typeof team.location === "object"
                      ? `${team.location.coordinates?.join(", ") || "N/A"}`
                      : team.location}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={team.status}
                      sx={{
                        bgcolor:
                          team.status === "ASSIGNED" ? green[500] : grey[700],
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {team.dateAssigned
                      ? new Date(team.dateAssigned).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
