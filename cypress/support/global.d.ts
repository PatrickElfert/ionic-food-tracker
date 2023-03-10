declare namespace Cypress {
  interface Chainable {
    signIn(
      redirectPath?: string,
      credentials?: { email: string; password: string }
    ): Chainable;

    resetFirestore(): Chainable;

    initializeUserSettings(): Chainable;

    initializeFireStore(): Chainable;
  }
}
