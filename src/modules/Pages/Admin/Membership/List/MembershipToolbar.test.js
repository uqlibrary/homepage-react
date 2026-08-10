import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipToolbar, { typeOptions } from './MembershipToolbar';

const accountTypes = [
    { value: 'hospital', title: 'Hospital' },
    { value: 'community', title: 'Community' },
];

const setup = (props = {}) => {
    const handlers = {
        onSearchText: jest.fn(),
        onType: jest.fn(),
        onSort: jest.fn(),
        onReload: jest.fn(),
        onExport: jest.fn(),
    };
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipToolbar
                    accountTypes={accountTypes}
                    searchText=""
                    type=""
                    sort="newest"
                    reloading={false}
                    pagination={{ total: 42, page: 2, per_page: 20, pages: 3 }}
                    {...handlers}
                    {...props}
                />
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    return handlers;
};

describe('MembershipToolbar', () => {
    it('announces the span of the page within the total', () => {
        setup();

        expect(screen.getByTestId('membership-list-status')).toHaveTextContent('Showing 21–40 of 42 applications');
    });

    it('uses the singular wording for a total of one', () => {
        setup({ pagination: { total: 1, page: 1, per_page: 20, pages: 1 } });

        expect(screen.getByTestId('membership-list-status')).toHaveTextContent('Showing 1–1 of 1 application');
    });

    it('says there are none when the page is empty', () => {
        setup({ pagination: { total: 0, page: 1, per_page: 20, pages: 0 } });

        expect(screen.getByTestId('membership-list-status')).toHaveTextContent('No applications');
    });

    it('reports each keystroke of the search', async () => {
        const { onSearchText } = setup();

        await userEvent.type(screen.getByTestId('membership-search-name'), 'a');

        expect(onSearchText).toHaveBeenCalledWith('a');
    });

    it('offers a clear button only once there is something to clear', async () => {
        const { onSearchText } = setup({ searchText: 'smith' });

        await userEvent.click(screen.getByTestId('membership-search-clear'));

        expect(onSearchText).toHaveBeenCalledWith('');
    });

    it('hides the clear button while the search is empty', () => {
        setup();

        expect(screen.queryByTestId('membership-search-clear')).not.toBeInTheDocument();
    });

    it('reports the chosen type and sort', async () => {
        const { onType, onSort } = setup();

        await userEvent.selectOptions(screen.getByTestId('membership-filter-type'), 'community');
        await userEvent.selectOptions(screen.getByTestId('membership-sort'), 'oldest');

        expect(onType).toHaveBeenCalledWith('community');
        expect(onSort).toHaveBeenCalledWith('oldest');
    });

    it('reloads from the API on request, and is blocked while a reload is running', async () => {
        const { onReload } = setup();
        await userEvent.click(screen.getByTestId('membership-reload'));
        expect(onReload).toHaveBeenCalled();

        setup({ reloading: true });
        expect(screen.getAllByTestId('membership-reload').at(-1)).toBeDisabled();
    });

    it('exports on request, and reads as busy and is blocked while an export runs', async () => {
        const { onExport } = setup();
        const button = screen.getByTestId('membership-export');
        expect(button).toHaveTextContent('Export CSV');

        await userEvent.click(button);
        expect(onExport).toHaveBeenCalled();

        setup({ exporting: true });
        const running = screen.getAllByTestId('membership-export').at(-1);
        expect(running).toBeDisabled();
        expect(running).toHaveTextContent('Exporting..');
    });

    describe('typeOptions', () => {
        it('sorts the account types by title and defaults to an empty list', () => {
            expect(typeOptions(accountTypes).map(t => t.value)).toEqual(['community', 'hospital']);
            expect(typeOptions()).toEqual([]);
        });
    });
});
