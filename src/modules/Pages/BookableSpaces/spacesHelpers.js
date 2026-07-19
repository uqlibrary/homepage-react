import React from 'react';
import PropTypes from 'prop-types';

import { Chip, useTheme } from '@mui/material';

import { getVisibleSpaceOutage } from '../Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';

export const FILTER_BOOKABLE_TYPE_ID = 9002;
export const FILTER_CAPACITY_TYPE_ID = 9003;

export const FILTER_BOOKABLE_ACTION_NAME = 'bookable';
export const FILTER_CURRENTLY_OPEN_ACTION_NAME = 'open';
export const FILTER_SPACE_CAPACITY_ACTION_NAME = 'capacity';

export const FACILITY_TYPE_CHECKBOX = 'checkbox';
export const FACILITY_TYPE_SLIDER = 'slider';

export const FILTER_DISPLAY_ON_SIMPLE = 'simple';
export const FILTER_DISPLAY_ON_ADVANCED = 'advanced';
export const FILTER_DISPLAY_ON_BOTH = 'both';

export const normalizeFilterDisplayOn = value => {
    const validDisplayOnValues = [FILTER_DISPLAY_ON_SIMPLE, FILTER_DISPLAY_ON_ADVANCED, FILTER_DISPLAY_ON_BOTH];
    return validDisplayOnValues.includes(value) ? value : FILTER_DISPLAY_ON_BOTH;
};

export function getOrdinalSuffixFor(number) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) {
        return 'st';
    }
    if (mod10 === 2 && mod100 !== 12) {
        return 'nd';
    }
    if (mod10 === 3 && mod100 !== 13) {
        return 'rd';
    }
    return 'th';
}

export const isInt = value => {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
};

export const getPrefixedFloorName = floorName => {
    return floorName?.startsWith('Level ') ? floorName : `Level ${floorName}`;
};
export function getFriendlyFloorName(bookableSpace) {
    if (!!bookableSpace?.space_is_ground_floor) {
        return 'Ground floor';
    }
    return getPrefixedFloorName(bookableSpace?.space_floor_name);
}

export function getFriendlyLocationDescription(bookableSpace, isCollapsed = false, hideOptions = {}) {
    if (isCollapsed) {
        return (
            <div className="location-space location-library">
                {bookableSpace?.space_library_name && bookableSpace?.space_library_name}
            </div>
        );
    }
    return (
        <>
            {!hideOptions.space_name && (
                <div className="location-space location-name">{`${bookableSpace?.space_name || ''}`}</div>
            )}
            <div className="location-space location-campus">{`${bookableSpace?.space_campus_name}`}</div>
            <div className="location-space location-building">{`${bookableSpace?.space_building_name} (${bookableSpace?.space_building_number})`}</div>
            <div className="location-space location-library">
                {bookableSpace?.space_library_name && bookableSpace?.space_library_name}{' '}
                <span className="location-floor">{getFriendlyFloorName(bookableSpace)}</span>
            </div>
            {!!bookableSpace?.space_precise ? (
                <div className="location-space location-precise">{bookableSpace?.space_precise}</div>
            ) : null}
        </>
    );
}
export const getFlatFacilityTypeList = facilityTypes => {
    return (
        facilityTypes?.data?.facility_type_groups?.flatMap(group => {
            const groupId = group?.facility_type_group_id;
            return group?.facility_type_children?.map(child => ({
                facility_type_group_id: groupId,
                facility_type_id: child?.facility_type_id,
                facility_type_name: child?.facility_type_name,
                facility_special_action: child?.facility_special_action,
                hide_in_public_filter_list: child?.hide_in_public_filter_list,
                filter_display_on: normalizeFilterDisplayOn(child?.filter_display_on),
            }));
        }) || []
    );
};

