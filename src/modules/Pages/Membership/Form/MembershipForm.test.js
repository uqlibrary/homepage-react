import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import locale from '../membership.locale';
import { isFrozen, isPaymentGatewayOutage } from '../membershipOutage';
import MembershipForm from './MembershipForm';

const { form } = locale;

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

// Both outage windows are in the past, so the real functions are always false; force them on to test the guards.
jest.mock('../membershipOutage', () => ({
    isFrozen: jest.fn(() => false),
    isPaymentGatewayOutage: jest.fn(() => false),
}));

const membershipFormData = {
    account_types: [
        {
            title: 'Community',
            value: 'community',
            conditions: 'For members of the general public. Membership costs $25 per year.',
            payment_options: [{ code: 'COM', description: '12 months ($25)' }],
        },
        { title: 'Fryer Library', value: 'fryer' },
    ],
    titles: ['Mr', 'Ms', 'Dr'],
};

const setup = (props = {}, route = '/membership/form/community') => {
    const actions = {
        loadMembershipFormData: jest.fn(),
        clearMembership: jest.fn(),
        submitMembership: jest.fn().mockResolvedValue({ id: 'abc-123' }),
        ...props.actions,
    };

    const utils = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter initialEntries={[route]}>
                    <Routes>
                        <Route
                            path="/membership/form/:type"
                            element={<MembershipForm {...{ membershipFormData, ...props, actions }} />}
                        />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );

    return { ...utils, actions };
};

const selectOption = async (field, value) => {
    await userEvent.click(screen.getByTestId(`${field}-select`));
    await userEvent.click(screen.getByTestId(`${field}-option-${value}`));
};

const fillInCommunityForm = async () => {
    await selectOption('title', 'Mr');
    await userEvent.type(screen.getByTestId('first_name-input'), 'Jane');
    await userEvent.type(screen.getByTestId('sn-input'), 'Tester');
    await selectOption('date_of_birth_day', '1');
    await selectOption('date_of_birth_month', '02');
    await selectOption('date_of_birth_year', '1970');
    await userEvent.type(screen.getByTestId('mail-input'), 'jane@example.org');
    await userEvent.type(screen.getByTestId('home_address_0-input'), '123 Library Way');
    await userEvent.type(screen.getByTestId('home_address_city-input'), 'St Lucia');
    await userEvent.type(screen.getByTestId('home_address_state-input'), 'QLD');
    await userEvent.type(screen.getByTestId('home_address_postcode-input'), '4067');
    await userEvent.type(screen.getByTestId('phone-input'), '0733654000');
};

describe('MembershipForm', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        isFrozen.mockReturnValue(false);
        isPaymentGatewayOutage.mockReturnValue(false);
    });

    it('closes the form for everyone during a maintenance freeze', () => {
        isFrozen.mockReturnValue(true);
        setup();

        expect(screen.getByTestId('membership-form-frozen')).toHaveTextContent(form.frozen);
        expect(screen.queryByTestId('membership-form')).not.toBeInTheDocument();
    });

    it('turns a paying type away during a payment gateway outage', () => {
        isPaymentGatewayOutage.mockReturnValue(true);
        setup();

        expect(screen.getByTestId('membership-form-outage')).toHaveTextContent(form.paymentGatewayOutage);
        expect(screen.queryByTestId('membership-form')).not.toBeInTheDocument();
    });

    it('loads the form data when it is not yet in the store', () => {
        const { actions } = setup({ membershipFormData: undefined });

        expect(screen.getByText('Loading the application form')).toBeInTheDocument();
        expect(actions.loadMembershipFormData).toHaveBeenCalledTimes(1);
    });

    it('shows an error when the form data could not be loaded', () => {
        setup({ membershipFormDataError: 'boom' });

        expect(screen.getByTestId('membership-form-load-error')).toHaveTextContent(form.loadFailed);
    });

    it('sends an unrecognised type back to the landing chooser', async () => {
        setup({}, '/membership/form/nope');

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/membership', { replace: true }));
    });

    it('renders the community form for a known type', () => {
        setup();

        expect(screen.getByTestId('membership-form')).toBeInTheDocument();
        expect(screen.getByTestId('membership-form-section-account')).toBeInTheDocument();
        expect(screen.getByTestId('membership-form-postcode-help')).toBeInTheDocument();

        const contactUs = screen.getByTestId('membership-form-contact-us');
        expect(contactUs).toHaveAttribute('target', '_blank');
        expect(contactUs).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('introduces the type with its conditions text from the form config', () => {
        setup();

        expect(screen.getByTestId('membership-form-conditions')).toHaveTextContent(
            'For members of the general public. Membership costs $25 per year.',
        );
    });

    it('omits the postcode helper for a type that collects no home address', () => {
        setup({}, '/membership/form/fryer');

        expect(screen.getByTestId('membership-form-section-organisation')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-form-postcode-help')).not.toBeInTheDocument();
        // This fixture entry carries no conditions text, so none is shown.
        expect(screen.queryByTestId('membership-form-conditions')).not.toBeInTheDocument();
    });

    it('sets the second-level breadcrumb on the site header when one is present', () => {
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        setup();

        expect(siteHeader.getAttribute('secondleveltitle')).toBeTruthy();
        expect(siteHeader.getAttribute('secondLevelUrl')).toBeTruthy();
        document.body.removeChild(siteHeader);
    });

    it('sends the application and goes to the received page', async () => {
        const { actions } = setup();

        await fillInCommunityForm();
        await userEvent.click(screen.getByTestId('membership-form-submit'));

        await waitFor(() => expect(actions.submitMembership).toHaveBeenCalledTimes(1));
        const request = actions.submitMembership.mock.calls[0][0];
        expect(request.type).toBe('community');
        expect(request.date_of_birth).toBe('1-02-1970');
        expect(request.payment_code).toBe('COM');

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/membership/received/abc-123'));
    });

    it('reports what is wrong instead of refusing to submit', async () => {
        const { actions } = setup();

        await userEvent.click(screen.getByTestId('membership-form-submit'));

        await waitFor(() =>
            expect(screen.getByTestId('membership-form-error-summary')).toHaveTextContent(form.invalidSummary),
        );
        expect(actions.submitMembership).not.toHaveBeenCalled();
    });

    it('reports a submission that the server rejected', async () => {
        const { actions } = setup({
            actions: { submitMembership: jest.fn().mockRejectedValue({ errors: { mail: 'taken' } }) },
        });

        await fillInCommunityForm();
        await userEvent.click(screen.getByTestId('membership-form-submit'));

        await waitFor(() => expect(actions.submitMembership).toHaveBeenCalled());
        await waitFor(() =>
            expect(screen.getByTestId('membership-form-server-error')).toHaveTextContent(form.submitFailed),
        );
        expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining('/received'));
    });

    it('says it is working, and cannot be submitted twice', () => {
        setup({ membershipSaving: true });

        expect(screen.getByTestId('membership-form-submit')).toBeDisabled();
        expect(screen.getByTestId('membership-form-submit')).toHaveTextContent(form.applying);
    });

    it('drops the record from the store when it unmounts', () => {
        const { unmount, actions } = setup();

        unmount();

        expect(actions.clearMembership).toHaveBeenCalled();
    });
});
