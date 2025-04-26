import React, { useState } from 'react';
import { AppBar, Toolbar, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";

export default function Navbar () {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate()
  const token = localStorage.getItem("accessToken")

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleLogout = async () => {
    await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/auth/logout`, 
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    ).then((response) => {
      if(response.status === 200){
        localStorage.removeItem('accessToken')
        toast("Logout successfully")
        setTimeout(() => navigate("/auth"), 1000)
      }
    })

  }

  return (
    <AppBar
      position="fixed"
      sx={{
        left: 230,
        width: 'calc(100% - 230px)', // match sidebar width
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1300
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          pr: 2,
          overflow: 'hidden'
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type something here"
          sx={{
            backgroundColor: 'white',
            borderRadius: '4px',
            maxWidth: '200px'
          }}
        />
        <Button
          variant="contained"
          component={Link}
          onClick={() => handleLogout()}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Logout
        </Button>
      </Toolbar>
      <ToastContainer />
    </AppBar>
  );
};

