describe('feature-tracking', () => {
  it('ingredient flow', () => {
    cy.initializeUserSettings();
    cy.visit('/');
    cy.get('[data-cy="add-ingredient"]').click();
    cy.intercept('GET', 'https://world.openfoodfacts.org/cgi/*', (req) => {
      req.reply({
        products: [
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            product_name: 'apple',
            nutriments: { carbohydrates: 10, proteins: 2, fat: 5 },
            brands: 'the apple brand',
          },
        ],
      });
    });
    cy.get('[data-cy="searchbar"]').type('apple');
    cy.get('ion-list ion-item:first').click();
    cy.get('[data-cy="add-to-diary"]').click();
    cy.get('[data-cy="back"]').click();
    cy.get('ion-list ion-item:first').contains('apple');
  });
});
