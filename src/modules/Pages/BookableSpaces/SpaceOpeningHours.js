import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const StyledTable = styled('table')(() => ({
    width: '100%',
    '& th, & th': {
        textAlign: 'center',
    },
}));

export const SpaceOpeningHours = ({ weeklyHoursLoading, weeklyHoursError, weeklyHours, bookableSpace }) => {
    console.log('TOP SpaceOpeningHours weeklyHours=', weeklyHoursLoading, weeklyHoursError, weeklyHours);
    console.log('TOP SpaceOpeningHours bookableSpace=', bookableSpace);

    const spaceId = bookableSpace?.space_id;

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
        filteredDays?.sort((a, b) => new Date(a.date) - new Date(b.date));

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
            allDays?.sort((a, b) => new Date(a.date) - new Date(b.date));
            filteredData.department.days = allDays;
        }

        !!filteredData.department.days && (filteredData.department = filterNext7Days(filteredData.department));

        return filteredData;
    }

    const spaceOpeningHours = bookableSpace => {
        console.log('spaceOpeningHours', bookableSpace.space_library_name, '1 bookableSpace=', bookableSpace);
        console.log('spaceOpeningHours', bookableSpace.space_library_name, '2 weeklyHours=', weeklyHours);
        const details = weeklyHours?.locations?.find(spaceOpeningHours => {
            return spaceOpeningHours.lid === bookableSpace?.space_opening_hours_id;
        });
        if (!!details) {
            const openingDetails = convertWeeksToDays(details);
            console.log('spaceOpeningHours', bookableSpace.space_library_name, '3 openingDetails=', openingDetails);
            return openingDetails?.department?.next7days;
        }
        return [];
    };

    const overrideMessage = !!bookableSpace?.space_opening_hours_override ? (
        <p data-testid={`space-${spaceId}-override_opening_hours`}>
            Note: {bookableSpace?.space_opening_hours_override}
        </p>
    ) : (
        ''
    );

    if (weeklyHoursLoading === true) {
        return null;
    }
    if (!!weeklyHoursError) {
        return (
            <>
                <p data-testid={`space-${spaceId}-weekly-hours-error`}>
                    General opening hours currently unavailable - please try again later.
                </p>
                {overrideMessage}
            </>
        );
    }

    if (weeklyHoursLoading === false && weeklyHoursError === false && weeklyHours?.locations?.length === 0) {
        return overrideMessage; // we don't get the building opening hours for this location
    }

    const openingHoursList = spaceOpeningHours(bookableSpace);

    if (!openingHoursList || openingHoursList.length === 0) {
        return overrideMessage; // no opening hours
    }

    return (
        <>
            <Typography component={'h3'} variant={'h6'}>
                {bookableSpace?.space_library_name} opening hours
            </Typography>
            <StyledTable>
                <thead>
                    <tr>
                        {openingHoursList?.map((d, index) => (
                            <th
                                key={`space-${spaceId}-opening-th-${index}`}
                                data-testid={`space-${spaceId}-openingHours-${index}`}
                            >
                                {d.dayName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {openingHoursList?.map((d, index) => (
                            <td key={`space-${spaceId}-opening-td-${index}`}>{d.rendered}</td>
                        ))}
                    </tr>
                </tbody>
            </StyledTable>
            {overrideMessage}
        </>
    );
};
SpaceOpeningHours.propTypes = {
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    bookableSpace: PropTypes.any,
};

export default React.memo(SpaceOpeningHours);
