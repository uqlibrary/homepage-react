import React from 'react';
import TabPanel from './TabPanel';
import { rtlRender } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<TabPanel {...testProps} />);
}

describe('TabPanel Renders component', () => {
    it('should render panel', () => {
        const { getByTestId } = setup({
            children: <div data-testid="panelChildId" />,
            value: 0,
            index: 0,
            id: 'parentId',
            'data-testid': 'parentId',
        });
        expect(getByTestId('parentId')).toBeInTheDocument();
        expect(getByTestId('panelChildId')).toBeInTheDocument();
    });
    it('should not render panel', () => {
        const { getByTestId, queryByTestId } = setup({
            children: <div data-testid="panelChildId" />,
            value: 1,
            index: 0,
            id: 'parentId',
            'data-testid': 'parentId',
        });
        expect(getByTestId('parentId')).toBeInTheDocument();
        expect(queryByTestId('panelChildId')).not.toBeInTheDocument();
    });
});
