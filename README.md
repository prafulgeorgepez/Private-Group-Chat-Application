# Private Group Chat Snippet

This project is a simple, full-stack private group chat application built with the MERN stack (MongoDB, Express.js, Node.js, and React). It allows users to register, log in, create private chat rooms, and exchange messages in real-time (simulated with polling). **The frontend for this application is currently under development.**

## Features

* **User Authentication:** Secure registration and login using JWT for authentication and bcrypt for password hashing.
* **Private Chat Rooms:** Users can create and view a list of available private chat rooms.
* **Real-time Messaging (Simulated):** Users can send and receive messages within specific chat rooms with updates fetched periodically.
* **RESTful API:** A well-structured API for managing users, rooms, and messages.

## Technologies Used

* **Backend:**
    * Node.js
    * Express.js
    * MongoDB
    * Mongoose (for MongoDB object modeling)
    * jsonwebtoken (for JWT authentication)
    * bcrypt (for password hashing)
* **Frontend:**
    * React (**Under Development**)

## Setup Instructions

While this README provides a general overview, specific setup instructions for running the backend and frontend locally would typically be included here if the project were being shared. This would involve steps like:

1.  **Cloning the repository** (if it were public).
2.  **Navigating to the backend and frontend directories.**
3.  **Installing dependencies** using `npm install` or `yarn install`.
4.  **Setting up environment variables** (e.g., MongoDB connection URI, JWT secret).
5.  **Running the backend server** (e.g., `npm start`).
6.  **Running the frontend development server** (e.g., `npm start`).

Since this is a conceptual README based on our development process, these detailed steps are omitted.

## API Endpoints (Backend)

A brief overview of the key backend API endpoints:

* `POST /users`: Register a new user.
* `POST /login`: Log in an existing user and receive a JWT.
* `GET /rooms`: Get a list of all chat rooms (requires authentication via JWT).
* `POST /rooms`: Create a new chat room (requires authentication via JWT).
* `POST /rooms/:roomId/messages`: Send a new message to a specific room (requires authentication via JWT).
* `GET /rooms/:roomId/messages`: Get messages for a specific room (requires authentication via JWT).

## Frontend Structure (Conceptual - Under Development)

A basic idea of the React frontend structure (subject to change during development):

* `components/`: Contains reusable UI components (e.g., RegistrationForm, LoginForm, RoomList, ChatWindow, MessageInput, Message).
* `pages/`: Contains the main application views (e.g., AuthPage, ChatPage).
* `services/`: Likely contains functions for making API calls to the backend.
* `App.js`: The main application entry point, handling routing and global state.

## Further Development (Potential Enhancements)

* Implement true real-time communication using WebSockets instead of polling.
* Add features like user presence indicators.
* Implement private messaging between users.
* Enhance UI/UX and styling.
* Add unit and integration tests.
