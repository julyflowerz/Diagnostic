# Security Notes

## API keys

API keys must be stored in `.env.local` or another environment-specific secret store. Do not hardcode private keys in JavaScript source files.

## Git safety

The `.gitignore` file excludes:

```text
node_modules/
.env
.env.local
build/
```

This prevents common local dependency, secret, and build files from being committed.

## Rotating exposed keys

If an API key is pasted into chat, committed to Git, or exposed in a browser build, rotate it from the provider dashboard.

## Frontend limitation

Create React App exposes `REACT_APP_*` variables in the browser bundle. For real production use, OpenRouter calls should go through a backend proxy that stores the key server-side.

## Current project status

`src/services/apiService.js` reads the OpenRouter key only from `process.env.REACT_APP_OPENROUTER_API_KEY`.
