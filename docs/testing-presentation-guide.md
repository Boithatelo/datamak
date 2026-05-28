# Testing Presentation Guide

This guide is for explaining the assigned testing work in the correct order:

1. Postman API testing
2. Selenium web UI testing
3. Dataflow testing
4. Integration testing

The main idea for the presentation is simple: first prove the backend works directly, then prove the web user journey works, then explain how data moves through the system, and finally show how separate modules work together.

## 1. Postman API Testing

### What It Is

Postman was used to test the backend API directly without using the web or mobile interface. This checks whether the server endpoints return the correct status codes, response bodies, tokens, cart data, orders, admin data, and security errors.

### What It Was For

Postman answered this question:

> Does the backend work correctly when we send HTTP requests directly to it?

It was useful because the API is the foundation of the whole e-commerce system. If login, products, cart, checkout, orders, and admin routes fail in Postman, then the web and mobile apps will also fail.

### How It Was Achieved

The backend was started on:

```text
http://localhost:4000/api
```

The Postman collection and environment were imported from:

```text
docs/postman/datamak-ecommerce.postman_collection.json
docs/postman/datamak-local.postman_environment.json
```

The collection was run in this order:

1. Health check
2. Customer login
3. Admin login
4. Product catalog
5. Product filtering and sorting
6. Cart operations
7. Checkout with simulated payment
8. Customer order tracking
9. Admin dashboard and order status update
10. Security checks

The Postman tests used assertions such as:

```javascript
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Customer token returned", () => pm.expect(data.token).to.be.a("string").and.not.empty);
pm.environment.set("customerToken", data.token);
```

This means Postman did not only send requests. It also automatically checked the result.

### Example To Explain

For customer login:

1. Postman sends `POST /api/auth/login`.
2. The request body contains the customer email and password.
3. The backend checks the user in the database.
4. If the login is correct, the backend returns a JWT token and user role.
5. Postman saves that token as `customerToken`.
6. Later cart and order requests use that token as a bearer token.

Good explanation line:

> I started with Postman because it isolates the backend. It proves that the API works before testing the interface. For example, the customer login request returns a token, then the cart and checkout requests reuse that token to prove authenticated customer actions work correctly.

### Evidence To Show

Show these screenshots:

- Collection imported in Postman
- Environment selected
- Collection Runner results with passed tests
- Customer login response with token
- Product list response
- Cart add or update response
- Checkout response with order ID and simulated payment
- Admin summary or admin order status update
- Security checks showing `401` or `403`

## 2. Selenium Web UI Testing

### What It Is

Selenium was used to automate browser testing of the React web application. Instead of manually clicking through the site, Selenium opened Chrome, entered login details, clicked buttons, navigated pages, and checked that the expected text or URL appeared.

### What It Was For

Selenium answered this question:

> Can a real user complete the main web workflows through the browser?

This is different from Postman. Postman tests the API directly, while Selenium tests the full user experience through the web interface.

### How It Was Achieved

The web app runs on:

```text
http://localhost:5173
```

The Selenium test file is:

```text
tests/selenium/ui.test.js
```

The tests are run from:

```powershell
cd tests\selenium
npm test
```

The Selenium test suite covers:

| Test ID | Workflow | What Selenium Checks |
| --- | --- | --- |
| SEL-001 | Customer login and add to cart | Product appears in cart and order summary is visible |
| SEL-002 | Invalid login rejected | Error message appears and no token is stored |
| SEL-003 | Category filter works | Catalog URL includes `category=Computers` and selected category is active |
| SEL-004 | Checkout creates order | Checkout success page appears with order ID |
| SEL-005 | Admin dashboard opens | Admin dashboard shows products, orders, and users |
| SEL-006 | Customer blocked from admin dashboard | Customer cannot stay on `/admin` |

### Example To Explain

For customer add-to-cart:

1. Selenium opens `/auth`.
2. It enters `customer@datamak.local` and `Customer@123`.
3. It clicks the login button.
4. It waits until `shop_token` exists in browser local storage.
5. It opens the product catalog.
6. It clicks the first available Add to Cart button.
7. It opens the cart page.
8. It checks that "Shopping Cart", "Order Summary", and "Grand Total" are visible.

Good explanation line:

