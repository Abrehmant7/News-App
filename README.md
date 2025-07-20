# 📰 News Pulse

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

A modern news aggregator that delivers real-time headlines with trending analytics, built with React, Tailwind CSS, and Firebase.

![App Screenshot](/screenshots/Screenshot1.png)
![App Screenshot](/screenshots/Screenshot2.png)

## ✨ Features

- **Real-time news** from GNews API
- **Trending analytics** (searches & articles)
- **Category filters** (Business, Tech, Sports, etc.)
- **Debounced search** for optimized performance
- **Dark/Light mode** toggle
- **Responsive design** for all devices

## 🚀 Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/news-pulse.git

### Install dependencies:
```bash
npm install

2. Set up environment:
   Create .env file in root directory

Add your API keys:
VITE_NEWS_API_KEY=your_gnews_api_key
VITE_FIREBASE_API_KEY=your_firebase_config

3. Run development server:
```bash
npm run dev


## 🔧Tech Stack
Category	Technology
Frontend	React + Vite
Styling	Tailwind CSS
State Management	Context API
Database	Firebase Firestore
News API	GNews

## 📂 Project Structure
src/
├── components/        # Reusable UI components
├── firebase/         # Firebase configuration
├── utils/            # Utility functions
├── App.jsx           # Main application
└── App.css           # Global styles