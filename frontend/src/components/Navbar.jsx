import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBars, FaSearch } from "react-icons/fa";
import useToken from "../context/token";

export default function Navbar({ setCollapsed }) {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const { tokenId, setTokenId } = useToken();
  const token = tokenId;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleLogout = async () => {
    try {
      let response;
      if (token) {
        response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        return;
      }
      if (response.status === 200) {
        setTokenId("");
        toast.success("Logged out successfully!");
        setTimeout(() => navigate("/auth"), 1200);
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          left: { md: "auto" },
          width: "100%",
          height: "63px",
          backgroundColor: "transparent",
          color: "black",
          borderBottom: "2px solid rgba(0, 0, 2, 0.26)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, md: 3 },
            py: 0.7,
          }}
        >
          {/* Left side - Menu button and title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => setCollapsed((prev) => !prev)}
              sx={{
                display: { md: "none" },
                color: "#22c55e",
              }}
            >
              <FaBars />
            </IconButton>
            <Link to="/" className="flex gap-2 flex-row-reverse items-center">
              <Box
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  color: "#22c55e",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Eco Pulse
              </Box>
              <img src="/eco_logo.png" alt="eco-logo" className="w-13 h-13" />
            </Link>
          </Box>

          {/* Right side - Search and Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <FaSearch style={{ marginRight: 8, color: "#64748b" }} />
                ),
              }}
              sx={{
                backgroundColor: "#f8fafc",
                borderRadius: 2,
                width: { xs: "150px", sm: "200px", md: "250px" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#22c55e",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#22c55e",
                  },
                },
              }}
              inputProps={{
                style: { padding: "8px 12px" },
              }}
            />
            {token ? (
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#22c55e",
                  "&:hover": {
                    backgroundColor: "#16a34a",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  },
                  color: "white",
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "none",
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate("/auth")}
                sx={{
                  backgroundColor: "#22c55e",
                  "&:hover": {
                    backgroundColor: "#16a34a",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  },
                  color: "white",
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "none",
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        toastStyle={{
          backgroundColor: "#1e293b",
          color: "#f8fafc",
        }}
      />
    </>
  );
}
