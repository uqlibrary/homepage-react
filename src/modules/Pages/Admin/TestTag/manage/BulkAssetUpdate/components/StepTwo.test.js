import React from 'react';
import {
    rtlRender,
    WithRouter,
    WithReduxStore,
    waitFor,
    userEvent,
    within,
    waitForElementToBeRemoved,
    renderHook,
    screen,
    preview,
} from 'test-utils';
import Immutable from 'immutable';

import assetsList from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssets';
import assetsListMine from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssetsMine';
import siteList from '../../../../../../../data/mock/data/testing/testAndTag/testTagSites';
import floorList from '../../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomList from '../../../../../../../data/mock/data/testing/testAndTag/testTagRooms';
import assetTypeData from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';

import { transformRow } from './utils';

import { useObjectList, FormContext } from '../../../helpers/hooks';

import StepTwo from './StepTwo';

import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';

import { DEFAULT_FORM_VALUES } from '../../BulkAssetUpdate/containers/BulkAssetUpdate';

const defaultList = [
    {
        asset_id: 1,
        asset_type_id_id: 3,
        asset_test_date: '2023-07-22',
        asset_next_test_due_date: '2023-08-06',
        asset_barcode: 'UQL000001',
        asset_room_id_last_seen: 1,
        asset_department_owned_by: 'UQL',
        asset_status: 'AWAITINGTEST',
        created_at: '2023-08-01T05:39:04.000000Z',
        updated_at: '2023-08-01T05:39:04.000000Z',
        asset_type_id: 3,
        asset_type_name: 'BRK-DELL',
        asset_type_class: '2',
        asset_type_power_rating: '10',
        asset_type: 'USB-C power bricks and adapters',
        asset_type_notes: 'Must be tested when connected to a device as they cannot be turned on indply',
        room_id: 1,
        room_id_displayed: 'W212',
        floor_id: 1,
        floor_id_displayed: '1',
        building_id: 1,
        building_name: 'Forgan Smith Building',
        building_id_displayed: '0001',
        site_id: 1,
        site_name: 'St Lucia',
        site_id_displayed: '01',
        latest_inspection_id: 1,
        inspect_comment: '',
        asset_id_displayed: 'UQL000001',
        asset_location: '1-W212 Forgan Smith Building, St Lucia',
    },
    {
        asset_id: 2,
        asset_type_id_id: 1,
        asset_test_date: '2023-07-23',
        asset_next_test_due_date: '2022-08-16',
        asset_barcode: 'UQL000002',
        asset_room_id_last_seen: 1,
        asset_department_owned_by: 'UQL',
        asset_status: 'CURRENT',
        created_at: '2023-08-01T05:39:04.000000Z',
        updated_at: '2023-08-01T05:39:04.000000Z',
        asset_type_id: 1,
        asset_type_name: 'PWRC13-10',
        asset_type_class: 'Cable',
        asset_type_power_rating: '10',
        asset_type: 'IEC C13 Power Cable (10 Amp)',
        asset_type_notes: 'Standard Computer Type Cable',
        room_id: 1,
        room_id_displayed: 'W212',
        floor_id: 1,
        floor_id_displayed: '1',
        building_id: 1,
        building_name: 'Forgan Smith Building',
        building_id_displayed: '0001',
        site_id: 1,
        site_name: 'St Lucia',
        site_id_displayed: '01',
        latest_inspection_id: 3,
        inspect_comment: 'passed, but starting to look dodgy',
        asset_id_displayed: 'UQL000002',
        asset_location: '1-W212 Forgan Smith Building, St Lucia',
    },
];

const defaultLocationState = {
    siteList,
    siteListLoading: false,
    siteListLoaded: true,
    buildingList: siteList[0].buildings,
    buildingListLoading: true,
    floorList: floorList[0],
    floorListLoading: false,
    floorListLoaded: true,
    roomList: roomList[0],
    roomListLoading: false,
    roomListLoaded: true,
};

