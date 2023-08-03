import React from 'react';
import TestTagHeader from './TestTagHeader';
import { rtlRender } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    // const props = {
    //     idLabel: 'test',
    //     ...testProps,
    // };

    return renderer(<TestTagHeader {...testProps} />);
}

describe('TestTagHeader Renders component', () => {
    it('should render skeleton loader', () => {
        const { getByTestId } = setup({
            departmentText: undefined,
            requiredText: undefined,
        });
        expect(getByTestId('test_tag_header')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-skeleton')).toBeInTheDocument();
    });
    it('should render header text', () => {
        const { getByText, getByTestId } = setup({
            departmentText: 'UQL',
        });
        expect(getByTestId('test_tag_header')).toBeInTheDocument();
        expect(getByText('UQL')).toBeInTheDocument();
    });
});
