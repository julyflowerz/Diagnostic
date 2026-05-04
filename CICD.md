# CI/CD

## What CI/CD means

CI/CD stands for Continuous Integration and Continuous Delivery. It helps teams automatically verify that code works before it is merged or deployed.

## GitHub Actions workflow

This project includes `.github/workflows/ci.yml`.

The workflow runs on pushes and pull requests to `main` and performs these checks:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs dependencies with `npm install`.
4. Runs tests with `npm test -- --watchAll=false`.
5. Builds the production app with `npm run build`.

## Why this supports professional development

- Catches broken tests before code reaches `main`.
- Confirms the app can build for production.
- Makes grading and team review more reliable.
- Documents a repeatable quality gate for Git version management.
