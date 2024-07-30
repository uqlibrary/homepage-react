/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';

import { useDispatch } from 'react-redux';
import {
    loadPrintBalance,
    loadLoans,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadCurrentSpotlights,
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
    getAssignedPromoPanel,
    getAnonPromoPanel,
} from 'data/actions';
import ContentLoader from 'react-content-loader';
import { lazy } from 'react';
import { lazyRetry } from 'helpers/general';

import { canSeeLearningResources, canSeeLibraryServices } from 'helpers/access';

const Computers = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Computers')));
const Hours = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Hours')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
const LibraryServices = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LibraryServices')));
const PersonalisedPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/PersonalisedPanel')));
const PromoPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/PromoPanel')));
const Spotlights = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Spotlights')));
const Training = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Training')));

/* istanbul ignore next */
const MyLoader = props => (
    <ContentLoader
        uniqueKey="personalisation-panel-or-hours"
        speed={2}
        width={'100%'}
        height={'100%'}
        viewBox="0 0 320 245"
        backgroundColor="#f3f3f3"
        foregroundColor="#e2e2e2"
        {...props}
    >
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
    </ContentLoader>
);

export const Index = ({
    account,
    accountLoading,
    libHours,
    libHoursLoading,
    libHoursError,
    computerAvailability,
    computerAvailabilityLoading,
    computerAvailabilityError,
    trainingEvents,
    trainingEventsLoading,
    trainingEventsError,
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadLibHours());
            dispatch(loadCompAvail());
        }
    }, [accountLoading, dispatch]);

    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadTrainingEvents(account));
        }
    }, [account, accountLoading, dispatch]);
    return (
        <React.Suspense fallback={<ContentLoader message="Loading" />}>
            <StandardPage>
                <Grid container spacing={4}>
                    {/* Search */}
                    <Grid item xs={12} style={{ marginTop: 12 }}>
                        <search-portal />
                    </Grid>
                    {/* Personalisation panel or hours */}
                    {!!accountLoading && (
                        /* istanbul ignore next */
                        <Grid item xs={12} md={4}>
                            <MyLoader />
                        </Grid>
                    )}
                    {/* Hours panel, logged out */}
                    {accountLoading === false && !account && (
                        <Grid item xs={12} md={4} data-testid="library-hours-panel">
                            <Hours
                                libHours={libHours}
                                libHoursLoading={libHoursLoading}
                                libHoursError={libHoursError}
                                account={account}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} md={4} data-testid="computer-availability-panel">
                        <Computers
                            computerAvailability={computerAvailability}
                            computerAvailabilityLoading={computerAvailabilityLoading}
                            computerAvailabilityError={computerAvailabilityError}
                            account={account}
                        />
                    </Grid>
                    {accountLoading === false && !!account && (
                        <Grid item xs={12} md={4} data-testid="library-hours-panel">
                            <Hours
                                libHours={libHours}
                                libHoursLoading={libHoursLoading}
                                libHoursError={libHoursError}
                                account={account}
                            />
                        </Grid>
                    )}

                    {canSeeLearningResources(account) && (
                        <Grid item xs={12} md={4} data-testid="learning-resources-panel">
                            <LearningResourcesPanel account={account} />
                        </Grid>
                    )}

                    <Grid item xs={12} md={4} data-testid="training-panel">
                        <Training
                            trainingEvents={trainingEvents}
                            trainingEventsLoading={trainingEventsLoading}
                            trainingEventsError={trainingEventsError}
                        />
                    </Grid>
                </Grid>
            </StandardPage>
        </React.Suspense>
    );
};

Index.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    actions: PropTypes.any,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
    computerAvailabilityError: PropTypes.bool,
    trainingEvents: PropTypes.any,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
};

export default Index;
