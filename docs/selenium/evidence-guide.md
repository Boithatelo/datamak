# Selenium Evidence Guide

Use this Selenium IDE project:

- `datamak-web-ui.side`

The project covers automated web UI testing for:

- Logged-out add-to-cart dialog.
- Customer login.
- Catalog sort menu.
- Customer hosting-plan checkout.
- Admin login and dashboard access.

## Before Running

Make sure both servers are running:

- Web app: `http://localhost:5174`
- Backend API: `http://localhost:4000/api/health`

If either server is stopped, start it before running Selenium.

## Install Selenium IDE

1. Open Google Chrome or Microsoft Edge.
2. Search for `Selenium IDE Chrome extension`.
3. Install Selenium IDE from the browser extension store.
4. Pin the Selenium IDE extension if you want easy access.

## Open The Selenium Project

1. Click the Selenium IDE extension icon.
2. Click `Open an existing project`.
3. Select this file:

   `docs/selenium/datamak-web-ui.side`

4. Confirm the base URL is:

   `http://localhost:5174`

## Run The Tests

1. In Selenium IDE, select the suite:

   `Datamak Web UI Regression Suite`

2. Click `Run all tests`.
3. Keep the browser visible while it runs.
4. Wait for the full suite to finish.

## Evidence To Save

Create a folder such as:

`evidence/selenium/`

Save these screenshots:

| Evidence ID | What To Save | Suggested File Name |
| --- | --- | --- |
| EV-SEL-001 | Selenium IDE project opened with all tests visible | `EV-SEL-001-project-opened.png` |
| EV-SEL-002 | Run results summary showing passed tests | `EV-SEL-002-run-summary.png` |
| EV-SEL-003 | Logged-out add-to-cart dialog test passing | `EV-SEL-003-login-required-dialog-pass.png` |
| EV-SEL-004 | Customer login test passing | `EV-SEL-004-customer-login-pass.png` |
| EV-SEL-005 | Catalog sort test passing | `EV-SEL-005-catalog-sort-pass.png` |
| EV-SEL-006 | Checkout test passing or payment success page | `EV-SEL-006-checkout-pass.png` |
| EV-SEL-007 | Admin dashboard login test passing | `EV-SEL-007-admin-dashboard-pass.png` |
| EV-SEL-008 | Any failed test with error details, if one fails | `EV-SEL-008-failed-test.png` |

## What To Write In The Report

Use wording like this:

> Selenium IDE was used to automate web user interface testing for the Datamak e-commerce system. The Selenium test suite verified logged-out cart protection, customer login, catalog sorting, cart and checkout workflow, and admin dashboard access. The tests simulated real user actions in the browser and produced pass/fail evidence for the web application.

## Selenium Test Summary Table

Use this table in the report:

| Test Case | Tool | Expected Result | Evidence |
| --- | --- | --- | --- |
| Logged-out add to cart | Selenium IDE | Login Required dialog appears | EV-SEL-003 |
| Customer login | Selenium IDE | Customer account loads successfully | EV-SEL-004 |
| Catalog sort | Selenium IDE | Sort option changes to Best Discount | EV-SEL-005 |
| Checkout | Selenium IDE | Payment Successful page appears | EV-SEL-006 |
| Admin login | Selenium IDE | Admin Control Center opens | EV-SEL-007 |

## If A Selenium Test Fails

1. Screenshot the failed command and browser state.
2. Record the test name and failed command.
3. Create a Jira bug.
4. Add:
   - Steps to reproduce.
   - Expected result.
   - Actual result.
   - Screenshot.
   - Severity.
5. Fix the issue.
6. Run the failed test again.
7. Screenshot the passing retest.

## Important Note

Running the checkout test creates a real simulated order in the local database. This is acceptable for test evidence. If you need a clean database later, rerun the seed/migration setup.

