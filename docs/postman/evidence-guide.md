# Postman Evidence Guide

Use these files in Postman:

- Collection: `datamak-ecommerce.postman_collection.json`
- Environment: `datamak-local.postman_environment.json`

## Before Running

1. Start the backend API.
2. Confirm this URL works in the browser or Postman:

   `http://localhost:4000/api/health`

3. Open Postman.
4. Import the collection file.
5. Import the environment file.
6. Select the `Datamak Local` environment in the top-right environment dropdown.

## How To Run The Collection

1. In Postman, open `Datamak E-Commerce API Tests`.
2. Click the collection name.
3. Click `Run`.
4. Select all folders.
5. Keep the request order unchanged.
6. Click `Run Datamak E-Commerce API Tests`.
7. Wait for the run to finish.

The collection logs in as the customer and admin, saves tokens automatically, loads products, tests cart actions, creates one service order using simulated payment, checks order details, and tests admin/security routes.

## Evidence To Save

Create a folder such as:

`evidence/postman/`

Save these screenshots/files:

| Evidence ID | What To Save | Suggested File Name |
| --- | --- | --- |
| EV-POST-001 | Imported collection visible in Postman | `EV-POST-001-collection-imported.png` |
| EV-POST-002 | Selected `Datamak Local` environment | `EV-POST-002-environment-selected.png` |
| EV-POST-003 | Collection Runner summary showing total passed tests | `EV-POST-003-runner-summary.png` |
| EV-POST-004 | Customer Login request showing 200 and passed tests | `EV-POST-004-customer-login-pass.png` |
| EV-POST-005 | Product Catalog List request showing products returned | `EV-POST-005-products-pass.png` |
| EV-POST-006 | Cart add/update/remove requests passing | `EV-POST-006-cart-pass.png` |
| EV-POST-007 | Checkout request showing simulated payment and order id | `EV-POST-007-checkout-pass.png` |
| EV-POST-008 | Admin Update Order Status request passing | `EV-POST-008-admin-status-pass.png` |
| EV-POST-009 | Security checks showing invalid access rejected | `EV-POST-009-security-pass.png` |
| EV-POST-010 | Exported collection after running | `EV-POST-010-postman-collection.json` |
| EV-POST-011 | Exported environment after running | `EV-POST-011-postman-environment.json` |

## How To Export Results

Postman Desktop:

1. After running the collection, keep the Runner results page open.
2. Screenshot the summary area showing passed/failed test totals.
3. Open important requests and screenshot the `Tests` tab or test results area.
4. Export the collection:
   - Click collection three-dot menu.
   - Click `Export`.
   - Choose Collection v2.1.
5. Export the environment:
   - Go to Environments.
   - Select `Datamak Local`.
   - Click export or download.

## What To Write In The Report

Use wording like this:

> Postman was used to perform API and integration testing for the Datamak e-commerce backend. The tests covered authentication, product catalog, filtering, sorting, cart management, checkout with simulated payment, order tracking, admin dashboard endpoints, and security checks for invalid login and unauthorized access. The Postman collection runner was used to execute the test suite and collect evidence of passed and failed requests.

## Postman Test Summary Table

Use this table in the report:

| Test Area | Tool | Result | Evidence |
| --- | --- | --- | --- |
| Backend health | Postman | Pass | EV-POST-003 |
| Authentication | Postman | Pass | EV-POST-004 |
| Product catalog | Postman | Pass | EV-POST-005 |
| Cart management | Postman | Pass | EV-POST-006 |
| Checkout/payment simulation | Postman | Pass | EV-POST-007 |
| Order tracking | Postman | Pass | EV-POST-007 |
| Admin order management | Postman | Pass | EV-POST-008 |
| Security authorization checks | Postman | Pass | EV-POST-009 |

## If A Test Fails

1. Screenshot the failed request and response.
2. Create a Jira bug.
3. Record:
   - Steps to reproduce.
   - Expected result.
   - Actual result.
   - Screenshot evidence.
   - Severity.
4. Fix the issue.
5. Rerun the failed request.
6. Screenshot the retest passing.

