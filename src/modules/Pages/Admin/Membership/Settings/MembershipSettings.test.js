import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipSettings, {
    DATE_PATTERN,
    isValidExpiry,
    MembershipTypeSetting,
    willUseCalculated,
} from './MembershipSettings';

const calculatedType = { id: 1, name: 'community', expiry: '02-08-2027', computed_expiry: '02-08-2027' };
const overrideType = { id: 5, name: 'hospital', expiry: '31-12-2027', computed_expiry: '24-12-2027' };
const noRuleType = { id: 12, name: 'proxy', expiry: '30-06-2027', computed_expiry: null };

const membershipFormData = {
    account_types: [
        { value: 'community', title: 'Community' },
        { value: 'hospital', title: 'RBWH and STARS' },
    ],
};

const renderPage = (props = {}) => {
    const actions = {
        loadMembershipTypes: jest.fn(),
        loadMembershipFormData: jest.fn(),
        updateMembershipType: jest.fn(),
        ...props.actions,
    };
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter>
                    <MembershipSettings
                        membershipTypes={[calculatedType, overrideType]}
                        membershipFormData={membershipFormData}
                        {...props}
                        actions={actions}
                    />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    return actions;
};

const renderRow = (type = calculatedType, props = {}) => {
    const onSave = props.onSave ?? jest.fn().mockResolvedValue(type);
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipTypeSetting type={type} title={props.title ?? 'Community'} onSave={onSave} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    return onSave;
};

afterEach(() => {
    document.querySelectorAll('uq-site-header').forEach(node => node.remove());
});

