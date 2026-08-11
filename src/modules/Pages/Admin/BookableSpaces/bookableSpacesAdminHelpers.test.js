import { displayToastMessage } from './bookableSpacesAdminHelpers';

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
});
