# Contacts API with MongoDB & JWT Auth

This project is a RESTful Contacts API built with **Node.js**, **Express 5**, and
**MongoDB (Mongoose)**.

It provides:

- **User authentication** with access/refresh tokens stored in MongoDB sessions
- **CRUD operations for contacts** scoped to the authenticated user
- **File uploads** for contact photos (local temp folder + Cloudinary)
- **Input validation** with Joi
- **Centralized error handling** and HTTP error helper
- **API documentation** generated from an OpenAPI spec (Redocly + Swagger UI)

## Tech Stack

- Node.js, Express 5
- MongoDB, Mongoose
- JWT (password reset token)
- bcrypt (password hashing)
- Multer (file uploads)
- Cloudinary (image storage)
- Nodemailer + Handlebars (email templates)
- Joi (request validation)
- Pino HTTP logger

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- MongoDB Atlas or a reachable MongoDB instance
- Cloudinary account (for contact photos)
- SMTP credentials (for password reset emails)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Key variables:

- **Server & App**

  - `PORT` – port for the HTTP server
  - `APP_DOMAIN` – public base URL of the app (used in links in emails, e.g.
    `http://localhost:3000`)

- **MongoDB**

  - `MONGODB_USER`
  - `MONGODB_PASSWORD`
  - `MONGODB_URL` – host/cluster (without protocol)
  - `MONGODB_DB` – database name
  - `MONGODB_OPTIONS` – optional URI query string (e.g. `retryWrites=true&w=majority`)

- **Auth & Security**

  - `JWT_SECRET` – secret key used for password reset tokens

- **Cloudinary**

  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

- **SMTP (email)**
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`
  - `SMTP_FROM` – from-address for outgoing emails

### Scripts

Defined in `package.json`:

- `npm run dev` – start the app in dev mode with Nodemon (`src/index.js`)
- `npm run build-docs` – bundle the OpenAPI spec from `docs/openapi.yaml` into
  `docs/swagger.json`
- `npm run build` – alias for `npm run build-docs`
- `npm run preview-docs` – preview the API docs via Redocly

### Running the Application

1. Ensure `.env` is correctly configured.
2. Build API docs (optional but recommended):

   ```bash
   npm run build-docs
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. The server will start on `PORT` and log the domain from `APP_DOMAIN`.

## Project Structure

```text
src/
  index.js              # App bootstrap: env, MongoDB, folders, server
  server.js             # Express app, routes, middlewares, Swagger UI
  db/
    initMongoConnection.js
    models/
      User.js
      Contacts.js
      Sessions.js
  controllers/
    auth.js             # HTTP layer for auth endpoints
    contacts.js         # HTTP layer for contacts endpoints
  services/
    auth.js             # Business logic for auth & sessions
    contacts.js         # Business logic for contacts
  middlewares/
    authenticate.js
    errorHandler.js
    notFoundHandler.js
    isValidId.js
    upload.js
    validatorBody.js
  validators/
    users.js
    contacts.js
  utils/
    ctrlWrapper.js
    sendMail.js
    saveFileToCloudinary.js
    parse* / pagination helpers
  constants/
    index.js            # time constants, paths (temp, uploads)
    pagination.js
  templates/
    reset-password-mail.html
docs/
  openapi.yaml          # Source OpenAPI spec
  swagger.json          # Generated bundle for Swagger UI
swagger/
  ...                   # Additional Swagger/Redoc config
uploads/                # Public upload directory (auto-created)
temp/                   # Temporary upload directory (auto-created)
```

## API Overview

### Authentication

Base path: `/auth`

- `POST /auth/register` – register a new user

  - Body: `{ name, email, password }`

- `POST /auth/login` – log in and create a new session

  - Body: `{ email, password }`
  - Response: `{ accessToken }`
  - Cookies set: `refreshToken`, `sessionId`

- `POST /auth/refresh` – refresh the session using cookies

  - Uses `refreshToken` and `sessionId` cookies
  - Response: new `{ accessToken }` and updated cookies

- `POST /auth/logout` – log out current session

  - Clears `refreshToken` and `sessionId` cookies

- `POST /auth/send-reset-email` – send password reset email

  - Body: `{ email }`

- `POST /auth/reset-pwd` – reset password using token
  - Body: `{ token, password }`

### Contacts

Base path: `/contacts`

All contacts routes are **protected** and require:

```http
Authorization: Bearer <accessToken>
```

- `GET /contacts` – list contacts for the authenticated user

  - Supports pagination, sorting, and filters via query params

- `GET /contacts/:contactId` – get a single contact

- `POST /contacts` – create a contact

  - Multipart form-data with optional `photo` field (file)
  - Validated with Joi (`createContactSchema`)

- `DELETE /contacts/:contactId` – delete a contact

- `PATCH /contacts/:contactId` – update a contact
  - Multipart form-data, optional new `photo` file
  - Validated with Joi (`updateContactSchema`)

## API Documentation

- **Swagger UI** is served at: `GET /api-docs`
- Backed by the bundled spec at `docs/swagger.json` (generated from `docs/openapi.yaml`).

## Error Handling

The app uses a centralized error handler and a custom `HttpError` class. Throwing
`httpError(status, message)` in controllers/services will be translated to a JSON error
response with:

```json
{
  "message": "...",
  "status": 400,
  "data": null
}
```

If an unknown/unexpected error occurs, the API responds with:

```json
{
  "message": "Something went wrong",
  "status": 500
}
```

## Development Notes

- Temp and upload folders are created automatically on startup (`temp/`, `uploads/`).
- Access tokens are short-lived; refresh tokens are stored in the `Sessions` collection.
- When a user logs in again, previous sessions for that user are removed.
