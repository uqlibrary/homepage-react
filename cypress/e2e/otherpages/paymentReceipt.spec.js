context('Payment receipt', () => {
    it('Shows the correct messages for valid querystring', () => {
        cy.visit('payment-receipt?Success=1&Receipt=1234&AmountPaid=20');
        cy.viewport(1300, 1000);
        cy.get('body').contains('Your transaction of $20.00 has been successful.');
        cy.get('body').contains('Please check your email for your receipt #1234');
    });

    it('Shows the failure messages for missing querystrings', () => {
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

    it('Shows the correct messages for a failed payment request', () => {
        cy.visit('payment-receipt?Success=0');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The payment request was not successful');
    });
});