function setup(testProps = {}, renderer = rtlRender) {
    const { list, excludedList, actions = {}, formContextValue = {}, ...props } = testProps;

    const _formContextValue = {
        formValues: DEFAULT_FORM_VALUES,
        handleChange: jest.fn(() => jest.fn()),
        formValueSignature: '{}',
        ...formContextValue,
    };

    const _state = {
        testTagLocationReducer: {
            ...defaultLocationState,
        },
        accountReducer: {
            accountLoading: false,
            account: { tnt: userData },
        },
        testTagAssetTypesReducer: {
            assetTypesList: assetTypeData,
            assetTypesListLoading: false,
            assetTypesListError: null,
        },
        testTagAssetsReducer: {
            assetsList: assetsList,
            assetsListLoading: false,
            assetsListError: null,
            assetsMineList: assetsListMine,
            assetsMineListLoading: false,
            assetsMineListError: null,
        },
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <FormContext.Provider value={_formContextValue}>
                    <StepTwo
                        id="test"
                        actions={actions}
                        list={list}
                        excludedList={excludedList}
                        isFilterDialogOpen={false}
                        prevStep={jest.fn()}
                        onSubmit={jest.fn()}
                        {...props}
                    />
                </FormContext.Provider>
            </WithRouter>
        </WithReduxStore>,
    );
}

const assertCheckboxStatus = (testId, expected) => {
    const checkbox = screen.getByTestId(testId);
    console.log(testId);
    if (expected) {
        expect(checkbox).toHaveClass('Mui-checked');
    } else {
        expect(checkbox).not.toHaveClass('Mui-checked');
    }
};

const assertCheckboxEnabled = (testId, expected) => {
    const checkbox = screen.getByTestId(testId);
    if (expected) {
        expect(checkbox).not.toHaveClass('Mui-disabled');
    } else {
        expect(checkbox).toHaveClass('Mui-disabled');
    }
};

const assertInputValue = (testId, expected) => expect(screen.getByTestId(testId)).toHaveValue(expected);
const assertLocation = ({ site, building, floor, room }) => {
    !!site && assertInputValue('location_picker-test-step-two-site-input', site);
    !!building && assertInputValue('location_picker-test-step-two-building-input', building);
    !!floor && assertInputValue('location_picker-test-step-two-floor-input', floor);
    !!room && assertInputValue('location_picker-test-step-two-room-input', room);
};
const assertMonthRange = expected => assertInputValue('months_selector-test-step-two-input', expected);
const assertCheckboxes = expected => {
    const mergeExpected = {
        hasLocation: DEFAULT_FORM_VALUES.hasLocation,
        hasAssetStatus: DEFAULT_FORM_VALUES.hasAssetStatus,
        hasAssetType: DEFAULT_FORM_VALUES.hasAssetType,
        hasDiscardStatus: DEFAULT_FORM_VALUES.hasDiscardStatus,
        hasClearNotes: DEFAULT_FORM_VALUES.hasClearNotes,
        ...expected,
    };
    assertCheckboxStatus('accordionWithCheckbox-location-checkbox', mergeExpected.hasLocation);
    assertCheckboxStatus('accordionWithCheckbox-assetStatus-checkbox', mergeExpected.hasAssetStatus);
    assertCheckboxStatus('accordionWithCheckbox-assetType-checkbox', mergeExpected.hasAssetType);
    assertCheckboxStatus('accordionWithCheckbox-discardStatus-checkbox', mergeExpected.hasDiscardStatus);
    assertCheckboxStatus('test_step_two-notes-checkbox', mergeExpected.hasClearNotes);
};
const assertCheckboxesEnabled = (expected = {}) => {
    const mergeExpected = {
        hasLocation: false,
        hasAssetStatus: false,
        hasAssetType: false,
        hasDiscardStatus: false,
        hasClearNotes: false,
        ...expected,
    };
    assertCheckboxEnabled('accordionWithCheckbox-location-checkbox', mergeExpected.hasLocation);
    assertCheckboxEnabled('accordionWithCheckbox-assetStatus-checkbox', mergeExpected.hasAssetStatus);
    assertCheckboxEnabled('accordionWithCheckbox-assetType-checkbox', mergeExpected.hasAssetType);
    assertCheckboxEnabled('accordionWithCheckbox-discardStatus-checkbox', mergeExpected.hasDiscardStatus);
    assertCheckboxEnabled('test_step_two-notes-checkbox', mergeExpected.hasClearNotes);
};

