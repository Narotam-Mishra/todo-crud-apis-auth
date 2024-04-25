
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { server, startService } = require('../index'); 
const UserModel = require('../models/userSchema');
const Todo = require('../models/todoSchema');

// Mock UserModel and Todo model
jest.mock('../models/userSchema');
jest.mock('../models/todoSchema');

describe('Authentication and Todo APIs', () => {
  let token; // Store token for authenticated requests
  let httpServer;

  beforeAll(async () => {
    // Start the server before tests
    httpServer = await startService();
  });

  // Add afterAll hook to close the server after all tests are done
  afterAll(async () => {
    // Close the server after tests
    console.log('Closing the server...');
    await httpServer.close();
    console.log('Server closed.');
  });

  describe('User Authentication API', () => {
    it('should register a new user and return a token', async () => {
      // Mocking UserModel.create method to resolve with a user object
      UserModel.create.mockResolvedValueOnce({
        _id: 'mockUserId',
        name: 'Test User',
        createJWT: jest.fn().mockReturnValue('mocked_token')
      });

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
        .expect(StatusCodes.CREATED);

      // Assert token is returned in the response
      expect(response.body).toHaveProperty('token');
      token = response.body.token; // Store the token for future requests
    });

    it('should login a user and return a token', async () => {
      // Mocking UserModel.findOne method to resolve with a user object
      UserModel.findOne.mockResolvedValueOnce({
        _id: 'mockUserId',
        name: 'Test User',
        comparePassword: jest.fn().mockResolvedValue(true),
        createJWT: jest.fn().mockReturnValue('mocked_token')
      });

      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(StatusCodes.OK);

      // Assert token is returned in the response
      expect(response.body).toHaveProperty('token');
      token = response.body.token; // Store the token for future requests
      console.log(token);
    });
  });

  describe('Todo APIs', () => {
    let jwToken; // Declare token variable to store the bearer token
    let userId; // Declare userId variable to store the user's ID

    beforeAll(async () => {
      // Mock the user authentication process to obtain the token
      // For example, you can simulate user login and obtain the token
      
      // Mocking UserModel.findOne method to resolve with a user object
      const mockUser = {
        _id: "mockUserId",
        name: "Test User",
        email: "test@example.com", // Existing user email
        comparePassword: jest.fn().mockResolvedValue(true), // Mock comparePassword method to always resolve true
        createJWT: jest.fn().mockReturnValue("mocked_token"),
      };

      UserModel.findOne.mockResolvedValueOnce(mockUser);
      userId = mockUser._id;

      const loginResponse = await request(server)
        .post("/api/v1/auth/login")
        .send({ email: "test@example.com", password: "password123" });

        // Log the login response to check if it's successful
        console.log("Login response:", loginResponse.body);
        
        // Extract the token from the login response
        jwToken = loginResponse.body.token;
        console.log("Token:", jwToken);
    });

    // Set up authenticated request with the token
    const authenticatedRequest = (method, url) => {
      return request(server)[method](url)
        .set('Authorization', `Bearer ${jwToken}`);
    };

    it('should create a new todo', async () => {
      // Mocking Todo.create method to resolve with a todo object
      const mockTodo = { _id: 'mockTodoId', title: 'New Todo', user: userId}; // Include user ID in the todo object
      Todo.create.mockResolvedValueOnce(mockTodo);

      const response = await authenticatedRequest('post', '/api/v1/todos')
        .send({ title: 'New Todo' })
        .expect(StatusCodes.CREATED);

      // Assert todo is created
      expect(response.body).toHaveProperty('todo');
      expect(response.body.todo).toHaveProperty('_id');
      expect(response.body.todo.user).toBe(userId);
    });

    it('should get all todos with pagination and filtering', async () => {
      // Mock Todo.find method to resolve with an array of todo objects
      Todo.find.mockResolvedValueOnce([
        { _id: 'mockTodoId1', title: 'Todo 1', completed: false },
        { _id: 'mockTodoId2', title: 'Todo 2', completed: true }
      ]);

      const response = await authenticatedRequest('get', '/api/v1/todos')
        .query({ page: 1, limit: 10 })
        .expect(StatusCodes.OK);

      // Assert the response body contains the expected todo list
      expect(response.body).toHaveProperty('completedTodoList');
      expect(response.body).toHaveProperty('nonCompletedTodoList');
      expect(response.body.completedTodoList).toHaveLength(1);
      expect(response.body.nonCompletedTodoList).toHaveLength(1);
    });

    it('should get a todo by ID', async () => {
      // Mock Todo.findOne method to resolve with a todo object
      Todo.findOne.mockResolvedValueOnce({ _id: 'mockTodoId', title: 'Mock Todo' });

      const response = await authenticatedRequest('get', '/api/v1/todos/mockTodoId')
        .expect(StatusCodes.OK);

      // Assert the response body contains the expected todo
      expect(response.body).toHaveProperty('todo');
      expect(response.body.todo._id).toBe('mockTodoId');
    });

    it('should update a todo by ID', async () => {
      // Mock Todo.findOneAndUpdate method to resolve with an updated todo object
      Todo.findOneAndUpdate.mockResolvedValueOnce({ _id: 'mockTodoId', title: 'Updated Todo' });

      const response = await authenticatedRequest('put', '/api/v1/todos/mockTodoId')
        .send({ title: 'Updated Todo' })
        .expect(StatusCodes.OK);

      // Assert the response body contains the updated todo
      expect(response.body).toHaveProperty('updatedTodo');
      expect(response.body.updatedTodo.title).toBe('Updated Todo');
    });

    it('should delete a todo by ID', async () => {
      // Mock Todo.findOneAndDelete method to resolve with a deleted todo object
      Todo.findOneAndDelete.mockResolvedValueOnce({ _id: 'mockTodoId', title: 'Deleted Todo' });

      const response = await authenticatedRequest('delete', '/api/v1/todos/mockTodoId')
        .expect(StatusCodes.OK);

      // Assert the response body contains the deletion message
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Todo deleted successfully');
    });
  });
});


