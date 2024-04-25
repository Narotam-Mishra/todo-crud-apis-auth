
const Todo = require('../models/todoSchema');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

// CRUD REST APIs to manage Todo List

//C - Create a todo
const createTodo = async (req, res) => {
  try {
    // Use req.user from authentication middleware to get user ID
    req.body.userId = req.user.userId;

    const todo = await Todo.create(req.body);
    res.status(StatusCodes.CREATED).json({ todo });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

//R - Get all todos with pagination and filtering
const getAllTodos = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch all todos without filtering
    const allTodos = await Todo.find({ userId: req.user.userId }).skip(skip).limit(limit);

    // Separate completed and non-completed todos
    const completedTodos = allTodos.filter(todo => todo.completed);
    const nonCompletedTodos = allTodos.filter(todo => !todo.completed);

    // Count total completed and non-completed todos
    const completedTotal = completedTodos.length;
    const nonCompletedTotal = nonCompletedTodos.length;

    // Display completed and non-completed todos separately in response
    res.json({
      page,
      limit,
      completedTotal,
      completedTotalPages: Math.ceil(completedTotal / limit),
      completedTodoList: completedTodos,
      nonCompletedTotal,
      nonCompletedTotalPages: Math.ceil(nonCompletedTotal / limit),
      nonCompletedTodoList: nonCompletedTodos,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//R - Get single todo by id
const getTodoById = async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, userId: req.user.userId });
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

  const updatedTodo = await Todo.findOneAndUpdate({ _id: id, userId: req.user.userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTodo) {
    throw new NotFoundError(`No todo with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ updatedTodo });
};

// Delete todo by id
const deleteTodoById = async (req, res) => {
  const { id } = req.params;

  const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId: req.user.userId });
  if (!deletedTodo) {
    throw new NotFoundError(`No todo with id ${id}`);
  }
  res.status(StatusCodes.OK).json({message:"Todo deleted successfully"});
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodoById,
  deleteTodoById,
};