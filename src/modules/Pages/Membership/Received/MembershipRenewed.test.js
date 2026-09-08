import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import locale from '../membership.locale';
import MembershipRenewed from './MembershipRenewed';

const { renewed, received } = locale;

const setup = () =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipRenewed />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

describe('MembershipRenewed', () => {
    it('confirms the renewal went in and says what happens next', () => {
        setup();

        expect(screen.getByTestId('membership-renewed')).toHaveTextContent(renewed.thankYou);
        expect(screen.getByTestId('membership-renewed')).toHaveTextContent(received.notifiedByEmail);
    });

    it('offers a way back to the Library', () => {
        setup();

        expect(screen.getByRole('link', { name: received.backToHomePage.label })).toHaveAttribute(
            'href',
            received.backToHomePage.url,
        );
    });

    it('tells the site header where it is, for the breadcrumb', () => {
        const setAttribute = jest.fn();
        const realQuerySelector = document.querySelector.bind(document);
        jest.spyOn(document, 'querySelector').mockImplementation(selector =>
            selector === 'uq-site-header' ? { setAttribute } : realQuerySelector(selector),
        );

        setup();

        expect(setAttribute).toHaveBeenCalledWith('secondleveltitle', 'Membership');
        expect(setAttribute).toHaveBeenCalledWith('secondLevelUrl', '/membership');
        document.querySelector.mockRestore();
    });

    it('copes when the site header is not on the page', () => {
        const realQuerySelector = document.querySelector.bind(document);
        jest.spyOn(document, 'querySelector').mockImplementation(selector =>
            selector === 'uq-site-header' ? null : realQuerySelector(selector),
        );

        expect(() => setup()).not.toThrow();
        document.querySelector.mockRestore();
    });
});
