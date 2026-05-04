# Environment Setup

## Environment variables

Create a local `.env.local` file from `.env.example`:

```env
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
REACT_APP_ENV=development
```

Restart the development server after changing environment variables.

## Development

Used by students and developers on their local machines. It can use test data, browser localStorage, and mock fallback responses.

## Staging

A staging environment mirrors production but is used for review before release. It should use separate API keys and a separate database.

## Production

Production is the live application. Real deployments should move OpenRouter calls to a backend proxy so API keys are never exposed in browser code.

## UI label

The footer displays `process.env.REACT_APP_ENV`, so the app can clearly show whether it is running in development, staging, or production.
