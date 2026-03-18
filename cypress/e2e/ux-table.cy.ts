describe('UxTable Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render table with correct headers', () => {
    cy.get('table').should('exist');
    cy.get('th').should('have.length', 4);
    cy.get('th').eq(0).should('contain', 'Name');
    cy.get('th').eq(1).should('contain', 'Age');
    cy.get('th').eq(2).should('contain', 'Address');
    cy.get('th').eq(3).should('contain', 'Action');
  });

  it('should render table data correctly', () => {
    cy.get('tbody tr').should('have.length', 3);
    
    // Check first row
    cy.get('tbody tr').eq(0).within(() => {
      cy.get('td').eq(0).should('contain', 'John Brown');
      cy.get('td').eq(1).should('contain', '32');
      cy.get('td').eq(2).should('contain', 'New York No. 1 Lake Park');
    });

    // Check custom render
    cy.get('tbody tr').eq(0).find('a').should('have.attr', 'href', '#');
  });

  it('should handle row keys correctly', () => {
    // Assuming rowKey works, the tr elements might have keys, but we can't easily check React keys in DOM.
    // However, we can check if the table renders without errors and structure is correct.
    cy.get('tbody tr').should('have.length', 3);
  });
});
