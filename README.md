# Spy Gadget Management API

## Overview

This is a Node.js Express API for managing spy gadgets, featuring authentication, gadget creation, updating, and self-destruction capabilities. The project uses Prisma as an ORM, bcrypt for password hashing, and JWT for authentication.

## Features

- User Authentication
  - User registration
  - User login
  - JWT-based authentication

- Gadget Management
  - Create new gadgets
  - List gadgets (with optional status filtering)
  - Update gadget details
  - Soft delete (decommission) gadgets
  - Self-destruct gadget functionality

## Prerequisites

- Node.js (v14 or later)
- npm
- PostgreSQL (or another Prisma-supported database)

## Installation

1. Clone the repository
```bash
git clone <your-repository-url>
cd spy-gadget-management-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following:
```
DATABASE_URL="your_database_connection_string"
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Generate Prisma client
```bash
npx prisma generate
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register`
  - Register a new user
  - Request body: `{ "username": string, "password": string }`

- `POST /api/auth/login`
  - Authenticate user and receive JWT token
  - Request body: `{ "username": string, "password": string }`
  - Returns: `{ "token": string }`

### Gadget Management
- `GET /api/gadgets`
  - Retrieve all gadgets
  - Optional query parameter: `status` (filter by gadget status)

- `POST /api/gadgets`
  - Create a new gadget
  - Request body: `{ "name": string }`
  - Automatically generates codename and sets status to "Available"

- `PUT /api/gadgets/:id`
  - Update an existing gadget
  - Request body: `{ "name": string, "status": string }`

- `DELETE /api/gadgets/:id`
  - Soft delete (decommission) a gadget

- `POST /api/gadgets/:id/self-destruct`
  - Trigger self-destruct sequence for a gadget
  - Requires confirmation code: `{ "confirmationCode": "CONFIRM-SELF-DESTRUCT" }`

## Authentication Middleware

All gadget management endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Token expiration (1 hour)
- Unique username constraints
- Self-destruct confirmation mechanism

## Error Handling

The API uses a centralized error handler that:
- Logs server-side errors
- Returns consistent error responses
- Prevents exposing sensitive error details

## Development Scripts

- `npm run dev`: Start server with nodemon
- `npm start`: Start production server
- `npm run generate-token`: Generate a test user and token


## License

Distributed under the MIT License. See `LICENSE` for more information.
