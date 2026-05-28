# Overall Path Testing Flow Graph

The following flow graph combines the important manual path testing scenarios for the Datamak Technologies e-commerce system into one complete user-flow diagram.

```mermaid
flowchart TD
    A([Start]) --> B[Open Login Page]
    B --> C[Enter Email and Password]
    C --> D{Validate Credentials}

    D -- Invalid credentials / PT-M02 --> E[Show Login Error Message]
    E --> C

    D -- Valid credentials / PT-M01 --> F[Login Successful]
    F --> G[Open Home / Catalog Page]

    G --> H{Choose Product Browsing Path}

    H -- Category filter / PT-M03 --> I[Select Product Category]
    I --> J[Load Products by Category]
    J --> K[Display Filtered Products]

    H -- Search / PT-M04 --> L[Enter Search Keyword]
    L --> M[Search Products]
    M --> N[Display Search Results]

    H -- View all products --> O[Display Product Catalog]

    K --> P[Select Product]
    N --> P
    O --> P

    P --> Q[Open Product Details / PT-M05]
    Q --> R[View Product Name, Price, Description, and Stock]

    R --> S{User Action}

    S -- Add to wishlist / PT-M06 --> T[Click Wishlist Heart Icon]
    T --> U[Add Product to Wishlist]
    U --> V[Show Wishlist Updated Message]
    V --> S

    S -- Remove from wishlist / PT-M07 --> W[Click Active Wishlist Heart Icon]
    W --> X[Remove Product from Wishlist]
    X --> V

    S -- Add to cart / PT-M08 --> Y[Click Add to Cart]
    Y --> Z{Check Product Availability}
    Z -- Available --> AA[Add Item to Cart]
    AA --> AB[Show Cart Updated Message]
    AB --> AC[Open Cart]

    Z -- Out of stock / error path --> AD[Show Cannot Add Item Message]
    AD --> S

    AC --> AE{Cart Action}

    AE -- Update quantity / PT-M09 --> AF[Change Item Quantity]
    AF --> AG[Recalculate Cart Totals]
    AG --> AH[Display Updated Cart]
    AH --> AE

    AE -- Remove item / PT-M10 --> AI[Remove Item from Cart]
    AI --> AJ[Recalculate Cart After Removal]
    AJ --> AK{Cart Empty?}

    AK -- No --> AH
    AK -- Yes / PT-M11 --> AL[Display Empty Cart / Zero Total]
    AL --> G

    AE -- Proceed to checkout / PT-M12 --> AM{Cart Has Items?}
    AM -- Yes --> AN[Click Checkout]
    AN --> AO[Load Checkout Page]
    AO --> AP[Display Order Items and Total]
    AP --> AQ[Confirm Checkout Path Tested]

    AM -- No --> AL

    AQ --> AR{Continue Shopping or Logout}
    AR -- Continue shopping --> G
    AR -- Logout / PT-M13 --> AS[Click Logout]

    G --> AS
    AS --> AT[End User Session]
    AT --> AU[Redirect to Login Page]
    AU --> AV([End])
```

## Path ID Mapping

| Path ID | Path Name | Flow Covered |
|---|---|---|
| PT-M01 | Successful login path | Start to valid credentials to catalog |
| PT-M02 | Invalid login path | Invalid credentials to error message and retry |
| PT-M03 | Product category path | Catalog to category filter to filtered products |
| PT-M04 | Product search path | Catalog to search keyword to search results |
| PT-M05 | Product details path | Product selection to details page |
| PT-M06 | Wishlist add path | Product action to add wishlist and confirmation |
| PT-M07 | Wishlist remove path | Active wishlist item to removal and confirmation |
| PT-M08 | Add to cart path | Product action to cart update |
| PT-M09 | Cart update path | Cart quantity change to recalculated totals |
| PT-M10 | Cart remove path | Remove cart item to recalculated cart |
| PT-M11 | Empty cart path | All items removed to empty cart / zero total |
| PT-M12 | Checkout path | Cart with items to checkout page and order total |
| PT-M13 | Logout path | User session ended and redirected to login |

## Figure Caption

Figure X: Overall path testing flow graph for the Datamak Technologies e-commerce system.

## Explanation

This overall path testing flow graph represents the main execution paths tested manually in the Datamak Technologies e-commerce system. It combines authentication, product browsing, category filtering, search, product details, wishlist, cart, checkout, empty cart, error handling, and logout paths into one complete user journey. The green/success paths represent normal user flows, while the alternative branches represent invalid login, out-of-stock/cart error handling, wishlist removal, item removal, and empty-cart outcomes.
