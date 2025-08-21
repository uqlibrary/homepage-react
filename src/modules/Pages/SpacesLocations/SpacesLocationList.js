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
    libHours,
    libHoursLoading,
    libHoursError,
}) => {
    React.useEffect(() => {
        if (locationSpaceListError === null && locationSpaceListLoading === null && locationSpaceList === null) {
            actions.loadAllLocationSpaces();
        }
        if (libHoursError === null && libHoursLoading === null && libHours === null) {
            actions.loadLibHours();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const spaceOpeningHours = bookableSpace => {
        if (!!libHoursError) {
            return null; // <p>Opening hours currently unavailable - please try again later</p>;
        }

        const openingDetails = libHours?.locations?.find(openingHours => {
            return openingHours.lid === bookableSpace.location_opening_hours_id;
        });
        if (!openingDetails || (openingDetails?.currently_open !== false && openingDetails?.currently_open !== true)) {
            return null;
        }
        const openClosedString = openingDetails?.currently_open === false ? 'Not currently open' : 'Currently open'; // currently_open neither true nor false handld above
        if (!!openingDetails?.opening_hours) {
            return (
                <p>
                    {openClosedString} - Open {openingDetails?.opening_hours}
                </p>
            );
        }
        return <p>{openClosedString}</p>;
    };

    function spaceFacilities(bookableSpace) {
        return (
            <>
                {bookableSpace?.facilities?.length > 0 && <h3>Facilities</h3>}
                {bookableSpace?.facilities?.length > 0 && (
                    <ul>
                        {bookableSpace?.facilities?.map(facility => {
                            return (
                                <li key={`facility-${bookableSpace?.location_id}-${facility.facilityTypeId}`}>
                                    {facility.facilityTypeDisplayName}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </>
        );
    }

    return (
        <StandardPage title="Library bookable locations">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        {(() => {
                            if (!!locationSpaceListLoading || !!libHoursLoading) {
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
                                    const key = `space-${bookableSpace?.location_id}`;
                                    return (
                                        <StyledBookableSpaceGridItem item xs={12} md={9} key={key}>
                                            <StyledStandardCard fullHeight title={bookableSpace?.location_title}>
                                                {
                                                    <>
                                                        <p>{bookableSpace?.location_description}</p>
                                                        {bookableSpace?.location_photo && (
                                                            <StyledLocationPhoto
                                                                src={bookableSpace?.location_photo}
                                                                alt={bookableSpace?.location_photo_description}
                                                            />
                                                        )}
                                                        {spaceFacilities(bookableSpace)}
                                                        {spaceOpeningHours(bookableSpace)}
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
    locationSpaceList: PropTypes.array,
    locationSpaceListLoading: PropTypes.bool,
    locationSpaceListError: PropTypes.any,
    libHours: PropTypes.any,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.any,
};

export default React.memo(SpacesLocationList);
