import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useAccountContext } from 'context';

import CircularProgress from '@mui/material/CircularProgress';

import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/JourneySpaceDetailsView';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Grid } from '@mui/material';
import JourneyBreadcrumbs from '../SpacesListPage/SimpleListPage/components/JourneyBreadcrumbs';

export const BookableSpacesDetailPage = ({
    actions,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    bookableSpaceGetting,
    bookableSpaceGetError,
    bookableSpaceGetResult,
    spacesFavouritesList,
    // spacesFavouritesLoading,
    spacesFavouritesError,
}) => {
    console.log(
        'BookableSpacesDetailPage start bookableSpace =',
        bookableSpaceGetting,
        bookableSpaceGetError,
        bookableSpaceGetResult,
    );
    console.log('BookableSpacesDetailPage start weeklyHours =', weeklyHoursLoading, weeklyHoursError, weeklyHours);

    // "spaceUuid" matching the param passed in pathConfig.js and config/routes.js
    const { spaceUuid } = useParams();

    const { account } = useAccountContext();
    const isLoggedIn = !!account?.id;

    // React.useEffect(() => {
    //     console.log('BookableSpacesDetailPage start');
    //     if (!!spaceUuid && bookableSpaceGetting === null && !bookableSpaceGetError && !bookableSpaceGetResult) {
    //         console.log('BookableSpacesDetailPage start call actions');
    //         actions.loadABookableSpacesRoom(spaceUuid);
    //     } else {
    //         console.log('BookableSpacesDetailPage start not yet spaceUuid=', spaceUuid);
    //         console.log('BookableSpacesDetailPage start not yet ================================================');
    //     }
    // }, [actions, bookableSpaceGetError, bookableSpaceGetResult, bookableSpaceGetting, spaceUuid]);
    useEffect(() => {
        if (!!spaceUuid) {
            actions.loadABookableSpacesRoom(spaceUuid);
            actions.loadWeeklyHours();
            if (isLoggedIn) {
                actions.loadSpacesFavourites();
            }
        }
    }, [actions, isLoggedIn, spaceUuid]);

    if (bookableSpaceGetting === false) {
        console.log('BookableSpacesDetailPage loaded =', bookableSpaceGetResult?.data);
    }

    return (
        <StandardPage>
            <Grid
                container
                spacing={4}
                style={{ marginTop: 0, paddingTop: 0 }}
                data-testid="library-updates-parent"
                key="library-updates-parent"
            >
                {(() => {
                    if (bookableSpaceGetting !== false) {
                        return (
                            <Grid item xs={'auto'} style={{ width: '100px', marginInline: 'auto', marginTop: '2rem' }}>
                                <CircularProgress
                                    color="primary"
                                    size={50}
                                    id="loading-space-details"
                                    aria-label="Loading Space details"
                                />
                            </Grid>
                        );
                    } else if (bookableSpaceGetError !== false) {
                        return (
                            <Grid item sx={{ marginInline: 'auto', marginTop: '2rem' }}>
                                <span>Details of this Space are currently unavailable - please try again later.</span>
                            </Grid>
                        );
                    } else if (
                        Object.keys(bookableSpaceGetResult?.data).length === 0 ||
                        !bookableSpaceGetResult?.data?.space_id
                    ) {
                        return (
                            <Grid item sx={{ marginInline: 'auto', marginTop: '2rem' }}>
                                <span>That Space does not seem to exist</span>
                            </Grid>
                        );
                    } else {
                        return (
                            <Grid item>
                                <JourneyBreadcrumbs view="details" />
                                <JourneySpaceDetailsView
                                    actions={actions}
                                    selectedSpace={bookableSpaceGetResult.data}
                                    weeklyHours={weeklyHours}
                                    weeklyHoursLoading={weeklyHoursLoading}
                                    weeklyHoursError={weeklyHoursError}
                                    showBackButton={false}
                                    showMap
                                    narrowView={false}
                                    verticalView={false}
                                    isFavourite={spacesFavouritesList?.some(
                                        fav => fav.space_id === bookableSpaceGetResult?.data?.space_id,
                                    )}
                                    // spacesFavouritesLoading={spacesFavouritesLoading || bookableSpaceGetting}
                                    spacesFavouritesError={spacesFavouritesError || bookableSpaceGetError}
                                />
                            </Grid>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

BookableSpacesDetailPage.propTypes = {
    actions: PropTypes.any,
    isLoggedIn: PropTypes.bool,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    isFavourite: PropTypes.bool,
    bookableSpaceGetting: PropTypes.any,
    bookableSpaceGetError: PropTypes.any,
    bookableSpaceGetResult: PropTypes.any,
    selectedSpace: PropTypes.any,
    spacesFavouritesList: PropTypes.any,
    // spacesFavouritesLoading: PropTypes.any,
    spacesFavouritesError: PropTypes.any,
};

export default React.memo(BookableSpacesDetailPage);
