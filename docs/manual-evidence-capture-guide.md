# Manual Evidence Capture Guide

Use this guide when collecting your own screenshots for the assignment. The codebase keeps the required Postman and Selenium testing assets, but the actual proof screenshots should be captured by you while you perform the tests.

## Before You Start

Run the backend, web app, and mobile app first.

```powershell
cd backend
npm run dev
```

```powershell
cd web
npm run dev
```

```powershell
cd mobile
npm run web
```

Use these login details:

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@datamak.local` | `Customer@123` |
| Admin | `admin@datamak.local` | `Admin@123` |

Create your own screenshot folders, for example:

```text
manual-testing-evidence/postman-testing
manual-testing-evidence/selenium-testing
manual-testing-evidence/dataflow-testing
manual-testing-evidence/integration-testing
manual-testing-evidence/mobile-dataflow-testing
manual-testing-evidence/mobile-integration-testing
```

These folders are ignored by Git because they are personal evidence files.

## Postman Testing Screenshots

Import these files into Postman:

| File | Purpose |
| --- | --- |
| `docs/postman/datamak-ecommerce.postman_collection.json` | Postman collection |
| `docs/postman/datamak-local.postman_environment.json` | Local environment |

Capture these screenshots yourself from Postman:

| Evidence ID | Where To Capture | What It Proves |
| --- | --- | --- |
| POSTMAN-001 | Postman Runner after running Health, Authentication, and Products requests | Backend responds, login works, profile works, products load |
| POSTMAN-002 | Postman Runner after running Cart, Checkout, and Orders requests | Authenticated customer can add to cart, checkout, and view orders |
| POSTMAN-003 | Postman Runner after running Admin and Security requests | Admin APIs work and protected routes reject invalid access |

## Selenium Testing Screenshots

Run Selenium from:

```powershell
cd tests\selenium
npm test
```

To keep each successful browser screen open long enough for your own screenshot, run:

```powershell
$env:SELENIUM_PAUSE_MS = "10000"
npm test
```

That pauses each passed Selenium step for 10 seconds. You can increase the number if you need more time.

Capture these screenshots yourself while the browser or terminal shows the test result:

| Evidence ID | Where To Capture | What It Proves |
| --- | --- | --- |
| SEL-001 | Web cart screen after customer login and add-to-cart | Customer can add a product to cart |
| SEL-002 | Web login screen after invalid credentials | Invalid login is rejected |
| SEL-003 | Web product catalog after selecting a category | Category filtering works |
| SEL-004 | Web checkout success screen | Checkout creates an order |
| SEL-005 | Web admin dashboard screen | Admin can access protected dashboard |
| SEL-006 | Web access-denied or redirected screen when customer tries admin area | Customer cannot access admin dashboard |

## Dataflow Testing Screenshots

Dataflow testing follows the data from input, through processing, to output.

### Web Dataflow

| Evidence ID | Where To Capture | Dataflow Shown |
| --- | --- | --- |
| DF-001 | Web home screen after customer login | Email/password -> auth API -> token/session -> logged-in UI |
| DF-002 | Web cart screen after adding a product | Product selection -> cart API -> cart state -> cart UI |
| DF-003 | Web checkout success screen | Cart data -> checkout API -> payment simulation -> order created |
| DF-004 | Web order details screen | Order ID -> orders API -> invoice/timeline output |

### Mobile Dataflow

Open the mobile app screen through Expo Web or on your phone through Expo Go.

| Evidence ID | Where To Capture | Dataflow Shown |
| --- | --- | --- |
| MDF-001 | Mobile home screen after customer login | Mobile credentials -> auth API -> mobile session |
| MDF-002 | Mobile cart screen after adding a product | Mobile product selection -> cart API -> cart screen |
| MDF-003 | Mobile checkout success screen | Mobile cart -> checkout API -> order created |
| MDF-004 | Mobile order details screen | Mobile order ID -> orders API -> tracking screen |
| MDF-005 | Mobile admin dashboard after admin login | Admin token -> admin APIs -> dashboard data |

## Integration Testing Screenshots

Integration testing proves that separate modules work together as one system.

### Web Integration

| Evidence ID | Where To Capture | Modules Integrated |
| --- | --- | --- |
| INT-001 | Web product catalog screen | Web UI + products API + backend |
| INT-002 | Web home screen after customer login | Auth form + auth API + session storage |
| INT-003 | Web cart screen after adding product | Products API + cart API + cart UI |
| INT-004 | Web checkout success screen | Cart + checkout API + payment simulation + orders |
| INT-005 | Web admin summary/dashboard screen | Admin auth + summary/users/products/orders APIs |

### Mobile Integration

| Evidence ID | Where To Capture | Modules Integrated |
| --- | --- | --- |
| MINT-001 | Mobile home screen after login | Mobile auth screen + auth API + session |
| MINT-002 | Mobile product catalog screen | Mobile UI + products API |
| MINT-003 | Mobile cart screen after adding product | Mobile catalog + products API + cart API |
| MINT-004 | Mobile checkout success screen | Mobile cart + checkout API + orders API |
| MINT-005 | Mobile admin dashboard screen | Mobile admin UI + protected admin APIs |

## What To Submit

Submit your report with these sections:

| Task | Required Content |
| --- | --- |
| Postman | Definition, tool used, collection/environment, requests tested, screenshots from Postman |
| Selenium | Definition, tool used, Selenium command, UI workflows tested, screenshots from browser/terminal |
| Dataflow Testing | Definition, web/mobile flows, screenshots showing data moving from input to output |
| Integration Testing | Definition, web/mobile module interactions, screenshots showing modules working together |

Do not submit generated placeholder screenshots. Use only the screenshots you capture yourself while running the real app and tools.
