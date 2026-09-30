import React from 'react';
import { rtlRender } from 'test-utils';

import RenderTextblock from './RenderTextblock';

function setup(props = {}) {
    return rtlRender(
        <RenderTextblock
            articleindex={0}
            article={{ title: 'News', categories: ['Library news'], description: 'A new update.' }}
            isSm={false}
            {...props}
        />,
    );
}

describe('RenderTextblock', () => {
    it('renders the lead article category, title and description', () => {
        const { getByRole, getByText, getByTestId } = setup();

        expect(getByText('Library news')).toBeInTheDocument();
        expect(getByRole('heading', { name: 'News', level: 3 })).toBe(getByTestId('article-1-title'));
        expect(getByText('A new update.')).toBeInTheDocument();
    });

    it('does not show description content for secondary articles', () => {
        const { getByTestId, queryByText } = setup({ articleindex: 1 });

        expect(getByTestId('article-2-title')).toHaveTextContent('News');
        expect(queryByText('A new update.')).not.toBeInTheDocument();
    });

    it.each([null, '   '])('does not render a description for %s', description => {
        const { container } = setup({ article: { title: 'News', categories: ['Library news'], description } });

        expect(container.querySelector('.ArticleDescription')).not.toBeInTheDocument();
    });

    it('uses mobile spacing and title size for a secondary article', () => {
        const { getByRole, getByText } = setup({ articleindex: 1, isSm: true });

        expect(getByText('Library news')).toHaveStyle({ marginTop: '0' });
        expect(getByRole('heading', { name: 'News', level: 3 })).toHaveStyle({
            fontSize: '22px',
            marginRight: '16px',
        });
    });
});
