# ReshmaTodo Feature Specifications

This document outlines the detailed operations and components of each capability implemented in the ReshmaTodo application.

---

## 1. Task CRUD Operations (Create, Read, Update, Delete)

- **Create (Add Task):** Users click the "Add New Task" button on the dashboard to open a modal form. Submitting the form triggers a server request to persist the new todo in `todos.json`.
- **Read (Inspect Details):** Clicking on any card's title navigates the user to a dedicated details view (`/todo?id=<id>`). This view fetches parameters for that specific task and displays its full description, priority, category, exact creation timestamp, last updated timestamp, and due date.
- **Update (Edit Task):** Users can modify all properties of a task via the edit icon on the card, which opens the form populated with the task's current data.
- **Delete Task:** Clicking the delete icon prompts the user with a native browser confirmation modal (`window.confirm`) to prevent accidental deletion. Upon approval, the client makes a `DELETE` request, and the dashboard is updated.

---

## 2. Advanced Search

- Users can type keywords into the dashboard's search bar.
- The filtering matches the entered search queries against **both the title and description** of each task, performing case-insensitive matching dynamically as the user types.

---

## 3. Dynamic Filters

- **Filter by Status:** Filters tasks to show either all tasks, only pending tasks, or only completed tasks.
- **Filter by Priority:** Narrows down tasks based on their priority level (`low`, `medium`, or `high`).
- **Filter by Category:** Dynamically displays categories extracted from the current active todos in storage. Selecting a category filters the dashboard view to display only matching tasks.

---

## 4. Multi-Criteria Sorting

Users can sort the list of tasks using the following options:
- **Newest Created / Oldest Created:** Sorts tasks chronologically using the `createdAt` timestamp.
- **Due Date (Soonest / Latest):** Sorts tasks based on the `dueDate`. Tasks without due dates are pushed to the end of the list.
- **Title (A-Z / Z-A):** Alphabetically sorts tasks using their titles.

---

## 5. Input Validation

### Client-Side Validation
- Enforced inside `TodoForm.jsx` before submitting data to the API:
  - **Title:** Checked for presence and whitespace. Maximum character length is capped at 100 characters.
  - **Description:** Capped at 500 characters.
  - **Category:** Required and must be non-empty.
  - **Due Date:** Validated to ensure it is a valid date input.

### Server-Side Validation
- Enforced inside `server/models/todoModel.js` to protect storage integrity:
  - Validates that title and category fields are provided and non-empty.
  - Validates that priority is one of `low`, `medium`, or `high`.
  - Validates that status is either `pending` or `completed`.
  - Rejects malformed dates for the `dueDate` property.
  - Returns a detailed `400 Bad Request` JSON error response to the client.

---

## 6. Toast Notifications

- Standardized feedback prompts appear at the bottom-right corner of the dashboard to notify the user of key operations (e.g. creating, updating, toggling status, or deleting tasks).
- Toast messages automatically fade away after 4 seconds and are color-coded (green for success, red for errors, and blue for info).

---

## 7. Responsive Layout and Aesthetics

- **Soft Color Palette:** Built using Slate colors (`#0f172a`, `#1e293b`) for the background, complemented by modern indigo accents (`#6366f1`).
- **Gradient Headers:** Modern headers and nav menus are styled with smooth dark purple/indigo gradients.
- **Rounded Corners:** Consistent `12px` border-radius application for cards, inputs, buttons, and modal dialogs.
- **Animations:** Smooth CSS transitions for button hovers, card lifting shadows, and overlay fades.
- **Mobile-Responsive CSS Grid:** The dashboard uses CSS grid auto-fit layout, adjusting from a single column on mobile screens to multi-column structures on tablet and desktop monitors.
