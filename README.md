# Task Manager

Task Manager is a full-stack team task management platform for creating, assigning, tracking, and reporting on work. The application combines a React and Vite web client with an Express REST API, MongoDB persistence, JWT authentication, role-based access control, profile image uploads, task attachments, dashboards, and Excel report exports.

## Executive Summary

Task Manager is structured as a deployable full-stack application containing:

- A React and Vite web client for authentication, dashboards, task management, and responsive task views.
- An Express REST API for users, tasks, authentication, uploads, and reports.
- MongoDB persistence through Mongoose for users and tasks.
- JWT-based authentication with admin and member roles.
- Render-compatible deployment as separate backend web and frontend static services.

The platform gives teams a shared workspace instead of disconnected task lists. An administrator can create tasks, assign them to members, monitor progress, manage users, and export reports. Members can view assigned tasks, update statuses, and complete checklist items.

## Business Capabilities

### Task management

- Create tasks with a title, description, priority, due date, assignees, attachments, and checklist items.
- Update task details and assignees.
- Delete tasks as an administrator.
- Filter tasks by Pending, In Progress, and Completed status.
- Update task status and automatically complete the checklist when a task is completed.
- Update checklist items and calculate task progress automatically.
- View task details and assigned team members.

### Dashboard experience

- Administrator dashboard with task totals, status summaries, progress information, and charts.
- Member dashboard with assigned-task summaries and progress information.
- Responsive task cards, tables, status tabs, progress indicators, and user avatar groups.
- Loading states, error handling, toast notifications, and mobile-friendly layouts.

### User and account management

- Register and log in with email and password.
- Hash passwords with bcryptjs.
- Authenticate API requests with seven-day JWT tokens.
- Load and update the authenticated user profile.
- Assign administrator access during registration with the configured invite token.
- Manage users as an administrator.
- Upload JPEG, JPG, or PNG profile images up to 5 MB.

### Reporting and files

- Export task data to an Excel report.
- Export user and task data to an Excel report.
- Upload profile images and serve them through the backend uploads route.
- Store task attachment references.

## User Roles

| Role | Capabilities |
| --- | --- |
| Visitor | View the login and registration screens. |
| Member | View assigned tasks, update task status, complete checklist items, and view the member dashboard. |
| Admin | Create, update, and delete tasks; assign users; manage users; view all tasks; view the admin dashboard; and export reports. |

## Technology Stack

### Backend

- Node.js and Express 4
- MongoDB and Mongoose 8
- JWT authentication with `jsonwebtoken`
- Password hashing with `bcryptjs`
- Multipart upload handling with `multer`
- Excel report generation with `exceljs`
- CORS and environment configuration with `cors` and `dotenv`

### Frontend

- React 19
- Vite 6
- React Router 7
- Tailwind CSS 4
- Axios
- Recharts
- React Hot Toast
- React Icons
- Moment.js

### Hosting and operations

- Render web service for the backend API
- Render static site for the frontend
- MongoDB Atlas or another reachable MongoDB deployment
- Environment variables for all service-specific URLs and credentials

## Architecture

```text
                    +----------------------+
                    | Team member / Admin   |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | React + Vite client  |
                    | Auth, dashboards,     |
                    | tasks, reports        |
                    +----------+-----------+
                               |
                         REST / JSON
                               |
                               v
                    +----------------------+
                    | Express REST API     |
                    | Routes and middleware|
                    +----+-------------+---+
                         |             |
                  Mongoose             | Multer / ExcelJS
                         v             v
              +----------+---+   +-----+----------------+
              | MongoDB       |   | Uploads and reports  |
              | users, tasks  |   | profile media, XLSX  |
              +--------------+   +----------------------+
```

## Backend Request Flow

