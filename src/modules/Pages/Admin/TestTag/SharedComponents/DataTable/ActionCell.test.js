import React from 'react';
import ActionCell from './ActionCell';
import { rtlRender } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<ActionCell {...testProps} />);
}
const testFunction = jest.fn();

const testDefaults = {
    api: {
        getRow: testFunction,
    },
    id: 1,
    handleEditClick: testFunction,
    handleDeleteClick: testFunction,
    disableEdit: false,
    disableDelete: false,
    dataFieldKeys: [],
    toolTips: [],
};

describe('ActionCell', () => {
    it('renders component defaults', () => {
        const { getByTestId } = setup(testDefaults);
        expect(getByTestId('action_cell-1-edit-button')).toBeInTheDocument();
        expect(getByTestId('action_cell-1-delete-button')).toBeInTheDocument();
    });
});
