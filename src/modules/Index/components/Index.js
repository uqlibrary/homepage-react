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
    author,
    spotlightsCurrent,
    spotlightsCurrentLoading,
    libHours,
    libHoursLoading,
    libHoursError,
    computerAvailability,
    computerAvailabilityLoading,
    computerAvailabilityError,
    trainingEvents,
    trainingEventsLoading,
    trainingEventsError,
    printBalance,
    printBalanceLoading,
    loans,
    loansLoading,
    possibleRecords,
    possibleRecordsLoading,
    incompleteNTRO,
    incompleteNTROLoading,
    currentPromoPanel,
    promoPanelActionError,
    promoPanelLoading,
}) => {
    const dispatch = useDispatch();
    // Load homepage data requirements
    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadCurrentSpotlights());
            dispatch(loadLibHours());
            dispatch(loadCompAvail());
        }
    }, [accountLoading, dispatch]);

    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadTrainingEvents(account));
            // Grab the relevant promo panel here.
            if (!!!account) {
                // load anonymous panel
                dispatch(getAnonPromoPanel());
            } else {
                // load specific panel.
                dispatch(getAssignedPromoPanel());
            }
        }
    }, [account, accountLoading, dispatch]);
    useEffect(() => {
        if (accountLoading === false && !!account && !printBalance && printBalanceLoading === null) {
            dispatch(loadPrintBalance());
        }
    }, [accountLoading, account, printBalance, printBalanceLoading, dispatch]);
    useEffect(() => {
        if (accountLoading === false && !!account && !loans && loansLoading === null) {
            dispatch(loadLoans());
        }
    }, [accountLoading, account, loans, loansLoading, dispatch]);
    useEffect(() => {
        if (
            accountLoading === false &&
            !!account &&
            !!author &&
            !!author.aut_id &&
            !possibleRecords &&
            possibleRecordsLoading === null
        ) {
            dispatch(searcheSpacePossiblePublications());
        }
    }, [accountLoading, account, author, possibleRecords, possibleRecordsLoading, dispatch]);
    useEffect(() => {
        if (
            accountLoading === false &&
            !!account &&
            !!author &&
            !!author.aut_id &&
            !incompleteNTRO &&
            incompleteNTROLoading === null
        ) {
            dispatch(searcheSpaceIncompleteNTROPublications());
        }
    }, [accountLoading, account, author, incompleteNTRO, incompleteNTROLoading, dispatch]);
    return (
        <React.Suspense fallback={<ContentLoader message="Loading" />}>
            <StandardPage>
                <Grid container spacing={4}>
                    {/* Search */}
                    <Grid item xs={12} style={{ marginTop: 12 }}>
                        <search-portal />
                    </Grid>
                    {accountLoading === false && !!account && (
                        <Hidden mdUp>
                            <Grid item xs={12} lg={4} id="personalisedPanel" data-testid="personalisedPanel">
                                <PersonalisedPanel
                                    account={account}
                                    author={author}
                                    loans={loans}
                                    printBalance={printBalance}
                                    possibleRecords={possibleRecords && possibleRecords.total}
                                    incompleteNTRORecords={incompleteNTRO}
                                />
                            </Grid>
                        </Hidden>
                    )}
                    <Grid item xs={12} md={8} id="spotlights" data-testid="spotlights">
                        <Spotlights
                            spotlights={spotlightsCurrent}
                            spotlightsLoading={spotlightsCurrentLoading}
                            account={account}
                        />
                    </Grid>
                    {/* Personalisation panel or hours */}
                    {!!accountLoading && (
                        /* istanbul ignore next */
                        <Grid item xs={12} md={4}>
                            <MyLoader />
                        </Grid>
                    )}
                    {/* Personalisation panel, desktop */}
                    {accountLoading === false && !!account && (
                        <Hidden mdDown>
                            <Grid item xs={12} md={4} id="personalisedPanel" data-testid="personalisedPanel">
                                <PersonalisedPanel
                                    account={account}
                                    author={author}
                                    loans={loans}
                                    printBalance={printBalance}
                                    possibleRecords={possibleRecords && possibleRecords.total}
                                    incompleteNTRORecords={incompleteNTRO}
                                    isNextToSpotlights
                                />
                            </Grid>
                        </Hidden>
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

                    {canSeeLibraryServices(account) && (
                        <Grid item xs={12} md={4} data-testid="library-services-panel">
                            <LibraryServices account={account} />
                        </Grid>
                    )}

                    <Grid item xs={12} md={4}>
                        <PromoPanel useAPI promoPanelLoading={promoPanelLoading} account={account} accountLoading={accountLoading} promoPanelActionError={promoPanelActionError} currentPromoPanel={currentPromoPanel} />
                    </Grid>
                </Grid>
            </StandardPage>
        </React.Suspense>
    );
};

Index.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    author: PropTypes.object,
    actions: PropTypes.any,
    spotlightsCurrent: PropTypes.any,
    // spotlightsCurrentError: PropTypes.any,
    spotlightsCurrentLoading: PropTypes.bool,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
    computerAvailabilityError: PropTypes.bool,
    trainingEvents: PropTypes.any,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
    printBalance: PropTypes.object,
    printBalanceLoading: PropTypes.bool,
    loans: PropTypes.object,
    loansLoading: PropTypes.bool,
    possibleRecords: PropTypes.object,
    possibleRecordsLoading: PropTypes.bool,
    incompleteNTRO: PropTypes.object,
    incompleteNTROLoading: PropTypes.bool,
    currentPromoPanel: PropTypes.object,
    promoPanelActionError: PropTypes.string,
    promoPanelLoading: PropTypes.bool,
};

export default Index;
