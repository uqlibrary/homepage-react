import React from 'react';
import ActionDialogue from './ActionDialogue';
import { rtlRender, WithRouter, act, fireEvent } from 'test-utils';

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');
        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

const onCancel = jest.fn();
const onProceed = jest.fn();

function setup(testProps = {}, renderer = rtlRender) {
    const id = 'asset-types';
    const data = [
        {
            asset_type_id: 1,
            asset_type_name: 'Power Cord - C13',
            asset_type_class: '',
            asset_type_power_rating: '',
            asset_type: '',
            asset_type_notes: '',
            asset_count: 76,
        },
        {
            asset_type_id: 2,
            asset_type_name: 'Test 2',
            asset_type_class: 'Test',
            asset_type_power_rating: 'Test V',
            asset_type: 'Test',
            asset_type_notes: 'Test item',
            asset_count: 10,
        },
        {
            asset_type_id: 3,
            asset_type_name: 'Test 3',
            asset_type_class: 'Test3',
            asset_type_power_rating: 'Test V3',
            asset_type: 'Test3',
            asset_type_notes: 'Test item3',
            asset_count: 13,
        },
    ];
    const row = { ...data[0] };
    const isOpen = true;
    const noMinContentWidth = false;
    const isBusy = false;
    return renderer(
        <WithRouter>
            <ActionDialogue
                id={id}
                data={data}
                row={row}
                isOpen={isOpen}
                noMinContentWidth={noMinContentWidth}
                onCancel={onCancel}
                onProceed={onProceed}
                isBusy={isBusy}
                {...testProps}
            />
        </WithRouter>,
    );
}

describe('ActionDialogue', () => {
    it('renders component', async () => {
        const { getByTestId } = setup();
        expect(getByTestId('action_dialogue-asset-types-title')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-content')).toHaveTextContent(
            'Delete Power Cord - C13 and reassign all assets to:',
        );
        expect(getByTestId('action_dialogue-asset-types-reassign-select')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-alert')).toBeInTheDocument();
    });
    it('renders component (No MinContentWidth)', async () => {
        const { getByTestId } = setup({ noMinContentWidth: true });
        expect(getByTestId('action_dialogue-asset-types-title')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-content')).toHaveTextContent(
            'Delete Power Cord - C13 and reassign all assets to:',
        );
        expect(getByTestId('action_dialogue-asset-types-reassign-select')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-alert')).toBeInTheDocument();
    });
    it('Select new asset type functions correctly', () => {
        const { getByTestId, getByRole, getAllByRole } = setup({ noMinContentWidth: true });
        expect(getByTestId('action_dialogue-asset-types-title')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-content')).toHaveTextContent(
            'Delete Power Cord - C13 and reassign all assets to:',
        );
        expect(getByTestId('action_dialogue-asset-types-reassign-select')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-alert')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-action-button')).toHaveAttribute('disabled');
        act(() => {
            fireEvent.mouseDown(getByTestId('action_dialogue-asset-types-reassign-select'));
        });
        selectOptionFromListByIndex(1, { getByRole, getAllByRole });
        expect(getByTestId('action_dialogue-asset-types-reassign-input')).toHaveValue('2');
        expect(getByTestId('action_dialogue-asset-types-action-button')).not.toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('action_dialogue-asset-types-action-button'));
        });
        expect(onProceed).toHaveBeenCalled();
    });
    it('renders busy correctly', async () => {
        const { getByTestId } = setup({ isBusy: true });
        expect(getByTestId('action_dialogue-asset-types-title')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-content')).toHaveTextContent(
            'Delete Power Cord - C13 and reassign all assets to:',
        );
        expect(getByTestId('action_dialogue-asset-types-reassign-select')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-alert')).toBeInTheDocument();
        expect(getByTestId('action_dialogue-asset-types-progress')).toBeInTheDocument();
    });
});
