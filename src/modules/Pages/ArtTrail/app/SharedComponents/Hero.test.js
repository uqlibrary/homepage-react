import React from 'react';
import { rtlRender } from 'test-utils';

import Hero from './Hero';

const defaultTitle = 'Indigenous art and Library discovery trail';
const defaultSubtitle =
    'A self-guided trail to explore Aboriginal and Torres Strait Islander artworks in the University of Queensland Library.';

const setup = (props = {}) => rtlRender(<Hero title={defaultTitle} subtitle={defaultSubtitle} {...props} />);

describe('Hero', () => {
    it('renders the title as the page heading and shows the subtitle', () => {
        const { getByRole, getByText } = setup();

        expect(getByRole('heading', { level: 1, name: defaultTitle })).toBeInTheDocument();
        expect(getByText(defaultSubtitle)).toBeInTheDocument();
    });

    it('omits the subtitle when one is not provided', () => {
        const { getByRole, queryByText } = setup({ subtitle: undefined });

        expect(getByRole('heading', { level: 1, name: defaultTitle })).toBeInTheDocument();
        expect(queryByText(defaultSubtitle)).not.toBeInTheDocument();
    });
});