1. The frontend builds API URLs from `VITE_API_BASE_URL` and sends requests through Axios.
2. Express parses JSON requests and applies the configured CORS policy.
3. Protected routes validate a JWT from the `Authorization: Bearer <token>` header.
4. Role middleware restricts administrator-only operations.
5. Route modules delegate request handling to controllers.
6. Controllers validate request data and read or write MongoDB through Mongoose models.
7. Multer handles image uploads, and ExcelJS generates administrator reports.
8. The API returns JSON, image URLs, or downloadable report files to the frontend.

## Repository Responsibilities

```text
backend/config          MongoDB connection and DNS configuration
backend/controllers     Authentication, users, tasks, and reports
backend/middlewares     JWT protection and upload constraints
backend/models          User and Task schemas
backend/routes          HTTP route registration and middleware composition
backend/scripts         Image URL maintenance utility
backend/uploads         Local uploaded profile media directory
backend/server.js       Express application entry point
frontend/.../pages      Authentication, admin, and member screens
frontend/.../components Reusable cards, layouts, charts, inputs, and overlays
frontend/.../context    Authenticated user state
frontend/.../hooks      Authentication hooks
frontend/.../routes     Protected route composition
frontend/.../utils      API paths, Axios, uploads, and shared helpers
```

## Data Model

### User

Stores account identity and access information:

- `name`
- Unique `email`
- Bcrypt-hashed `password`
- Optional `profileImageUrl`
- `role`: `admin` or `member`
- `createdAt` and `updatedAt` timestamps

### Task

Stores a unit of team work:

- Required `title` and `dueDate`
- Optional `description`
- `priority`: Low, Medium, or High
- `status`: Pending, In Progress, or Completed
- References to assigned users through `assignedTo`
- Reference to the creator through `createdBy`
- Attachment URL or path references
- Embedded checklist items with `text` and `completed`
- Numeric `progress` percentage
- `createdAt` and `updatedAt` timestamps

## Frontend Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Authenticate an existing user. |
| `/signUp` | Public | Register a member or administrator. |
| `/admin/dashboard` | Admin | View administrator task and team metrics. |
| `/admin/tasks` | Admin | Review, filter, and export tasks. |
| `/admin/create-task` | Admin | Create or update a task. |
| `/admin/users` | Admin | Review and manage users. |
| `/user/dashboard` | Member | View assigned-task metrics. |
| `/user/tasks` | Member | Review assigned tasks. |
| `/user/task-details/:id` | Member | View and update an assigned task. |

## API Reference

The local API base URL is configured through `VITE_API_BASE_URL`. Deployed clients use the Render backend URL supplied through that variable.

### System and media

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Returns API health and runtime information. |
| `GET` | `/uploads/:filename` | Public | Serves an uploaded profile image. |

### Authentication and profile

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Creates a user and returns a JWT. |
| `POST` | `/api/auth/login` | Public | Authenticates a user and returns a JWT. |
| `GET` | `/api/auth/profile` | JWT required | Returns the authenticated profile. |
| `PUT` | `/api/auth/profile` | JWT required | Updates the authenticated profile. |
| `POST` | `/api/auth/upload-image` | Public | Accepts an image in the `image` multipart field and returns its configured URL. |

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/users` | Admin | Lists users. |
| `GET` | `/api/users/:id` | JWT required | Returns a user by ID. |
| `DELETE` | `/api/users/:id` | Admin | Deletes a user. |

### Tasks

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/tasks/dashboard-data` | JWT required | Returns administrator dashboard data. |
| `GET` | `/api/tasks/user-dashboard-data` | JWT required | Returns member dashboard data. |
| `GET` | `/api/tasks` | JWT required | Lists all tasks for admins or assigned tasks for members. |
| `GET` | `/api/tasks/:id` | JWT required | Returns one task with assigned users. |
| `POST` | `/api/tasks` | Admin | Creates a task. |
| `PUT` | `/api/tasks/:id` | JWT required | Updates task details and assignments. |
| `DELETE` | `/api/tasks/:id` | Admin | Deletes a task. |
| `PUT` | `/api/tasks/:id/status` | JWT required | Updates task status. |
| `PUT` | `/api/tasks/:id/todo` | JWT required | Updates checklist items and recalculates progress. |

