const TodoModel = require('../models/todoModel');

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.getAll();
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Public
const getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoModel.getById(req.params.id);
    if (!todo) {
      res.status(404);
      throw new Error(`Todo with ID ${req.params.id} not found`);
    }
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Public
const createTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.create(req.body);
    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Update existing todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.update(req.params.id, req.body);
    if (!todo) {
      res.status(404);
      throw new Error(`Todo with ID ${req.params.id} not found`);
    }
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, res, next) => {
  try {
    const success = await TodoModel.delete(req.params.id);
    if (!success) {
      res.status(404);
      throw new Error(`Todo with ID ${req.params.id} not found`);
    }
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
