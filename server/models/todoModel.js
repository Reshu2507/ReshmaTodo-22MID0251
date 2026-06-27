const fileHandler = require('../utils/fileHandler');

const validateTodo = (data, isUpdate = false) => {
  const errors = [];
  const { title, status, priority, category, dueDate } = data;

  if (!isUpdate || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.push('Title is required and must be a non-empty string.');
    }
  }

  if (status !== undefined) {
    if (status !== 'completed' && status !== 'pending') {
      errors.push('Status must be either "completed" or "pending".');
    }
  }

  if (priority !== undefined) {
    if (priority !== 'low' && priority !== 'medium' && priority !== 'high') {
      errors.push('Priority must be "low", "medium", or "high".');
    }
  }

  if (category !== undefined) {
    if (!category || typeof category !== 'string' || category.trim() === '') {
      errors.push('Category must be a non-empty string.');
    }
  }

  if (dueDate !== undefined) {
    if (dueDate && isNaN(Date.parse(dueDate))) {
      errors.push('Due date must be a valid date format.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const TodoModel = {
  async getAll() {
    return await fileHandler.readTodosFromFile();
  },

  async getById(id) {
    const todos = await this.getAll();
    return todos.find(todo => String(todo.id) === String(id));
  },

  async create(data) {
    const { isValid, errors } = validateTodo(data);
    if (!isValid) {
      throw new Error(errors.join(' '));
    }

    const todos = await this.getAll();
    const newTodo = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      category: data.category || 'personal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null
    };

    todos.push(newTodo);
    await fileHandler.writeTodosToFile(todos);
    return newTodo;
  },

  async update(id, data) {
    const { isValid, errors } = validateTodo(data, true);
    if (!isValid) {
      throw new Error(errors.join(' '));
    }

    const todos = await this.getAll();
    const index = todos.findIndex(todo => String(todo.id) === String(id));

    if (index === -1) {
      return null;
    }

    const existingTodo = todos[index];
    const updatedTodo = {
      ...existingTodo,
      title: data.title !== undefined ? data.title.trim() : existingTodo.title,
      description: data.description !== undefined ? data.description.trim() : existingTodo.description,
      status: data.status !== undefined ? data.status : existingTodo.status,
      priority: data.priority !== undefined ? data.priority : existingTodo.priority,
      category: data.category !== undefined ? data.category : existingTodo.category,
      dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate).toISOString() : null) : existingTodo.dueDate,
      updatedAt: new Date().toISOString()
    };

    todos[index] = updatedTodo;
    await fileHandler.writeTodosToFile(todos);
    return updatedTodo;
  },

  async delete(id) {
    const todos = await this.getAll();
    const index = todos.findIndex(todo => String(todo.id) === String(id));

    if (index === -1) {
      return false;
    }

    todos.splice(index, 1);
    await fileHandler.writeTodosToFile(todos);
    return true;
  }
};

module.exports = TodoModel;
