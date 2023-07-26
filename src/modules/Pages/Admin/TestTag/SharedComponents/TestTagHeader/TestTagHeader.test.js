import React from 'react';
import TestTagHeader from './TestTagHeader';
import { rtlRender, renderWithRouter } from 'test-utils';

import InspectionIcon from '@material-ui/icons/Search';
/*

    departmentText: PropTypes.string,
    breadcrumbs: PropTypes.array,
    className: PropTypes.string,
    requiredText: PropTypes.string,
*/

function setup(testProps = {}, renderer = rtlRender) {
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
            requiredText: 'is required',
        });
        expect(getByTestId('test_tag_header')).toBeInTheDocument();
        expect(getByText('UQL')).toBeInTheDocument();
        expect(getByText('is required')).toBeInTheDocument();
    });
    it('should render breadcrumbs with mixed icons', () => {
        const breadcrumbs = [
            {
                title: 'Item 1',
                icon: <InspectionIcon data-testid="item1icon" fontSize={'small'} />,
                link: '#',
            },
            {
                title: 'Item 2',
            },
        ];
        const { getByTestId, queryByTestId } = setup(
            {
                departmentText: 'UQL',
                requiredText: 'is required',
                breadcrumbs,
            },
            renderWithRouter,
        );
        expect(getByTestId('test_tag_header')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-dashboard')).toHaveTextContent('Dashboard');
        expect(getByTestId('test_tag_header-navigation-item-1')).toBeInTheDocument();
        expect(getByTestId('item1icon')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-item-1')).toHaveTextContent('Item 1');
        expect(getByTestId('test_tag_header-navigation-current-page')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-current-page')).toHaveTextContent('Item 2');
        expect(queryByTestId('item2icon')).not.toBeInTheDocument();
    });
    it('should render breadcrumbs all with icons', () => {
        const breadcrumbs = [
            {
                title: 'Item 1',
                icon: <InspectionIcon data-testid="item1icon" fontSize={'small'} />,
                link: '#',
            },
            {
                title: 'Item 2',
                icon: <InspectionIcon data-testid="item2icon" fontSize={'small'} />,
            },
        ];
        const { getByTestId } = setup(
            {
                departmentText: 'UQL',
                requiredText: 'is required',
                breadcrumbs,
            },
            renderWithRouter,
        );
        expect(getByTestId('test_tag_header')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-dashboard')).toHaveTextContent('Dashboard');
        expect(getByTestId('test_tag_header-navigation-item-1')).toBeInTheDocument();
        expect(getByTestId('item1icon')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-item-1')).toHaveTextContent('Item 1');
        expect(getByTestId('test_tag_header-navigation-current-page')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-current-page')).toHaveTextContent('Item 2');
        expect(getByTestId('item2icon')).toBeInTheDocument();
    });
    it('should render breadcrumbs with no icons', () => {
        const breadcrumbs = [
            {
                title: 'Item 1',
                link: '#',
            },
            {
                title: 'Item 2',
            },
        ];
        const { getByTestId, queryByTestId } = setup(
            {
                departmentText: 'UQL',
                requiredText: 'is required',
                breadcrumbs,
            },
            renderWithRouter,
        );
        expect(getByTestId('test_tag_header')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-dashboard')).toHaveTextContent('Dashboard');
        expect(getByTestId('test_tag_header-navigation-item-1')).toBeInTheDocument();
        expect(queryByTestId('item1icon')).not.toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-item-1')).toHaveTextContent('Item 1');
        expect(getByTestId('test_tag_header-navigation-current-page')).toBeInTheDocument();
        expect(getByTestId('test_tag_header-navigation-current-page')).toHaveTextContent('Item 2');
        expect(queryByTestId('item2icon')).not.toBeInTheDocument();
    });
});
