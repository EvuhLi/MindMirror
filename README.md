# 🪞 MindMirror
## Real-Time Mood & Emotion Analyzer
MindMirror is a simple web app that uses your webcam and the ChatGPT API to analyze your facial expressions in real time. Every few seconds, it sends a frame from your camera to a Node.js backend and returns insights such as mood, stress, energy, observations, and quick advice.

## Features
- Real-time emotion and mood analysis
- Uses webcam snapshots (no videos stored)
- Node.js backend sends frames to the ChatGPT API
- Returns easy-to-understand insights
- Clean, fast, lightweight setup

## How It Works
Frontend captures an image from the webcam every few seconds, and then the image is sent to the Node.js backend. The backend sends it to the ChatGPT Vision API, and the API returns natural-language feedback about your emotional state. Finally, the frontend displays the results instantly.


## Privacy
Frames are not saved or stored. Images are only used for the immediate API call, and you stay fully in control of your webcam.
