# Selenium WebDriver Evidence Guide

The Selenium IDE browser extension is no longer available in some Chrome installations, so use Selenium WebDriver instead.

## Files

- Test runner: `tests/selenium/datamak-web-ui.test.js`
- Package file: `tests/selenium/package.json`
- Evidence output folder: `evidence/selenium/`

## What The Test Covers

- Logged-out user clicks Add to Cart and sees the Login Required dialog.
- Customer logs in successfully.
- Catalog sort menu changes to Best Discount.
- Customer adds a hosting plan and completes checkout.
- Admin logs in and reaches the Admin Control Center.

## Before Running

Make sure these are running:

- Backend API: `http://localhost:4000/api/health`
- Web app: `http://localhost:5174`

## Install Selenium Dependencies

Open a terminal in:

`tests/selenium`

Run:

```bash
npm install
```

## Run Selenium Tests

From `tests/selenium`, run:

```bash
npm test
```

Chrome will open automatically and Selenium will perform the test steps.

## Evidence To Save

The test automatically saves screenshots in:

`evidence/selenium/`

Save these files for your report:

| Evidence ID | File |
| --- | --- |
| EV-SEL-003 | `EV-SEL-003-login-required-dialog-pass.png` |
| EV-SEL-004 | `EV-SEL-004-customer-login-pass.png` |
| EV-SEL-005 | `EV-SEL-005-catalog-sort-pass.png` |
| EV-SEL-006 | `EV-SEL-006-checkout-pass.png` |
| EV-SEL-007 | `EV-SEL-007-admin-dashboard-pass.png` |
| EV-SEL-RESULTS | `selenium-results.json` |

Also take a screenshot of the terminal after `npm test` finishes. Save it as:

`EV-SEL-002-terminal-run-summary.png`

## What To Write In The Report

Use wording like this:

> Selenium WebDriver was used to automate web user interface testing for the Datamak e-commerce system. The Selenium tests opened Chrome and simulated real user actions including adding a product while logged out, logging in as a customer, sorting the catalog, completing checkout, and logging in as an administrator. Screenshots and a JSON result file were saved as evidence.

## If A Test Fails

1. Check the terminal output.
2. Open the failure screenshot in `evidence/selenium/`.
3. Create a Jira bug with the failed test name.
4. Add expected result, actual result, and screenshot.
5. Fix the issue.
6. Rerun `npm test`.

