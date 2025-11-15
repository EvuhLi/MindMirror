# 🪞 MindMirror
Real-Time Mood & Emotion Analyzer
---
MindMirror is a simple web app that uses your webcam and the ChatGPT API to analyze your facial expressions in real time. Every few seconds, it sends a frame from your camera to a Node.js backend and returns insights such as mood, stress, energy, observations, and quick advice.

# ✨ Features
---
Real-time emotion and mood analysis

Uses webcam snapshots (no videos stored)

Node.js backend sends frames to the ChatGPT API

Returns easy-to-understand insights

Clean, fast, lightweight setup

# 🧠 How It Works
---
Frontend captures an image from the webcam every few seconds.

The image is sent to the Node.js backend.

Backend sends it to the ChatGPT Vision API.

The API returns natural-language feedback about your emotional state.

The frontend displays the results instantly.

# 🚀 Getting Started
---
Requirements

Node.js

OpenAI API key

A browser with webcam access

# Install
---
git clone https://github.com/yourusername/mindmirror.git
cd mindmirror
npm install

Setup .env
OPENAI_API_KEY=your_api_key
PORT=3000

# Run
---
npm start


Then visit:

http://localhost:3000

# 🔒 Privacy
---
Frames are not saved or stored.

Images are only used for the immediate API call.

You stay fully in control of your webcam.
