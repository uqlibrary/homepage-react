import React from 'react';
import { render, screen, fireEvent, within, waitFor } from 'test-utils';
import userEvent from '@testing-library/user-event';
import SelectField from './SelectField';

let defaultProps = {};

function setup(props = {}, renderer = render) {
    return renderer(<SelectField {...defaultProps} {...props} />);
}

describe('SelectField', () => {
    beforeEach(() => {
        defaultProps = {
            field: 'Asset Type',
            options: [
                { id: 1, label: 'Toaster' },
                { id: 2, label: 'Printer' },
                { id: 3, label: 'Projector' },
            ],
            locale: { label: 'Asset Type', all: 'All asset types' },
            filterModel: { items: [] },
            setFilterModel: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    const id = 'asset-type';

    const getCombobox = () => screen.getByTestId(`${id}-select-filter`).querySelector('[role="combobox"]');

    const openMenu = async () => {
        fireEvent.mouseDown(getCombobox());
        return screen.findByRole('listbox');
    };

    const getFilterModelData = ids => {
        if (!ids) return { items: [] };
        return {
            items: [
                {
                    columnField: defaultProps.field,
                    operatorValue: 'isAnyOf',
                    operator: 'isAnyOf',
                    value: ids,
                },
            ],
        };
    };
    const assertSetFilterModelWasCalledWith = (next, prev) => {
        expect(defaultProps.setFilterModel).toHaveBeenCalled();
        const updater = defaultProps.setFilterModel.mock.calls.at(-1)[0];
        const current = updater(getFilterModelData(prev));

        const expected = getFilterModelData(next);
        expect(current).toEqual(expected);

        return expected;
    };

    it('should render as disabled when there are no options', () => {
        setup({ option: [] });
    });

    it('should display default value', () => {
        const { getByText } = setup();
        expect(getByText('All asset types')).toBeInTheDocument();
    });

    it('should renders selected options ', () => {
        const { getByText, getByTestId } = setup({
            filterModel: getFilterModelData(['2', '3']),
        });

        expect(getByText('Printer, Projector')).toBeInTheDocument();
        expect(getByTestId(`${id}-select-filter-clear-button`)).toBeInTheDocument();
    });

    it('should update filterModel when selecting option', async () => {
        setup();

        const menu = await openMenu();
        await userEvent.click(within(menu).getByText('Toaster'));
        // should close options
        await waitFor(() => {
            expect(menu).not.toBeInTheDocument();
        });

        assertSetFilterModelWasCalledWith(['1']);
    });

    it('should update filterModel when changing selection (multiple)', async () => {
        const { rerender } = setup({ multiple: true });

        // select 1st option
        const menu = await openMenu();
        await userEvent.click(within(menu).getByText('Toaster'));
        let filterModel = assertSetFilterModelWasCalledWith(['1']);

        setup(
            {
                multiple: true,
                filterModel,
            },
            rerender,
        );

        // select 2nd option
        await userEvent.click(within(menu).getByText('Printer'));
        filterModel = assertSetFilterModelWasCalledWith(['1', '2'], filterModel);

        setup(
            {
                multiple: true,
                filterModel,
            },
            rerender,
        );

        // deselect 1st option
        await userEvent.click(within(menu).getByText('Printer'));
        assertSetFilterModelWasCalledWith(['1'], filterModel);
    });

    it('should clear selection', async () => {
        const { getByTestId } = setup({
            filterModel: getFilterModelData(['2', '3']),
        });

        await userEvent.click(getByTestId(`${id}-select-filter-clear-button`));
        assertSetFilterModelWasCalledWith();
    });
});
