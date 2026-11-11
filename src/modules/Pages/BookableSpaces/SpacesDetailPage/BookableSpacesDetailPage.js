import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router';
import { useAccountContext } from 'context';

import CircularProgress from '@mui/material/CircularProgress';

import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/JourneySpaceDetailsView';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Grid } from '@mui/material';
import { useTitle } from 'hooks';
import JourneyBreadcrumbs from '../SpacesListPage/SimpleListPage/components/JourneyBreadcrumbs';
import { trackSpacesPageView } from 'modules/Pages/BookableSpaces/Shared/spacesAnalytics';

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
    const location = useLocation();

    const { account } = useAccountContext();
    const isLoggedIn = !!account?.id;
    const [pageAnnouncement, setPageAnnouncement] = React.useState('');
    const loadedSpace = bookableSpaceGetResult?.data;
    const spaceMatchesRoute = [loadedSpace?.space_uuid, loadedSpace?.space_id].some(
        identifier => identifier != null && String(identifier) === String(spaceUuid),
    );
    const spaceName = spaceMatchesRoute
        ? [loadedSpace?.space_type_details?.space_type_name, loadedSpace?.space_name].filter(Boolean).join(' ')
        : null;
    const pageTitle = spaceName ? `Space Details - ${spaceName} - UQ Library` : 'Space Details - UQ Library';
    useTitle(pageTitle);
    const spaceRequestStateRef = React.useRef({ spaceUuid: null, loadingObserved: false });

    React.useEffect(() => {
        setPageAnnouncement('Space Details');
    }, []);

    useEffect(() => {
        if (!!spaceUuid) {
            spaceRequestStateRef.current = { spaceUuid, loadingObserved: false };
            actions.loadABookableSpacesRoom(spaceUuid);
            actions.loadWeeklyHours();
            if (isLoggedIn) {
                actions.loadSpacesFavourites();
            }
        }
    }, [actions, isLoggedIn, spaceUuid]);

    useEffect(() => {
        const requestState = spaceRequestStateRef.current;
        if (!spaceUuid || requestState.spaceUuid !== spaceUuid) {
            return;
        }

        if (bookableSpaceGetting === true) {
            requestState.loadingObserved = true;
            return;
        }

        if (bookableSpaceGetting !== false) {
            return;
        }

        const isNotFoundResult = loadedSpace && Object.keys(loadedSpace).length === 0;
        const hasCurrentResponse =
            spaceMatchesRoute ||
            (requestState.loadingObserved && (bookableSpaceGetError !== false || isNotFoundResult));
        if (!hasCurrentResponse) {
            return;
        }

        trackSpacesPageView(pageTitle, location.key);
    }, [
        bookableSpaceGetError,
        bookableSpaceGetting,
        loadedSpace,
        location.key,
        pageTitle,
        spaceMatchesRoute,
        spaceUuid,
    ]);

    useEffect(() => {
        const restoreScrollBehavior = () => {
            /* istanbul ignore else */
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
        /* istanbul ignore next */
        if (typeof window === 'undefined') {
            return restoreScrollBehavior;
        }
        /* istanbul ignore else */
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch {
            // Ignore browsers without the object-form scroll API.
        }

        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        return restoreScrollBehavior;
    }, [spaceUuid]);

    if (bookableSpaceGetting === false) {
        console.log('BookableSpacesDetailPage loaded =', bookableSpaceGetResult?.data);
    }

    return (
        <StandardPage>
            {pageAnnouncement && (
                <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-9999px' }}>
                    {pageAnnouncement}
                </div>
            )}
            <Grid
                container
                rowSpacing={4}
                columnSpacing={4}
                style={{ marginTop: 0, paddingTop: 0 }}
                data-testid="library-updates-parent"
                key="library-updates-parent"
            >
                {(() => {
                    if (bookableSpaceGetting !== false) {
                        return (
                            <Grid
                                size={{ xs: 'auto' }}
                                style={{ width: '100px', marginInline: 'auto', marginTop: '2rem' }}
                            >
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
                            <Grid sx={{ marginInline: 'auto', marginTop: '2rem' }}>
                                <span>Details of this Space are currently unavailable - please try again later.</span>
                            </Grid>
                        );
                    } else if (
                        Object.keys(bookableSpaceGetResult?.data).length === 0 ||
                        !bookableSpaceGetResult?.data?.space_id
                    ) {
                        return (
                            <Grid sx={{ marginInline: 'auto', marginTop: '2rem' }}>
                                <span>That Space does not seem to exist</span>
                            </Grid>
                        );
                    } else {
                        return (
                            <Grid sx={{ mt: 4 }}>
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
