import React from 'react';
import { UtilityBar } from './UtilityBar';
import { rtlRender, WithRouter } from 'test-utils';
import { fireEvent } from '@testing-library/react';

// UtilityBar lazy-loads the (heavy) Locations panel; stub it so the component under test renders without
// suspending on its dynamic import - this test only exercises UtilityBar's own open/close behaviour.
jest.mock('./Locations', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-locations" />,
}));

const defaultProps = {
    libHours: null,
    libHoursLoading: false,
    libHoursError: false,
    vemcount: null,
    vemcountLoading: false,
    vemcountError: false,
};

const setup = (testProps = {}) =>
    rtlRender(
        <WithRouter>
            <React.Suspense fallback={<div />}>
                <UtilityBar {...defaultProps} {...testProps} />
            </React.Suspense>
        </WithRouter>,
    );

describe('UtilityBar', () => {
    it('ignores a mousedown on the opener control so the open panel does not double-toggle', async () => {
        const { getByTestId, findByTestId } = setup();

        // open the locations/hours panel
        const opener = await findByTestId('hours-accordion-open');
        fireEvent.click(opener);
        expect(getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');

        // A mousedown whose target is the opener button, or its label, must be ignored by the
        // click-outside handler - the control already toggles on its own onClick, so acting here too
        // would close then immediately reopen it. The panel therefore stays open.
        fireEvent.mouseDown(document.getElementById('location-dialog-controller'));
        expect(getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');

        fireEvent.mouseDown(document.getElementById('location-dialog-controller-label'));
        expect(getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'assertive');

        // a mousedown genuinely outside the panel and its control closes it
        fireEvent.mouseDown(document.body);
        expect(getByTestId('locations-wrapper')).toHaveAttribute('aria-live', 'off');
    });
});
