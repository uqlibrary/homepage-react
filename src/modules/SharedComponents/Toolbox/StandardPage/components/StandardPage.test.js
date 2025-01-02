import React from 'react';
import { StandardPage } from './StandardPage';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = { ...testProps };
    return rtlRender(<StandardPage {...props} />);
}

describe('StandardPage component', () => {
    it('renders with content', () => {
        const { getByTestId } = setup({ children: 'test content' });
        expect(getByTestId('StandardPage')).toHaveTextContent('test content');
    });

    it('renders title', () => {
        const testTitle = 'standard page title';
        const { getByTestId } = setup({ title: testTitle });
        expect(getByTestId('StandardPage-title')).toHaveTextContent(testTitle);
    });
});
