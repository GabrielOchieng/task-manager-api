This repository contains the backend code for a task management website built using the MERN stack (MongoDB, Express, React, Node.js) with authentication and authorization functionalities.

This repository focuses on the server-side logic and data management aspects of the web application.

<h1>Features:</h1>

<h3>User Authentication:</h3> Handles user registration, login, and JWT token generation for secure access.

<h3>Authorization:</h3> Implements role-based access control to restrict or grant users specific permissions based on their roles.

<h3>Task Management API:</h3> Provides RESTful API endpoints for creating, reading, updating, and deleting tasks.
Data Storage: Utilizes MongoDB to store user data and task information including their departments and assigned users.

<h3>Technologies Used: </h3>

<h3>Node.js:</h3> (https://nodejs.org/) - The JavaScript runtime environment for building the server-side application.
<h3>Express.js:</h3> (https://expressjs.com/) - A lightweight web framework for creating robust and scalable APIs.
<h3>Mongoose:</h3> (https://mongoosejs.com/) - An ODM (Object Data Modeling) library for interacting with MongoDB from Node.js.
<h3>JWT (JSON Web Token):</h3> (https://jwt.io/introduction) - Used for secure authentication by creating and verifying tokens upon successful login.
<h3>Database (MongoDB):</h3> (https://www.mongodb.com/) - A NoSQL document-oriented database for storing user and task data.

<h3></h3>

<h3>Integration:</h3>

This backend API serves as the data source for the frontend application (https://github.com/GabrielOchieng/task-manager.git). The frontend interacts with this API using libraries like Axios to fetch, create, update, and delete tasks and departments.

<h3>Development Setup:</h3>

<h3>Clone the repository:</h3> Clone this repository to your local machine using git clone https://github.com/GabrielOchieng/task-manager-api.git 
<h3>Install dependencies:</h3> Navigate to the project directory and run npm install to install all required dependencies.
<h3>Environment Variables:</h3> Create a .env file in the root directory and set environment variables for database connection, secret keys, and other configuration details.
<h3>Development Server:</h3> Run npm run dev or node server.js to start the backend server.

<h3>Note:</h3>

This backend API is designed to work alongside the frontend application (https://github.com/GabrielOchieng/task-manager.git) for a complete user experience.
