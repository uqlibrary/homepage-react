import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { SidebarFilters } from './SidebarFilters';

describe('SidebarFilters campus selector', () => {
    const theme = createTheme({
        palette: {
            primary: { main: '#51247a', light: '#7f5b97', dark: '#360f52' },
            designSystem: {
                border: '1px solid #e5e5e5',
                bodyCopy: '#333',
                alert: { info: '#f0f0f0', warning: '#fdf2d7' },
            },
        },
    });

    const renderWithTheme = props =>
        render(
            <ThemeProvider theme={theme}>
                <SidebarFilters {...props} />
            </ThemeProvider>,
        );

    const renderWithStatefulTheme = props => {
        const ControlledSidebarFilters = () => {
            const [selectedFacilityTypes, setSelectedFacilityTypes] = React.useState(props.selectedFacilityTypes || []);
            const [capacityFilterValue, setCapacityFilterValue] = React.useState(props.capacityFilterValue || [1, 50]);

            return (
                <ThemeProvider theme={theme}>
                    <SidebarFilters
                        {...baseProps}
                        {...props}
                        selectedFacilityTypes={selectedFacilityTypes}
                        setSelectedFacilityTypes={setSelectedFacilityTypes}
                        capacityFilterValue={capacityFilterValue}
                        setCapacityFilterValue={setCapacityFilterValue}
                    />
                </ThemeProvider>
            );
        };

        return render(<ControlledSidebarFilters />);
    };

    const baseProps = {
        facilityTypeList: { data: { facility_type_groups: [] } },
        facilityTypeListLoading: false,
        facilityTypeListError: false,
        selectedFacilityTypes: [],
        setSelectedFacilityTypes: jest.fn(),
        filteredFacilityTypeList: { data: { facility_type_groups: [] } },
        minimumSpaceCapacity: 1,
        maximumSpaceCapacity: 50,
        capacityFilterValue: [1, 50],
        setCapacityFilterValue: jest.fn(),
        selectedCampus: 1,
        handleCampusSelection: jest.fn(),
        campusList: [
            { campus_id: 1, campus_name: 'St Lucia', campus_space_count: 10 },
            { campus_id: 2, campus_name: 'Gatton', campus_space_count: 5 },
        ],
        activeFilterCount: 0,
        librariesForCampus: [],
        selectedLibrary: 0,
        handleLibrarySelection: jest.fn(),
        onApplyAllFilters: jest.fn(),
    };

    const facilityGroupFixture = {
        data: {
            facility_type_groups: [
                {
                    facility_type_group_id: 1,
                    facility_type_group_name: 'Facilities',
                    facility_type_group_order: 1,
                    facility_type_group_loads_open: false,
                    facility_type_children: [
                        {
                            facility_type_id: 57,
                            facility_type_name: 'Natural light',
                            facility_special_action: null,
                        },
                    ],
                },
            ],
        },
    };

    const selectedNaturalLightFilter = [
        {
            facility_type_group_id: 1,
            facility_type_id: 57,
            selected: true,
            unselected: false,
            facility_special_action: null,
        },
    ];

    it('puts the reset filters control in the sidebar header and removes the legacy remove-all button', () => {
        renderWithTheme({
            ...baseProps,
            onResetAllFilters: jest.fn(),
            activeFilterCount: 1,
            selectedFacilityTypes: selectedNaturalLightFilter,
            filteredFacilityTypeList: facilityGroupFixture,
            facilityTypeList: facilityGroupFixture,
        });

        expect(screen.getByText('Filter spaces')).toBeInTheDocument();
        expect(screen.getByTestId('reset-filters-button')).toHaveTextContent('Reset filters');
        expect(screen.queryByRole('button', { name: /remove all filters/i })).not.toBeInTheDocument();
    });

    it('offers an all-campuses option in the campus selector', async () => {
        renderWithTheme(baseProps);

        fireEvent.mouseDown(screen.getByRole('combobox'));

        expect(await screen.findByRole('option', { name: 'All campuses' })).toBeInTheDocument();
    });

    it('shows the library selector when there is more than one library option', () => {
        renderWithTheme({
            ...baseProps,
            librariesForCampus: [
                { library_id: 0, library_name: 'All libraries' },
                { library_id: 1, library_name: 'Central Library' },
                { library_id: 2, library_name: 'Law Library' },
            ],
        });

        expect(screen.getByTestId('filter-by-library')).toBeInTheDocument();
        expect(screen.getByText('Choose library')).toBeInTheDocument();
    });

    it('shows the space capacity slider even when the bookable filter is not selected', () => {
        renderWithTheme({
            ...baseProps,
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_children: [
                                {
                                    facility_type_id: 9002,
                                    facility_type_name: 'Bookable',
                                    facility_special_action: 'bookable',
                                },
                                {
                                    facility_type_id: 9003,
                                    facility_type_name: 'Space capacity',
                                    facility_special_action: 'capacity',
                                },
                            ],
                        },
                    ],
                },
            },
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9002,
                    selected: false,
                    unselected: false,
                    facility_special_action: 'bookable',
                },
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: false,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
        });

        fireEvent.click(screen.getByText('Facilities'));

        expect(screen.getByText('Space capacity')).toBeInTheDocument();
        expect(screen.getAllByRole('slider').length).toBeGreaterThan(0);
    });

    it('allows the left handle to render fully at the minimum value without clipping', () => {
        const capacityGroupFixture = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            {
                                facility_type_id: 9003,
                                facility_type_name: 'Space capacity',
                                facility_special_action: 'capacity',
                            },
                        ],
                    },
                ],
            },
        };

        renderWithTheme({
            ...baseProps,
            facilityTypeList: capacityGroupFixture,
            filteredFacilityTypeList: capacityGroupFixture,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
            capacityFilterValue: [1, 50],
        });

        const firstHandle = document.querySelector('.MuiSlider-thumb[data-index="0"]');
        expect(firstHandle).not.toBeNull();
        expect(getComputedStyle(firstHandle).marginLeft).toBe('0.7rem');
    });

    it('creates a selected capacity filter when the slider is changed before the filter exists in state', () => {
        const setSelectedFacilityTypes = jest.fn();
        const capacityGroupFixture = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            {
                                facility_type_id: 9003,
                                facility_type_name: 'Space capacity',
                                facility_special_action: 'capacity',
                            },
                        ],
                    },
                ],
            },
        };

        renderWithTheme({
            ...baseProps,
            facilityTypeList: capacityGroupFixture,
            setSelectedFacilityTypes,
            selectedFacilityTypes: [],
            filteredFacilityTypeList: capacityGroupFixture,
        });

        fireEvent.change(screen.getByTestId('capacitySlider-inputRight'), { target: { value: '8' } });

        expect(setSelectedFacilityTypes).toHaveBeenCalled();
        const updater = setSelectedFacilityTypes.mock.calls.find(([value]) => typeof value === 'function')?.[0];

        expect(updater).toEqual(expect.any(Function));
        expect(updater([])).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    facility_type_id: 9003,
                    selected: true,
                    facility_special_action: 'capacity',
                }),
            ]),
        );
    });

    it('keeps the active capacity bound when one side of the range is temporarily cleared while editing', () => {
        const setCapacityFilterValue = jest.fn();
        const capacityGroupFixture = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            {
                                facility_type_id: 9003,
                                facility_type_name: 'Space capacity',
                                facility_special_action: 'capacity',
                            },
                        ],
                    },
                ],
            },
        };

        renderWithTheme({
            ...baseProps,
            facilityTypeList: capacityGroupFixture,
            setCapacityFilterValue,
            capacityFilterValue: [8, 24],
            filteredFacilityTypeList: capacityGroupFixture,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
        });

        fireEvent.change(screen.getByTestId('capacitySlider-inputLeft'), { target: { value: '' } });

        expect(setCapacityFilterValue).toHaveBeenLastCalledWith([8, 24]);
    });

    it('only shows the capacity filter once in the active filter list and clears it when dismissed', () => {
        let latestState = [
            { facility_type_group_id: 1, facility_type_id: 9002, selected: true, unselected: false },
            { facility_type_group_id: 1, facility_type_id: 9003, selected: true, unselected: false },
            { facility_type_group_id: 1, facility_type_id: 57, selected: true, unselected: false },
        ];
        const setSelectedFacilityTypes = jest.fn(updater => {
            latestState = typeof updater === 'function' ? updater(latestState) : updater;
            return latestState;
        });
        const setCapacityFilterValue = jest.fn();
        const props = {
            ...baseProps,
            activeFilterCount: 1,
            capacityFilterValue: [4, 8],
            setSelectedFacilityTypes,
            setCapacityFilterValue,
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_children: [
                                { facility_type_id: 57, facility_type_name: 'Natural light' },
                                { facility_type_id: 9002, facility_type_name: 'Bookable' },
                                { facility_type_id: 9003, facility_type_name: 'Space capacity' },
                            ],
                        },
                    ],
                },
            },
            selectedFacilityTypes: latestState,
        };

        renderWithTheme(props);

        expect(screen.getByTestId('space-filter-count')).toHaveTextContent('Active filters: 1');
        expect(screen.queryByTestId('button-deselect-selected-capacity')).not.toBeInTheDocument();
        fireEvent.click(screen.getByTestId('button-deselect-selected-9003'));

        expect(latestState).toHaveLength(3);
        expect(latestState.find(f => f.facility_type_id === 9002)).toMatchObject({ selected: true });
        expect(latestState.find(f => f.facility_type_id === 9003)).toMatchObject({ selected: false });
        expect(latestState.find(f => f.facility_type_id === 57)).toMatchObject({ selected: true });
        expect(setCapacityFilterValue).toHaveBeenCalledWith([1, 50]);
    });

    it('resets the capacity range when a different space type is selected', () => {
        const setCapacityFilterValue = jest.fn();
        const facilityList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            { facility_type_id: 57, facility_type_name: 'Natural light' },
                            { facility_type_id: 9003, facility_type_name: 'Space capacity' },
                        ],
                    },
                ],
            },
        };

        const props = {
            ...baseProps,
            facilityTypeList: facilityList,
            capacityFilterValue: [4, 8],
            setCapacityFilterValue,
            filteredFacilityTypeList: facilityList,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
        };

        window.sessionStorage.setItem(
            'bookableSpacesJourneyLiveFilterState',
            JSON.stringify({
                capacityFilterValue: [4, 8],
                selectedFacilityTypes: [{ facility_type_id: 9003, selected: true }],
            }),
        );

        renderWithTheme(props);

        fireEvent.click(screen.getByTestId('filtertype-57'));

        expect(setCapacityFilterValue).toHaveBeenCalledWith([1, 50]);
        expect(window.sessionStorage.getItem('bookableSpacesJourneyLiveFilterState')).not.toContain(
            'capacityFilterValue',
        );
    });

    it('opens the parent group for journey intent preselected filters', async () => {
        renderWithTheme({
            ...baseProps,
            suppliedClassName: 'journeyFilterSidebar',
            facilityTypeList: facilityGroupFixture,
            filteredFacilityTypeList: facilityGroupFixture,
            selectedFacilityTypes: selectedNaturalLightFilter,
        });

        expect(await screen.findByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'block' });
        expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'none' });
    });

    it('does not force reopen after user manually collapses an auto-opened selected group', async () => {
        const props = {
            ...baseProps,
            suppliedClassName: 'journeyFilterSidebar',
            facilityTypeList: facilityGroupFixture,
            filteredFacilityTypeList: facilityGroupFixture,
            selectedFacilityTypes: selectedNaturalLightFilter,
        };

        const { rerender } = renderWithTheme(props);

        expect(await screen.findByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'block' });

        fireEvent.click(screen.getByTestId('facility-type-group-1'));

        expect(screen.getByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'none' });
        expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'block' });

        rerender(
            <ThemeProvider theme={theme}>
                <SidebarFilters {...props} />
            </ThemeProvider>,
        );

        expect(screen.getByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'none' });
        expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'block' });
    });

    it('toggles the group when the group title is clicked', async () => {
        renderWithTheme({
            ...baseProps,
            facilityTypeList: facilityGroupFixture,
            filteredFacilityTypeList: facilityGroupFixture,
        });

        expect(await screen.findByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'block' });
        expect(screen.getByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'none' });

        fireEvent.click(screen.getByText('Facilities'));

        expect(screen.getByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'block' });
        expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'none' });
    });

    it('removes the final persisted capacity state when the default capacity range is restored', () => {
        const setSelectedFacilityTypes = jest.fn();
        const capacityGroupFixture = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            {
                                facility_type_id: 9003,
                                facility_type_name: 'Space capacity',
                                facility_special_action: 'capacity',
                            },
                        ],
                    },
                ],
            },
        };

        window.sessionStorage.setItem(
            'bookableSpacesJourneyLiveFilterState',
            JSON.stringify({
                capacityFilterValue: [6, 18],
            }),
        );

        renderWithTheme({
            ...baseProps,
            facilityTypeList: capacityGroupFixture,
            filteredFacilityTypeList: capacityGroupFixture,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
            setSelectedFacilityTypes,
            capacityFilterValue: [6, 18],
        });

        fireEvent.change(screen.getByTestId('capacitySlider-inputRight'), { target: { value: '1' } });
        fireEvent.change(screen.getByTestId('capacitySlider-inputLeft'), { target: { value: '50' } });

        expect(window.sessionStorage.getItem('bookableSpacesJourneyLiveFilterState')).toBeNull();
    });

    it('clears a special capacity filter when it is reset back to its default range', () => {
        const setSelectedFacilityTypes = jest.fn();
        const setCapacityFilterValue = jest.fn();
        const facilityList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            { facility_type_id: 9003, facility_type_name: 'Space capacity', facility_special_action: 'capacity' },
                        ],
                    },
                ],
            },
        };

        renderWithTheme({
            ...baseProps,
            facilityTypeList: facilityList,
            filteredFacilityTypeList: facilityList,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
            setSelectedFacilityTypes,
            setCapacityFilterValue,
            capacityFilterValue: [12, 24],
        });

        fireEvent.change(screen.getByTestId('capacitySlider-inputLeft'), { target: { value: '50' } });

        expect(setSelectedFacilityTypes).toHaveBeenCalled();
        expect(setCapacityFilterValue).toHaveBeenLastCalledWith([12, 50]);
    });

    it('renders the active capacity cartouche and favourite toggle when only those filters are active', () => {
        renderWithTheme({
            ...baseProps,
            activeFilterCount: 2,
            selectedFacilityTypes: [],
            capacityFilterValue: [4, 12],
            isLoggedIn: true,
            hasFavouriteSpaces: true,
            showFavouriteSpacesOnly: true,
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [
                                { facility_type_id: 57, facility_type_name: 'Natural light' },
                                { facility_type_id: 9003, facility_type_name: 'Space capacity', facility_special_action: 'capacity' },
                            ],
                        },
                    ],
                },
            },
        });

        expect(screen.getByTestId('button-deselect-selected-capacity')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: /your favourites/i })).toBeChecked();
        expect(screen.getByText('Your favourites')).toBeInTheDocument();
    });

    it('shows the collapsed group count and empty-group message when a closed group has selected entries', () => {
        const fixture = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: false,
                        facility_type_children: [],
                    },
                ],
            },
        };

        renderWithTheme({
            ...baseProps,
            facilityTypeList: fixture,
            filteredFacilityTypeList: fixture,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 57,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
        });

        expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'block' });
        expect(screen.getByTestId('facility-type-group-1-expanded-count')).toHaveTextContent('(1 of 0)');

        fireEvent.click(screen.getByTestId('facility-type-group-1'));

        expect(screen.getByText('No filters available')).toBeInTheDocument();
    });

    it('accepts non-numeric facility ids for the string-based match fallback in deselection logic', () => {
        const setSelectedFacilityTypes = jest.fn();
        renderWithTheme({
            ...baseProps,
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [
                                { facility_type_id: 'custom', facility_type_name: 'Custom option' },
                            ],
                        },
                    ],
                },
            },
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 'custom',
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            setSelectedFacilityTypes,
        });

        fireEvent.click(document.getElementById('button-deselect-selected-custom'));

        expect(setSelectedFacilityTypes).toHaveBeenCalled();
    });

    it('clears persisted journey capacity state and ignores malformed session JSON during reset', () => {
        window.sessionStorage.setItem('bookableSpacesJourneyViewState', '{bad json');
        window.sessionStorage.setItem(
            'bookableSpacesJourneyLiveFilterState',
            JSON.stringify({ capacityFilterValue: [8, 16], other: 'keep' }),
        );

        renderWithTheme({
            ...baseProps,
            activeFilterCount: 1,
            onResetAllFilters: jest.fn(),
            selectedFacilityTypes: selectedNaturalLightFilter,
            filteredFacilityTypeList: facilityGroupFixture,
            facilityTypeList: facilityGroupFixture,
        });

        fireEvent.click(screen.getByTestId('reset-filters-button'));

        expect(window.sessionStorage.getItem('bookableSpacesJourneyLiveFilterState')).toBe(JSON.stringify({ other: 'keep' }));
    });

    it('gracefully handles undefined sessionStorage while rendering a journey group', () => {
        const originalSessionStorage = window.sessionStorage;
        Object.defineProperty(window, 'sessionStorage', {
            value: undefined,
            configurable: true,
        });

        renderWithTheme({
            ...baseProps,
            suppliedClassName: 'journeyFilterSidebar',
            selectedFacilityTypes: [],
            filteredFacilityTypeList: facilityGroupFixture,
            facilityTypeList: facilityGroupFixture,
        });

        fireEvent.click(screen.getByTestId('facility-type-group-1'));

        Object.defineProperty(window, 'sessionStorage', {
            value: originalSessionStorage,
            configurable: true,
        });
    });

    it('scrolls to the sidebar and resets a default capacity range when the special filter is cleared', () => {
        const facilityList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            { facility_type_id: 9003, facility_type_name: 'Space capacity', facility_special_action: 'capacity' },
                        ],
                    },
                ],
            },
        };

        const scrollIntoView = jest.fn();
        const focus = jest.fn();
        const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
        const originalFocus = HTMLElement.prototype.focus;

        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
            configurable: true,
            value: scrollIntoView,
        });
        Object.defineProperty(HTMLElement.prototype, 'focus', {
            configurable: true,
            value: focus,
        });

        renderWithStatefulTheme({
            ...baseProps,
            facilityTypeList: facilityList,
            filteredFacilityTypeList: facilityList,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
            capacityFilterValue: [10, 20],
        });

        fireEvent.change(screen.getByTestId('capacitySlider-inputRight'), { target: { value: '1' } });
        fireEvent.change(screen.getByTestId('capacitySlider-inputLeft'), { target: { value: '50' } });

        expect(scrollIntoView).toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();

        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
            configurable: true,
            value: originalScrollIntoView,
        });
        Object.defineProperty(HTMLElement.prototype, 'focus', {
            configurable: true,
            value: originalFocus,
        });
    });

    it('covers min/max blur validation and invalid numeric strings for the capacity range', () => {
        const setCapacityFilterValue = jest.fn();
        const capacityGroupFixture = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            {
                                facility_type_id: 9003,
                                facility_type_name: 'Space capacity',
                                facility_special_action: 'capacity',
                            },
                        ],
                    },
                ],
            },
        };

        renderWithTheme({
            ...baseProps,
            facilityTypeList: capacityGroupFixture,
            filteredFacilityTypeList: capacityGroupFixture,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
            capacityFilterValue: [8, 24],
            setCapacityFilterValue,
        });

        fireEvent.change(screen.getByTestId('capacitySlider-inputRight'), { target: { value: 'bad' } });
        fireEvent.blur(screen.getByTestId('capacitySlider-inputRight'), { target: { value: '-3' } });
        fireEvent.blur(screen.getByTestId('capacitySlider-inputLeft'), { target: { value: '999' } });

        expect(setCapacityFilterValue).toHaveBeenCalled();
    });

    it('renders a group helper note and covers the reset button mouse-down path without a stored journey state', () => {
        const facilityList = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_group_help: 'Helpful note for Facilities',
                        facility_type_children: [
                            { facility_type_id: 9003, facility_type_name: 'Space capacity', facility_special_action: 'capacity' },
                        ],
                    },
                ],
            },
        };

        const setSelectedFacilityTypes = jest.fn();
        const setCapacityFilterValue = jest.fn();
        const originalSessionStorage = window.sessionStorage;
        Object.defineProperty(window, 'sessionStorage', {
            value: undefined,
            configurable: true,
        });

        renderWithTheme({
            ...baseProps,
            activeFilterCount: 1,
            facilityTypeList: facilityList,
            filteredFacilityTypeList: facilityList,
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
            setSelectedFacilityTypes,
            setCapacityFilterValue,
            capacityFilterValue: [12, 24],
        });

        expect(screen.getByText('Helpful note for Facilities')).toBeInTheDocument();
        fireEvent.mouseDown(screen.getByTestId('reset-filters-button'));

        Object.defineProperty(window, 'sessionStorage', {
            value: originalSessionStorage,
            configurable: true,
        });
    });

    it('handles whitespace capacity input and string-based IDs during deselection', () => {
        const setSelectedFacilityTypes = jest.fn();
        const setCapacityFilterValue = jest.fn();
        const customFixture = {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Facilities',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: true,
                        facility_type_children: [
                            { facility_type_id: 'custom', facility_type_name: 'Custom option' },
                            { facility_type_id: 9003, facility_type_name: 'Space capacity', facility_special_action: 'capacity' },
                        ],
                    },
                ],
            },
        };

        renderWithTheme({
            ...baseProps,
            facilityTypeList: customFixture,
            filteredFacilityTypeList: customFixture,
            selectedFacilityTypes: [
                { facility_type_group_id: 1, facility_type_id: 'custom', selected: true, unselected: false },
                {
                    facility_type_group_id: 1,
                    facility_type_id: 9003,
                    selected: true,
                    unselected: false,
                    facility_special_action: 'capacity',
                },
            ],
            capacityFilterValue: [8, 24],
            setSelectedFacilityTypes,
            setCapacityFilterValue,
        });

        fireEvent.change(screen.getByTestId('capacitySlider-inputRight'), { target: { value: '   ' } });
        fireEvent.blur(screen.getByTestId('capacitySlider-inputRight'), { target: { value: '-3' } });
        fireEvent.blur(screen.getByTestId('capacitySlider-inputLeft'), { target: { value: '999' } });
        fireEvent.click(document.getElementById('button-deselect-selected-custom'));

        expect(setSelectedFacilityTypes).toHaveBeenCalled();
        expect(setCapacityFilterValue).toHaveBeenCalled();
    });

    it('auto-expands selected journey groups and keeps the rerender short-circuit stable', async () => {
        const props = {
            ...baseProps,
            suppliedClassName: 'journeyFilterSidebar',
            facilityTypeList: facilityGroupFixture,
            filteredFacilityTypeList: facilityGroupFixture,
            selectedFacilityTypes: [],
        };

        const { rerender } = renderWithTheme(props);
        expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'block' });

        rerender(
            <ThemeProvider theme={theme}>
                <SidebarFilters {...props} selectedFacilityTypes={selectedNaturalLightFilter} />
            </ThemeProvider>,
        );

        expect(await screen.findByTestId('facility-type-group-1-open')).toHaveStyle({ display: 'block' });
        expect(screen.getByTestId('facility-type-group-1-collapsed')).toHaveStyle({ display: 'none' });
    });

    it('renders the active capacity cartouche and bottom action state when only that filter is active', () => {
        renderWithTheme({
            ...baseProps,
            activeFilterCount: 1,
            capacityFilterValue: [4, 12],
            selectedFacilityTypes: [
                {
                    facility_type_group_id: 1,
                    facility_type_id: 57,
                    selected: true,
                    unselected: false,
                    facility_special_action: null,
                },
            ],
            showBottomActionButtons: true,
            suppliedClassName: 'journeyFilterSidebar',
            filteredFacilityTypeList: {
                data: {
                    facility_type_groups: [
                        {
                            facility_type_group_id: 1,
                            facility_type_group_name: 'Facilities',
                            facility_type_group_order: 1,
                            facility_type_group_loads_open: true,
                            facility_type_children: [
                                { facility_type_id: 57, facility_type_name: 'Natural light' },
                                { facility_type_id: 9003, facility_type_name: 'Space capacity', facility_special_action: 'capacity' },
                            ],
                        },
                    ],
                },
            },
        });

        expect(screen.getByTestId('button-deselect-selected-capacity')).toBeInTheDocument();
        expect(screen.getByTestId('button-deselect-list')).toBeInTheDocument();
    });

    it('does not force the popup filter sidebar to stay hidden on mobile', () => {
        const { container } = renderWithTheme({
            ...baseProps,
            suppliedClassName: 'popupFilterList',
        });

        expect(container.querySelector('#filterSidebar')).not.toHaveClass('mobileHidden');
    });
});
