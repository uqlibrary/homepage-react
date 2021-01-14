context('Payment receipt', () => {
    it('Shows the correct messages for valid querystring', () => {
        // masquerade may be a special case, but we dont have a better example atm
        // if we end up with other admin pages, swap this out
        cy.visit('payment-receipt?Success=1&Receipt=1234&AmountPaid=1250');
        cy.viewport(1300, 1000);
        cy.get('body').contains('Your transaction of $12.50 has been successful.');
        cy.get('body').contains('Please check your email for your receipt #1234');
    });

    it('Shows the failure messages for missing querystrings', () => {
        // masquerade may be a special case, but we dont have a better example atm
        // if we end up with other admin pages, swap this out
        cy.visit('payment-receipt');
        cy.viewport(1300, 1000);
        cy.get('body').contains(
            'You have reached this page in error. Please go back, and check what brought you here.',
        );

        cy.visit('payment-receipt?Success=1');
        cy.viewport(1300, 1000);
        cy.get('body').contains(
            'You have reached this page in error. Please go back, and check what brought you here.',
        );

        cy.visit('payment-receipt?Success=1&Receipt=1234&AmountPaid=');
        cy.viewport(1300, 1000);
        cy.get('body').contains(
            'You have reached this page in error. Please go back, and check what brought you here.',
        );
    });
});
