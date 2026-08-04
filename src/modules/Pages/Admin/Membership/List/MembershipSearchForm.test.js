import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipSearchForm, { defaultFilter, typeOptions } from './MembershipSearchForm';

const accountTypes = [
    { value: 'hospital', title: 'Hospital' },
    { value: 'community', title: 'Community' },
];

const setup = (props = {}) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipSearchForm accountTypes={accountTypes} searching={false} onSearch={jest.fn()} {...props} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

describe('MembershipSearchForm', () => {
    it('submits the current filter values', async () => {
        const onSearch = jest.fn();
        setup({ onSearch });

        await userEvent.click(screen.getByTestId('membership-search-button'));

        await waitFor(() => expect(onSearch).toHaveBeenCalled());
        expect(onSearch.mock.calls[0][0]).toEqual(defaultFilter);
    });

    it('disables the button and changes its label while a search is running', () => {
        setup({ searching: true });

        const button = screen.getByTestId('membership-search-button');
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Searching');
    });

    describe('typeOptions', () => {
        it('sorts the account types by title', () => {
            expect(typeOptions(accountTypes)).toEqual([
                { value: 'community', label: 'Community' },
                { value: 'hospital', label: 'Hospital' },
            ]);
        });

        it('defaults to an empty list when no types are given', () => {
            expect(typeOptions()).toEqual([]);
        });
    });
});
