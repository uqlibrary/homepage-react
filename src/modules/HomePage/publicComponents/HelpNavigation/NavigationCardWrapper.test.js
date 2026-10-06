import React from 'react';
import { rtlRender, WithRouter, within } from 'test-utils';

import NavigationCardWrapper from './NavigationCardWrapper';

function setup(props = {}) {
    return rtlRender(
        <WithRouter>
            <NavigationCardWrapper {...props} />
        </WithRouter>,
    );
}

describe('NavigationCardWrapper', () => {
    it('renders six public navigation cards and their destinations', () => {
        const { getByTestId } = setup();
        const navPanel = within(getByTestId('help-navigation-panel'));
        const links = [
            ['Study and learning support', '/study-and-learning-support'],
            ['Library and student IT help', '/library-and-student-it-help'],
            ['Research and publish', '/research-and-publish'],
            ['Find and borrow', '/find-and-borrow'],
            ['Visit', '/visit'],
            ['About', '/about'],
        ];

        expect(navPanel.getAllByRole('listitem')).toHaveLength(6);
        links.forEach(([heading, path]) => {
            expect(navPanel.getByRole('heading', { name: heading, level: 2 })).toBeInTheDocument();
            expect(navPanel.getByRole('link', { name: new RegExp(`^${heading}`) })).toHaveAttribute(
                'href',
                `https://dev-library-uq.pantheonsite.io${path}`,
            );
        });
        expect(
            navPanel.getByText('Course materials, assignments, training, referencing, teaching and copyright.'),
        ).toBeInTheDocument();
    });

    it('uses third-level headings for a signed-in account after loading', () => {
        const { getByTestId } = setup({ account: { id: 's1234567' }, accountLoading: false });
        const navPanel = within(getByTestId('help-navigation-panel'));

        expect(navPanel.getAllByRole('heading', { level: 3 })).toHaveLength(6);
        expect(navPanel.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it.each([
        ['still loading', { account: { id: 's1234567' }, accountLoading: true }],
        ['no account', { account: null, accountLoading: false }],
    ])('uses second-level headings when %s', (_, props) => {
        const { getByTestId } = setup(props);
        const navPanel = within(getByTestId('help-navigation-panel'));

        expect(navPanel.getAllByRole('heading', { level: 2 })).toHaveLength(6);
        expect(navPanel.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });
});
