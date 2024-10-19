# ts-express-auth-api-1
# Authentication & Authorization API Documentation

## Overview
REST API implementation with JWT authentication, Role-Based Access Control (RBAC), and Multi-Factor Authentication.

## Base URL
```
https://intern-api-0e3f4df9db4a.herokuapp.com/
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting
- Maximum 100 requests per 15 minutes per IP
- Rate limit headers included in response:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Roles
- **Admin**: Full access to all endpoints
- **User**: Access to own profile and public data
- **Guest**: Access to public data only

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:** 201
```json
{
  "message": "User registered successfully",
  "userId": "string",
  "email": "string"
}
```

#### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** 200
```json
{
  "token": "string",
  "otpRequired": boolean
}
```

#### POST /auth/verify-otp
Verify OTP for two-factor authentication.

**Request Body:**
```json
{
  "email": "string",
  "otp": "string"
}
```

**Response:** 200
```json
{
  "token": "string"
}
```

#### POST /auth/assign-role
Assign role to user (Admin only).

**Request Body:**
```json
{
  "userId": "string",
  "role": "ADMIN | USER | GUEST"
}
```

**Response:** 200
```json
{
  "message": "Role assigned successfully"
}
```

### User Management

#### GET /profile
Get authenticated user's profile.

**Response:** 200
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "createdAt": "string"
}
```

#### PUT /profile
Update authenticated user's profile.

**Request Body:**
```json
{
  "username": "string",
  "email": "string"
}
```

**Response:** 200
```json
{
  "message": "Profile updated successfully"
}
```

#### DELETE /user/:id
Delete user by ID (Admin only).

**Parameters:**
- id: string (path)

**Response:** 200
```json
{
  "message": "User deleted successfully"
}
```

#### GET /public-data
Get public data (accessible to all roles).

**Response:** 200
```json
{
  "data": "array"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized access"
}
```

#### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "resetTime": "timestamp"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Security
- All endpoints use HTTPS
- Passwords are hashed using bcrypt
- JWT tokens expire after 1 hour
- Rate limiting implemented to prevent brute force attacks
- Two-factor authentication available via OTP

## Headers
```
Content-Type: application/json
Authorization: Bearer <token>
```
