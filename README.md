# 🚀 Agro24 Project Setup Guide

Welcome to the **Agro24** project! This guide will walk you through setting up the frontend (React Native with Expo) and the backend (Python Flask).

---

## 📂 Project Structure
```
Agro24/
│-- App/                 # React Native (Expo) frontend
│-- Backend/             # Python Flask backend
│-- README.md            # Project documentation
```

---

## ⚡ Setting Up the React Native App (Expo)

### 1️⃣ Install Node.js & Expo CLI
Ensure you have Node.js installed. You can download it from [Node.js Official Site](https://nodejs.org/)

Then install Expo CLI globally:
```sh
npm install -g expo-cli
```

### 2️⃣ Install Dependencies
Navigate to the **App** folder and install dependencies:
```sh
cd App
npm install
```

### 3️⃣ Start the Expo Development Server
Run the following command to start your app:
```sh
npx expo start
```
This will open the Expo Developer Tools in your browser. You can scan the QR code using the Expo Go app on your phone.

---

## 🔥 Setting Up the Backend (Python Flask)

### 1️⃣ Install Python & Virtual Environment
Ensure you have Python installed. You can download it from [Python Official Site](https://www.python.org/)

Then, create and activate a virtual environment:
```sh
cd Backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 2️⃣ Install Dependencies
Run the following command to install required dependencies:
```sh
pip install -r requirements.txt
```

### 3️⃣ Run the Flask Server
Start the Flask backend using:
```sh
python server.py
```
By default, the server runs on **http://192.*.*.*:5000/**.
Paste This Server Url In /APP/App.tsx

---

## 🎯 API & Frontend Connection
- The **React Native App** will make requests to `http://192.*.*.*:5000/`.
- Ensure the backend is running before using the app.

---

## 🛠 Troubleshooting
- If you encounter any errors, check the logs.
- Ensure your dependencies are installed correctly.
- Restart the Expo or Flask server if needed.

---

🚀 Happy Coding! 🎉

