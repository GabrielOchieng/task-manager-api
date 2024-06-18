This repository contains the backend code for a task management website built using the MERN stack (MongoDB, Express, React, Node.js) with authentication and authorization functionalities.

This repository focuses on the server-side logic and data management aspects of the web application.

Features:
User Authentication: Handles user registration, login, and JWT token generation for secure access.
Authorization: Implements role-based access control to restrict or grant users specific permissions based on their roles.
Task Management API: Provides RESTful API endpoints for creating, reading, updating, and deleting tasks.
Data Storage: Utilizes MongoDB to store user data and task information.
Technologies Used:
Node.js: (https://nodejs.org/) - The JavaScript runtime environment for building the server-side application.
Express.js: (https://expressjs.com/) - A lightweight web framework for creating robust and scalable APIs.
Mongoose: (https://mongoosejs.com/) - An ODM (Object Data Modeling) library for interacting with MongoDB from Node.js.
JWT (JSON Web Token): (https://jwt.io/introduction) - Used for secure authentication by creating and verifying tokens upon successful login.
Database (MongoDB): (https://www.mongodb.com/) - A NoSQL document-oriented database for storing user and task data.
Integration:

This backend API serves as the data source for the frontend application (separate repository). The frontend interacts with this API using libraries like Axios to fetch, create, update, and delete tasks.

Development Setup:
Clone the repository: Clone this repository to your local machine using git clone https://<your_github_username>@github.com/<your_repository_name>.git.
Install dependencies: Navigate to the project directory and run npm install to install all required dependencies.
Environment Variables: Create a .env file in the root directory and set environment variables for database connection, secret keys, and other configuration details.
Development Server: Run npm run dev:backend to start the backend server.

Note:

This backend API is designed to work alongside the frontend application (separate repository) for a complete user experience
