# Back-End Developer Task: Secure REST API for User Authentication

## Objective:

Create a secure REST API for user authentication using Node.js, Express, Passportjs, Jwt and MongoDB. The API should support user registration, login, and token-based authentication. Implement security best practices to protect sensitive data and prevent common vulnerabilities.

## Backend Technologies:

- Node.js
- Express.js
- MongoDB
- Passport.js
- JWT (JSON Web Tokens)
- Bcrypt.js
- Dotenv
- CORS
- Helmet.js
- Morgan
- Rate Limiting
- Stripe (for payment processing)
- Nodemon (for development)
- Mongoose (for MongoDB object modeling)

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/monir6163/backend-passportjs.git
   cd backend-passportjs
   ```

2. Install dependencies:
   ```bash
    npm install
   ```
3. Run the development server:

   ```bash
   npm run dev

   # Open http://localhost:8000/api
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:
Check the `.env.example` file for reference.

```env
DATABASE_URL=""
DB_NAME=""
PORT=8000
CORS_ORIGINS=""
JWT_ACCESS_TOKEN_SECRET="your_access_token_secret"
JWT_REFRESH_TOKEN_SECRET="your_refresh_token_secret"
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET="" (for local testing)
```
