# Datamak E-Commerce Testing Test Cases

This document lists the test cases for the assigned testing tasks: Postman, Selenium, Dataflow testing, and Integration testing. Screenshot evidence should be captured manually while performing each test.

## 1. Postman API Testing

| Test Case ID | Test Case | Preconditions | Test Steps | Expected Result | Evidence To Capture |
| --- | --- | --- | --- | --- | --- |
| POSTMAN-001 | Backend health check | Backend is running on `http://localhost:4000` | Send `GET /api/health` in Postman | API returns HTTP `200` and service status is `ok` | Postman response showing status `200` |
| POSTMAN-002 | Customer login | Customer account exists | Send `POST /api/auth/login` with customer email/password | API returns token and user role `customer` | Postman Tests tab showing passed login assertions |
| POSTMAN-003 | Admin login | Admin account exists | Send `POST /api/auth/login` with admin email/password | API returns token and user role `admin` | Postman Tests tab showing admin token returned |
| POSTMAN-004 | Product catalog loads | Backend has products | Send `GET /api/products` | API returns product list | Response body showing products |
| POSTMAN-005 | Product category filter | Backend has category data | Send product request with category filter | API returns products matching selected category | Response showing filtered products |
| POSTMAN-006 | Add product to cart | Customer token is saved | Send `POST /api/cart/items` with product ID and quantity | Product is added to authenticated customer's cart | Postman response showing cart item |
| POSTMAN-007 | Update cart quantity | Cart has at least one item | Send quantity update request | Cart item quantity changes successfully | Response showing updated quantity |
| POSTMAN-008 | Checkout with simulated payment | Customer cart has item | Send `POST /api/checkout` with payment details | Order is created and payment is marked simulated/paid | Response showing order ID and payment status |
| POSTMAN-009 | Customer order details | Order was created | Send `GET /api/orders/{orderId}` | API returns matching order details | Response showing order details |
| POSTMAN-010 | Admin dashboard summary | Admin token is saved | Send `GET /api/admin/summary` | Admin summary data is returned | Response showing users/products/orders/revenue |
| POSTMAN-011 | Unauthorized cart access rejected | No token is provided | Send cart request without bearer token | API rejects request with authorization error | Response showing unauthorized message |
| POSTMAN-012 | Customer cannot access admin summary | Customer token is saved | Send `GET /api/admin/summary` using customer token | API blocks access | Response showing forbidden/unauthorized result |

## 2. Selenium Web UI Testing

| Test Case ID | Test Case | Preconditions | Test Steps | Expected Result | Evidence To Capture |
| --- | --- | --- | --- | --- | --- |
| SEL-001 | Customer login and add to cart | Backend and web app are running | Login as customer, open catalog, add product, open cart | Cart page shows product and order summary | Browser cart screen and terminal PASS |
| SEL-002 | Invalid login rejected | Web app is running | Enter wrong email/password and submit login form | Login fails and no token is created | Browser error message and terminal PASS |
| SEL-003 | Category filter works | Products exist | Open product catalog and select `Computers` category | URL/filter state changes and category is selected | Product catalog after filter |
| SEL-004 | Checkout creates order | Customer is logged in and cart has item | Proceed to checkout, continue, place order | Payment successful page appears with order ID | Checkout success screen |
| SEL-005 | Admin dashboard opens | Admin account exists | Login as admin | Admin Control Center opens | Admin dashboard screen |
| SEL-006 | Customer blocked from admin dashboard | Customer account exists | Login as customer and navigate to `/admin` | Customer is redirected/blocked from admin page | Redirected customer page or blocked state |

## 3. Dataflow Testing

Dataflow testing checks that data moves correctly from input to processing, storage/state, and final screen output.

### Web Dataflow

