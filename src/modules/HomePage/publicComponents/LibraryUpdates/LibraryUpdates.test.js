import React from 'react';
import LibraryUpdates from './LibraryUpdates';
import { rtlRender, WithRouter } from 'test-utils';
import { getByTestId } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(
        <WithRouter>
            <LibraryUpdates {...testProps} />
        </WithRouter>,
    );
}

describe('Library Updates panel', () => {
    it('should render loading panel', () => {
        const props = {
            drupalArticlesLoading: true,
            drupalArticlesError: false,
            drupalArticleList: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('drupal-loading')).toBeInTheDocument();
    });
    it('should render error panel', () => {
        const props = {
            drupalArticlesLoading: false,
            drupalArticlesError: true,
            drupalArticleList: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('drupal-error')).toBeInTheDocument();
    });
    it('should render empty panel', () => {
        const props = {
            drupalArticlesLoading: false,
            drupalArticlesError: false,
            drupalArticleList: [],
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('drupal-empty')).toBeInTheDocument();
    });
});
