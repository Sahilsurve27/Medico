// src/App.js
import React from 'react';
import { Grid, Button, Typography } from '@mui/material';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
       Start with dev -1.1
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Button variant="contained" color="primary" fullWidth>
            Button 1
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button variant="contained" color="secondary" fullWidth>
            Button 2
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button variant="contained" color="error" fullWidth>
            Button 3
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
