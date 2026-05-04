# AI Car Diagnostic Tool

A beginner-friendly React application that helps users diagnose car problems with a guided workflow, a 3D vehicle panel, local diagnostic history, simulated queue processing, and OpenRouter LLM integration.

## Features

- Dark mode interface with red automotive accents.
- Step-by-step workflow for vehicle entry, symptom selection, AI diagnosis, results, and history.
- Clickable 3D vehicle systems for Engine, Exhaust/O2 Sensor, Battery, Wheels/Suspension, and Cooling System.
- OpenRouter-powered AI diagnostic analysis.
- Structured result cards for severity, cost, drive advice, causes, checks, repairs, warnings, difficulty, and OBD-II codes.
- Browser localStorage database layer for saved diagnostic reports.
- Simulated event-driven diagnostic queue.
- Testing with Jest and React Testing Library.
- GitHub Actions CI workflow for test and build checks.
- Environment labels for development, staging, and production.

## Screenshots

Add screenshots here for your class presentation:

- Home workflow screen
- Vehicle system panel
- AI diagnosis results
- Diagnostic history

## Install

```bash
npm install
```

## Environment setup

Copy `.env.example` to `.env.local` and add your key:

```env
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
REACT_APP_ENV=development
```

Do not commit `.env` or `.env.local`.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Test

```bash
npm test -- --watchAll=false
```

See `TESTING.md` for the testing protocol.

## Build

```bash
npm run build
```

## System design overview

The application is organized into React UI components and service modules:

- `App.js`: coordinates the workflow, validation, queue status, results, and history.
- `CarViewer.js`: displays the 3D vehicle panel and selectable system labels.
- `DiagnosticForm.js`: captures year, make, and model.
- `ProblemSelector.js`: lets users choose symptoms.
- `DiagnosticResults.js`: displays structured AI output.
- `apiService.js`: calls OpenRouter using `process.env.REACT_APP_OPENROUTER_API_KEY`.
- `diagnosticQueue.js`: simulates asynchronous queue processing.
- `diagnosticStorage.js`: stores diagnostic history in localStorage.

## Database / localStorage explanation

This frontend-only version uses browser localStorage as a simple local database. It stores vehicle details, selected symptoms, AI diagnosis results, timestamps, and status values.

The storage service exposes:

- `saveDiagnosticResult(result)`
- `getDiagnosticHistory()`
- `deleteDiagnosticResult(id)`
- `clearDiagnosticHistory()`

In a future version, this service could be replaced by Firebase, SQL Server, MongoDB, or PostgreSQL through a backend API.

## Queue / event-driven explanation

`diagnosticQueue.js` simulates a queue-driven architecture:

1. The UI creates a diagnostic job.
2. The job starts as `queued`.
3. The worker changes it to `processing`.
4. OpenRouter AI is called asynchronously.
5. The job becomes `completed` or `failed`.

In production, this could map to RabbitMQ, Kafka, AWS SQS, Azure Queue Storage, or a database-backed worker queue.

## CI/CD explanation

The GitHub Actions workflow in `.github/workflows/ci.yml` runs tests and builds the app on pushes and pull requests to `main`.

See `CICD.md` for details.

## Security notes

- API keys belong in `.env.local`, not source code.
- `.env` and `.env.local` are ignored by Git.
- Exposed keys should be rotated.
- Frontend environment variables are visible in production browser bundles, so a backend proxy is recommended for real deployments.

See `SECURITY.md` for details.

## Future improvements

- Add user accounts and cloud-synced diagnostic history.
- Replace localStorage with a real backend database.
- Move OpenRouter calls behind a secure backend proxy.
- Add staging and production deployment pipelines.
- Add downloadable PDF diagnostic reports.
- Add more OBD-II code lookup features.