const assertOption = option => screen.queryByRole('option', { name: option });

const assertOptions = (expected, has = true) => {
    expected.forEach(option => {
        if (has) {
            expect(assertOption(option)).toBeInTheDocument();
        } else {
            expect(assertOption(option)).not.toBeInTheDocument();
        }
    });
};

const assertAssetStatus = expected => assertInputValue('asset_status_selector-test-step-two-input', expected);
const assertAssetType = expected => assertInputValue('asset_type_selector-test-step-two-input', expected);
const assertFormSubmitEnabled = (expected = true) => {
    const submitButton = screen.getByTestId('test_step_two-submit-button');
    if (expected) {
        expect(submitButton).not.toHaveAttribute('disabled');
    } else {
        expect(submitButton).toHaveAttribute('disabled');
    }
};
const assertClearButton = async (componentIdLower, fieldName, outerFn, innerFn, clearValue = '') => {
    await userEvent.click(screen.getByTestId(`test_step_two-${componentIdLower}-accordion-action`));
    expect(outerFn).toHaveBeenCalledWith(fieldName);
    expect(innerFn).toHaveBeenCalledWith(clearValue);
};

describe('StepTwo', () => {
    jest.setTimeout(30000);
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders component', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText, getByTestId } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();

        // check state of UI elements
        // location, automatically selected
        expect(getByTestId('accordionWithCheckbox-location-checkbox')).toHaveClass('Mui-checked');
        expect(getByTestId('location_picker-test-step-two-site-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('location_picker-test-step-two-building-input')).toHaveAttribute('disabled');
        expect(getByTestId('location_picker-test-step-two-floor-input')).toHaveAttribute('disabled');
        expect(getByTestId('location_picker-test-step-two-room-input')).toHaveAttribute('disabled');
        expect(getByTestId('months_selector-test-step-two-input')).toHaveValue('-1');
        // asset type
        expect(getByTestId('accordionWithCheckbox-assetType-checkbox')).not.toHaveClass('Mui-checked');
        expect(getByTestId('asset_type_selector-test-step-two-input')).toHaveAttribute('disabled');
        // discard reason
        expect(getByTestId('test_step_two-notes-checkbox')).not.toHaveClass('Mui-checked');
        expect(getByTestId('test_step_two-discard-reason-input')).toHaveAttribute('disabled');
        // clear test notes
        expect(getByTestId('test_step_two-notes-checkbox')).not.toHaveClass('Mui-checked');
        // submit button
        expect(getByTestId('test_step_two-submit-button')).toHaveAttribute('disabled');
    });

    it('back button functions as expected', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const prevStepFn = jest.fn();
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText, getByTestId } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
            prevStep: prevStepFn,
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();

        // check state of UI elements
        // location, automatically selected
        expect(getByTestId('accordionWithCheckbox-location-checkbox')).toHaveClass('Mui-checked');

        // Nav back to step 1
        await userEvent.click(getByTestId('test_step_two-back-button'));
        expect(prevStepFn).toHaveBeenCalled();
    });

    it('location options', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const handleChangeInnerFn = jest.fn();
        const handleChangeFn = jest.fn(() => handleChangeInnerFn);
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
            formContextValue: {
                formValues: {
                    hasLocation: true,
                    fullLocation: { site: 1, building: 1, floor: 1, room: 1 },
                    monthRange: '12',
                },
                handleChange: handleChangeFn,
            },
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();
        assertCheckboxes({ hasLocation: true });
        assertMonthRange('12');
        assertLocation({ site: 'St Lucia', building: '0001 - Forgan Smith Building', floor: '2', room: 'W212' });
        // test clear button

        await assertClearButton('location', 'location', handleChangeFn, handleChangeInnerFn);
    });

    it('location options with asset status', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
            formContextValue: {
                formValues: {
                    hasLocation: true,
                    fullLocation: { site: 1, building: 1, floor: 1, room: 1 },
                    monthRange: '12',
                    hasAssetStatus: true,
                    asset_status: { label: 'IN STORAGE', value: 'INSTORAGE' },
                },
            },
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();

        assertCheckboxes({ hasLocation: true, hasAssetStatus: true });
        assertMonthRange('12');
        assertLocation({ site: 'St Lucia', building: '0001 - Forgan Smith Building', floor: '2', room: 'W212' });
        assertAssetStatus('IN STORAGE');

        await userEvent.click(screen.getByTestId('asset_status_selector-test-step-two-input'));
        assertOptions(['IN STORAGE']);
        assertOptions(['MISSING'], false); // MISSING option should not be present with location
    });

    it('default asset status options', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
            formContextValue: {
                formValues: {
                    hasLocation: false,
                    hasAssetStatus: true,
                    asset_status: { label: 'IN STORAGE', value: 'INSTORAGE' },
                },
            },
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();
        assertCheckboxes({ hasLocation: false, hasAssetStatus: true });
        assertAssetStatus('IN STORAGE');

        await userEvent.click(screen.getByTestId('asset_status_selector-test-step-two-input'));
        assertOptions(['IN STORAGE', 'MISSING']);
    });

    it('asset type', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const handleChangeInnerFn = jest.fn();
        const handleChangeFn = jest.fn(() => handleChangeInnerFn);
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
            formContextValue: {
                formValues: {
                    hasLocation: false,
                    hasAssetType: true,
                    asset_type: { asset_type_id: 3, asset_type_name: 'PowerBoard' },
                },
                handleChange: handleChangeFn,
            },
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();
        assertCheckboxes({ hasLocation: false, hasAssetType: true });
        assertAssetType('PowerBoard');
        assertCheckboxesEnabled({ hasLocation: false, hasAssetType: true, hasClearNotes: true });
        // form submit should be enabled
        assertFormSubmitEnabled();

        // test clear button
        await assertClearButton('asset-type', 'asset_type', handleChangeFn, handleChangeInnerFn);
    });

    it('invalid options 1', () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
            formContextValue: {
                formValues: {
                    hasLocation: true,
                    fullLocation: { site: 1, building: 1, floor: 1, room: 1 },
                    monthRange: '12',
                    hasAssetType: true,
                },
            },
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();
        assertCheckboxes({ hasLocation: true, hasAssetType: true });
        assertCheckboxesEnabled(); // all should be disbaled as this is an invalid combination
        assertFormSubmitEnabled(false);
    });
    it('invalid options 2', () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const list = renderHook(() => useObjectList(defaultList, transformRow)).result;
        const excludedList = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            excludedList: excludedList.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
            formContextValue: {
                formValues: {
                    hasLocation: true,
                    fullLocation: { site: 1, building: 1, floor: 1, room: 1 },
                    monthRange: '12',
                    hasAssetStatus: true,
                    asset_status: { label: 'MISSING', value: 'MISSING' }, // invalid with location
                },
            },
        });

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();
        // checkboxes will be checked
        assertCheckboxes({ hasLocation: true, hasAssetStatus: true });
        // and enabled
        assertCheckboxesEnabled({ hasLocation: true, hasAssetStatus: true, hasClearNotes: true });
        // but form submit should be disabled
        assertFormSubmitEnabled(false);
    });
});