describe('MembershipSettings', () => {
    describe('helpers', () => {
        it('isValidExpiry accepts a DD-MM-YYYY date or a blank, and rejects anything else', () => {
            expect(DATE_PATTERN.test('02-08-2027')).toBe(true);
            expect(isValidExpiry('02-08-2027')).toBe(true);
            expect(isValidExpiry('')).toBe(true);
            expect(isValidExpiry('  ')).toBe(true);
            expect(isValidExpiry('2027-08-02')).toBe(false);
            expect(isValidExpiry('soon')).toBe(false);
        });

        it('willUseCalculated treats a blank or the computed date as calculated, and needs a computed rule', () => {
            expect(willUseCalculated('24-12-2027', '24-12-2027')).toBe(true);
            expect(willUseCalculated('24-12-2027', '')).toBe(true);
            expect(willUseCalculated('24-12-2027', '31-12-2027')).toBe(false);
            expect(willUseCalculated(null, '30-06-2027')).toBe(false);
        });
    });

    describe('MembershipTypeSetting', () => {
        it('shows a type on its computed date as using the calculated date', () => {
            renderRow(calculatedType);

            expect(screen.getByTestId('expiry-community-input')).toHaveValue('02-08-2027');
            const status = screen.getByTestId('membership-type-status-community');
            expect(status).toHaveTextContent('Calculated expiry date (default): 02-08-2027.');
            expect(status).toHaveTextContent('Using calculated expiry date.');
            // Unedited, so the status is not qualified with "on update".
            expect(status).not.toHaveTextContent('on update');
        });

        it('shows an overridden type as such, with its computed date to return to', () => {
            renderRow(overrideType, { title: 'RBWH and STARS' });

            const status = screen.getByTestId('membership-type-status-hospital');
            expect(status).toHaveTextContent('Calculated expiry date (default): 24-12-2027.');
            expect(status).toHaveTextContent('Override active.');
        });

        it('reads automation as unavailable for a type with no computed rule', () => {
            renderRow(noRuleType, { title: 'Proxy Borrower' });

            expect(screen.getByTestId('membership-type-status-proxy')).toHaveTextContent('Automation unavailable.');
        });

        it('previews the status live as the date is edited', async () => {
            renderRow(overrideType, { title: 'RBWH and STARS' });
            const input = screen.getByTestId('expiry-hospital-input');
            const status = screen.getByTestId('membership-type-status-hospital');

            // Typing the computed date previews a return to the calculated date.
            await userEvent.clear(input);
            await userEvent.type(input, '24-12-2027');
            expect(status).toHaveTextContent('Using calculated expiry date on update.');

            // Clearing the field previews the same, since a blank drops the override.
            await userEvent.clear(input);
            expect(status).toHaveTextContent('Using calculated expiry date on update.');

            // Any other date previews an override.
            await userEvent.type(input, '01-01-2030');
            expect(status).toHaveTextContent('Override active on update.');
        });

        it('flags a date that is not DD-MM-YYYY and keeps the update out of reach', async () => {
            renderRow();
            const input = screen.getByTestId('expiry-community-input');

            await userEvent.clear(input);
            await userEvent.type(input, '2027/08/02');

            expect(screen.getByTestId('expiry-community-helper-text')).toHaveTextContent(
                'Enter the date as DD-MM-YYYY',
            );
            expect(screen.getByTestId('membership-type-save-community')).toBeDisabled();
        });

        it('offers the update for any valid date, a cleared field included', async () => {
            renderRow();

            // Valid and unedited: still offered, matching the legacy behaviour.
            expect(screen.getByTestId('membership-type-save-community')).toBeEnabled();

            await userEvent.clear(screen.getByTestId('expiry-community-input'));
            expect(screen.getByTestId('membership-type-save-community')).toBeEnabled();
        });

        it('updates an override to the computed date and takes on the calculated status the server returns', async () => {
            // The admin types the computed date; the server drops the override and returns the computed date.
            const onSave = jest.fn().mockResolvedValue({ ...overrideType, expiry: '24-12-2027' });
            renderRow(overrideType, { title: 'RBWH and STARS', onSave });

            const input = screen.getByTestId('expiry-hospital-input');
            await userEvent.clear(input);
            await userEvent.type(input, '24-12-2027');
            await userEvent.click(screen.getByTestId('membership-type-save-hospital'));

            expect(onSave).toHaveBeenCalledWith({ ...overrideType, expiry: '24-12-2027' });
            await waitFor(() => expect(screen.getByTestId('membership-type-saved-hospital')).toBeInTheDocument());
            // The row takes on what the server stored: now on the calculated date, no longer "on update".
            const status = screen.getByTestId('membership-type-status-hospital');
            expect(status).toHaveTextContent('Using calculated expiry date.');
            expect(status).not.toHaveTextContent('on update');
            expect(input).toHaveValue('24-12-2027');

            // Editing again clears the saved note.
            await userEvent.type(input, '9');
            expect(screen.queryByTestId('membership-type-saved-hospital')).not.toBeInTheDocument();
        });

        it('reports an update that failed', async () => {
            const onSave = jest.fn().mockRejectedValue(new Error('nope'));
            renderRow(calculatedType, { onSave });
            const input = screen.getByTestId('expiry-community-input');

            await userEvent.clear(input);
            await userEvent.type(input, '05-05-2028');
            await userEvent.click(screen.getByTestId('membership-type-save-community'));

            await waitFor(() => expect(screen.getByTestId('membership-type-error-community')).toBeInTheDocument());
        });

        it('starts from an empty input for a type with no date set', () => {
            renderRow({ id: 9, name: 'proxy', expiry: null, computed_expiry: null }, { title: 'Proxy Borrower' });

            expect(screen.getByTestId('expiry-proxy-input')).toHaveValue('');
        });

        it('leaves the field empty when a save returns no date', async () => {
            // Clearing a type with no computed rule stores it blank; the server returns a record with no date.
            const onSave = jest.fn().mockResolvedValue({ ...noRuleType, expiry: null });
            renderRow(noRuleType, { title: 'Proxy Borrower', onSave });

            const input = screen.getByTestId('expiry-proxy-input');
            await userEvent.clear(input);
            await userEvent.click(screen.getByTestId('membership-type-save-proxy'));

            await waitFor(() => expect(screen.getByTestId('membership-type-saved-proxy')).toBeInTheDocument());
            expect(input).toHaveValue('');
        });
    });

    it('loads the types and the form data on mount when the store is empty', () => {
        const actions = renderPage({ membershipTypes: null, membershipFormData: null });

        expect(actions.loadMembershipTypes).toHaveBeenCalled();
        expect(actions.loadMembershipFormData).toHaveBeenCalled();
    });

    it('does not reload what the store already holds', () => {
        const actions = renderPage();

        expect(actions.loadMembershipTypes).not.toHaveBeenCalled();
        expect(actions.loadMembershipFormData).not.toHaveBeenCalled();
        expect(screen.getByTestId('membership-settings-list')).toBeInTheDocument();
    });

    it('names each row by its type title, falling back to the type name', () => {
        renderPage({ membershipTypes: [calculatedType, noRuleType] });

        // Titled from the form data...
        expect(screen.getByTestId('membership-type-community')).toHaveTextContent('Community');
        // ...and a type the form data does not name reads by its own name.
        expect(screen.getByTestId('membership-type-proxy')).toHaveTextContent('proxy');
    });

    it('sets the second-level breadcrumb on the site header when one is present', () => {
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        renderPage();

        expect(siteHeader.getAttribute('secondleveltitle')).toBe('Membership expiry settings');
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe('/admin/membership/settings');
    });

    it('shows the calculated-vs-override explanation', () => {
        renderPage();

        expect(screen.getByText(/update automatically to calculated values every day/)).toBeInTheDocument();
        expect(screen.getByText(/set it and forget it/)).toBeInTheDocument();
    });

    it('shows a loader while the types are loading', () => {
        renderPage({ membershipTypes: null, membershipTypesLoading: true });

        expect(screen.getByText('Loading membership types')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-settings-list')).not.toBeInTheDocument();
    });

    it('reports a load failure and can try again', async () => {
        const actions = renderPage({ membershipTypes: null, membershipTypesError: 'It broke' });

        expect(screen.getByTestId('membership-settings-error')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-settings-list')).not.toBeInTheDocument();

        await userEvent.click(screen.getByTestId('membership-settings-retry'));
        expect(actions.loadMembershipTypes).toHaveBeenCalled();
    });

    it('links back to the applications queue', () => {
        renderPage();

        expect(screen.getByTestId('membership-settings-back')).toHaveAttribute('href', '/admin/membership');
    });

    it('updates a type through the update action', async () => {
        const updateMembershipType = jest.fn().mockResolvedValue(calculatedType);
        renderPage({ actions: { updateMembershipType } });

        const input = screen.getByTestId('expiry-community-input');
        await userEvent.clear(input);
        await userEvent.type(input, '09-09-2028');
        await userEvent.click(screen.getByTestId('membership-type-save-community'));

        expect(updateMembershipType).toHaveBeenCalledWith({ ...calculatedType, expiry: '09-09-2028' });
    });
});
