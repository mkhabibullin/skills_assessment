import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import './App.css';
import ChatUI from './components/ChatUI';


function App() {

  return (
    <Container maxWidth="xl" sx={{ p: '0px !important' }} >
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Skills Assessment Chat
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        component="form"
        sx={{
          mt: 3,
          '& .MuiTextField-root': { my: 1, width: '100%' },
        }}
        noValidate
        autoComplete="off"
      >
        <Container maxWidth="xl">
          <ChatUI></ChatUI>
        </Container>
      </Box>
    </Container>
  );
}

export default App;