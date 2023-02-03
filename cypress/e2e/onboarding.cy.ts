import { dataCy } from '../support/commands';

describe('onboarding-feature', () => {
  /*it('complete onboarding with fixed calories', () => {
    cy.get(dataCy('fixed-calories-button')).click();
    cy.get(dataCy('fixed-calories-input')).type('3000');
    cy.get(dataCy('confirm-button')).click();
    cy.get(dataCy('calories')).contains('3000');
  });*/

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
    cy.get('button').contains('FEMALE').click();
    cy.get('button').contains('OK').click({force:true});
    cy.get(dataCy('height-input')).type('{selectall}180');
    cy.get(dataCy('weight-input')).type('{selectall}80');
    cy.get(dataCy('goal-select')).click();
    cy.get('button').contains('GAIN').click();
    cy.get('button').contains('OK').click({force:true});
    cy.get(dataCy('activity-select')).click();
    cy.get('button').contains('LIGHTLY ACTIVE').click();
    cy.get('button').contains('OK').click({force:true});
    cy.get(dataCy('confirm-button')).click();
    cy.get(dataCy('calorie-display')).contains('0 / 3,511 kcal');
  });
});
