import React from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import { useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { MEMBERSHIP_TYPES } from '../membershipFieldRules';
import locale from '../membership.locale';
import MembershipTerms from './MembershipTerms';

const { terms } = locale;

const setup = (type, current = {}) => {
    const { result } = renderHook(() => useForm());

    return render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipTerms type={type} control={result.current.control} current={current} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );
};

describe('MembershipTerms', () => {
    describe('the types that must tick a box', () => {
        it('asks an alumni applicant to confirm they have read their entitlements', () => {
            setup(MEMBERSHIP_TYPES.ALUMNI);

            expect(screen.getByTestId('accept_mandatory_terms-input')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /list of services/ })).toHaveAttribute(
                'href',
                terms.alumniServices.url,
            );
        });

        it('asks a new alumni applicant the same', () => {
            setup(MEMBERSHIP_TYPES.ALUMNI_NEW);

            expect(screen.getByTestId('accept_mandatory_terms-input')).toBeInTheDocument();
        });

        it('does not tell them that submitting is agreement, because ticking the box is', () => {
            setup(MEMBERSHIP_TYPES.ALUMNI);

            expect(screen.queryByText(terms.submissionIndicatesAgreement)).not.toBeInTheDocument();
        });

        it('names the checkbox so it can be read and addressed', () => {
            setup(MEMBERSHIP_TYPES.ALUMNI);

            expect(
                screen.getByRole('checkbox', { name: 'Checking this box indicates you have read and understand:' }),
            ).toBeInTheDocument();
        });

        // Marking the box red says nothing to a screen reader, so the reason is tied to the checkbox itself.
        it('tells the applicant why the box matters when they submit without it', async () => {
            const Harness = () => {
                const { control, safelyHandleSubmit } = useForm();
                return (
                    <form onSubmit={safelyHandleSubmit(() => {})} noValidate>
                        <MembershipTerms type={MEMBERSHIP_TYPES.ALUMNI} control={control} current={{}} />
                        <button type="submit" data-testid="submit">
                            Apply
                        </button>
                    </form>
                );
            };

            render(
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={mui1theme}>
                        <Harness />
                    </ThemeProvider>
                </StyledEngineProvider>,
            );

            await userEvent.click(screen.getByTestId('submit'));

            await waitFor(() =>
                expect(screen.getByTestId('accept_mandatory_terms-error')).toHaveTextContent(
                    'This must be checked before you can continue',
                ),
            );

            const checkbox = screen.getByTestId('accept_mandatory_terms-input');
            expect(checkbox).toHaveAttribute('aria-invalid', 'true');
            expect(checkbox).toHaveAttribute('aria-describedby', 'accept_mandatory_terms-helper-text');
        });

        it('accepts the application once the box is ticked', async () => {
            setup(MEMBERSHIP_TYPES.ALUMNI);

            const checkbox = screen.getByTestId('accept_mandatory_terms-input');
            await userEvent.click(checkbox);

            expect(checkbox).toBeChecked();
        });
    });

    describe('every other type', () => {
        it('tells a community applicant that submitting the form is the agreement', () => {
            setup(MEMBERSHIP_TYPES.COMMUNITY);

            expect(screen.getByText(terms.submissionIndicatesAgreement)).toBeInTheDocument();
            expect(screen.queryByTestId('accept_mandatory_terms-input')).not.toBeInTheDocument();
        });

        it('shows the agreements the type config adds, links and all', () => {
            setup(MEMBERSHIP_TYPES.COMMUNITY, {
                agreement: [
                    'I have reviewed <a target="_blank" href="https://web.library.uq.edu.au/rules">borrowing privileges</a> and I am aware of my entitlements',
                ],
            });

            expect(screen.getByRole('link', { name: /borrowing privileges/ })).toHaveAttribute(
                'href',
                'https://web.library.uq.edu.au/rules',
            );
        });

        it('copes with a type whose config lists no agreements', () => {
            setup(MEMBERSHIP_TYPES.COMMUNITY, {});
            expect(screen.getByTestId('membership-terms')).toBeInTheDocument();

            setup(MEMBERSHIP_TYPES.COMMUNITY, { agreement: [] });
            expect(screen.getAllByTestId('membership-terms')).toHaveLength(2);
        });

        // The alumni types state their entitlements above instead, so their config agreements are not repeated.
        it('does not show the config agreements to a type that ticks the box', () => {
            setup(MEMBERSHIP_TYPES.ALUMNI, { agreement: ['<a href="https://example.org/x">Some agreement</a>'] });

            expect(screen.queryByRole('link', { name: 'Some agreement' })).not.toBeInTheDocument();
        });

        it('does not offer the alumni entitlements link to a type it does not apply to', () => {
            setup(MEMBERSHIP_TYPES.COMMUNITY);

            expect(screen.queryByRole('link', { name: /list of services/ })).not.toBeInTheDocument();
        });
    });

    describe('the policies everyone agrees to', () => {
        it('links every policy, in a new window and safely', () => {
            setup(MEMBERSHIP_TYPES.COMMUNITY);

            terms.policies.forEach(policy => {
                const link = screen.getByRole('link', { name: policy.label });
                expect(link).toHaveAttribute('href', policy.url);
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });

        it('always states how personal information is handled', () => {
            setup(MEMBERSHIP_TYPES.COMMUNITY);

            expect(screen.getByText(terms.privacy.title)).toBeInTheDocument();
            expect(screen.getByTestId('membership-privacy')).toHaveTextContent(
                /only requests and uses personal information/,
            );
            expect(screen.getByRole('link', { name: /Privacy Management Policy/ })).toHaveAttribute(
                'href',
                'https://policies.uq.edu.au/document/view-current.php?id=4',
            );
        });
    });
});
