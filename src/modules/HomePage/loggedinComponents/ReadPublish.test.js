import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import { ReadPublish } from './ReadPublish';

function setup() {
    return rtlRender(
        <WithRouter>
            <ReadPublish />
        </WithRouter>,
    );
}

describe('ReadPublish', () => {
    it('shows the journal search and open access publishing links', () => {
        const { getByRole, getByText } = setup();

        expect(getByRole('heading', { name: 'Open access publishing' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'Publish in the right journal' })).toHaveAttribute(
            'href',
            'https://espace.library.uq.edu.au/journals/search/',
        );
        expect(getByText('Find and evaluate the best publishing options using Journal Search.')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Open access publishing agreements' })).toHaveAttribute(
            'href',
            'https://dev-library-uq.pantheonsite.io/research-and-publish/open-research/open-access-publishing-agreements',
        );
        expect(getByText(/for more information\./)).toBeInTheDocument();
    });
});
