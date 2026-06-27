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
- **Clickable Completed Tasks page:** Dedicated view displaying only completed tasks.
- **Clickable Pending Tasks page:** Dedicated view displaying only pending tasks.
- **Clickable Progress Dashboard page:** Displays task statistics and a visual completion progress bar.
- **Priority Star Indicator on every task:** Stars indicating low (outlined), medium (orange), and high (gold) priority.
- **Progress Bar with completion statistics:** Visually represents the overall completion progress of tasks.

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

---

## Screenshots

*(Screenshots can be saved inside the `screenshots/` directory)*

- **Dashboard View:** Shows the statistics panel, filter controls, search bar, and todo list cards.
- **Details View:** Accessing `/todo?id=<id>` displays full detail inspect views.
- **About View:** Displays information about the application structure and creator identity.

