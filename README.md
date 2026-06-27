# ReshmaTodo-22MID0251

A Full Stack Multi-Page Todo Application with a React frontend, Node.js + Express backend, and file-based JSON storage.

---

## Author Details
- **Author:** Reshma
- **Registration Number:** 22MID0251

---

## Live Demo
- **Frontend:** https://reshma-todo-22-mid-0251-o664.vercel.app/
- **Backend API:** https://reshmatodo-22mid0251.onrender.com/api

---

## Features
- **Full CRUD operations:** Create, read, update, and delete tasks.
- **Toggle Status:** Mark tasks as "completed" or "pending" directly from the dashboard or inspect details page.
- **Search:** Search across titles and descriptions dynamically.
- **Filters:** Filter tasks by Status (Pending/Completed), Priority (Low/Medium/High), and Category.
- **Sorting:** Sort dynamically by Creation Date, Due Date, or Alphabetical title.
- **Visual Statistics:** Real-time summary metrics showing Total, Completed, Pending tasks, and Progress percentage.
- **Detail Inspection Page:** Dedicated sub-page path `/todo?id=<id>` displaying all properties of a task.
- **Form Validation:** Validates form inputs on both client and server side.
- **Responsive Layout:** CSS media queries optimized for mobile, tablet, and desktop interfaces.

---

## New Features

### Priority Rating System
- **3-Star Priority System:** Stars indicateLow Priority (★☆☆), Medium Priority (★★☆), and High Priority (★★★) with color-coded fills and hovering tooltips.
- Indicators appear in the top-right corner of each card and next to the title on the Task Details page.

### Timeline (Gantt Chart)
- **Interactive Project Timeline:** Horizontal Gantt chart on the main dashboard showing tasks, their start and due dates, completion statuses, and current day marker line.
- Sorting is automatically adjusted to prioritize tasks approaching deadlines first.

### Calendar View
- **Monthly Calendar Planner:** Displays tasks on their due dates inside a grid under `/calendar` route, color-coded by priority and completion status.

### XP System
- **Gamified Tasks:** Completing a task rewards the user with `+10 XP` instantly. Total XP persists and is displayed in the dashboard header.

### Daily Streak
- **Streak Tracker:** Tracks consecutive days on which the user completed at least one task, showing a flame indicator (`🔥 X Day Streak`).

### Upcoming Deadlines & Analytics
- **Deadline Highlights:** Coded visual highlights for cards:
  - 0–2 days remaining: Red border and warning icon
  - 3–5 days remaining: Orange border
  - Overdue tasks: Highlights text `⚠ Overdue` with red warnings
- **Analytics Widgets:** Highlights the next five upcoming deadlines, shows recent CRUD activity logs, and counts overdue, highest priority, and daily/weekly tasks.

---

## Folder Structure

```
ReshmaTodo-22MID0251/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TodoCard.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoDetails.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── About.jsx
│   │   ├── services/
│   │   │   └── todoService.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Todo.css
│   │   │   └── Details.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── controllers/
│   │   └── todoController.js
│   ├── routes/
│   │   └── todoRoutes.js
│   ├── models/
│   │   └── todoModel.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── fileHandler.js
│   ├── data/
│   │   └── todos.json
│   ├── app.js
│   ├── package.json
│   └── .env.example
├── screenshots/
├── README.md
├── API.md
├── FEATURES.md
├── DEPLOYMENT.md
├── LICENSE
├── .gitignore
└── package.json
```

## API Summary

All endpoints are prefixed with `/api/todos`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/todos` | Retrieve all todo items. |
| **GET** | `/api/todos/:id` | Retrieve detailed properties of a specific todo item by ID. |
| **POST** | `/api/todos` | Add a new todo item. |
| **PUT** | `/api/todos/:id` | Update properties of a specific todo item. |
| **DELETE** | `/api/todos/:id` | Delete a specific todo item. |

Refer to [API.md](API.md) for full request/response payloads.



