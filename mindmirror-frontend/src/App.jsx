import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [running, setRunning] = useState(false);

  // captureFrame needs stable identity so interval always calls the same function
  const captureFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return; // not ready

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // get base64 without the prefix
    const base64 = canvas.toDataURL("image/jpeg", 0.6).split(",")[1];

    try {
      const res = await axios.post("http://localhost:3001/analyze", {
        text: "",
        imageBase64: base64,
      }, { timeout: 30000 });

      setAnalysis(res.data);
    } catch (err) {
      console.error("captureFrame -> analyze error:", err?.response?.data ?? err.message ?? err);
    }
  }, []);

  // start/stop camera and interval
  useEffect(() => {
    async function startCameraAndInterval() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;

        // small delay to allow video to have metadata (width/height)
        const startCapture = () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          // capture immediately and then every 3s
          captureFrame();
          intervalRef.current = setInterval(captureFrame, 3000);
        };

        // if video is already ready
        if (videoRef.current && videoRef.current.readyState >= 2) {
          startCapture();
        } else {
          // wait for metadata loaded
          const onLoaded = () => {
            startCapture();
            videoRef.current.removeEventListener("loadedmetadata", onLoaded);
          };
          videoRef.current.addEventListener("loadedmetadata", onLoaded);
        }

        setRunning(true);
      } catch (err) {
        console.error("Camera start error:", err);
        alert("Could not access camera. Check permissions.");
      }
    }

    startCameraAndInterval();

    return () => {
      // cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      setRunning(false);
    };
  }, [captureFrame]);

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>MindMirror (Live)</h1>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: 400, borderRadius: 8, background: "#000" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => {
                // manual capture
                captureFrame();
              }}
              style={{ padding: "8px 12px", borderRadius: 6, background: "#0b69ff", color: "#fff", border: "none" }}
            >
              Capture Now
            </button>
            <span style={{ marginLeft: 12, color: running ? "green" : "gray" }}>
              {running ? "Running (auto-capture every 3s)" : "Stopped"}
            </span>
          </div>
        </div>

        <div style={{ minWidth: 320 }}>
          <h2 style={{ marginTop: 0 }}>Live Analysis</h2>
          {analysis ? (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div><strong>Mood:</strong> {analysis.mood}</div>
              <div><strong>Stress:</strong> {analysis.stress}</div>
              <div><strong>Energy:</strong> {analysis.energy}</div>
              <div style={{ marginTop: 8 }}><strong>Observation:</strong> {analysis.observation}</div>
              <div style={{ marginTop: 8 }}><strong>Advice:</strong> {analysis.advice}</div>
            </div>
          ) : (
            <div style={{ color: "#666" }}>Waiting for first analysis...</div>
          )}
        </div>
      </div>
    </div>
  );
}