### Reports

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/reports/export/tasks` | Admin | Downloads an Excel task report. |
| `GET` | `/api/reports/export/users` | Admin | Downloads an Excel user-task report. |

Protected requests use:

```text
Authorization: Bearer <jwt>
```

## Environment Configuration

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
MONGO_DNS_SERVER=1.1.1.1
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_INVITE_TOKEN=replace-with-an-admin-invite-token
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
SERVER_URL=http://localhost:5000
```

Create `frontend/Task-Manager/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
```

| Variable | Application | Required | Purpose |
| --- | --- | --- | --- |
| `MONGO_URI` | Backend | Yes | MongoDB connection string. |
| `MONGO_DNS_SERVER` | Backend local setup | Optional | DNS server used when the local resolver cannot resolve MongoDB SRV records. |
| `JWT_SECRET` | Backend | Yes | Signs and verifies seven-day JWTs. |
| `ADMIN_INVITE_TOKEN` | Backend | Yes for admin signup | Promotes a registering user to the admin role when it matches. |
| `NODE_ENV` | Backend | No | Controls development error details and runtime labeling. |
| `PORT` | Backend | No | Local API port; hosting platforms provide their own port. |
| `CLIENT_URL` | Backend | Yes in deployment | Comma-separated frontend origins accepted by CORS. |
| `SERVER_URL` | Backend | Yes | Public base URL used when generating uploaded image URLs. |
| `VITE_API_BASE_URL` | Frontend | Yes | API base URL compiled into the browser bundle. |
| `VITE_FRONTEND_URL` | Frontend | Optional | Frontend URL for local or deployment configuration. |

Only variables prefixed with `VITE_` are exposed to the browser. Never place `MONGO_URI`, `JWT_SECRET`, or `ADMIN_INVITE_TOKEN` in frontend environment files.

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm
- A reachable MongoDB instance, local or hosted

### Installation

From the repository root:

```powershell
cd backend
npm install

cd ..\frontend\Task-Manager
npm install
```

Create the environment files described above before starting the services.

### Start the API

In one terminal:

```powershell
cd backend
npm run dev
```

The API is available at the URL configured by `PORT`, normally `http://localhost:5000`.

### Start the web client

In a second terminal:

```powershell
cd frontend/Task-Manager
npm run dev -- --host 127.0.0.1
```

The Vite development server is normally available at `http://127.0.0.1:5173`.

### Verification commands

```powershell
cd frontend/Task-Manager
npm run lint
npm run build

cd ..\..\backend
node --check server.js
```

The frontend currently passes lint with non-blocking React hook warnings. The production build and backend syntax check should complete successfully.

## Deployment on Render

The repository does not currently include a `render.yaml` Blueprint. Create the backend and frontend as two Render services connected to the same GitHub repository.

### Backend web service

- Service type: Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

