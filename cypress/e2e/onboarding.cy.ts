import { dataCy } from '../support/commands';

describe('onboarding-feature', () => {
  it('complete onboarding with fixed calories', () => {
    cy.get(dataCy('fixed-calories-button')).click();
    cy.get(dataCy('fixed-intake-input')).type('{selectall}3000');
    cy.get(dataCy('confirm-button')).click();
    cy.get(dataCy('calorie-display')).contains('0 / 3,000 kcal');
  });

  it('complete onboarding with calculated calories', () => {
    cy.get(dataCy('calculate-calories-button')).click();
    cy.get(dataCy('datetime-button')).click();
    cy.get('ion-datetime')
      .shadow()
      .find('.calendar-month')
      .not('[aria-hidden="true"]')
      .find('[data-day="1"]')
      .click();
    cy.get('body').click(0,0);
    cy.get(dataCy('gender-select')).click();
    cy.contains('button', 'FEMALE').click();
    cy.contains('button','OK').click();
    cy.get(dataCy('height-input')).type('{selectall}180');
    cy.get(dataCy('weight-input')).type('{selectall}80');
    cy.get(dataCy('goal-select')).click();
    cy.contains('button', 'GAIN').click();
    cy.contains('button', 'OK').click();
    cy.get(dataCy('activity-select')).click();
    cy.contains('button', 'LIGHTLY ACTIVE').click();
    cy.contains('button', 'OK').click();
    cy.get(dataCy('confirm-button')).click();
    cy.get(dataCy('calorie-display')).contains('0 / 3,511 kcal');
  });
});
