// src/components/RecordingControls.js
import React from "react";
import { Button } from "@mui/material";

const RecordingControls = ({ isRecording, startRecording, stopRecording }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
      {isRecording ? (
        <Button variant="contained" color="secondary" onClick={stopRecording}>
          Stop Recording
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={startRecording}>
          Start Recording
        </Button>
      )}
    </div>
  );
};

export default RecordingControls;