> Selenium proves the web interface works from the user's point of view. The test does not just call an API. It uses the browser, clicks the same buttons a customer would click, and confirms the expected screen appears.

### Evidence To Show

Show:

- Browser on the cart page after add-to-cart
- Login error screen for invalid login
- Product catalog after selecting Computers
- Checkout success page with order ID
- Admin dashboard after admin login
- Terminal showing `PASS` results

## 3. Dataflow Testing

### What It Is

Dataflow testing checks whether data moves correctly from input, through processing, into storage or application state, and finally to the screen output.

The focus is not only "did the button work?" The focus is:

> Where did the data start, where did it go, how was it processed, and where did it appear?

### What It Was For

Dataflow testing was used to prove that important data is not lost, changed incorrectly, or displayed in the wrong place.

Examples of important data:

- Email and password
- JWT token
- Product ID
- Quantity
- Cart total
- Payment method
- Order ID
- Order status
- Admin role

### How It Was Achieved

The dataflow tests were achieved by following real workflows and checking the data at each stage.

### Dataflow 1: Login

Flow:

```text
Email/password input -> auth API -> JWT token -> localStorage -> logged-in UI
```

In the code:

- Web login submits credentials from `web/src/pages/AuthPage.jsx`
- Auth context calls `POST /auth/login` in `web/src/context/AuthContext.jsx`
- The backend verifies credentials in `backend/src/routes/auth.js`
- The token is saved in browser storage as `shop_token`
- The UI changes to a logged-in customer or admin view

What to say:

> For login dataflow, the data starts as email and password entered by the user. It is sent to the authentication API. If valid, the backend returns a token and user object. The web app stores the token and uses it to show the logged-in interface.

### Dataflow 2: Cart

Flow:

```text
Selected product ID and quantity -> cart API -> cart state -> cart screen totals
```

In the code:

- Product card sends the selected product ID
- Cart context calls `POST /cart/items`
- The backend validates the product and stock
- The cart is updated for the logged-in user
- The frontend receives the updated cart and displays item totals

What to say:

> For cart dataflow, the important data is the product ID and quantity. After the user clicks Add to Cart, that data goes to the cart endpoint. The backend calculates the cart summary, and the frontend displays the updated cart and grand total.

### Dataflow 3: Checkout

Flow:

```text
Cart items and payment form -> checkout API -> simulated payment -> order record -> success page
```

In the code:

- Checkout page submits payment and address data
- Backend reads the current cart
- Backend calculates totals, applies coupon logic, simulates payment, creates an order, and clears the cart
- Frontend navigates to `/checkout/success/{orderId}`

What to say:

> For checkout dataflow, the cart becomes an order. The backend takes cart items, calculates totals, creates a simulated payment record, stores the order, clears the cart, and returns the order ID to the success screen.

### Dataflow 4: Order Tracking

Flow:

```text
Order ID -> orders API -> order details -> status timeline screen
```

What to say:

> For order tracking, the order ID is used to fetch one order. The response contains the order items, totals, payment status, and status history. The screen then displays those details as the customer order record.

### Dataflow Evidence To Show

Show screenshots that prove the flow reached the final output:

- Login success screen
- Cart screen with selected product
- Checkout success screen with order ID
- Order details/status timeline screen
- Mobile equivalents if required

## 4. Integration Testing

### What It Is

Integration testing checks whether separate parts of the system work together correctly. In this project, those parts include:

- React web app
- Expo mobile app
- Express backend API
- Authentication middleware
- PostgreSQL data layer
- Product routes
- Cart routes
- Checkout and order routes
- Admin routes

### What It Was For

Integration testing answered this question:

> Do the modules communicate correctly when combined as one e-commerce system?

This is important because a module can work alone but fail when connected to another module.

### Difference Between Dataflow And Integration Testing

Dataflow testing follows the data.

Example:

```text
productId -> cart API -> cart state -> cart screen
```

Integration testing checks the connected modules.

Example:

```text
Product catalog UI + cart context + cart API + backend storage
```

Simple line to remember:

> Dataflow testing asks, "Did the data move correctly?" Integration testing asks, "Did the modules work together correctly?"

### How It Was Achieved

Integration testing was achieved by running complete workflows that require more than one module.

### Integration 1: Product Catalog

Modules:

