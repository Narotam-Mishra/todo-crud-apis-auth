
const Todo = require('../models/todoSchema');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

// CRUD REST APIs to manage Todo List

//C - Create a todo
const createTodo = async (req, res) => {
    const todo = await Todo.create(req.body);
    res.status(StatusCodes.CREATED).json({ todo });
};

//R - Get all todos with pagination and filtering
const getAllTodos = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.completed) {
      filter.completed = req.query.completed === "true";
    }

    const todos = await Todo.find(filter).skip(skip).limit(limit);
    const total = await Todo.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: todos,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//R - Get single todo by id
const getTodoById = async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  if (!todo) {
    throw new NotFoundError(`No todo with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ todo });
};

// Update todo by id
const updateTodoById = async (req, res) => {
  const {
    body: { title }
  } = req;

  const { id } = req.params;

  if (title === "" || title === undefined) {
    throw new BadRequestError("Title cannot be empty!!");
  }

  const todo = await Todo.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!todo) {
    throw new NotFoundError(`No todo with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ todo });
};

// Delete todo by id
const deleteTodoById = async (req, res) => {
  const { id } = req.params;

  const deletedTodo = await Todo.findByIdAndDelete(id);
  if (!deletedTodo) {
    throw new NotFoundError(`No todo with id ${id}`);
  }
  res.status(StatusCodes.OK).json("Todo deleted successfully");
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodoById,
  deleteTodoById,
};