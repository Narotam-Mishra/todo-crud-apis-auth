
## [todo-crud-apis-with-auth](https://todo-crud-apis-with-auth.onrender.com/)

### Setup
- Started by initializing a new Node.js project and installing Express.js to create your backend server. You can use npm init to initialize your project and npm install express to install Express.js.

- To start and run the Server use this command ```npm install && npm run dev```

- To test the app use this command  ```npm test```

### Implement CRUD Operations for Todo Items
- Created routes for CRUD operations (Create, Read, Update, Delete) for managing todo items.

- Implemented corresponding controller functions to handle these operations.

### User Authentication (JWT-based)
- Implemented user authentication middleware using JWT (JSON Web Tokens).

- Created routes for user registration and login,

- Utilized JWT to generate tokens upon successful authentication and verify tokens on protected routes.

### Node.js with Express.js for API Development
- Set up a Node.js project and install Express.js.

- Defined routes, middleware, and controllers to handle API requests.

### Routers
- [authRoutes.js]
- [todoRoutes.js]

### Models
- [todoSchema.js]
- [userSchema.js]

### Middlewares
- [authentication.js]
- [error-hanler.js]
- [not-found.js]

### Controllers
- [auth.js]
- [todoController.js]

### Integrated API with Database
- Choosen a Mongo Database to store data
- Set up a connection to the chosen database MongoDB using a suitable Node.js library using Mongoose for MongoDB.
- Defined database models for storing todo items and user information.

### Implemented CRUD APIs with authentication for todo items (todoController.js & auth.js)

#### Created endpoints to perform authentication for user.
- [RegisterUser](https://todo-crud-apis-with-auth.onrender.com/api/v1/auth/register)
- [LoginUser](https://todo-crud-apis-with-auth.onrender.com/api/v1/auth/login)

#### Created endpoints for performing CRUD operations on todo items. Defined routes for creating, reading, updating, and deleting todo-items, and implemented corresponding controller functions to handle these operations.
- [CreateTodoItem](https://todo-crud-apis-with-auth.onrender.com/api/v1/todos/)
- [GetAllTodotems](https://todo-crud-apis-with-auth.onrender.com/api/v1/todos)
- [GetSingleTodoItem](https://todo-crud-apis-with-auth.onrender.com/v1/todos/662a454e18195f90f990c097)
- [UpdateTodoItem](https://todo-crud-apis-with-auth.onrender.com/api/v1/todos/662a454e18195f90f990c097)
- [DeleteTodoItem](https://todo-crud-apis-with-auth.onrender.com/api/v1/todos/662a454e18195f90f990c097)

### Written Test Cases Using Jest
- Written unit tests and integration tests for API endpoints using Jest.
- Mocked dependencies such as database operations and external services.
- Tested authentication flows, CRUD operations, error handling, and edge cases.

### Tested all Auth and Todo APIs using Postman
- [Postman Collection Link](https://schema.getpostman.com/json/collection/v2.1.0/collection.json)

### Dockerized the Application
- Written a Dockerfile to define the application's environment and dependencies.
- Build a Docker image for the application.

### Configured CI/CD Pipelines
- Set up Continuous Integration (CI) pipelines to automate testing.
- Used a CI/CD platform (e.g., GitHub Actions) to trigger builds and tests on code changes.
- Configured deployment pipelines to deploy the application to staging and production environments.

### Secured Storage of User Credentials and Tokens
- Hashed user passwords before storing them in the database using a strong hashing algorithm (e.g., bcrypt).
- Stored JWT secret securely and rotate it periodically.

### Implemented Pagination and Filtering Options
- Added pagination and filtering parameters to relevant API endpoints.
- Implemented logic to paginate through large datasets and filter results based on criteria provided in the request.

### Documented API Endpoints
- [Docgen Library](https://github.com/thedevsaddam/docgen)
- Export Postman Collection
- Make sure the postman's collection and windows_amd64.exe should reside in same folder 
- Run below command using command prompt
- windows_amd64 build -i todo_crud-apis-auth.postman_collection.json -o index.html
- A index.html file will be generated then place place that file under public folder
- Use this code to host static html file ```server.use(express.static('./public'));```

# Deployed the backend app on Render
- [Link](https://todo-crud-apis-with-auth.onrender.com/)
