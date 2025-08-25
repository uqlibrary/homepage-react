import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from '../../SharedComponents/Toolbox/Loaders';

const StyledStandardCard = styled(StandardCard)(() => ({
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));
const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledLocationPhoto = styled('img')(() => ({
    maxWidth: '100%',
}));

export const SpacesLocationList = ({
    actions,
    locationSpaceList,
    locationSpaceListLoading,
    locationSpaceListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
}) => {
    React.useEffect(() => {
        if (locationSpaceListError === null && locationSpaceListLoading === null && locationSpaceList === null) {
            actions.loadAllLocationSpaces();
        }
        if (weeklyHoursError === null && weeklyHoursLoading === null && weeklyHours === null) {
            actions.loadWeeklyHours();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        if (!!weeklyHoursError) {
            return null; // <p>Opening hours currently unavailable - please try again later</p>;
        }

        let openingDetails = weeklyHours?.data?.locations?.find(openingHours => {
            return openingHours.lid === bookableSpace.space_opening_hours_id;
        });
        !!openingDetails && (openingDetails = convertWeeksToDays(openingDetails));
        return openingDetails?.department?.next7days || [];
    };

    function spaceFacilities(bookableSpace) {
        return (
            <>
                {bookableSpace?.facilities?.length > 0 && <h3>Facilities</h3>}
                {bookableSpace?.facilities?.length > 0 && (
                    <ul>
                        {bookableSpace?.facilities?.map(facility => {
                            return (
                                <li key={`facility-${bookableSpace?.space_id}-${facility.facilityTypeId}`}>
                                    {facility.facilityTypeDisplayName}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </>
        );
    }

    function openingHoursComponent(openingHoursList, locationKey) {
        if (openingHoursList.length === 0) {
            return null;
        }
        return (
            <>
                <h3>Opening Hours</h3>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            {openingHoursList.map((d, index) => (
                                <th style={{ textAlign: 'center' }} key={`${locationKey}-openingth-${index}`}>
                                    {d.dayName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {openingHoursList.map((d, index) => (
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

    return (
        <StandardPage title="Library bookable spaces">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        {(() => {
                            if (!!locationSpaceListLoading || !!weeklyHoursLoading) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <InlineLoader message="Loading" />
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (!!locationSpaceListError) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else if (
                                !locationSpaceList?.data?.locations ||
                                locationSpaceList?.data?.locations.length === 0
                            ) {
                                return (
                                    <StyledBookableSpaceGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>No locations found - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledBookableSpaceGridItem>
                                );
                            } else {
                                return locationSpaceList?.data?.locations.map(bookableSpace => {
                                    const locationKey = `space-${bookableSpace?.space_id}`;
                                    return (
                                        <StyledBookableSpaceGridItem item xs={12} md={9} key={locationKey}>
                                            <StyledStandardCard fullHeight title={bookableSpace?.space_title}>
                                                {
                                                    <>
                                                        <p>{bookableSpace?.space_description}</p>
                                                        {bookableSpace?.space_photo_url && (
                                                            <StyledLocationPhoto
                                                                src={bookableSpace?.space_photo_url}
                                                                alt={bookableSpace?.space_photo_description}
                                                            />
                                                        )}
                                                        {spaceFacilities(bookableSpace)}
                                                        {openingHoursComponent(
                                                            spaceOpeningHours(bookableSpace),
                                                            locationKey,
                                                        )}
                                                    </>
                                                }
                                            </StyledStandardCard>
                                        </StyledBookableSpaceGridItem>
                                    );
                                });
                            }
                        })()}
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

SpacesLocationList.propTypes = {
    actions: PropTypes.any,
    locationSpaceList: PropTypes.any,
    locationSpaceListLoading: PropTypes.bool,
    locationSpaceListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
};

export default React.memo(SpacesLocationList);
