// src/components/RecordingsList.js
import React from "react";
import { Box, Typography } from "@mui/material";

const RecordingsList = ({ recordings }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Previous Recordings
      </Typography>
      {recordings.map((recording) => (
        <Box key={recording.id} mb={2}>
          <Typography variant="body1">{recording.name}</Typography>
          <video
            src={recording.url}
            controls
            width="100%"
            height="auto"
            style={{ border: "2px solid gray" }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default RecordingsList;
