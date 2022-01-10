import { clickButton } from './helpers';

export const numberCurrentPublishedSpotlights = 4;
export const totalCountPastRecords = 34;

export const FILTER_STORAGE_NAME = 'spotlights-admin-filter-term'; // match to SpotlightsListAsTable value

export function getFooterLabel(
    totalCountRecordsAvailable,
    highestRecordNumberDisplayedOnPage = 5,
    lowestRecordNumberDisplayedOnPage = 1,
) {
    // eg '1-5 of 34'
    return `${lowestRecordNumberDisplayedOnPage}-${highestRecordNumberDisplayedOnPage} of ${totalCountRecordsAvailable}`;
}

export function dragzoneIsReadyForDrag() {
    cy.get('[data-testid="dropzone-dragarea"]').should('exist');
    cy.get('[data-testid="dropzone-preview"]').should('not.exist');
    cy.get('[data-testid="spotlights-form-upload-dropzone"').should('contain', 'Drag and drop a spotlight image');
}
export function dragzoneContainsAnImage() {
    cy.get('[data-testid="dropzone-dragarea"]').should('not.exist');
    cy.get('[data-testid="dropzone-preview"]').should('exist');
    cy.get('[data-testid="spotlights-form-upload-dropzone"').should('not.contain', 'Drag and drop a spotlight image');
}

export function dragFileToDropzone(uploadableFile) {
    dragzoneIsReadyForDrag();
    cy.fixture(uploadableFile, 'base64').then(content => {
        cy.get('[data-testid="spotlights-form-upload-dropzone"]')
            // uploadFile is a custom command - see commands.js
            .uploadFile(content, uploadableFile);
    });
    cy.get('[data-testid="dropzone-dragarea"]').should('not.exist');
    cy.get('[data-testid="dropzone-preview"]').should('exist');
}

export function saveButtonisDisabled() {
    cy.get('[data-testid="admin-spotlights-form-button-save"]').should('be.disabled');
}

export function saveButtonNOTDisabled() {
    cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
}

export function showUnpublishedSpotlights() {
    cy.get('[data-testid="spotlights-hideshow-unpublished"] input').check();
}

// we test on 2 different images:
// spotlight-just-right.png and spotlight-too-large.jpg
// we know what the specific dimensions are for each, so can hard code them
export function assertImageWarningIsPresent(dataTestid, isUpload = true) {
    cy.get(`[data-testid="${dataTestid}"]`)
        .should('exist')
        .find('svg path[d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"]')
        .should('exist');
    cy.get(`[data-testid="${dataTestid}"]`).should('contain', 'Dimensions: 1967px by 721px (aspect ratio: 2.73).');
    if (isUpload) {
        cy.get(`[data-testid="${dataTestid}"]`).should(
            'contain',
            'Larger images will affect page load time and smaller ones may be pixelated',
        );
    }
}
export function assertImageOKIsPresent(dataTestid) {
    cy.get(`[data-testid="${dataTestid}"]`)
        .should('exist')
        .should('contain', 'Dimensions: 813px by 298px (aspect ratio: 2.73).')
        .find('svg path[d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"]')
        .should('exist');
}

export function removeImageFromDragzone() {
    cy.get('button[data-testid="spotlights-form-remove-image"]').click();
}

export const placeholderImage =
    'https://app-testing.library.uq.edu.au/file/public/3530e810-40e5-11ec-b167-ad28af8d7358.png';

export function hasAWorkingHelpButton(idHelpButton = 'admin-spotlights-help-button') {
    // help is not initially displayed
    cy.get('[data-testid="help-drawer-title"]').should('not.exist');

    // click the help button
    clickButton(`[data-testid="${idHelpButton}"]`, 'Help');

    // we can see the help contents
    cy.get('[data-testid="help-drawer-title"]').scrollIntoView();
    cy.get('[data-testid="help-drawer-title"]').should('be.visible');

    // the close button works
    clickButton('[data-testid="spotlights-helpdrawer-close-button"]', 'Close');
    cy.get('[data-testid="help-drawer-title"]').should('not.exist');
}
