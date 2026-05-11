# Cypress E2E Suite

## Run Modes

- Open interactive runner:
  - `npm run cypress:open`
- Run headless:
  - `npm run cypress:run`
- Run headed in Chrome:
  - `npm run cypress:run:headed`
- Run with JUnit output:
  - `npm run cypress:run:report`

## Structure

- `cypress/e2e/`
  - Domain-based end-to-end suites
- `cypress/fixtures/`
  - Deterministic test data for auth, products, cart, orders, and admin summary
- `cypress/support/`
  - Reusable commands, API mock server, and test selectors
- `cypress/artifacts/`
  - Generated screenshots, videos, and reports

## Notes

- Tests use `data-testid` selectors for stability.
- API flows are mocked with `cy.intercept` to keep tests reliable and assignment-friendly.
- Base URL can be overridden with `CYPRESS_BASE_URL`.