```text
Web UI + products API + backend data layer
```

What happens:

1. User opens catalog.
2. Web app calls `GET /api/products`.
3. Backend reads product data.
4. Product list appears in the UI.

What to say:

> This proves the product catalog UI is integrated with the backend product API and data source.

### Integration 2: Login

Modules:

```text
Auth page + auth API + JWT middleware + local storage
```

What happens:

1. User submits login form.
2. Web app calls the auth API.
3. Backend returns token and user role.
4. Frontend stores the session.
5. Protected customer or admin pages become available.

### Integration 3: Cart

Modules:

```text
Product catalog + cart API + cart context + cart page
```

What happens:

1. Product is selected from catalog.
2. Product ID goes to cart API.
3. Backend updates the user's cart.
4. Cart context receives updated cart.
5. Cart page displays the selected product and totals.

### Integration 4: Checkout And Orders

Modules:

```text
Cart + checkout API + simulated payment + orders API + success screen
```

What happens:

1. Cart has an item.
2. Checkout form is submitted.
3. Backend creates a paid order.
4. Success screen shows the order ID.
5. Orders page can retrieve the order later.

### Integration 5: Admin Dashboard

Modules:

```text
Admin login + protected admin routes + dashboard UI + orders/users/products data
```

What happens:

1. Admin logs in.
2. Admin token is stored.
3. Web app opens admin dashboard.
4. Dashboard calls admin APIs.
5. Summary, users, products, and orders appear.

What to say:

> The admin integration test proves role-based access control and protected admin data work together. A customer is blocked, while an admin can access the dashboard.

## Recommended Presentation Order

Use this order when presenting:

1. Introduce the system: Datamak e-commerce with backend, web app, mobile app, products, cart, checkout, orders, and admin dashboard.
2. Show Postman: prove the backend endpoints work directly.
3. Show Selenium: prove the web workflows work in the browser.
4. Explain dataflow: trace login, cart, checkout, and order data from input to output.
5. Explain integration: show modules working together as one system.
6. End with evidence: screenshots, passed tests, and what each test proved.

## Short Presentation Script

Use this if you need to speak confidently:

> My assigned testing tasks were Postman API testing, Selenium UI testing, dataflow testing, and integration testing. I started with Postman because the backend API is the foundation of the system. I tested health, authentication, products, cart, checkout, orders, admin, and security endpoints. Postman also saved tokens and IDs in the environment so later requests could depend on earlier successful requests.

> After that, I used Selenium to test the web application from the user's point of view. Selenium opened Chrome, logged in as a customer or admin, clicked buttons, added products to the cart, completed checkout, and checked that the expected pages and text appeared.

> For dataflow testing, I traced important data through the system. For example, in login, email and password go to the auth API, the backend returns a token, the token is stored in local storage, and the UI changes to a logged-in state. In checkout, cart items go to the checkout API, the backend simulates payment, creates an order, and returns the order ID to the success screen.

> For integration testing, I checked that separate modules worked together. For example, the product catalog integrates the web UI with the products API and backend data. Checkout integrates the cart, checkout API, payment simulation, orders API, and success screen. Admin testing integrates admin login, role-based protection, and dashboard data.

> So the testing work proves both the individual API endpoints and the complete user workflows of the e-commerce system.

## Lecturer Questions To Prepare For

### Why did you use Postman?

Because it tests the backend API directly and verifies status codes, response bodies, tokens, and authorization without depending on the UI.

### Why did you use Selenium?

Because it tests the actual browser workflow from the user's point of view.

### What is the difference between Postman and Selenium?

Postman tests API endpoints directly. Selenium tests the web interface by controlling the browser.

### What is dataflow testing?

It checks how data moves from input, through processing and storage, to final output.

### What is integration testing?

It checks whether separate modules work correctly together.

### Give one dataflow example.

Login: email/password -> auth API -> token -> local storage -> logged-in UI.

### Give one integration example.

Checkout: cart module + checkout API + simulated payment + order module + success page.

### How did you test security?

By checking invalid login, cart access without token, and customer access to admin routes. The expected results were `401 Unauthorized` or `403 Forbidden`.

### What proves checkout worked?

The checkout response returns an order ID, order status is `Paid`, payment is marked as simulated, and the success page displays the order ID.

