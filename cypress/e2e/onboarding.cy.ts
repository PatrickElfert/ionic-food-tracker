import { dataCy } from "../support/commands";

describe('onboarding-feature', () => {
  it('complete onboarding with fixed calories', () => {
    cy.get(dataCy('fixed-calories-button')).click();
    cy.get(dataCy('fixed-calories-input')).type('3000');
    cy.get(dataCy('confirm-button')).click();
    cy.get(dataCy('calories')).contains('3000');
  });

  it('complete onboarding with calculated calories', () => {
    cy.get(dataCy('calculate-calories-button')).click();
    cy.get(dataCy('age-input')).type('30');
    cy.get(dataCy('gender-input')).select('Male');
    cy.get(dataCy('height-input')).type('180');
    cy.get(dataCy('weight-input')).type('80');
    cy.get(dataCy('activity-input')).select('Sedentary');
    cy.get(dataCy('confirm-button')).click();
    cy.get(dataCy('calories')).contains('3000');
  });
});
