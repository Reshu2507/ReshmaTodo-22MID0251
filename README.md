# ReshmaTodo-22MID0251

A Full Stack Multi-Page Todo Application with a React frontend, Node.js + Express backend, and file-based JSON storage.

---

## Author Details
- **Author:** Reshma
- **Registration Number:** 22MID0251

---

## Live Demo
- **Frontend:** https://YOUR_FRONTEND_URL
- **Backend API:** https://YOUR_BACKEND_URL/api

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

---

## Installation & Setup

Ensure you have **Node.js** (v16 or higher) and **npm** installed on your system.

1. Clone or copy this repository directory to your local system:
   ```bash
   C:\Users\reshm\ReshmaTodo-22MID0251
   ```

2. Run the workspace installer at the root directory to automatically fetch dependencies for both the frontend and backend projects:
   ```bash
   npm run install-all
   ```

---

## Running the Application

You can spin up both components concurrently or run them in separate terminal instances.

### Option A: Running Concurrently (Recommended)
Run the following shortcut script in the root directory:
```bash
npm run dev
```
- This runs the React client server on [http://localhost:3000](http://localhost:3000)
- This runs the Express backend server on [http://localhost:5000](http://localhost:5000)

### Option B: Running Separately

#### Running the Backend Service
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Start the server (runs on port 5000):
   ```bash
   npm start
   ```

#### Running the Frontend Client
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Start the Vite dev server (runs on port 3000):
   ```bash
   npm run dev
   ```

---

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

---

## Deployment

Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step guidance on pushing to GitHub and launching production environments.
