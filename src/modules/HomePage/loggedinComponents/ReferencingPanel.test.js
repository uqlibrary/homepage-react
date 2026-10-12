import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import { ReferencingPanel } from './ReferencingPanel';

function setup(account) {
    return rtlRender(
        <WithRouter>
            <ReferencingPanel account={account} />
        </WithRouter>,
    );
}

describe('ReferencingPanel', () => {
    it('shows style guides and Endnote for an eligible signed-in user', () => {
        const { getByRole, getByText } = setup({ id: 's1234567', user_group: 'UG' });

        expect(getByText('APA, Chicago, Vancouver and more')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Endnote referencing software' })).toHaveAttribute(
            'href',
            'https://guides.library.uq.edu.au/tools-and-techniques/endnote-referencing-software',
        );
        expect(getByText('Download and support')).toBeInTheDocument();
    });

    it.each([
        ['signed-out users', null],
        ['users without Endnote access', { id: 'community', user_group: 'COMMU' }],
    ])('shows only style guides for %s', (_, account) => {
        const { queryByRole, getByText, queryByText } = setup(account);

        expect(getByText('APA, Chicago, Vancouver and more')).toBeInTheDocument();
        expect(queryByRole('link', { name: 'Endnote referencing software' })).not.toBeInTheDocument();
        expect(queryByText('Download and support')).not.toBeInTheDocument();
    });
});
