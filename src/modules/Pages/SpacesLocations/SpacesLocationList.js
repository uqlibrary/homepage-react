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
const StyledLocationPhoto = styled('img')(() => ({
    maxWidth: '100%',
}));

export const SpacesLocationList = ({
    actions,
    locationSpaceList,
    locationSpaceListLoading,
    locationSpaceListError,
}) => {
    React.useEffect(() => {
        if (locationSpaceListError === null && locationSpaceListLoading === null && locationSpaceList === null) {
            actions.loadAllLocationSpaces();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StandardPage title="Library bookable locations">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        {(() => {
                            if (!!locationSpaceListLoading) {
                                return (
                                    <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                        <StyledStandardCard fullHeight>
                                            <InlineLoader message="Loading" />
                                        </StyledStandardCard>
                                    </Grid>
                                );
                            } else if (!!locationSpaceListError) {
                                return (
                                    <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </Grid>
                                );
                            } else if (!locationSpaceList || locationSpaceList.length === 0) {
                                return (
                                    <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                        <StyledStandardCard fullHeight>
                                            <p>No locations found.</p>
                                        </StyledStandardCard>
                                    </Grid>
                                );
                            } else {
                                return locationSpaceList.map(object => {
                                    return (
                                        <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                            <StyledStandardCard fullHeight title={object?.location_title}>
                                                <p>{object?.location_description}</p>
                                                {object?.location_photo && (
                                                    <StyledLocationPhoto
                                                        src={object?.location_photo}
                                                        alt={object?.location_photo_description}
                                                    />
                                                )}
                                                {object?.facilities?.length > 0 && (
                                                    <>
                                                        <h3>Facilities</h3>
                                                        <ul>
                                                            {object?.facilities?.map(facility => {
                                                                return <li>{facility.facilityTypeDisplayName}</li>;
                                                            })}
                                                        </ul>
                                                    </>
                                                )}
                                            </StyledStandardCard>
                                        </Grid>
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
};

export default React.memo(SpacesLocationList);
