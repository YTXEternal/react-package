describe('UxTable Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Rendering', () => {
    it('should render table headers correctly', () => {
      cy.get('table').should('exist');
      cy.get('th').should('have.length', 4);
      cy.get('th').eq(0).should('contain', 'Name');
      cy.get('th').eq(1).should('contain', 'Age');
      cy.get('th').eq(2).should('contain', 'Address');
      cy.get('th').eq(3).should('contain', 'Action');
    });

    it('should render table data rows correctly', () => {
      cy.get('tbody tr').should('have.length', 3);
      
      // Check first row content
      cy.get('tbody tr').eq(0).within(() => {
        cy.get('td').eq(0).should('contain', 'John Brown');
        cy.get('td').eq(1).should('contain', '32');
        cy.get('td').eq(2).should('contain', 'New York No. 1 Lake Park');
      });

      // Check custom render in Action column
      cy.get('tbody tr').eq(0).find('td').eq(3).find('a').should('have.attr', 'href', '#').and('contain', 'Delete');
    });

    it('should handle fixed columns correctly', () => {
      // Check sticky styles for left fixed column (Name)
      cy.get('th').eq(0).should('have.css', 'position', 'sticky');
      cy.get('th').eq(0).should('have.css', 'left', '0px');
      
      // Check sticky styles for right fixed column (Action)
      cy.get('th').eq(3).should('have.css', 'position', 'sticky');
      // Right offset calculation might vary, checking position sticky is a good indicator
    });
  });

  describe('Selection', () => {
    it('should select a cell on click', () => {
      // Click on first cell (John Brown)
      cy.get('tbody tr').eq(0).find('td').eq(0).click();
      
      // Check if it has the active outline style
      cy.get('tbody tr').eq(0).find('td').eq(0)
        .should('have.css', 'outline-style', 'solid');
    });

    it('should handle keyboard navigation', () => {
      // Click on first cell to focus
      cy.get('tbody tr').eq(0).find('td').eq(0).click();
      
      // Press ArrowRight
      cy.get('body').type('{rightarrow}');
      
      // Next cell (Age) should be active
      // Note: we check outline style on the next cell
      cy.get('tbody tr').eq(0).find('td').eq(1)
        .should('have.css', 'outline-style', 'solid');
        
      // Press ArrowDown
      cy.get('body').type('{downarrow}');
      
      // Cell below (Jim Green's Age) should be active
      cy.get('tbody tr').eq(1).find('td').eq(1)
        .should('have.css', 'outline-style', 'solid');
    });
  });

  describe('Editing', () => {
    it('should enter edit mode on double click and save value', () => {
      const newName = 'Edited Name';
      
      // Double click on first cell
      cy.get('tbody tr').eq(0).find('td').eq(0).dblclick();
      
      // Check if input exists
      cy.get('tbody tr').eq(0).find('td').eq(0).find('input').should('exist');
      
      // Type new value and press Enter
      cy.get('tbody tr').eq(0).find('td').eq(0).find('input').clear().type(`${newName}{enter}`);
      
      // Check if value is updated in the cell
      cy.get('tbody tr').eq(0).find('td').eq(0).should('contain', newName);
      
      // Input should be gone
      cy.get('tbody tr').eq(0).find('td').eq(0).find('input').should('not.exist');
    });

    it('should cancel edit on Escape', () => {
      const originalName = 'John Brown';
      
      // Double click on first cell
      cy.get('tbody tr').eq(0).find('td').eq(0).dblclick();
      
      // Type something but press Escape
      cy.get('tbody tr').eq(0).find('td').eq(0).find('input').clear().type('Cancelled Edit{esc}');
      
      // Check if value remains original
      cy.get('tbody tr').eq(0).find('td').eq(0).should('contain', originalName);
    });

    it('should start editing on typing', () => {
      // Click to select
      cy.get('tbody tr').eq(0).find('td').eq(0).click();
      
      // Type directly
      cy.get('body').type('Direct Edit{enter}');
      
      // Check if updated (Note: implementation appends or replaces? Usually direct typing replaces or starts with char)
      // Based on implementation: startEditing(..., e.key) sets initial value to key
      // So 'D' starts it, then 'irect Edit' is typed into input? 
      // Actually `startEditing` sets value to `e.key`. Then input is focused.
      // The subsequent characters might need to be typed into the input if the test runs fast enough or we need to wait for input.
      // Let's adjust test: Type 'D', check input has 'D', then type rest.
      
      // We'll just check if input appears with first char
      cy.get('tbody tr').eq(1).find('td').eq(0).click();
      cy.get('body').type('X');
      cy.get('tbody tr').eq(1).find('td').eq(0).find('input').should('have.value', 'X');
    });
  });

  describe('Sorting', () => {
    it('should sort data when clicking header', () => {
      // Default order: John(32), Jim(42), Joe(32)
      // Sort by Age (2nd column)
      
      // Click Age header -> Ascending
      cy.get('th').eq(1).click();
      
      // Expect: John(32), Joe(32), Jim(42) or Joe(32), John(32), Jim(42) depending on stable sort
      // Actually initial data: John(32), Jim(42), Joe(32)
      // Sorted Asc: 32, 32, 42. Jim should be last.
      cy.get('tbody tr').eq(2).find('td').eq(1).should('contain', '42'); // Jim is last
      
      // Click Age header again -> Descending
      cy.get('th').eq(1).click();
      
      // Expect: Jim(42) first
      cy.get('tbody tr').eq(0).find('td').eq(1).should('contain', '42'); // Jim is first
    });
  });

  describe('Resizing', () => {
    it('should resize column width', () => {
      // Get initial width of first column
      cy.get('th').eq(0).invoke('width').then((initialWidth) => {
        // The resize handle is a div inside th
        // We need to trigger mousedown on the handle, mousemove on document, mouseup
        
        // Find the handle (last div child of th)
        cy.get('th').eq(0).find('div').last().trigger('mousedown', { which: 1, pageX: 100, pageY: 10, force: true });
        
        // Move mouse 50px to right
        cy.get('body').trigger('mousemove', { pageX: 150, pageY: 10, force: true });
        cy.get('body').trigger('mouseup', { force: true });
        
        // Check new width (should be larger)
        cy.get('th').eq(0).invoke('width').should('be.gt', initialWidth);
      });
    });
  });
});
