import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from '../../SharedComponents/Toolbox/Loaders';

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
            <StandardCard standardCardId="location-list-card">
                <Grid container spacing={3}>
                    {(() => {
                        if (!!locationSpaceListLoading) {
                            return (
                                <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                    <StandardCard fullHeight>
                                        <InlineLoader message="Loading" />
                                    </StandardCard>
                                </Grid>
                            );
                        } else if (!!locationSpaceListError) {
                            return (
                                <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                    <StandardCard fullHeight>
                                        <p>Something went wrong - please try again later.</p>
                                    </StandardCard>
                                </Grid>
                            );
                        } else if (!locationSpaceList || locationSpaceList.length === 0) {
                            return (
                                <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                    <StandardCard fullHeight>
                                        <p>No locations found.</p>
                                    </StandardCard>
                                </Grid>
                            );
                        } else {
                            return locationSpaceList.map(object => {
                                return (
                                    <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                        <StandardCard fullHeight>
                                            <h2>{object.location_title}</h2>
                                            <p>{object.location_description}</p>
                                        </StandardCard>
                                    </Grid>
                                );
                            });
                        }
                    })()}
                </Grid>
            </StandardCard>
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
