import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';

import RenderImage from './RenderImage';

const fallBackImage = require('../../../../../../public/images/article_placeholder.jpg');

function setup(props = {}) {
    return rtlRender(
        <RenderImage articleindex={0} article={{ image: '/article.jpg', title: 'News' }} isSm={false} {...props} />,
    );
}

describe('RenderImage', () => {
    it('renders the article image and title', () => {
        const { getByRole } = setup();

        expect(getByRole('img', { name: 'News' })).toHaveAttribute('src', '/article.jpg');
    });

    it('uses the placeholder when no image is provided', () => {
        const { getByRole } = setup({ article: { image: null, title: 'News' } });

        expect(getByRole('img', { name: 'News' })).toHaveAttribute('src', fallBackImage);
    });

    it('uses the placeholder when an image fails to load', () => {
        const { getByRole } = setup();
        const image = getByRole('img', { name: 'News' });

        fireEvent.error(image);
        expect(image).toHaveAttribute('src', fallBackImage);
    });

    it('uses the secondary mobile image proportions', () => {
        const { getByRole } = setup({ articleindex: 1, isSm: true });

        expect(getByRole('img', { name: 'News' }).parentElement).toHaveStyle({
            paddingBottom: '91.534%',
            marginBottom: '32px',
        });
    });
});