Backend Render environment variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<long-random-secret>
ADMIN_INVITE_TOKEN=<admin-invite-token>
NODE_ENV=production
CLIENT_URL=https://<frontend-service>.onrender.com
SERVER_URL=https://<backend-service>.onrender.com
```

Do not set a fixed `PORT` on Render. Do not add `MONGO_DNS_SERVER` unless Render logs show a resolver-specific issue.

### Frontend static site

- Service type: Static Site
- Root Directory: `frontend/Task-Manager`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Frontend Render environment variable:

```env
VITE_API_BASE_URL=https://<backend-service>.onrender.com
```

Add this rewrite in the frontend service settings so React routes work after refresh:

```text
Source: /*
Destination: /index.html
Action: Rewrite
Status: 200
```

The repository also includes `frontend/Task-Manager/public/_redirects`.

### Deployment procedure

1. Push the repository to GitHub.
2. Create the backend Render Web Service with the backend settings above.
3. Set the MongoDB, JWT, admin token, `CLIENT_URL`, and `SERVER_URL` variables.
4. Deploy the backend and verify `/health` returns HTTP 200.
5. Copy the deployed backend URL.
6. Create the frontend Render Static Site with the frontend settings above.
7. Set `VITE_API_BASE_URL` to the deployed backend URL before building.
8. Add the SPA rewrite.
9. Copy the deployed frontend URL.
10. Update backend `CLIENT_URL` to the final frontend URL and redeploy the backend.
11. Test registration, login, image upload, task creation, assignment, checklist updates, status changes, and reports.

## Media Storage Limitation

The current upload implementation stores profile images under `backend/uploads` and serves them from the API. Render web-service filesystems are ephemeral, so uploaded images can be lost after restarts, redeployments, or instance replacement.

For durable production media, integrate an object-storage provider such as Amazon S3, Cloudflare R2, Azure Blob Storage, or Cloudinary and persist the returned URL in MongoDB.

## Security and Operational Posture

Current controls include:

- Bcrypt password hashing.
- JWT authentication with seven-day token expiry.
- Admin-only task creation, deletion, user management, and report endpoints.
- CORS origin configuration through `CLIENT_URL`.
- Image type filtering and a 5 MB upload limit.
- Render-compatible `/health` monitoring.
- Environment-only service URLs and credentials.

Before treating the application as a hardened production service, address these gaps:

- Move uploaded media to durable object storage.
- Protect the public image-upload endpoint with authentication and rate limiting.
- Add request validation and security headers.
- Enforce ownership checks consistently for every task mutation.
- Add structured logging, monitoring, and audit trails.
- Add automated unit, integration, API, and browser-level tests.
- Add CI checks for linting, builds, dependency scanning, and deployment validation.
- Rotate JWT, MongoDB, and other credentials if they are exposed outside local environment files.

## Quality and Verification

The repository currently provides frontend linting, frontend production builds, backend syntax checks, and the `/health` endpoint. It does not currently define an automated test suite.

Recommended release verification:

```powershell
cd frontend/Task-Manager
npm run lint
npm run build

cd ..\..\backend
node --check server.js
```

Deployment smoke tests:

- `GET /health` returns a successful response.
- The frontend loads from the deployed static site.
- Registration and login return a usable JWT.
- Protected dashboard routes require authentication.
- Admin-only task and report actions reject member users.
- Profile image upload returns a reachable configured URL.
- Checklist and status changes update task progress.
- Excel reports download successfully.
- Refreshing a frontend route does not return a 404.

## Project Structure

```text
Task-Manager/
├── backend/
│   ├── config/                 MongoDB connection and DNS configuration
│   ├── controllers/            Authentication, users, tasks, and reports
│   ├── middlewares/            JWT protection and image upload constraints
│   ├── models/                 User and Task schemas
│   ├── routes/                 Authentication, users, tasks, and reports
│   ├── scripts/                Image URL maintenance utility
│   ├── uploads/                Local uploaded media directory
│   ├── server.js               Express application entry point
│   └── package.json             Backend scripts and dependencies
├── frontend/Task-Manager/
│   ├── public/                 Static assets and SPA fallback
│   ├── src/
│   │   ├── components/         Reusable cards, layouts, charts, and inputs
│   │   ├── context/            Authenticated user state
│   │   ├── hooks/              Authentication hooks
│   │   ├── pages/              Admin, member, and authentication screens
│   │   ├── routes/             Protected route composition
│   │   └── utils/              API paths, Axios, uploads, and helpers
│   ├── index.html
│   └── package.json             Frontend scripts and dependencies
├── .gitignore
└── README.md
```

## Product Roadmap

- Durable object-storage integration for profile images and attachments.
- Stronger ownership checks across every task mutation.
- Request validation, security headers, and rate limiting.
- Automated unit, integration, and browser test coverage.
- CI/CD quality gates and dependency security scanning.
- Improved task analytics and progress history.
- Calendar and reminder support for due dates.
- Additional collaboration features such as comments and activity history.

## License

This project is licensed under the MIT License.

## Developer

Pushkar Kumar Saini
