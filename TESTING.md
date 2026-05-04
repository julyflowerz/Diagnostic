# Testing Protocol

## How to run tests

```bash
npm test -- --watchAll=false
```

## Test coverage added

- **Main app rendering**: verifies the diagnostic workflow loads.
- **Required field validation**: verifies users see an error if they run diagnosis before entering vehicle information.
- **Loading state**: verifies the UI shows a running AI diagnosis state while the simulated queue processes the job.
- **Diagnostic history**: verifies saved reports appear in the history section.
- **Storage service**: verifies `saveDiagnosticResult`, `getDiagnosticHistory`, `deleteDiagnosticResult`, and `clearDiagnosticHistory`.

## Manual demo protocol

1. Start the app with `npm start`.
2. Enter a vehicle year, make, and model.
3. Select a problem or click a labeled vehicle system.
4. Run AI diagnosis.
5. Confirm queue status moves through queued, processing, and completed.
6. Review result cards.
7. Save the result and confirm it appears in diagnostic history.
8. Delete or clear history to demonstrate database operations.
