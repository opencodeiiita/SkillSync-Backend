# SkillSync Backend

Welcome to the backend of **SkillSync**, a collaborative skill-sharing platform where users can exchange skills through time-bound sessions. This repository contains the server-side code for handling user profiles, session scheduling, notifications, and other core functionalities.

## Features

The backend powers the following features of SkillSync:
- **User Profiles:** Dynamic profile creation, skill tags, portfolio, and bio.
- **Session Scheduling:** Integrated calendar for booking and managing skill exchange sessions.
- **Interactive Dashboard:** Track completed sessions, progress, and user activity.
- **Community Forum:** Discussion threads for users to share experiences or ask for advice.
- **Gamification:** Badge system and leaderboard to reward active users.
- **Notifications:** Real-time updates and reminders for sessions.

## Tech Stack

- **Frontend:** React (or Next.js), Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Real-Time Features:** Socket.IO (for notifications)
- **Deployment:**
  - Frontend: Vercel
  - Backend: Railway

## Folder Structure

skillsync-backend/
│
├── config/                     # Database & auth configuration
│   └── db.js                  # MongoDB connection
│   └── auth.js                # JWT auth configuration
│
├── controllers/                # Logic for routes
│   └── authController.js       # Handle authentication logic
│   └── dashboardController.js  # Dashboard-related logic
│   └── forumController.js      # Forum logic
│   └── sessionController.js    # Session booking logic
│   └── userController.js       # User profile logic
│
├── middleware/                 # Middleware for error handling & auth
│   └── authMiddleware.js       # Auth logic for route protection
│   └── errorMiddleware.js      # Error handling logic
│
├── models/                     # Database models
│   └── Forum.js               # Forum model
│   └── Payment.js             # Payment model
│   └── Session.js             # Session model
│   └── User.js                # User model
│
├── routes/                     # API routes
│   └── authRoutes.js          # Routes for authentication
│   └── dashboardRoutes.js     # Dashboard routes
│   └── forumRoutes.js         # Forum routes
│   └── sessionRoutes.js       # Session routes
│   └── userRoutes.js          # User-related routes
│
├── services/                   # External services or logic
│   └── aiRecommendation.js    # AI recommendation logic
│   └── paymentService.js      # Handles payment gateway logic
│
├── server.js                   # Entry point for the backend server
└── README.md                   # Project documentation


