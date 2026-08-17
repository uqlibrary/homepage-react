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

    it('only clears the capacity filter state when the capacity cartouche is dismissed', () => {
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

        fireEvent.click(screen.getByTestId('button-deselect-selected-capacity'));

        expect(latestState).toHaveLength(3);
        expect(latestState.find(f => f.facility_type_id === 9002)).toMatchObject({ selected: true });
        expect(latestState.find(f => f.facility_type_id === 9003)).toMatchObject({ selected: false });
        expect(latestState.find(f => f.facility_type_id === 57)).toMatchObject({ selected: true });
        expect(setCapacityFilterValue).toHaveBeenCalledWith([1, 50]);
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

    it('does not force the popup filter sidebar to stay hidden on mobile', () => {
        const { container } = renderWithTheme({
            ...baseProps,
            suppliedClassName: 'popupFilterList',
        });

        expect(container.querySelector('#filterSidebar')).not.toHaveClass('mobileHidden');
    });
});
