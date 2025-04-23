import React, { useState } from 'react';
import { AppBar, Toolbar, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar () {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

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
          to="/logout"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

