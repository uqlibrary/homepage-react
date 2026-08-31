import React from 'react';
import { rtlRender } from 'test-utils';

import Hero from './Hero';

const defaultTitle = 'Indigenous art and Library discovery trail';
const defaultSubtitle =
    'A self-guided trail to explore Aboriginal and Torres Strait Islander artworks in the University of Queensland Library.';

const setup = (props = {}) => rtlRender(<Hero title={defaultTitle} subtitle={defaultSubtitle} {...props} />);

describe('Hero', () => {
    it('renders a plain string title without an HTML wrapper', () => {
        const { getByRole, getByText } = setup();

        const heading = getByRole('heading', { level: 1, name: defaultTitle });
        expect(heading).toBeInTheDocument();
        expect(heading.querySelector('span')).not.toBeInTheDocument();
        expect(getByText(defaultSubtitle)).toBeInTheDocument();
    });

    it('renders HTML in a string title', () => {
        const title = 'Hector Tjupuru Burton, <em>Punu Tjukurpa</em>, 2013';
        const { getByRole, getByTestId } = setup({ title, subtitle: undefined });

        const heading = getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Hector Tjupuru Burton, Punu Tjukurpa, 2013');
        expect(heading.querySelector('em')).toHaveTextContent('Punu Tjukurpa');

        const announcement = getByTestId('aria-announcement');
        expect(announcement).toHaveTextContent('Hector Tjupuru Burton, Punu Tjukurpa, 2013');
        expect(announcement.querySelector('em')).not.toBeInTheDocument();
    });

    it('renders the configured HTML title for an artwork ID', () => {
        const { getByRole } = setup({ id: 'artwork-punu-tjukurpa', title: undefined, subtitle: undefined });

        const heading = getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent(
            'Hector Tjupuru Burton, Ray Ken, Mick Wikilyiri and Brenton Ken, Punu Tjukurpa, 2013',
        );
        expect(heading.querySelector('em')).toHaveTextContent('Punu Tjukurpa');
    });

    it('omits the subtitle when one is not provided', () => {
        const { getByRole, queryByText } = setup({ subtitle: undefined });

        expect(getByRole('heading', { level: 1, name: defaultTitle })).toBeInTheDocument();
        expect(queryByText(defaultSubtitle)).not.toBeInTheDocument();
    });
});
