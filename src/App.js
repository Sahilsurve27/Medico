// src/App.js
import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, Card, CardContent, CardMedia, Grid, Paper } from "@mui/material";
import CameraFeed from "./components/CameraFeed";
import RecordingControls from "./components/RecordingControls";

// Import icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TodayIcon from "@mui/icons-material/Today";

// To format the current time and date with a shorter format
const formatDateTime = () => {
  const now = new Date();
  return {
    date: new Intl.DateTimeFormat("en-US", {
      weekday: "short", // Abbreviated weekday (e.g., Mon, Tue)
      month: "short",   // Abbreviated month (e.g., Jan, Feb)
      day: "numeric",   // Day of the month (e.g., 1, 2)
      year: "numeric",  // Full year (e.g., 2025)
    }).format(now),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(now),
  };
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(formatDateTime());
  const [cameraError, setCameraError] = useState(null);

  // Initialize video stream when component mounts
  useEffect(() => {
    const initCamera = async () => {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: "usb" } },
        });
        setStream(cameraStream);
        setCameraError(null);
      } catch (error) {
        console.error("Error accessing camera", error);
        setStream(null);
        setCameraError("Please connect a USB camera");
      }
    };
    initCamera();

    // Update time and date every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(formatDateTime());
    }, 1000); // Update time every second

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(intervalId);
    };
  }, [stream]);

  // Start recording the video
  const startRecording = () => {
    if (!stream) {
      console.error("Stream not available");
      return;
    }

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      setRecordedChunks((prev) => [...prev, event.data]);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const id = new Date().toISOString();
      const newRecording = { id, url, name: `Recording ${id}` };

      const existingRecordings = JSON.parse(localStorage.getItem("recordings")) || [];
      existingRecordings.push(newRecording);
      localStorage.setItem("recordings", JSON.stringify(existingRecordings));

      setRecordings(existingRecordings);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  // Stop recording the video
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Load previous recordings from localStorage
  useEffect(() => {
    const savedRecordings = JSON.parse(localStorage.getItem("recordings")) || [];
    setRecordings(savedRecordings);
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        USB Camera Recording App
      </Typography>

      {/* Display Camera Feed or Error Message */}
      <Box sx={{ position: "relative" }}>
        {cameraError ? (
          <Paper sx={{ padding: 2, textAlign: "center", backgroundColor: "#ffdddd", borderRadius: "8px" }}>
            <Typography variant="h6" color="error">
              {cameraError}
            </Typography>
          </Paper>
        ) : (
          <CameraFeed stream={stream} />
        )}
      </Box>

      {/* Recording Controls */}
      {!cameraError && (
        <RecordingControls
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      )}

      {/* List of Recordings or Empty Message */}
      <Box my={4}>
        <Typography variant="h5" align="center" gutterBottom>
          Previous Recordings
        </Typography>

        {recordings.length === 0 ? (
          <Paper sx={{ padding: 2, textAlign: "center", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
            <Typography variant="h6" color="textSecondary">
              No recordings available. Start recording a video.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {recordings.map((recording) => (
              <Grid item xs={12} sm={6} md={4} key={recording.id}>
                <Card>
                  <CardMedia
                    component="video"
                    controls
                    src={recording.url}
                    alt={recording.name}
                    sx={{ height: 200, borderRadius: "8px", objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="body1" component="div" gutterBottom>
                      {recording.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => window.open(recording.url, "_blank")}
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                      Open in new tab
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Time and Calendar Icons in Upper Right Corner */}
      <Box
        sx={{
          position: "fixed", // Fixed positioning to avoid overlap with other content
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10, // Ensures it's above other UI elements
          padding: "4px", // Smaller padding
          backgroundColor: "rgba(255, 255, 255, 0.7)", // Light background for visibility
          borderRadius: "8px", // Rounded corners for the background
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for separation

          // Responsive styles
          "@media (max-width: 600px)": {
            fontSize: "0.75rem", // Smaller font size for mobile
            flexDirection: "row", // Align icons horizontally
            gap: 0.5, // Less space between icon and text
            padding: "2px", // Even smaller padding on mobile
          },
        }}
      >
        {/* Time Icon and Live Time */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: "1.2rem", marginRight: 0.5 }} />
          <Typography variant="body2" color="textSecondary">
            {currentDateTime.time}
          </Typography>
        </Box>

        {/* Calendar Icon and Live Date */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TodayIcon sx={{ fontSize: "1.2rem", marginRight: 0.5 }} />
          <Typography variant="body2" color="textSecondary">
            {currentDateTime.date}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
