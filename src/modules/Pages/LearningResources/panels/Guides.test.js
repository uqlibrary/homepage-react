import React from 'react';
import { rtlRender } from 'test-utils';
import { Guides } from './Guides';

const setup = (props = {}) => rtlRender(<Guides headingLevel="h2" {...props} />);

describe('Guides component', () => {
    it('shows an error message instead of loading or guide results', () => {
        const { getByTestId, queryByTestId } = setup({
            guideListError: 'Unavailable',
        });

        expect(getByTestId('guides-springshare-error')).toHaveTextContent('Subject guides list currently unavailable');
        expect(queryByTestId('loading-guide-suggestions')).not.toBeInTheDocument();
        expect(queryByTestId('guide-0')).not.toBeInTheDocument();
    });

    it('shows a loading indicator when the guide list is loading without an error', () => {
        const { getByRole, queryByTestId } = setup({ guideListLoading: true });

        expect(getByRole('progressbar', { name: 'Loading guides' })).toBeInTheDocument();
        expect(queryByTestId('no-guides')).not.toBeInTheDocument();
    });

    it('shows the empty state when the guide list is missing or empty', () => {
        const { getByTestId, rerender } = setup();

        expect(getByTestId('no-guides')).toHaveTextContent('No subject guides for this course.');

        rerender(<Guides headingLevel="h2" guideList={[]} />);

        expect(getByTestId('no-guides')).toHaveTextContent('No subject guides for this course.');
    });

    it('renders up to three guides and the permanent resource links', () => {
        const guideList = [
            { title: 'French guide', url: 'https://example.com/french', coursecode: 'FREN1010' },
            { title: 'Biology guide', url: 'https://example.com/biology' },
            { title: 'History guide', url: 'https://example.com/history' },
            { title: 'Extra guide', url: 'https://example.com/extra' },
        ];
        const { getByRole, getByTestId, queryByTestId } = setup({ headingLevel: 'h3', guideList });

        expect(getByRole('heading', { name: 'Subject guides', level: 3 })).toBeInTheDocument();
        expect(getByTestId('guides-FREN1010')).toHaveAttribute('id', 'guides-FREN1010');
        expect(getByTestId('guide-0')).toHaveAttribute('href', 'https://example.com/french');
        expect(getByTestId('guide-0')).toHaveAttribute('aria-label', 'library guide for French guide');
        expect(getByTestId('guide-1')).toHaveTextContent('Biology guide');
        expect(getByTestId('guide-2')).toHaveTextContent('History guide');
        expect(queryByTestId('guide-3')).not.toBeInTheDocument();
        expect(getByTestId('referencingGuides')).toHaveAttribute(
            'href',
            'https://guides.library.uq.edu.au/referencing',
        );
        expect(getByTestId('all-guides')).toHaveAttribute('href', 'https://guides.library.uq.edu.au/all-guides');
    });
});