| Test Case ID | Dataflow Tested | Preconditions | Test Steps | Expected Result | Evidence To Capture |
| --- | --- | --- | --- | --- | --- |
| DF-001 | Login dataflow | Customer account exists | Enter email/password and login | Credentials go to auth API, token/session is created, logged-in UI appears | Web home screen after login |
| DF-002 | Cart dataflow | Customer is logged in | Select a product and add to cart | Product ID/quantity go to cart API and cart screen shows item | Web cart screen |
| DF-003 | Checkout dataflow | Cart has item | Proceed to checkout and place order | Cart data goes to checkout API and creates an order | Web checkout success screen |
| DF-004 | Order tracking dataflow | Order exists | Open order details | Order ID retrieves order details and status timeline | Web order details screen |

### Mobile Dataflow

| Test Case ID | Dataflow Tested | Preconditions | Test Steps | Expected Result | Evidence To Capture |
| --- | --- | --- | --- | --- | --- |
| MDF-001 | Mobile login dataflow | Mobile app and backend are running | Login on mobile app | Auth API creates mobile session and home screen appears | Mobile home screen after login |
| MDF-002 | Mobile cart dataflow | Customer is logged in on mobile | Add product to cart and open cart tab | Cart data appears on mobile cart screen | Mobile cart screen |
| MDF-003 | Mobile checkout dataflow | Mobile cart has item | Place order from mobile cart | Order is created and payment successful screen appears | Mobile checkout success screen |
| MDF-004 | Mobile order tracking dataflow | Mobile order exists | Open order details | Mobile app displays invoice/status timeline | Mobile order details screen |
| MDF-005 | Mobile admin dashboard dataflow | Admin account exists | Login as admin on mobile | Admin APIs load dashboard totals | Mobile admin dashboard |

## 4. Integration Testing

Integration testing checks that different modules communicate correctly as one system.

### Web Integration

| Test Case ID | Integration Tested | Modules Involved | Test Steps | Expected Result | Evidence To Capture |
| --- | --- | --- | --- | --- | --- |
| INT-001 | Product catalog integration | Web UI + products API + backend | Open product catalog | Product data loads from backend into web UI | Web product catalog screen |
| INT-002 | Login integration | Auth form + auth API + session storage | Login as customer | Token/session is stored and logged-in home screen appears | Web home screen after login |
| INT-003 | Product and cart integration | Products API + cart API + cart UI | Add product to cart and open cart page | Selected product appears in cart | Web cart screen |
| INT-004 | Checkout integration | Cart + checkout API + simulated payment + orders API | Checkout cart item | Paid order is created and success page appears | Web payment success screen |
| INT-005 | Admin dashboard integration | Admin auth + protected admin APIs + dashboard UI | Login as admin and open dashboard | Summary/users/products/orders data loads | Web admin summary/dashboard |

### Mobile Integration

| Test Case ID | Integration Tested | Modules Involved | Test Steps | Expected Result | Evidence To Capture |
| --- | --- | --- | --- | --- | --- |
| MINT-001 | Mobile login integration | Mobile auth screen + auth API + mobile session | Login on mobile | Mobile home screen opens with customer session | Mobile home screen after login |
| MINT-002 | Mobile product catalog integration | Mobile UI + products API | Open Products tab | Product catalog loads on mobile | Mobile product catalog screen |
| MINT-003 | Mobile product and cart integration | Mobile catalog + products API + cart API | Add product to cart | Product appears on mobile cart screen | Mobile cart screen |
| MINT-004 | Mobile checkout integration | Mobile cart + checkout API + orders API | Place order from mobile cart | Payment successful screen appears | Mobile checkout success screen |
| MINT-005 | Mobile admin integration | Mobile admin UI + admin auth + protected APIs | Login as admin on mobile | Admin dashboard data loads | Mobile admin dashboard |

## Presentation Order

1. Start with Postman because it proves the backend API works directly.
2. Move to Selenium because it proves the web UI works through browser automation.
3. Explain Dataflow testing by following data from input to final output.
4. Explain Integration testing by showing modules working together across web and mobile.
