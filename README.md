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



---

## Setup and Installation

To get started with the backend of SkillSync, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/skillsync-backend.git
   cd skillsync-backend
2. **Install dependencies**:

   ```bash
   Ensure you have Node.js and npm installed. Then, install the required packages by running:
   npm install
3. **Configure environment variables**:

  ```bash
  Create a .env file in the root directory and add your environment variables. Example:
  MONGODB_URI=mongodb://localhost:27017/skillsync
  JWT_SECRET=your_jwt_secret_key
  PORT=5000
4. **Start the server**

  ```bash
  npm start

---


##The backend will be available at http://localhost:5000.

---

## Contributions
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. 2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add your feature here'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

---

## Contact
For questions or feedback, please reach out to:
- **Prinkal Dhingra**
-  **Vansh Dhawan**
- **Anjali Kalwar**  

# Contribution Guidelines

## Claim an Issue
- Comment on the issue to claim it.
- In case of no activity on the issue even after 2 days, the issue will be reassigned.
- If you have difficulty approaching the issue, feel free to ask on our Discord channel.

## Communication
- Whether you are working on a new feature or facing a doubt, please feel free to ask us on our Discord channel.
- We will be happy to help you out.

## Guidelines
### General
- Please help us follow best practices to make it easy for the reviewer as well as the contributor.
- We want to focus on code quality more than on managing pull request (PR) ethics.

### People Before Code
- If any of the following rules are violated, the pull requests must not be rejected. This is to create an easy and joyful onboarding process for new programmers and first-time contributors.

### Pull Request (PR) Guidelines
1. **Single Commit per PR**: Ensure there is a single commit per pull request and name the commit meaningfully. For example: `Adding <your-name> in students/mentors section`.
2. **Reference Issues**: Reference the issue numbers in the commit message if it resolves an open issue. Follow the PR template:
   ```
   Issue: <ISSUE NUMBER>
   ```
4. **Live Preview or Screenshots**: Provide a link to the live GitHub Pages from your forked repository or relevant screenshots for easier review.
5. **Inactive PRs**: Pull requests older than 3 days with no response from the contributor shall be marked closed.
6. **Issue-Linked PRs Only**: Do not make a PR that is not related to any issue. You can create an issue and solve it once approved.
7. **Avoid Duplicate PRs**: If necessary, comment on the older PR with the PR number of the follow-up (new PR) and close the obsolete PR yourself.
8. **Be Polite**: Be polite and respectful to other community members.
---

Thank you for contributing! We look forward to working with you and making this project a success.

