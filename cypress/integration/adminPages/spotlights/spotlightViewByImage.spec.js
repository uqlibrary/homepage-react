import { FILTER_STORAGE_NAME, hasAWorkingHelpButton } from '../../../support/spotlights';
import { clickButton } from '../../../support/helpers';

describe('Spotlights Admin: the view-by-image lightbox works', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
        cy.viewport(1300, 1000);
    });

    function loadTheViewByImageLightbox() {
        clickButton('button[data-testid="admin-spotlights-view-by-image-button"]', 'View by image');
    }

    beforeEach(() => {
        loadTheViewByImageLightbox();
    });
    it('the view-by-image loads correctly', () => {
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
            .should('exist')
            .children()
            .should('have.length', 47);
        // the first image has the expected values
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div > a:first-child')
            .should('have.attr', 'title')
            .then(titleAttribute => {
                // too hard to test for the complete string with carriage return in the middle
                expect(titleAttribute.startsWith('Study outdoors in Duhig Place - Study space')).to.be.true;
                expect(titleAttribute.endsWith('Run between 2021-03-01 00:01:00  and  2099-12-07 23:59:00')).to.be.true;
            });
        // the same element
        cy.get('[data-testid="fba95ec0-77f5-11eb-8c73-9734f9d4b368-lightbox-item"] img')
            .should('exist')
            .and(
                'have.attr',
                'alt',
                'Study outdoors in Duhig Place. Shade, wifi, tables, bubbler, fairy lights and fresh air.',
            )
            .and(
                'have.attr',
                'src',
                'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            );
    });
    it('the view-by-image filter works', () => {
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
            .should('exist')
            .children()
            .should('have.length', 47);
        // typing "can" in the filter reduces the number of thumbnails to 8
        cy.get('[data-testid="spotlights-viewbyimage-filter-text-field"] input')
            .should('exist')
            .type('can');
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
            .should('exist')
            .children()
            .should('have.length', 8);
        // an alert with title containing "can" displays
        cy.get('[data-testid="3fa92cc0-6ab9-11e7-839f-a1392c2927cc-lightbox-item"]').should('exist');
        // an alert with img_alt containing "can" displays
        cy.get('[data-testid="298288b0-605c-11eb-ad87-357f112348ef-lightbox-item"]').should('exist');
        // an alert with admin note containing "can" displays
        cy.get('[data-testid="f0a1de60-1999-11e7-af36-7d945160e88f-lightbox-item"]').should('exist');
        // the clear-filter text field 'x' buttons works
        cy.get('[data-testid="spotlights-viewbyimage-filter-text-clear-button"]')
            .should('exist')
            .click();
        // all thumbnails are again displayed
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
            .should('exist')
            .children()
            .should('have.length', 47);
    });
    it('the view-by-history loads correctly from view-by-image', () => {
        // click the top left image in the lightbox
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div > a:first-child')
            .should('exist')
            .click();
        // the view-by-history lightbox loads (it overlays the view-by-image lightbox)
        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('exist');
        // view-by-history close button works
        clickButton('[data-testid="spotlights-viewbyhistory-lightbox-close-button"]', 'Close');
        // the view-by-image lightbox is back in focus
        cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('not.exist');
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-title"]').should('exist');
    });
    it('the view-by-image help button works', () => {
        hasAWorkingHelpButton('admin-spotlights-viewbyimage-help-button');
    });
    it('the view-by-image close button works', () => {
        clickButton('[data-testid="spotlights-viewbyimage-lightbox-close-button"]', 'Close');
        cy.location('href').should('eq', `${Cypress.config('baseUrl')}/admin/spotlights?user=uqstaff`);
        cy.get('[data-testid="spotlights-viewbyimage-lightbox-title"]').should('not.exist');
    });
});
