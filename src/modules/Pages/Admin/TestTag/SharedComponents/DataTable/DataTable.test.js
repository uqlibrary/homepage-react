import React from 'react';

import { render, within, act, fireEvent, preview } from 'test-utils';

import DataTable from './DataTable';

function setup(props = {}, renderer = render) {
    return renderer(<DataTable id={'test'} rowId={'id'} {...props} />);
}

describe('DataTable', () => {
    it('renders component without data', () => {
        const { getByTestId } = setup({});

        expect(getByTestId('data_table-test')).toBeInTheDocument();
    });
    it('renders component with data', () => {
        const rows = [
            { id: 1, field1: 'test 1A', field2: 'test 2A', field3: 'test 3A ' },
            { id: 2, field1: 'test 1B', field2: 'test 2B', field3: 'test 3B' },
            { id: 3, field1: 'test 1C', field2: 'test 2C', field3: 'test 3C' },
        ];
        const columns = [
            { field: 'field1', headerName: 'label 1', minWidth: 200 },
            { field: 'field2', headerName: 'label 2', minWidth: 200 },
            { field: 'field3', headerName: 'label 3', minWidth: 200 },
        ];
        const { getByTestId, getByText } = setup({ rows, columns });

        expect(getByTestId('data_table-test')).toBeInTheDocument();
        expect(getByText('label 1')).toBeInTheDocument();
        expect(getByText('label 2')).toBeInTheDocument();
        expect(getByText('label 3')).toBeInTheDocument();

        expect(getByText('test 1A')).toBeInTheDocument();
        expect(getByText('test 2A')).toBeInTheDocument();
        expect(getByText('test 3A')).toBeInTheDocument();

        expect(getByText('test 1B')).toBeInTheDocument();
        expect(getByText('test 2B')).toBeInTheDocument();
        expect(getByText('test 3B')).toBeInTheDocument();

        expect(getByText('test 1C')).toBeInTheDocument();
        expect(getByText('test 2C')).toBeInTheDocument();
        expect(getByText('test 3C')).toBeInTheDocument();
    });

    it('renders component with sort button and grid height', () => {
        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);

        const rows = [
            { id: 1, field1: 'test 1A', field2: 'test 2A', field3: 'test 3A ' },
            { id: 2, field1: 'test 1B', field2: 'test 2B', field3: 'test 3B' },
            { id: 3, field1: 'test 1C', field2: 'test 2C', field3: 'test 3C' },
        ];
        const columns = [
            { field: 'field1', headerName: 'label 1', minWidth: 200 },
            { field: 'field2', headerName: 'label 2', minWidth: 200 },
            { field: 'field3', headerName: 'label 3', minWidth: 200 },
        ];
        const { getByTestId, getByText, getAllByRole } = setup({
            rows,
            columns,
            defaultSortColumn: 'field2',
            autoHeight: false,
            height: 500,
        });
        preview.debug();
        expect(getByTestId('data_table-test')).toBeInTheDocument();
        expect(getByText('label 1')).toBeInTheDocument();
        expect(getByText('label 2')).toBeInTheDocument();
        expect(getByText('label 3')).toBeInTheDocument();

        expect(within(getAllByRole('columnheader')[1]).getByTitle('Sort')).toBeInTheDocument();
        act(() => {
            fireEvent.click(within(getAllByRole('columnheader')[1]).getByTitle('Sort'));
        });
        expect(setStateMock).toHaveBeenCalled();
    });
});
