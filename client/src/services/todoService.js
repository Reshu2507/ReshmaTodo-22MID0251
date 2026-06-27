const API = import.meta.env.VITE_API_URL;

// Helper to handle response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || 'Something went wrong';
    throw new Error(errorMsg);
  }
  return data;
};

export const todoService = {
  // Get all todos
  async getTodos() {
    try {
      const response = await fetch(`${API}/todos`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get a single todo by ID
  async getTodoById(id) {
    try {
      const response = await fetch(`${API}/todos/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching todo with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new todo
  async createTodo(todoData) {
    try {
      const response = await fetch(`${API}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update a todo (including marking complete/pending)
  async updateTodo(id, todoData) {
    try {
      const response = await fetch(`${API}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a todo
  async deleteTodo(id) {
    try {
      const response = await fetch(`${API}/todos/${id}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting todo with ID ${id}:`, error);
      throw error;
    }
  }
};

