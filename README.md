# Async Board

Async Board is a shared online canvas for planning and sketching with a team. Create boards, invite people as viewers or editors, and work together on the same canvas.

## What you can do

- Create public or private boards and manage invite links.
- Invite collaborators with viewer or editor access.
- Draw with the canvas tools and share updates in real time.
- Save and restore board snapshots.
- Sign up, log in, and reset a forgotten password.

## Built with

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, and Socket.IO Client
- **Backend:** Express, TypeScript, MongoDB, Socket.IO, and Redis
- **Other services:** Cloudinary for image uploads and Gmail for account emails
- **E2E tests:** Playwright

## Run it locally

You’ll need Node.js 20.19+ (or 22.12+), npm, MongoDB, and Redis. Cloudinary and Gmail credentials are needed for image uploads and email flows.

### 1. Install dependencies

Open a terminal at the project root and install each package:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 2. Configure the backend

Create `backend/.env` and set the values below. Use your own credentials; don’t commit this file.

```env
PORT=8000
MONGO_URL=mongodb://127.0.0.1:27017/async-board
isProduction=false

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

ACCESS_TOKEN_SECRET_KEY=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET_KEY=replace-with-a-long-random-secret
RESET_TOKEN_SECRET_KEY=replace-with-a-long-random-secret

GMAIL_USER=your-email@gmail.com
GMAIL_USER_PASSWORD=your-gmail-app-password

CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

SERVER_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

`SERVER_URL` is used to build board invite links. `CLIENT_URL` is the frontend origin allowed by the API. For password reset and other email features, configure a Gmail app password.

### 3. Configure the frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Start the app

Start the backend and frontend in separate terminals:

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run dev
```

Vite prints the local frontend URL when it starts (normally `http://localhost:5173`). Keep MongoDB and Redis running while using the app.

## Tests and checks

The Playwright tests run from the `e2e` directory. They start the frontend automatically; the covered API calls are mocked, so you don’t need to run the backend for this suite.

```powershell
cd e2e
npm install
npx playwright install chromium
npm test
```

To run only the board tests:

```powershell
npm test -- tests/board/board.spec.ts
```

The frontend also has build and lint checks:

```powershell
cd frontend
npm run build
npm run lint
```

Playwright saves failure artifacts under `e2e/test-results/` and its HTML report under `e2e/playwright-report/`.

## Project layout

```text
backend/   Express API, authentication, boards, canvas data, and sockets
frontend/  React application
e2e/       Playwright configuration and end-to-end tests
```
