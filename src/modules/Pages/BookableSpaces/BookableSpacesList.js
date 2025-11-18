import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Grid, InputLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import {
    getFilteredFacilityTypeList,
    getFlatFacilityTypeList,
    getFriendlyLocationDescription,
} from 'modules/Pages/BookableSpaces/spacesHelpers';
import { breadcrumbs } from 'config/routes';
import { standardText } from 'helpers/general';

const StyledStandardCard = styled(StandardCard)(({ theme }) => ({
    ...standardText(theme),
    fontWeight: '400 !important',
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));
const svgOrangeCheckbox =
    "data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid meet' focusable='false'%3E%3Cpath fill='%23c13e2a' d='M22.2,20.9l-1.3-1.3C21,19.4,21,19.2,21,19v-8h-2v6.7l-4.6-4.6l6-6l-1.4-1.4l-6,6L6.3,5H15V3H5C4.8,3,4.6,3,4.4,3.1L3,1.7L1.8,2.9l1.3,1.3C3.1,4.4,3,4.7,3,5v14c0,1.1,0.9,2,2,2h14c0.3,0,0.6-0.1,0.8-0.2l1.2,1.2L22.2,20.9z M5,19V6l6.9,6.9l-1.4,1.4l-3.1-3.1L6,12.6l4.5,4.5l2.8-2.8L18,19H5z'%3E%3C/path%3E%3C/svg%3E";

const rejectedCheckboxStyle = {
    backgroundImage: `url("${svgOrangeCheckbox}")`,
    backgroundRepeat: 'no-repeat',
    display: 'inline-block',
    padding: 0,
    height: '40px',
    width: '40px',
    backgroundSize: '50%',
    paddingLeft: '6px',
    marginTop: '8px',
    marginBottom: '-8px',
    marginLeft: '5px',
    cursor: 'pointer',
};
const StyledInputListItem = styled('li')(({ theme }) => ({
    listStyle: 'none',
    paddingLeft: 0,
    display: 'flex',
    '& label': {
        ...standardText(theme),
        display: 'inline',
    },
    // when we hover or focus on the reject-checkbox, style the label to be orange
    '&:hover label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
    '&:focus label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
    '&:has(> input:checked) label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
    '&:has(> input:inline-focus) label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
    '@media (pointer:coarse)': {
        // show the reject checkbox on mobile, as they can't hover
        'label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
    },
    '& input.rejectedFilterType': {
        display: 'none',
    },
    '& span:not(.fortestfocus)': {
        cursor: 'pointer',
    },
}));
const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledSidebarContainer = styled(Grid)(() => ({
    position: 'sticky',
    top: 0,
    maxHeight: '100vh',
    overflowY: 'auto',
    paddingInline: '1em',
    marginBlock: '1em',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '4px',
        '&:hover': {
            background: '#a8a8a8',
        },
    },
    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: '#c1c1c1 #f1f1f1',
    '& > button': {
        margin: '0 0.5rem 0.5rem 0',
        display: 'inline-flex',
        alignItems: 'center',
        textTransform: 'none',
        textDecoration: 'underline',
        padding: '0.1rem 0.25rem 0.1rem 0',
        lineHeight: 'normal',
        '&:hover, &:focus': {
            backgroundColor: 'transparent',
        },
        '& span': {
            marginLeft: '0.25rem',
            '&:hover, &:focus': {
                backgroundColor: '#51247a',
                color: '#fff',
            },
        },
    },
}));
const StyleFacilityGroup = styled('div')(() => ({
    // styling here
}));
const StyledFilterSpaceList = styled('ul')(() => ({
    paddingLeft: 0,
}));
const StyledCartoucheList = styled('ul')(({ theme }) => ({
    listStyle: 'none',
    display: 'inline',
    margin: 0,
    padding: 0,
    '& li': {
        listStyle: 'none',
        display: 'inline',
        margin: 0,
        padding: 0,
        '& button': {
            margin: '0 0.5rem 0.5rem 0',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '12px',
            border: `1px solid ${theme.palette.primary.main}`,
            textTransform: 'none !important',
            padding: '0.1rem 0.25rem 0.1rem 0.5rem',
            '&.unselectedFilter span': {
                textDecoration: 'line-through',
            },
            '&:hover, :focus': {
                backgroundColor: '#fff',
                '& span': {
                    textDecoration: 'underline',
                },
                '&.unselectedFilter span': {
                    textDecoration: 'underline line-through',
                },
            },
            '& svg': {
                width: '0.7em',
                height: '0.7em',
            },
        },
    },
}));
const StyledLocationPhoto = styled('img')(() => ({
    maxWidth: '100%',
}));
const StyledDescription = styled('div')(() => ({
    '&.truncated p': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));
const StyledHideableBlock = styled('div')(() => ({
    '&.visible': {
        visibility: 'visible',
        height: 'auto',
        opacity: 1,
    },
    '&.hidden': {
        visibility: 'hidden',
        height: 0,
        opacity: 0,
    },
}));

export const BookableSpacesList = ({
    actions,
    bookableSpacesRoomList,
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
}) => {
    console.log(
        'BookableSpacesList load facilityTypeList:',
        facilityTypeListLoading,
        facilityTypeListError,
        facilityTypeList,
    );

    const [facilityTypeFilters, setFacilityTypeFilters2] = React.useState([]);
    const setFacilityTypeFilters = data => {
        console.log('setFacilityTypeFilters', data);
        setFacilityTypeFilters2(data);
    };
    const setFilters = (facilityTypeId, isSelected, isUnselected) => {
        const newFilters = facilityTypeFilters?.filter(ftf => {
            return ftf.facility_type_id !== facilityTypeId;
        });
        newFilters.push({
            facility_type_id: facilityTypeId,
            selected: isSelected,
            unselected: isUnselected,
        });
        setFacilityTypeFilters(newFilters);
    };

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespaces.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespaces.pathname);
        if (
            bookableSpacesRoomListError === null &&
            bookableSpacesRoomListLoading === null &&
            bookableSpacesRoomList === null
        ) {
            actions.loadAllBookableSpacesRooms();
        }
        if (weeklyHoursError === null && weeklyHoursLoading === null && weeklyHours === null) {
            actions.loadWeeklyHours();
        }
        if (facilityTypeListError === null && facilityTypeListLoading === null && facilityTypeList === null) {
            actions.loadAllFacilityTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        if (
            facilityTypeListError === false &&
            facilityTypeListLoading === false &&
            facilityTypeList?.data?.facility_type_groups?.length > 0 &&
            facilityTypeFilters?.length === 0
        ) {
            // Filter the facility type list
            const filteredFacilityTypeList = getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList);
            console.log('filteredFacilityTypeList=', filteredFacilityTypeList?.data?.facility_type_groups);

            const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
            const newFilters = flatFacilityTypeList.map(facilityType => ({
                facility_type_id: facilityType.facility_type_id,
                selected: false,
                unselected: false,
            }));
            console.log('newFilters=', newFilters);
            setFacilityTypeFilters(newFilters);
        }
    }, [facilityTypeListError, facilityTypeListLoading, facilityTypeList, facilityTypeFilters, bookableSpacesRoomList]);

    const getSpaceId = spaceId => {
        return `space-${spaceId}`;
    };

    function showSpace(spaceFacilityTypes, facilityTypeToGroup, facilityTypeFilters) {
        // Create a map of facility_type_id to group_id for quick lookup
        // Group selected filters by their facility type group
        const selectedFiltersByGroup = {};
        const rejectedFilters = [];

        facilityTypeFilters?.forEach(filter => {
            if (filter.selected) {
                const groupId = facilityTypeToGroup[filter.facility_type_id];
                if (groupId) {
                    if (!selectedFiltersByGroup[groupId]) {
                        selectedFiltersByGroup[groupId] = [];
                    }
                    selectedFiltersByGroup[groupId].push(filter.facility_type_id);
                }
            }

            // Collect rejected facility types
            if (filter.unselected) {
                rejectedFilters.push(filter.facility_type_id);
            }
        });

        // check if space should be excluded due to rejected facility types
        if (rejectedFilters.length > 0) {
            const hasRejectedFacility = rejectedFilters.some(rejectedId => spaceFacilityTypes?.includes(rejectedId));
            if (hasRejectedFacility) {
                return false;
            }
        }

        // If no inclusion filters are selected, show all spaces (that haven't been rejected)
        if (Object.keys(selectedFiltersByGroup).length === 0) {
            return true;
        }

        // AND between groups
        for (const groupId in selectedFiltersByGroup) {
            const selectedFiltersInGroup = selectedFiltersByGroup[groupId];

            // OR within group
            const hasMatchInGroup = selectedFiltersInGroup.some(filterId => spaceFacilityTypes?.includes(filterId));
            if (!hasMatchInGroup) {
                return false;
            }
        }
        return true;
    }

    // hide listitems that are checked
    const showHideActiveFilterListItems = (facilityTypeId, e) => {
        const listItemId = `facility-type-listitem-${facilityTypeId}`;
        console.log(
            'showHideActiveFilterListItems facilityTypeId=',
            facilityTypeId,
            'checked=',
            e.target.checked,
            'listItemId=',
            listItemId,
            e.target,
        );
        const listItemElement = document.getElementById(listItemId);
        !!e.target.checked &&
            !!listItemElement &&
            !listItemElement.classList.contains('checkedCheckbox') &&
            listItemElement.classList.add('checkedCheckbox') &&
            console.log('showHideActiveFilterListItems add checkedCheckbox');
        !e.target.checked &&
            !!listItemElement &&
            !!listItemElement.classList.contains('checkedCheckbox') &&
            listItemElement.classList.remove('checkedCheckbox') &&
            console.log('showHideActiveFilterListItems remove checkedCheckbox');
    };

    const scrollToTopOfContent = () => {
        const topOfPage = document.getElementById('topofcontent');
        !!topOfPage && typeof topOfPage.scrollIntoView === 'function' && topOfPage.scrollIntoView();

        const topOfSidebar = document.getElementById('topOfSidebar');
        !!topOfSidebar &&
            typeof topOfSidebar.scrollIntoView === 'function' &&
            topOfSidebar.scrollIntoView({
                behavior: 'smooth',
            });
    };

    const handleFilterRejection = (e, facilityTypeId) => {
        showHideActiveFilterListItems(facilityTypeId, e);

        setFilters(facilityTypeId, false, !!e.target.checked);

        scrollToTopOfContent();
    };

    const handleFilterSelection = (e, facilityTypeId) => {
        showHideActiveFilterListItems(facilityTypeId, e);

        setFilters(facilityTypeId, !!e.target.checked, false);

        scrollToTopOfContent();
    };

    function filterNext7Days(departmentData) {
        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate the end date (6 days from today)
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 6);

        // Filter days to include only the next 7 days starting from today
        const filteredDays = departmentData.days.filter(day => {
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);

            return dayDate >= today && dayDate <= endDate;
        });

        // Sort by date to ensure chronological order
        filteredDays.sort((a, b) => new Date(a.date) - new Date(b.date));

        filteredDays.map((d, index) => {
            if (index <= 1) {
                d.dayName = index === 0 ? 'Today' : 'Tomorrow';
            }
            return d;
        });

        // Return the department with filtered days
        const result = {
            ...departmentData,
            next7days: filteredDays,
        };
        delete result.days;

        return result;
    }

    // rewrite the hours-by-week into one long list of days
    function convertWeeksToDays(data) {
        // Create a deep copy to avoid mutating the original data
        const location = JSON.parse(JSON.stringify(data));

        // Define the order of days for consistent sorting
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // only one of these should appear in the data - should match api HoursResource list
        const displayedDepartments = ['Collections and space', 'Study space', 'Service and collections'];
        const filteredData = {
            ...location,
            department: location.departments.find(dept => displayedDepartments.includes(dept.name)),
        };
        delete filteredData.departments;

        if (filteredData.department.weeks && Array.isArray(filteredData.department.weeks)) {
            const allDays = [];

            filteredData.department.weeks.forEach(week => {
                dayOrder.forEach(dayName => {
                    if (week[dayName]) {
                        // Add day name as a property for easier identification
                        const dayData = {
                            dayName: dayName,
                            ...week[dayName],
                        };
                        allDays.push(dayData);
                    }
                });
            });

            delete filteredData.department.weeks;
            allDays.sort((a, b) => new Date(a.date) - new Date(b.date));
            filteredData.department.days = allDays;
        }

        !!filteredData.department.days && (filteredData.department = filterNext7Days(filteredData.department));

        return filteredData;
    }

    const spaceOpeningHours = bookableSpace => {
        console.log('spaceOpeningHours 1 bookableSpace=', bookableSpace);
        console.log('spaceOpeningHours 2 weeklyHours=', weeklyHours);
        let openingDetails = weeklyHours?.locations?.find(openingHours => {
            return openingHours.lid === bookableSpace?.space_opening_hours_id;
        });
        !!openingDetails && (openingDetails = convertWeeksToDays(openingDetails));
        return openingDetails?.department?.next7days || [];
    };

    function openingHoursComponent(bookableSpace, locationKey, libraryName) {
        if (weeklyHoursLoading === false && !!weeklyHoursError) {
            const spaceId = bookableSpace?.space_id || /* istanbul ignore next */ 'unknown';
            return (
                <p data-testid={`weekly-hours-error-${spaceId}`}>
                    General opening hours currently unavailable - please try again later.
                </p>
            );
        }
        const openingHoursList = spaceOpeningHours(bookableSpace);
        if (openingHoursList?.length === 0) {
            return <p>Opening hours currently unavailable - please try again later</p>;
        }
        return (
            <>
                <h3>{libraryName} opening hours</h3>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            {openingHoursList?.map((d, index) => (
                                <th
                                    style={{ textAlign: 'center' }}
                                    key={`${locationKey}-openingHours-${index}`}
                                    data-testid={`${locationKey}-openingHours-${index}`}
                                >
                                    {d.dayName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {openingHoursList?.map((d, index) => (
                                <td style={{ textAlign: 'center' }} key={`${locationKey}-openingtd-${index}`}>
                                    {d.rendered}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }

    const spaceExtraElementsId = spaceId => `space-more-${spaceId}`;
    const spaceDescriptionElementsId = spaceId => `space-description-${spaceId}`;
    const expandButtonElementId = spaceId => `expand-button-space-${spaceId}`;
    const collapseButtonElementId = spaceId => `collapse-button-space-${spaceId}`;
    const expandSpace = spaceId => {
        const spaceBlock = document.getElementById(spaceExtraElementsId(spaceId));
        !!spaceBlock && spaceBlock.classList.contains('hidden') && spaceBlock.classList.remove('hidden');
        !!spaceBlock && !spaceBlock.classList.contains('visible') && spaceBlock.classList.add('visible');

        const spaceDescription = document.getElementById(spaceDescriptionElementsId(spaceId));
        !!spaceDescription &&
            spaceDescription.classList.contains('truncated') &&
            spaceDescription.classList.remove('truncated');

        const expandButton = document.getElementById(expandButtonElementId(spaceId));
        !!expandButton && (expandButton.style.display = 'none');
        const collapseButton = document.getElementById(collapseButtonElementId(spaceId));
        !!collapseButton && (collapseButton.style.display = 'block');
    };
    const collapseSpace = spaceId => {
        const spaceBlock = document.getElementById(spaceExtraElementsId(spaceId));
        !!spaceBlock && !spaceBlock.classList.contains('hidden') && spaceBlock.classList.add('hidden');
        !!spaceBlock && !!spaceBlock.classList.contains('visible') && spaceBlock.classList.remove('visible');

        const spaceDescription = document.getElementById(spaceDescriptionElementsId(spaceId));
        !!spaceDescription &&
            !spaceDescription.classList.contains('truncated') &&
            spaceDescription.classList.add('truncated');

        const expandButton = document.getElementById(expandButtonElementId(spaceId));
        !!expandButton && (expandButton.style.display = 'block');
        const collapseButton = document.getElementById(collapseButtonElementId(spaceId));
        !!collapseButton && (collapseButton.style.display = 'none');
    };
    const spaceGrid = bookableSpace => {
        const locationKey = `space-${bookableSpace?.space_id}`;
        return (
            <>
                <div data-testid={locationKey}>{getFriendlyLocationDescription(bookableSpace)}</div>
                {bookableSpace?.space_description?.length > 0 && (
                    <StyledDescription
                        id={spaceDescriptionElementsId(bookableSpace?.space_id)}
                        data-testid={spaceDescriptionElementsId(bookableSpace?.space_id)}
                        className={'truncated'}
                    >
                        <p>{bookableSpace?.space_description}</p>
                    </StyledDescription>
                )}
                <StyledHideableBlock
                    id={spaceExtraElementsId(bookableSpace?.space_id)}
                    data-testid={spaceExtraElementsId(bookableSpace?.space_id)}
                    className={'hidden'}
                    style={{ transition: 'opacity 0.3s ease-in-out, height 0.3s ease-in-out' }}
                >
                    {bookableSpace?.space_photo_url && (
                        <StyledLocationPhoto
                            src={bookableSpace?.space_photo_url}
                            alt={bookableSpace?.space_photo_description}
                        />
                    )}
                    {bookableSpace?.facility_types?.length > 0 && (
                        <>
                            <h3>Facilities</h3>
                            <ul data-testid={`facility-${bookableSpace?.space_id}`}>
                                {bookableSpace?.facility_types?.map(facility => {
                                    return (
                                        <li
                                            key={`facility-${bookableSpace?.space_id}-${facility.facility_type_id}`}
                                            data-testid={`facility-${bookableSpace?.space_id}-${facility.facility_type_id}`}
                                        >
                                            {facility.facility_type_name}
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}
                    {openingHoursComponent(bookableSpace, locationKey, bookableSpace?.space_library_name)}
                    {!!bookableSpace?.space_opening_hours_override ? (
                        <p data-testid={`override_opening_hours_${bookableSpace?.space_uuid}`}>
                            Note: {bookableSpace?.space_opening_hours_override}
                        </p>
                    ) : (
                        ''
                    )}
                </StyledHideableBlock>
                <div style={{ float: 'right' }}>
                    <IconButton
                        id={expandButtonElementId(bookableSpace?.space_id)}
                        data-testid={expandButtonElementId(bookableSpace?.space_id)}
                        onClick={() => expandSpace(bookableSpace?.space_id)}
                        aria-label="Expand Space details"
                        style={{ display: 'block' }}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton
                        id={collapseButtonElementId(bookableSpace?.space_id)}
                        data-testid={collapseButtonElementId(bookableSpace?.space_id)}
                        onClick={() => collapseSpace(bookableSpace?.space_id)}
                        aria-label="Collapse Space details"
                        style={{ display: 'none' }}
                    >
                        <KeyboardArrowUpIcon />
                    </IconButton>
                </div>
            </>
        );
    };
    const deSelectSelected = e => {
        const button = e?.target.closest('button');
        const facilityTypeId = parseInt(button.id.replace('button-deselect-selected-', ''), 10);
        console.log('deSelectSelected button=', facilityTypeId, button);

        showHideActiveFilterListItems(facilityTypeId, e);

        setFilters(facilityTypeId, false, false);
    };
    const deSelectAll = () => {
        // reset the facility types to all false - the render will clear the buttons and checkboxes for us!
        const newFacilityTypes = facilityTypeFilters.map(ft => {
            return {
                facility_type_id: ft.facility_type_id,
                selected: false,
                unselected: false,
            };
        });
        setFacilityTypeFilters(newFacilityTypes);
    };
    const showFilterSidebar = () => {
        if (facilityTypeList?.data?.facility_type_groups?.length === 0) {
            return null;
        }

        const filteredFacilityTypeList = getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList);
        const sortedUsedGroups =
            !!filteredFacilityTypeList?.data?.facility_type_groups &&
            filteredFacilityTypeList?.data?.facility_type_groups.length > 0
                ? [...filteredFacilityTypeList?.data?.facility_type_groups].sort(
                      (a, b) => a.facility_type_group_order - b.facility_type_group_order,
                  )
                : [];

        const hasActiveFilters = facilityTypeFilters?.some(f => !!f.selected || !!f.unselected);
        console.log('hasActiveFilters=', hasActiveFilters);

        const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
        const checkFiltersList = facilityTypeFilters?.filter(f => !!f.selected || !!f.unselected);
        console.log('checkFiltersList', checkFiltersList?.length, checkFiltersList);
        return (
            <>
                {!!hasActiveFilters && (
                    <>
                        <span id="topOfSidebar" />
                        <Typography component={'h3'} variant={'h6'}>
                            Active filters
                        </Typography>
                        <StyledCartoucheList id={'button-deselect-list'} data-testid={'button-deselect-list'}>
                            {facilityTypeFilters?.map(f => {
                                if (!!f.selected) {
                                    const facilityTypeRecord = flatFacilityTypeList.find(
                                        flat => flat.facility_type_id === f.facility_type_id,
                                    );
                                    return (
                                        <li key={`cartouche-select-${f.facility_type_id}`}>
                                            <Button
                                                id={`button-deselect-selected-${f.facility_type_id}`}
                                                data-testid={`button-deselect-selected-${f.facility_type_id}`}
                                                onClick={deSelectSelected}
                                                className="selectedFilter"
                                                title={`${facilityTypeRecord.facility_type_name} selected - click to deselect`}
                                            >
                                                <span>{facilityTypeRecord?.facility_type_name}</span> <CloseIcon />
                                            </Button>
                                        </li>
                                    );
                                }
                                if (!!f.unselected) {
                                    const facilityTypeRecord = flatFacilityTypeList.find(
                                        flat => flat.facility_type_id === f.facility_type_id,
                                    );
                                    return (
                                        <li key={`cartouche-unselect-${f.facility_type_id}`}>
                                            <Button
                                                id={`button-deselect-selected-${f.facility_type_id}`}
                                                data-testid={`button-deselect-unselected-${f.facility_type_id}`}
                                                onClick={deSelectSelected}
                                                className="unselectedFilter"
                                                aria-label={`${facilityTypeRecord.facility_type_name} excluded - click to deselect`}
                                            >
                                                <span>{facilityTypeRecord?.facility_type_name}</span> <CloseIcon />
                                            </Button>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </StyledCartoucheList>
                        {checkFiltersList?.length > 0 && (
                            <Button
                                id={'button-deselect-all-filters'}
                                data-testid={'button-deselect-all-filters'}
                                onClick={deSelectAll}
                            >
                                <ReplayIcon />
                                <span>Remove all filters</span>
                            </Button>
                        )}
                    </>
                )}
                <div data-testid="sidebarCheckboxes">
                    <Typography component={'h3'} variant={'h6'}>
                        Filter Spaces
                    </Typography>
                    {sortedUsedGroups.map(group => (
                        <StyleFacilityGroup key={group.facility_type_group_id} className="facility-group">
                            <h3 className="group-heading">{group.facility_type_group_name}</h3>
                            <StyledFilterSpaceList>
                                {group.facility_type_children && group.facility_type_children.length > 0 ? (
                                    group.facility_type_children.map(facilityType => (
                                        <StyledInputListItem
                                            key={`facility-type-listitem-${facilityType.facility_type_id}`}
                                            id={`facility-type-listitem-${facilityType.facility_type_id}`}
                                            data-testid={`facility-type-listitem-${facilityType.facility_type_id}`}
                                        >
                                            <InputLabel
                                                title={`Only show Spaces with ${facilityType.facility_type_name}`}
                                                htmlFor={`filtertype-${facilityType.facility_type_id}`}
                                            >
                                                <Checkbox
                                                    onChange={e =>
                                                        handleFilterSelection(e, facilityType.facility_type_id)
                                                    }
                                                    data-testid={`filtertype-${facilityType.facility_type_id}`}
                                                    id={`filtertype-${facilityType.facility_type_id}`}
                                                    className="selectedFilterType"
                                                    checked={
                                                        facilityTypeFilters?.find(
                                                            f1 => f1.facility_type_id === facilityType.facility_type_id,
                                                        )?.selected || false
                                                    }
                                                />
                                                <span>{facilityType.facility_type_name}</span>
                                            </InputLabel>
                                            <input
                                                type="checkbox"
                                                id={`reject-filtertype-${facilityType.facility_type_id}`}
                                                data-testid={`reject-filtertype-${facilityType.facility_type_id}`}
                                                className="rejectedFilterType"
                                                onChange={e => handleFilterRejection(e, facilityType.facility_type_id)}
                                                aria-label={`Exclude Spaces with ${facilityType.facility_type_name}`}
                                                checked={
                                                    facilityTypeFilters?.find(
                                                        f1 => f1.facility_type_id === facilityType.facility_type_id,
                                                    )?.unselected || false
                                                }
                                            />
                                            <label
                                                htmlFor={`reject-filtertype-${facilityType.facility_type_id}`}
                                                className="rejectedFacilityTypeLabel"
                                                data-testid={`reject-filtertype-label-${facilityType.facility_type_id}`}
                                                title={`Exclude Spaces with ${facilityType.facility_type_name}`}
                                            />
                                            <span className="fortestfocus" style={{ width: '10px' }} />
                                        </StyledInputListItem>
                                    ))
                                ) : (
                                    <li className="no-items">No facility types available</li>
                                )}
                            </StyledFilterSpaceList>
                        </StyleFacilityGroup>
                    ))}
                </div>
            </>
        );
    };
    return (
        <StandardPage title="Library spaces" standardPageId="topofcontent">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3} data-testid="library-spaces">
                        {(() => {
                            if (!!bookableSpacesRoomListLoading || !!weeklyHoursLoading) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <InlineLoader message="Loading" />
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (!!bookableSpacesRoomListError || !!facilityTypeListError) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p data-testid="spaces-error">
                                                Something went wrong - please try again later.
                                            </p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (
                                !bookableSpacesRoomList?.data?.locations ||
                                bookableSpacesRoomList?.data?.locations?.length === 0
                            ) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p data-testid="no-spaces">No locations found - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else {
                                const facilityTypeToGroup = {};
                                getFilteredFacilityTypeList(
                                    bookableSpacesRoomList,
                                    facilityTypeList,
                                )?.data?.facility_type_groups?.forEach(group => {
                                    group.facility_type_children.forEach(child => {
                                        facilityTypeToGroup[child.facility_type_id] = group.facility_type_group_id;
                                    });
                                });
                                const filteredSpaceLocations = bookableSpacesRoomList?.data?.locations?.filter(s => {
                                    const spaceFacilityTypes = s.facility_types.map(item => item.facility_type_id);
                                    return showSpace(spaceFacilityTypes, facilityTypeToGroup, facilityTypeFilters);
                                });

                                return (
                                    <>
                                        <Grid item xs={8} md={9}>
                                            <Grid container data-testid={'space-wrapper'}>
                                                {filteredSpaceLocations.length === 0 && (
                                                    <Grid item xs={9} data-testid={'no-spaces-visible'}>
                                                        <p>
                                                            No Spaces match these filters - change your selection in the
                                                            sidebar to show some spaces.
                                                        </p>
                                                    </Grid>
                                                )}
                                                {filteredSpaceLocations.length > 0 &&
                                                    filteredSpaceLocations?.map(bookableSpace => {
                                                        const locationKey = getSpaceId(bookableSpace?.space_id);
                                                        return (
                                                            <StyledBookableSpaceGridItem
                                                                item
                                                                xs={12}
                                                                key={locationKey}
                                                                id={locationKey}
                                                                data-testid={locationKey}
                                                                style={{ display: 'block' }}
                                                            >
                                                                <StyledStandardCard
                                                                    fullHeight
                                                                    title={`${bookableSpace?.space_name} - ${bookableSpace?.space_type}`}
                                                                >
                                                                    {spaceGrid(bookableSpace)}
                                                                </StyledStandardCard>
                                                            </StyledBookableSpaceGridItem>
                                                        );
                                                    })}
                                            </Grid>
                                        </Grid>
                                        <StyledSidebarContainer item xs={3}>
                                            {showFilterSidebar()}
                                        </StyledSidebarContainer>
                                    </>
                                );
                            }
                        })()}
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

BookableSpacesList.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.bool,
    bookableSpacesRoomListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
};

export default React.memo(BookableSpacesList);
