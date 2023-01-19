export function saveButtonIsDisabled(expect) {
    expect
        ? cy.get('[data-testid="admin-promopanel-form-button-save"]').should('be.disabled')
        : cy.get('[data-testid="admin-promopanel-form-button-save"]').should('not.be.disabled');
}
export function addScheduleIsDisabled(expect) {
    expect
        ? cy.get('[data-testid="admin-promopanel-form-button-addSchedule"]').should('be.disabled')
        : cy.get('[data-testid="admin-promopanel-form-button-addSchedule"]').should('not.be.disabled');
}
export function previewIsDisabled(expect) {
    expect
        ? cy.get('[data-testid="admin-promopanel-form-button-preview"]').should('be.disabled')
        : cy.get('[data-testid="admin-promopanel-form-button-preview"]').should('not.be.disabled');
}

export function testId(value) {
    return cy.get(`[data-testid="${value}"]`);
}
// export function RichTextContent(content) {
//     cy.window().then(win => {
//         console.log(win.CKEDITOR_VERSION);
//         // win.CKEDITOR_TRANSLATIONS.instances.html_body.setData(content);
//     });
// }
