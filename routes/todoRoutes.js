
const express = require('express');
const router = express.Router()

const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodoById,
  deleteTodoById,
} = require("../controllers/todoController");

router.route("/").post(createTodo).get(getAllTodos);
router.route("/:id").get(getTodoById).patch(updateTodoById).delete(deleteTodoById);


module.exports = router;