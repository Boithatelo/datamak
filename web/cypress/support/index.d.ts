/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByTestId(testId: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
    mockEcommerceApi(options?: { simulateCatalogDelayMs?: number }): Chainable<void>;
    loginAs(role?: "customer" | "admin", redirectPath?: string): Chainable<void>;
    setViewportPreset(preset?: "iphone" | "samsung" | "ipad" | "desktop"): Chainable<void>;
  }
}
