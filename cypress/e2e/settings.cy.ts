import { dataCy } from '../support/commands';

describe('settings feature', () => {
  it('should update settings', () => {
    cy.initializeUserSettings();
    cy.visit('/');
    cy.get(dataCy('tab2')).click();
    cy.get(dataCy('calorie-settings')).click();
    cy.get(dataCy('calculated-segment'), {includeShadowDom: true}).click();
    cy.get(dataCy('save-button')).click();
    cy.get(dataCy('tab1')).click();
    cy.get(dataCy('calorie-display')).contains('0 / 3,177 kcal');
  });
});
