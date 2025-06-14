<h1 align="center">
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/agile/agile.png" width="48" />
  Orbit - Agile Task Management
</h1>

<p align="center">
  <b>Modern, collaborative, and beautiful Agile project management for teams 🚀</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-4-black?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-6-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-live-brightgreen?logo=socket.io" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
</p>

---

## 🌟 Overview

Orbit is a full-stack Agile Task Management platform designed for modern teams.  
It combines a beautiful UI, real-time collaboration, and powerful features to help you plan, track, and deliver projects efficiently.

---

## ✨ Features

- **🧑‍🤝‍🧑 Workspaces & Projects:** Organize your work into workspaces, each with multiple projects.
- **📋 Kanban Boards:** Drag-and-drop tasks across customizable columns.
- **🌓 Dark & Light Mode:** Gorgeous UI that adapts to your preference.
- **🔗 Real-time Collaboration:** Live comments and updates via Socket.IO.
- **🔒 Authentication:** Secure sign up, sign in, and email verification.
- **📧 Email Invites:** Invite members to workspaces via email or shareable link.
- **👥 Roles & Permissions:** Owner, Admin, Member, Viewer roles for granular control.
- **🎨 Customization:** Change workspace name, color, description, and theme.
- **🗑️ Danger Zone:** Delete workspace or transfer ownership safely.
- **📝 Task Management:** Assign, prioritize, and comment on tasks.
- **📊 Progress Tracking:** Visual progress bars for projects and tasks.
- **🔔 Activity Feed:** See who did what and when.
- **⚡ Fast & Responsive:** Built with React, Tailwind CSS, and modern best practices.

---

## 📸 Screenshots

<p align="center">
  <img src="https://user-images.githubusercontent.com/6190356/273420237-8e7e2c6e-2e8c-4b2e-9e3b-2e2e6e7e2e2e.png" width="700" alt="Dashboard" />
  <br>
  <i>Dashboard - Kanban Board</i>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/6190356/273420238-9e7e2c6e-2e8c-4b2e-9e3b-2e2e6e7e2e2e.png" width="700" alt="Workspace Settings" />
  <br>
  <i>Workspace Settings - Customization & Members</i>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/6190356/273420239-ae7e2c6e-2e8c-4b2e-9e3b-2e2e6e7e2e2e.png" width="700" alt="Dark Mode" />
  <br>
  <i>Dark Mode - Beautiful and Accessible</i>
</p>

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sachin-fsd/orbit-agile-task-management.git
cd orbit-agile-task-management
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

- Copy `.env.example` to `.env` in both `backend` and `frontend` folders.
- Fill in your MongoDB URI, JWT secret, email credentials, and frontend URL.

### 4. Run the app

```bash
# In one terminal (backend)
cd backend
npm run dev

# In another terminal (frontend)
cd ../frontend
npm run dev
```

- Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Query, Socket.IO-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO
- **Auth:** JWT, bcrypt, email verification
- **Email:** Nodemailer (Gmail/SMTP)
- **Real-time:** Socket.IO for live comments and updates

---

## 🧩 Project Structure

```
/frontend
  /app
    /components
    /hooks
    /routes
    /provider
  ...
/backend
  /controllers
  /models
  /routes
  /libs
  ...
```

---

## 📝 API Highlights

- `POST /api-v1/auth/register` - Register a new user
- `POST /api-v1/auth/login` - Login
- `POST /api-v1/workspaces` - Create workspace
- `PUT /api-v1/workspaces/:id` - Update workspace
- `POST /api-v1/workspaces/:id/invite-member` - Invite member
- `POST /api-v1/projects` - Create project
- `POST /api-v1/tasks` - Create task
- `POST /api-v1/tasks/:id/comments` - Add comment (real-time)
- ...and many more!

---

## 💡 Customization

- Change workspace color, name, description, and theme in **Settings**.
- Invite members as **admin**, **member**, or **viewer**.
- Switch between **dark** and **light** mode anytime.

---

## 🤝 Contributing

Contributions are welcome!  
Please open issues or pull requests for improvements, bug fixes, or new features.

---

## 📬 Contact

- [GitHub Issues](https://github.com/yourusername/orbit-agile-task-management/issues)
- Email: your@email.com

---

<p align="center">
  <b>Made with ❤️ for Agile teams</b>
</p>