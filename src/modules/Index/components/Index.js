/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Grid from '@mui/material/Grid';

import { useDispatch } from 'react-redux';
import {
    loadPrintBalance,
    loadLoans,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
} from 'data/actions';
import ContentLoader from 'react-content-loader';
import { lazy } from 'react';
import { lazyRetry } from 'helpers/general';

import { canSeeLearningResources, canSeeLibraryServices } from 'helpers/access';

const Computers = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Computers')));
const Hours = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Hours')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
const LibraryServices = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LibraryServices')));
const Training = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Training')));

export const Index = ({
    account,
    accountLoading,
    author,
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
}) => {
    const dispatch = useDispatch();
    // Load homepage data requirements
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
            <div id="search-portal-container" data-testid="search-portal-container" style={{
                paddingTop: 25,
                paddingBottom: 25,
                backgroundColor: '#51247a',
                }}>
                    <StandardPage><search-portal /></StandardPage>

            </div>
            <StandardPage>

                <Grid container spacing={4}>
                    {/* Search */}
                    <Grid item xs={12} style={{ marginTop: 12 }}>
                        {/* <search-portal /> */}
                    </Grid>
                    {/* Hours panel, logged out */}
                    <Grid item xs={12} md={4} data-testid="library-hours-panel">
                        <Hours
                            libHours={libHours}
                            libHoursLoading={libHoursLoading}
                            libHoursError={libHoursError}
                            account={account}
                        />
                    </Grid>
                    <Grid item xs={12} md={8} data-testid="computer-availability-panel">
                        <Computers
                            computerAvailability={computerAvailability}
                            computerAvailabilityLoading={computerAvailabilityLoading}
                            computerAvailabilityError={computerAvailabilityError}
                            account={account}
                        />
                    </Grid>
                    {canSeeLearningResources(account) && (
                        <Grid item xs={12} md={4} data-testid="learning-resources-panel">
                            <LearningResourcesPanel account={account} history={history} />
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
};

export default Index;
