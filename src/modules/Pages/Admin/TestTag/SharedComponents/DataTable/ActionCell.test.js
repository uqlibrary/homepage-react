import React from 'react';

import { render, fireEvent } from 'test-utils';

import ActionCell from './ActionCell';
import { waitForElementToBeRemoved } from '@testing-library/dom';

function setup(testProps = {}, renderer = render) {
    const { row = {}, ...props } = testProps;
    const api = { getRow: () => row };
    return renderer(<ActionCell id={'test'} api={api} {...props} />);
}

describe('ActionCell', () => {
    it('renders component with tooltips', async () => {
        // jest.useFakeTimers();
        const row = { field1: 'test', testKey: 'test value', field2: 'test' };
        const dataFieldKeys = { valueKey: 'testKey' };
        const tooltips = { edit: 'Test edit tooltip', delete: 'Test delete tooltip' };
        const onEditClickFn = jest.fn();
        const onDeleteClickFn = jest.fn();
        const { queryByRole, getByTestId, findByRole } = setup({
            row,
            handleEditClick: onEditClickFn,
            handleDeleteClick: onDeleteClickFn,
            dataFieldKeys,
            tooltips,
        });

        expect(getByTestId('action_cell-test-edit-button')).toHaveAttribute('data-field', 'testKey');
        expect(getByTestId('action_cell-test-edit-button')).toHaveAttribute('data-value', 'test value');
        expect(getByTestId('action_cell-test-edit-button')).toHaveAttribute('data-action', 'edit');

        expect(getByTestId('action_cell-test-delete-button')).toHaveAttribute('data-field', 'testKey');
        expect(getByTestId('action_cell-test-delete-button')).toHaveAttribute('data-value', 'test value');
        expect(getByTestId('action_cell-test-delete-button')).toHaveAttribute('data-action', 'delete');

        fireEvent.mouseOver(getByTestId('tooltip-edit'));
        expect(await findByRole('tooltip')).toHaveTextContent('Test edit tooltip');
        fireEvent.mouseOut(getByTestId('tooltip-edit'));
        await waitForElementToBeRemoved(queryByRole('tooltip'));

        fireEvent.mouseOver(getByTestId('tooltip-delete'));
        expect(await findByRole('tooltip')).toHaveTextContent('Test delete tooltip');
        fireEvent.mouseOut(getByTestId('tooltip-delete'));
        await waitForElementToBeRemoved(queryByRole('tooltip'));

        fireEvent.click(getByTestId('action_cell-test-edit-button'));
        expect(onEditClickFn).toHaveBeenCalled();
        fireEvent.click(getByTestId('action_cell-test-delete-button'));
        expect(onDeleteClickFn).toHaveBeenCalled();
    });

    it('renders component with disabled tooltips', async () => {
        const tooltips = {
            edit: 'Test edit tooltip',
            editDisabled: 'Disabled edit tooltip',
            delete: 'Test delete tooltip',
            deleteDisabled: 'Disabled delete tooltip',
        };
        const onEditClickFn = jest.fn();
        const onDeleteClickFn = jest.fn();
        const { queryByRole, getByTestId, findByRole } = setup({
            handleEditClick: onEditClickFn,
            handleDeleteClick: onDeleteClickFn,
            tooltips,
            disableEdit: true,
            disableDelete: true,
        });

        expect(getByTestId('action_cell-test-edit-button')).toBeInTheDocument();
        expect(getByTestId('action_cell-test-delete-button')).toBeInTheDocument();

        fireEvent.mouseOver(getByTestId('tooltip-edit'));
        expect(await findByRole('tooltip')).toHaveTextContent('Disabled edit tooltip');
        fireEvent.mouseOut(getByTestId('tooltip-edit'));
        await waitForElementToBeRemoved(queryByRole('tooltip'));

        fireEvent.mouseOver(getByTestId('tooltip-delete'));
        expect(await findByRole('tooltip')).toHaveTextContent('Disabled delete tooltip');
    });

    it('renders component without tooltips', async () => {
        const onEditClickFn = jest.fn();
        const onDeleteClickFn = jest.fn();
        const { getByTestId, queryByTestId } = setup({
            handleEditClick: onEditClickFn,
            handleDeleteClick: onDeleteClickFn,
        });

        expect(getByTestId('action_cell-test-edit-button')).toBeInTheDocument();
        expect(getByTestId('action_cell-test-delete-button')).toBeInTheDocument();
        expect(queryByTestId('tooltip-edit')).not.toBeInTheDocument();
        expect(queryByTestId('tooltip-delete')).not.toBeInTheDocument();
    });

    it('renders no buttons if no handlers provided', async () => {
        const { queryByTestId } = setup({});

        expect(queryByTestId('action_cell-test-edit-button')).not.toBeInTheDocument();
        expect(queryByTestId('action_cell-test-delete-button')).not.toBeInTheDocument();
    });
});
