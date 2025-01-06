// src/components/CameraFeed.js
import React, { useEffect, useRef } from "react";

const CameraFeed = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="100%"
        height="auto"
        style={{ border: "2px solid black" }}
      />
    </div>
  );
};

export default CameraFeed;
