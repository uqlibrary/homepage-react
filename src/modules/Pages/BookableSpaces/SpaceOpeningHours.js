import React from 'react';
import PropTypes from 'prop-types';
import { BookableSpacesList } from './BookableSpacesList';

export const SpaceOpeningHours = ({ weeklyHoursLoading, weeklyHoursError, weeklyHours, bookableSpace }) => {
    const locationKey = `space-${bookableSpace?.space_id}`;
    const overrideMessage = !!bookableSpace?.space_opening_hours_override ? (
        <p data-testid={`override_opening_hours_${bookableSpace?.space_uuid}`}>
            Note: {bookableSpace?.space_opening_hours_override}
        </p>
    ) : (
        ''
    );
    console.log('overrideMessage', overrideMessage);
    if (weeklyHoursLoading === false && !!weeklyHoursError) {
        const spaceId = bookableSpace?.space_id || /* istanbul ignore next */ 'unknown';
        return (
            <>
                <p data-testid={`weekly-hours-error-${spaceId}`}>
                    General opening hours currently unavailable - please try again later.
                </p>
                {overrideMessage}
            </>
        );
    }
    if (weeklyHoursError === false && weeklyHoursLoading === false && weeklyHours?.locations?.length === 0) {
        return overrideMessage; // we don't get the building opening hours for this location
    }
    if (!!weeklyHoursError) {
        return (
            <>
                <p>Opening hours currently unavailable - please try again later</p>
                {overrideMessage}
            </>
        );
    }

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
        console.log('spaceOpeningHours 1 bookableSpace=', bookableSpace);
        console.log('spaceOpeningHours 2 weeklyHours=', weeklyHours);
        let openingDetails = weeklyHours?.locations?.find(openingHours => {
            return openingHours.lid === bookableSpace?.space_opening_hours_id;
        });
        !!openingDetails && (openingDetails = convertWeeksToDays(openingDetails));
        return openingDetails?.department?.next7days || [];
    };
    const openingHoursList = spaceOpeningHours(bookableSpace);
    console.log('openingHoursList=', openingHoursList);
    if (!!openingHoursList && openingHoursList.length > 0) {
        return (
            <>
                <h3>{bookableSpace?.space_library_name} opening hours</h3>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            {openingHoursList?.map((d, index) => (
                                <th
                                    style={{
                                        textAlign: 'center',
                                    }}
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
                                <td
                                    style={{
                                        textAlign: 'center',
                                    }}
                                    key={`${locationKey}-openingtd-${index}`}
                                >
                                    {d.rendered}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                {overrideMessage}
            </>
        );
    }
    return overrideMessage;
};
SpaceOpeningHours.propTypes = {
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    bookableSpace: PropTypes.any,
};

export default React.memo(SpaceOpeningHours);
