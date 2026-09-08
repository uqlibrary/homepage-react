import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import locale from '../membership.locale';
import MembershipLanding from './MembershipLanding';

const { landing } = locale;

const accountTypes = [
    {
        value: 'community',
        title: 'Community',
        description: 'For members of the general public. Membership costs $25 per year.',
    },
    {
        value: 'alumni',
        title: 'Alumni',
        description: 'For <a href="https://web.library.uq.edu.au/alumni">UQ graduates</a> with a UQ username.',
    },
];

const setup = (props = {}) => {
    const actions = {
        loadMembershipFormData: jest.fn(),
        checkIsRenewing: jest.fn(),
        ...props.actions,
    };

    const utils = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter>
                    <MembershipLanding
                        {...{
                            accountLoading: false,
                            membershipFormData: { account_types: accountTypes },
                            membershipFormDataLoading: false,
                            ...props,
                            actions,
                        }}
                    />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );

    return { ...utils, actions };
};

describe('MembershipLanding', () => {
    describe('loading the page', () => {
        it('asks for the membership types when it has none', () => {
            const { actions } = setup({ membershipFormData: null, membershipFormDataLoading: null });

            expect(actions.loadMembershipFormData).toHaveBeenCalledTimes(1);
        });

        it('does not ask again while a request is already in flight', () => {
            const { actions } = setup({ membershipFormData: null, membershipFormDataLoading: true });

            expect(actions.loadMembershipFormData).not.toHaveBeenCalled();
        });

        it('does not ask again once it has them', () => {
            const { actions } = setup();

            expect(actions.loadMembershipFormData).not.toHaveBeenCalled();
        });

        it('does not retry after a failure, so a broken API is not hammered', () => {
            const { actions } = setup({ membershipFormData: null, membershipFormDataError: 'Network error' });

            expect(actions.loadMembershipFormData).not.toHaveBeenCalled();
        });

        it('shows a loader while the types are on their way', () => {
            setup({ membershipFormData: null, membershipFormDataLoading: true });

            expect(screen.getByRole('progressbar')).toBeInTheDocument();
            expect(screen.queryByTestId('membership-type-list')).not.toBeInTheDocument();
        });

        it('tells the applicant when the types could not be loaded', () => {
            setup({ membershipFormData: null, membershipFormDataError: 'Network error' });

            const error = screen.getByTestId('membership-landing-error');
            expect(error).toHaveTextContent(landing.loadFailed);
            // announced without the applicant having to go looking for it (WCAG 4.1.3)
            expect(error).toHaveAttribute('role', 'alert');
        });
    });

    describe('checking for a renewal', () => {
        it('asks whether a signed-in member has a renewal waiting', () => {
            const { actions } = setup({ account: { id: 'uqtester' } });

            expect(actions.checkIsRenewing).toHaveBeenCalledTimes(1);
        });

        it('does not ask on behalf of someone who is not signed in', () => {
            const { actions } = setup({ account: null });

            expect(actions.checkIsRenewing).not.toHaveBeenCalled();
        });

        it('does not ask twice', () => {
            const { actions } = setup({
                account: { id: 'uqtester' },
                membershipRenewing: { renewing: false },
            });

            expect(actions.checkIsRenewing).not.toHaveBeenCalled();
        });

        it('does not ask while the answer is on its way, or after it failed', () => {
            const inFlight = setup({ account: { id: 'uqtester' }, membershipRenewingLoading: true });
            expect(inFlight.actions.checkIsRenewing).not.toHaveBeenCalled();

            const failed = setup({ account: { id: 'uqtester' }, membershipRenewingError: 'Network error' });
            expect(failed.actions.checkIsRenewing).not.toHaveBeenCalled();
        });
    });

    describe('the introduction', () => {
        it('waits until we know whether the visitor is signed in', () => {
            setup({ accountLoading: true });

            expect(screen.queryByTestId('membership-landing-intro')).not.toBeInTheDocument();
        });

        it('offers a returning member a way to log in', () => {
            setup({ account: null });

            expect(screen.getByTestId('membership-landing-returning')).toHaveTextContent(
                landing.anonymous.returningMember,
            );
            expect(screen.getByTestId('membership-landing-login')).toHaveAttribute(
                'href',
                `https://auth.library.uq.edu.au/login?return=${window.btoa(window.location.href)}`,
            );
            expect(screen.queryByTestId('membership-landing-welcome')).not.toBeInTheDocument();
        });

        it('points a member whose membership is due straight at their renewal', () => {
            setup({
                account: { id: 'uqtester' },
                membershipRenewing: { renewing: true, type: 'community', id: 'abc-123', renewal_code: 'xyz789' },
            });

            expect(screen.getByTestId('membership-landing-renewal')).toHaveTextContent(landing.renewing.prompt);
            expect(screen.getByTestId('membership-landing-renew-link')).toHaveAttribute(
                'href',
                '/membership/form/community/abc-123/xyz789',
            );
            expect(screen.queryByTestId('membership-landing-welcome')).not.toBeInTheDocument();
        });

        it('welcomes a signed-in member with nothing to renew', () => {
            setup({ account: { id: 'uqtester' }, membershipRenewing: { renewing: false } });

            expect(screen.getByTestId('membership-landing-welcome')).toHaveTextContent(landing.loggedIn.becomeAMember);
            expect(screen.queryByTestId('membership-landing-renewal')).not.toBeInTheDocument();
            expect(screen.queryByTestId('membership-landing-returning')).not.toBeInTheDocument();
        });

        it('does not offer a renewal to someone who is not signed in, whatever the API said', () => {
            setup({
                account: null,
                membershipRenewing: { renewing: true, type: 'community', id: 'abc-123', renewal_code: 'xyz789' },
            });

            expect(screen.queryByTestId('membership-landing-renewal')).not.toBeInTheDocument();
            expect(screen.getByTestId('membership-landing-returning')).toBeInTheDocument();
        });
    });

    describe('the list of membership types', () => {
        it('offers every type the API returned', () => {
            setup();

            expect(screen.getByTestId('membership-type-community')).toHaveTextContent('Community');
            expect(screen.getByTestId('membership-type-alumni')).toHaveTextContent('Alumni');
        });

        it('renders the description the config wrote', () => {
            setup();

            expect(screen.getByTestId('membership-type-community-description')).toHaveTextContent(
                'For members of the general public. Membership costs $25 per year.',
            );
        });

        // Rebuilt out of React elements rather than injected as HTML - see ConfigText.
        it('renders the links a description carries, without injecting the config as markup', () => {
            setup();

            expect(screen.getByRole('link', { name: 'UQ graduates' })).toHaveAttribute(
                'href',
                'https://web.library.uq.edu.au/alumni',
            );
        });

        it('sends the applicant to the form for the type they chose', () => {
            setup();

            expect(screen.getByTestId('membership-type-community-apply')).toHaveAttribute(
                'href',
                '/membership/form/community',
            );
        });

        // A bare "Apply" would give twelve identical links; naming the type makes each one make sense on its
        // own to anyone tabbing or listening (WCAG 2.4.4).
        it('names the type in each apply link, so the links are told apart', () => {
            setup();

            expect(screen.getByRole('link', { name: 'Apply for Community' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Apply for Alumni' })).toBeInTheDocument();
        });

        // A single list of twelve, not two lists of arbitrary length.
        it('is one list, labelled by the sentence that introduces it', () => {
            setup();

            const list = screen.getByRole('list', { name: landing.chooseType });
            expect(list).toBeInTheDocument();
            expect(screen.getAllByRole('listitem')).toHaveLength(2);
        });

        it('falls back to its own label when the introduction is not there to label it', () => {
            setup({ accountLoading: true });

            expect(screen.getByRole('list', { name: landing.typeListLabel })).toBeInTheDocument();
        });

        it('shows nothing rather than an empty list when the API returned no types at all', () => {
            setup({ membershipFormData: {} });

            expect(screen.queryByTestId('membership-type-list')).not.toBeInTheDocument();
        });
    });

    // MUI's ThemeProvider queries the document too, so only the site header lookup is answered with a stub.
    const mockSiteHeader = siteHeader => {
        const realQuerySelector = document.querySelector.bind(document);
        jest.spyOn(document, 'querySelector').mockImplementation(selector =>
            selector === 'uq-site-header' ? siteHeader : realQuerySelector(selector),
        );
    };

    it('tells the site header where it is, for the breadcrumb', () => {
        const setAttribute = jest.fn();
        mockSiteHeader({ setAttribute });

        setup();

        expect(setAttribute).toHaveBeenCalledWith('secondleveltitle', 'Membership');
        expect(setAttribute).toHaveBeenCalledWith('secondLevelUrl', '/membership');

        document.querySelector.mockRestore();
    });

    it('copes when the site header is not on the page', () => {
        mockSiteHeader(null);

        expect(() => setup()).not.toThrow();

        document.querySelector.mockRestore();
    });
});
