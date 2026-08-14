import {
    addBreadcrumbsToSiteHeader,
    closeDeletionConfirmation,
    closeDialog,
    displayToastErrorMessage,
    displayToastMessage,
    getPathRoot,
    getUserPostfix,
    initialisedSpringshareList,
    removeAnyListeners,
    safeCampusIndex,
    showGenericConfirmAndDeleteDialog,
    spacesAdminLink,
    springshareLocations,
    validCampusList,
    validLibraryList,
    weeklyHoursLoaded,
} from './bookableSpacesAdminHelpers';
import { locale } from './bookablespaces.locale';
import { accounts } from '../../../../data/mock/data/account';

describe('bookableSpacesAdminHelpers toast helpers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    it('returns an empty user postfix outside localhost', () => {
        expect(getPathRoot()).toBeDefined();
        expect(getUserPostfix()).toBe('');
    });

    it('returns an empty admin space link when the user is not an admin', () => {
        expect(spacesAdminLink('/admin/spaces', accounts.vanilla)).toBe('');
    });

    it('removes listeners safely when no element is supplied', () => {
        expect(removeAnyListeners(null)).toBe(false);
    });

    it('adds the admin breadcrumbs to the site-header shadow root only once', () => {
        const siteHeader = document.createElement('uq-site-header');
        const shadowRoot = siteHeader.attachShadow({ mode: 'open' });
        const breadcrumbParent = document.createElement('ul');
        breadcrumbParent.id = 'breadcrumb_nav';
        shadowRoot.appendChild(breadcrumbParent);
        document.body.appendChild(siteHeader);

        addBreadcrumbsToSiteHeader(['<li><a href="/admin/spaces/test">Test</a></li>']);
        jest.advanceTimersByTime(200);

        expect(siteHeader.getAttribute('secondleveltitle')).toBe('Spaces');
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe('/spaces');
        expect(breadcrumbParent.querySelector('#secondlevel-site-breadcrumb-link')).not.toBeNull();
        expect(breadcrumbParent.textContent).toContain('Admin');
        expect(breadcrumbParent.textContent).toContain('Test');
    });

    it('exposes the static admin locale values used by the BookableSpaces forms', () => {
        expect(locale.noSpringshareHoursLabel).toContain('No Springshare opening hours');
        expect(locale.unselectedSpringshareOption).toMatchObject({ id: -1, display_name: locale.noSpringshareHoursLabel });
        expect(locale.locations.greatCourtCoordinates).toEqual([-27.49751, 153.01329]);
        expect(locale.form.upload.maxRatio).toBe(2.8);
        expect(locale.form.upload.minRatio).toBe(2.55);
        expect(locale.form.upload.fileTooLarge.confirmButtonLabel).toBe('OK');
    });

    it('renders multiple messages as a stacked toast list', () => {
        displayToastMessage('First toast');
        displayToastMessage('Second toast');

        const toasts = document.querySelectorAll('[data-testid="toast-message"]');
        const container = document.getElementById('locations-toast-container');

        expect(container).not.toBeNull();
        expect(toasts).toHaveLength(2);
        expect(container?.querySelectorAll('.toast')).toHaveLength(2);
        expect(toasts[0]).toHaveTextContent('First toast');
        expect(toasts[1]).toHaveTextContent('Second toast');
    });

    it('renders an error toast with the error styling variant', () => {
        displayToastErrorMessage('Something failed');

        const toast = document.querySelector('[data-testid="toast-message"]');
        expect(toast).toHaveClass('bookable-spaces-toast--error');
        expect(toast).toHaveTextContent('Something failed');
    });

    it('builds a springshare location list without AskUs entries', () => {
        const weeklyHours = {
            locations: [
                {
                    lid: 1,
                    display_name: 'Library B',
                    departments: [
                        { lid: 10, name: 'AskUs Desk' },
                        { lid: 11, name: 'Study rooms' },
                    ],
                },
                { lid: 999, display_name: 'AskUs', departments: [{ lid: 20, name: 'AskUs Desk' }] },
                {
                    lid: 2,
                    display_name: 'Library A',
                    departments: [{ lid: 21, name: 'Quiet Study' }],
                },
            ],
        };

        expect(springshareLocations(weeklyHours)).toEqual([
            { id: 21, display_name: 'Library A - Quiet Study' },
            { id: 11, display_name: 'Library B - Study rooms' },
        ]);
    });

    it('shows and closes a generic delete confirmation dialog', () => {
        document.body.innerHTML = `
            <dialog id="confirmationDialog"><div id="confDialogMessage"></div></dialog>
            <button id="confDialogCancelButton" type="button">Cancel</button>
            <button id="confDialogOkButton" type="button">OK</button>
        `;

        const dialog = document.getElementById('confirmationDialog');
        dialog.showModal = jest.fn();
        dialog.close = jest.fn();

        showGenericConfirmAndDeleteDialog('Delete item?', 'This cannot be undone.');

        expect(document.getElementById('confDialogMessage').innerHTML).toContain('<p>Delete item?</p>');
        expect(document.getElementById('confDialogMessage').innerHTML).toContain('<p>This cannot be undone.</p>');
        expect(dialog.showModal).toHaveBeenCalledTimes(1);

        closeDeletionConfirmation();

        expect(dialog.close).toHaveBeenCalledTimes(1);
        expect(document.getElementById('confDialogMessage').innerHTML).toBe('');
    });

    it('cleans up dialog state and resets buttons when closing the popup dialog', () => {
        document.body.innerHTML = `
            <dialog id="popupDialog"></dialog>
            <div id="dialogMessageContent"></div>
            <div id="warning-icon" class="warning hidden"></div>
            <div id="dialogBody"></div>
            <button id="addNewButton" style="display:none">Add new</button>
            <button id="deleteButton" style="display:none">Delete</button>
            <button id="cancelButton">Cancel</button>
            <button id="saveButton">Save</button>
            <div id="mapWrapper" style="display:block"></div>
        `;

        const dialog = document.getElementById('popupDialog');
        dialog.close = jest.fn();

        closeDialog({ target: { closest: () => dialog } });

        expect(dialog.close).toHaveBeenCalledTimes(1);
        expect(document.getElementById('dialogMessageContent').innerHTML).toBe('');
        expect(document.getElementById('addNewButton')).toHaveTextContent('Add new');
        expect(document.getElementById('addNewButton')).toHaveStyle('display: inline');
        expect(document.getElementById('deleteButton')).toHaveStyle('display: inline');
        expect(document.getElementById('mapWrapper')).toHaveStyle('display: none');
    });

    it('reports when weekly hours are loaded and available', () => {
        expect(
            weeklyHoursLoaded(false, false, {
                locations: [{ display_name: 'Campus library' }],
            }),
        ).toBe(true);
        expect(weeklyHoursLoaded(false, true, { locations: [] })).toBe(false);
        expect(weeklyHoursLoaded(false, false, { locations: [] })).toBe(false);
    });

    it('builds the initial springshare list with a placeholder option', () => {
        const locale = { unselectedSpringshareOption: { id: -1, display_name: 'No selection' } };
        expect(initialisedSpringshareList(locale, { locations: [] })).toEqual([{ id: -1, display_name: 'No selection' }]);
    });

    it('filters campus and library lists to only valid entries', () => {
        const campuses = [
            { campus_id: 1, libraries: [{ floors: [1] }] },
            { campus_id: 2, libraries: [] },
            { campus_id: 3, libraries: [{ floors: [] }] },
            { campus_id: 4, libraries: [{ floors: [1, 2] }] },
        ];

        const libraries = [
            { library_id: 1, floors: [1] },
            { library_id: 2, floors: [] },
            { library_id: 3, floors: [1, 2] },
        ];

        expect(validCampusList(campuses)).toEqual([
            { campus_id: 1, libraries: [{ floors: [1] }] },
            { campus_id: 3, libraries: [{ floors: [] }] },
            { campus_id: 4, libraries: [{ floors: [1, 2] }] },
        ]);
        expect(validLibraryList(libraries)).toEqual([
            { library_id: 1, floors: [1] },
            { library_id: 3, floors: [1, 2] },
        ]);
        expect(safeCampusIndex(campuses, 4)).toBe(3);
        expect(safeCampusIndex(campuses, 99)).toBe(-1);
        expect(safeCampusIndex(null, 1)).toBe(-1);
    });
});