function filterNext7Days(departmentData) {
    // Get today's date (start of day)
    const today = new Date();
    today?.setHours(0, 0, 0, 0);

    // Calculate the end date (6 days from today)
    const endDate = new Date(today);
    endDate?.setDate(today?.getDate() + 6);

    // Filter days to include only the next 7 days starting from today
    const filteredDays = departmentData?.days?.filter(day => {
        const dayDate = new Date(day?.date);
        dayDate?.setHours(0, 0, 0, 0);

        return dayDate >= today && dayDate <= endDate;
    });

    // Sort by date to ensure chronological order
    filteredDays?.sort((a, b) => new Date(a?.date) - new Date(b?.date));

    filteredDays?.map((d, index) => {
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
    if (!data) {
        return [];
    }

    // Create a deep copy to avoid mutating the original data
    const location = JSON.parse(JSON.stringify(data));

    // Define the order of days for consistent sorting
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // only one of these should appear in the data - should match api HoursResource list
    const displayedDepartments = ['Collections and space', 'Study space', 'Service and collections'];
    const filteredData = {
        ...location,
        department: location?.departments?.find(dept => displayedDepartments?.includes(dept?.name)),
    };
    delete filteredData.departments;

    if (filteredData?.department?.weeks && Array.isArray(filteredData?.department?.weeks)) {
        const allDays = [];

        filteredData?.department?.weeks?.forEach(week => {
            dayOrder?.forEach(dayName => {
                if (week[dayName]) {
                    // Add day name as a property for easier identification
                    const dayData = {
                        dayName: dayName,
                        ...week[dayName],
                    };
                    allDays?.push(dayData);
                }
            });
        });

        delete filteredData?.department?.weeks;
        allDays?.sort((a, b) => new Date(a?.date) - new Date(b?.date));
        filteredData.department.days = allDays;
    }

    !!filteredData?.department?.days && (filteredData.department = filterNext7Days(filteredData?.department));

    return filteredData;
}

export const spaceOpeningHours = (bookableSpace, weeklyHours) => {
    const details = weeklyHours?.locations?.filter(lib =>
        lib?.departments.find(spaceOpeningHours => spaceOpeningHours?.lid === bookableSpace?.space_opening_hours_id),
    );
    if (!!details) {
        const openingDetails = convertWeeksToDays(details?.at(0));
        return openingDetails?.department?.next7days;
    }
    return [];
};

export const isBookable = space => {
    return space?.space_external_book_url?.startsWith('http');
};

export const getSpaceHoursStatus = (space, weeklyHours) => {
    const days = spaceOpeningHours(space, weeklyHours);
    if (!days || days.length === 0) return null;
    const today = days[0];
    if (!today) return null;

    const status = today?.times?.status;
    if (status === 'closed') return 'closed';
    if (status === '24hours') return 'open';

    const openStr = today?.open; // e.g. "07:30:00"
    const closeStr = today?.close; // e.g. "19:30:00"

    if (!openStr || !closeStr) return null;

    const now = new Date();
    const [oh, om] = openStr.split(':').map(Number);
    const [ch, cm] = closeStr.split(':').map(Number);

    const openTime = new Date();
    openTime.setHours(oh, om, 0, 0);
    const closeTime = new Date();
    closeTime.setHours(ch, cm, 0, 0);

    if (now < openTime || now >= closeTime) return 'closed';

    const minsUntilClose = (closeTime - now) / 60000;
    if (minsUntilClose <= 60) return 'closing-soon';
    return 'open';
};

export const defaultChipStyles = theme => {
    return {
        borderColor: theme.palette.designSystem.bodyCopy,
        border: '1px solid',
        color: theme.palette.designSystem.bodyCopy,
        fontWeight: 600,
        fontSize: '1rem',
    };
};

export const SpaceOpenStatusChip = ({ space, weeklyHours, weeklyHoursLoading, weeklyHoursError, chipStyles }) => {
    const openingHoursStatusConfig = (status, theme) => {
        if (status === 'open') {
            return {
                label: 'Open now',
                sx: {
                    ...defaultChipStyles(theme),
                    backgroundColor: theme.palette.designSystem.alert.info,
                },
            };
        }
        if (status === 'closing-soon') {
            return {
                label: 'Closing soon',
                sx: {
                    ...defaultChipStyles(theme),
                    backgroundColor: theme.palette.designSystem.alert.warning,
                },
            };
        }
        if (status === 'closed') {
            return {
                label: 'Currently closed',
                sx: {
                    ...defaultChipStyles(theme),
                    backgroundColor: theme.palette.designSystem.alert.error,
                },
            };
        }
        return null;
    };

    const chipTestId = `spaces-${space?.space_id}-details-outage-chip`;
    const theme = useTheme();
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    if (visibleOutage?.status === 'Current') {
        const closedConfig = openingHoursStatusConfig('closed', theme);
        return (
            <Chip
                data-testid={chipTestId}
                label={closedConfig.label}
                size="small"
                sx={{
                    ...chipStyles,
                    ...closedConfig?.sx,
                }}
            />
        );
    }

    if (weeklyHoursLoading || weeklyHoursError || !weeklyHours) {
        return null;
    }

    const status = getSpaceHoursStatus(space, weeklyHours);
    if (!status) {
        return null;
    }

    const config = openingHoursStatusConfig(status, theme);
    if (!config) {
        return null;
    }
    return (
        <Chip
            data-testid={'spaces-journey-open-status-chip-' + status}
            label={config.label}
            size="small"
            sx={{
                ...chipStyles,
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.01em',
                ...config.sx,
            }}
        />
    );
};

SpaceOpenStatusChip.propTypes = {
    space: PropTypes.object,
    weeklyHours: PropTypes.object,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.bool,
    chipStyles: PropTypes.any,
};
