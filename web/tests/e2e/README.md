# Playwright Cross-Browser Automation Testing

This folder contains automated end-to-end tests for the Datamak Technologies E-Commerce web application.

## Tool

Playwright is used for cross-browser web automation testing. The tests run against:

- Chromium
- Firefox
- WebKit

## Covered Flows

- Visitor opens the homepage and browses to the catalog.
- Visitor can view the catalog without logging in.
- Visitor cannot add products to cart before logging in.
- Protected cart page redirects logged-out users to the login page.
- Customer login shows account navigation and Logout.

## Before Running

From the project root, start the backend and make sure PostgreSQL is connected:

```powershell
cd backend
npm run db:init
npm run dev
```

In another terminal, run the Playwright tests from the `web` folder:

```powershell
cd web
npm run test:e2e:install
npm run test:e2e
```

## View Report

```powershell
npm run test:e2e:report
```

The HTML report and screenshots/videos from failed tests are generated locally and ignored by Git.
