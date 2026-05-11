# Playwright Cross-Browser Automation Testing

This folder contains automated end-to-end tests for the Datamak Technologies E-Commerce web application.

## Tool

Playwright is used for cross-browser web automation testing. The tests run against:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

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

## Run Browsers One By One

Use these commands when collecting screenshot evidence:

```powershell
npm run test:e2e:chrome
npm run test:e2e:edge
npm run test:e2e:firefox
```

Each command runs all tests for one browser in order, using one worker, so the browser actions are easier to follow.

For a slower visible demonstration where Playwright opens the browser, types the login details, clicks buttons, and shows the flow more clearly, use:

```powershell
npm run test:e2e:demo:chrome
npm run test:e2e:demo:edge
npm run test:e2e:demo:firefox
```

The login test automatically enters the default customer account:

```text
Email: customer@datamak.local
Password: Customer@123
```

## View Report

```powershell
npm run test:e2e:report
```

The HTML report and screenshots/videos from failed tests are generated locally and ignored by Git.
