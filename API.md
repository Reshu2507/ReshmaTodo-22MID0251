# ReshmaTodo API Documentation

This document describes the REST API endpoints provided by the backend service. All requests and responses exchange data in JSON format.

---

## Base URL
```
http://localhost:5000/api/todos
```
*(When running Vite locally, requests to `/api` are automatically proxied to the backend, so you can call `/api/todos` directly from the client).*

---

## Todo Object Structure

Each todo resource contains the following fields:

| Field | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `id` | String | Unique auto-generated string identifier. | Read-Only |
| `title` | String | Title or title summary of the task (Max: 100 chars). | Yes |
| `description` | String | Detailed description of the task (Max: 500 chars). | No |
| `status` | String | Current status. Must be `"pending"` or `"completed"`. | No (Default: `"pending"`) |
| `priority` | String | Priority classification. Must be `"low"`, `"medium"`, or `"high"`. | No (Default: `"medium"`) |
| `category` | String | Arbitrary category group (e.g., `"Work"`, `"Shopping"`). | Yes |
| `createdAt` | String | ISO-8601 creation timestamp. | Read-Only |
| `updatedAt` | String | ISO-8601 last update timestamp. | Read-Only |
| `dueDate` | String | ISO-8601 deadline date limit. | No |

---

## Endpoints

### 1. Get All Todos
Retrieves all todo items stored in the system.

- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`
  - **Payload:**
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "id": "t1",
          "title": "Complete Design Documentation",
          "description": "Write and format the technical details of the Todo Application project.",
          "status": "completed",
          "priority": "high",
          "category": "Work",
          "createdAt": "2026-06-25T10:00:00.000Z",
          "updatedAt": "2026-06-25T14:30:00.000Z",
          "dueDate": "2026-06-28T18:00:00.000Z"
        },
        {
          "id": "t2",
          "title": "Buy Groceries",
          "description": "Stock up on vegetables, milk, bread, eggs, and coffee beans.",
          "status": "pending",
          "priority": "medium",
          "category": "Shopping",
          "createdAt": "2026-06-26T08:00:00.000Z",
          "updatedAt": "2026-06-26T08:00:00.000Z",
          "dueDate": "2026-06-27T22:00:00.000Z"
        }
      ]
    }
    ```

---

### 2. Get Todo by ID
Retrieves the full property sheet of a single task.

- **URL:** `/:id`
- **Method:** `GET`
- **URL Params:** `id=[string]`
- **Success Response:**
  - **Code:** `200 OK`
  - **Payload:**
    ```json
    {
      "success": true,
      "data": {
        "id": "t2",
        "title": "Buy Groceries",
        "description": "Stock up on vegetables, milk, bread, eggs, and coffee beans.",
        "status": "pending",
        "priority": "medium",
        "category": "Shopping",
        "createdAt": "2026-06-26T08:00:00.000Z",
        "updatedAt": "2026-06-26T08:00:00.000Z",
        "dueDate": "2026-06-27T22:00:00.000Z"
      }
    }
    ```
- **Error Responses:**
  - **Code:** `404 NOT FOUND` (When the ID does not match any existing item)
  - **Payload:**
    ```json
    {
      "success": false,
      "message": "Todo with ID t100 not found"
    }
    ```

---

### 3. Create Todo
Registers a new todo item.

- **URL:** `/`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
    ```json
    {
      "title": "Book Flight Tickets",
      "description": "Book return flights to Chicago for the upcoming business seminar.",
      "priority": "high",
      "category": "Work",
      "dueDate": "2026-07-15T00:00:00.000Z"
    }
    ```
- **Success Response:**
  - **Code:** `201 CREATED`
  - **Payload:**
    ```json
    {
      "success": true,
      "data": {
        "id": "jq4m8a",
        "title": "Book Flight Tickets",
        "description": "Book return flights to Chicago for the upcoming business seminar.",
        "status": "pending",
        "priority": "high",
        "category": "Work",
        "createdAt": "2026-06-27T07:20:15.123Z",
        "updatedAt": "2026-06-27T07:20:15.123Z",
        "dueDate": "2026-07-15T00:00:00.000Z"
      }
    }
    ```
- **Error Responses:**
  - **Code:** `400 BAD REQUEST` (When parameters fail schema validation)
  - **Payload:**
    ```json
    {
      "success": false,
      "message": "Title is required and must be a non-empty string."
    }
    ```

---

### 4. Update Todo
Updates one or more editable properties of an existing todo.

- **URL:** `/:id`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **URL Params:** `id=[string]`
- **Request Body:** (Pass only fields you wish to modify)
    ```json
    {
      "status": "completed",
      "priority": "medium"
    }
    ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Payload:**
    ```json
    {
      "success": true,
      "data": {
        "id": "jq4m8a",
        "title": "Book Flight Tickets",
        "description": "Book return flights to Chicago for the upcoming business seminar.",
        "status": "completed",
        "priority": "medium",
        "createdAt": "2026-06-27T07:20:15.123Z",
        "updatedAt": "2026-06-27T07:22:40.456Z",
        "dueDate": "2026-07-15T00:00:00.000Z"
      }
    }
    ```
- **Error Responses:**
  - **Code:** `404 NOT FOUND` or `400 BAD REQUEST`

---

### 5. Delete Todo
Removes a todo item from storage.

- **URL:** `/:id`
- **Method:** `DELETE`
- **URL Params:** `id=[string]`
- **Success Response:**
  - **Code:** `200 OK`
  - **Payload:**
    ```json
    {
      "success": true,
      "message": "Todo deleted successfully"
    }
    ```
- **Error Responses:**
  - **Code:** `404 NOT FOUND`
