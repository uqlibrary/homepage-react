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
            'data-testid': 'boxId',
        });
        expect(getByTestId('boxId')).toBeInTheDocument();
        expect(getByTestId('tntHeaderSkeletonDepartmentTextLoading')).toBeInTheDocument();
    });
    it('should render header text', () => {
        const { getByText, getByTestId } = setup({
            departmentText: 'UQL',
            requiredText: 'is required',
            'data-testid': 'boxId',
        });
        expect(getByTestId('boxId')).toBeInTheDocument();
        expect(getByText('UQL')).toBeInTheDocument();
        expect(getByText('is required')).toBeInTheDocument();
    });
});
