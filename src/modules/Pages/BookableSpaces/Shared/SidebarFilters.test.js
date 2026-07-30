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

    it('offers an all-campuses option in the campus selector', async () => {
        renderWithTheme(baseProps);

        fireEvent.mouseDown(screen.getByRole('combobox'));

        expect(await screen.findByRole('option', { name: 'All campuses' })).toBeInTheDocument();
    });
});
