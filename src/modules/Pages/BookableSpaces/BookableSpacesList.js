import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@mui/material/Checkbox';
import { Grid, InputLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
    '& label': {
        ...standardText(theme),
        display: 'inline',
    },
    '&:hover label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
    '&:focus label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
    '&:has(> input:checked) label.rejectedFacilityTypeLabel': rejectedCheckboxStyle,
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
        console.log('showSpace facilityTypeFilters=', facilityTypeFilters);
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

        console.log('showSpace selectedFiltersByGroup=', selectedFiltersByGroup);
        console.log('showSpace rejectedFilters=', rejectedFilters);

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

    const handleFilterRejection = (e, facilityTypeId) => {
        console.log('handleFilterRejection facilityTypeId=', facilityTypeId);
        console.log('handleFilterRejection facilityTypeFilters=', facilityTypeFilters);
        console.log(
            'after:',
            facilityTypeFilters?.filter(ftf => {
                return ftf.facility_type_id !== facilityTypeId;
            }),
        );
        const newFilters = facilityTypeFilters?.filter(ftf => {
            return ftf.facility_type_id !== facilityTypeId;
        });
        newFilters.push({
            facility_type_id: facilityTypeId,
            selected: false,
            unselected: !!e.target.checked,
        });
        setFacilityTypeFilters(newFilters);
    };

    const handleFilterSelection = (e, facilityTypeId) => {
        console.log('handleFilterSelection facilityTypeId=', facilityTypeId);
        console.log('handleFilterSelection facilityTypeFilters=', facilityTypeFilters);

        const newFilters = facilityTypeFilters?.filter(ftf => {
            return ftf.facility_type_id !== facilityTypeId;
        });
        newFilters.push({
            facility_type_id: facilityTypeId,
            selected: !!e.target.checked,
            unselected: false,
        });
        setFacilityTypeFilters(newFilters);
    };

    function filterNext7Days(departmentData) {
        console.log('filterNext7Days 1 departmentData=', departmentData);
        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('filterNext7Days 2 today=', today);

        // Calculate the end date (6 days from today)
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 6);
        console.log('filterNext7Days 3 endDate=', endDate);

        // Filter days to include only the next 7 days starting from today
        const filteredDays = departmentData.days.filter(day => {
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);

            return dayDate >= today && dayDate <= endDate;
        });
        console.log('filterNext7Days 4 filteredDays=', filteredDays);

        // Sort by date to ensure chronological order
        filteredDays.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log('filterNext7Days 5 filteredDays=', filteredDays);

        filteredDays.map((d, index) => {
            if (index <= 1) {
                d.dayName = index === 0 ? 'Today' : 'Tomorrow';
            }
            return d;
        });
        console.log('filterNext7Days 6 filteredDays=', filteredDays);

        // Return the department with filtered days
        const result = {
            ...departmentData,
            next7days: filteredDays,
        };
        delete result.days;
        console.log('filterNext7Days 7 result=', result);

        return result;
    }

    // rewrite the hours-by-week into one long list of days
    function convertWeeksToDays(data) {
        console.log('convertWeeksToDays 1 data=', data);
        // Create a deep copy to avoid mutating the original data
        const location = JSON.parse(JSON.stringify(data));
        console.log('convertWeeksToDays 2 location=', location);

        // Define the order of days for consistent sorting
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // only one of these should appear in the data - should match api HoursResource list
        const displayedDepartments = ['Collections and space', 'Study space', 'Service and collections'];
        const filteredData = {
            ...location,
            department: location.departments.find(dept => displayedDepartments.includes(dept.name)),
        };
        console.log('convertWeeksToDays 3 filteredData=', filteredData);
        delete filteredData.departments;
        console.log('convertWeeksToDays 4 filteredData=', filteredData);

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
        console.log('convertWeeksToDays 5 filteredData=', filteredData);

        !!filteredData.department.days && (filteredData.department = filterNext7Days(filteredData.department));
        console.log('convertWeeksToDays 6 filteredData=', filteredData);

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
    const showFilterSidebar = () => {
        if (facilityTypeList?.data?.facility_type_groups?.length === 0) {
            return null;
        }

        const filteredFacilityTypeList = getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList);
        const sortedUsedGroups = [...filteredFacilityTypeList?.data?.facility_type_groups].sort(
            (a, b) => a.facility_type_group_order - b.facility_type_group_order,
        );

        return (
            <>
                <Typography component={'h3'} variant={'h6'}>
                    Active filters
                </Typography>
                {sortedUsedGroups.map(group => (
                    <div key={group.facility_type_group_id} className="facility-group">
                        <h3 className="group-heading">{group.facility_type_group_name}</h3>
                        <ul style={{ paddingLeft: 0 }}>
                            {group.facility_type_children && group.facility_type_children.length > 0 ? (
                                group.facility_type_children.map(facilityType => (
                                    <StyledInputListItem
                                        key={`facility-type-listitem-${facilityType.facility_type_id}`}
                                        data-testid={`facility-type-listitem-${facilityType.facility_type_id}`}
                                        style={{ listStyle: 'none', paddingLeft: 0, display: 'flex' }}
                                    >
                                        <InputLabel
                                            title={`Only show Spaces with ${facilityType.facility_type_name}`}
                                            for={`filtertype-${facilityType.facility_type_id}`}
                                        >
                                            <Checkbox
                                                onChange={e => handleFilterSelection(e, facilityType.facility_type_id)}
                                                data-testid={`filtertype-${facilityType.facility_type_id}`}
                                                id={`filtertype-${facilityType.facility_type_id}`}
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
                                            // data-filtergroup={`filtertype-${group.facility_type_group_id}`}
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
                        </ul>
                    </div>
                ))}
            </>
        );
    };
    return (
        <StandardPage title="Library spaces">
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
                                        <StyledBookableSpaceGridItem item xs={3} style={{ padding: '1em' }}>
                                            {showFilterSidebar()}
                                        </StyledBookableSpaceGridItem>
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
