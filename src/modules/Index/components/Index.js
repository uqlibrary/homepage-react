import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { useDispatch } from 'react-redux';
import {
    loadPrintBalance,
    loadLoans,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadSpotlights,
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
} from 'actions';
import { seeCourseResources, seeLibraryServices } from 'helpers/access';
import LibraryServices from './subComponents/LibraryServices';
import Spotlights from './subComponents/Spotlights';
import Hours from './subComponents/Hours';
import { default as Computers } from './subComponents/Computers';
import { default as Training } from './subComponents/Training';
import { default as PersonalisedPanel } from './subComponents/PersonalisedPanel';
import CourseResourcesPanel from './subComponents/CourseResourcesPanel';
import PromoPanel from './subComponents/PromoPanel';
import ContentLoader from 'react-content-loader';

const MyLoader = props => (
    <ContentLoader
        uniqueKey="spotlights"
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
}) => {
    const dispatch = useDispatch();
    console.log('homepage: spotlightsCurrent = ', spotlightsCurrent);
    // Load homepage data requirements
    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadSpotlights());
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
                    <Grid item xs={12} md={4}>
                        <MyLoader />
                    </Grid>
                )}
                {/* Personalisation panel, desktop */}
                {accountLoading === false && !!account && (
                    <Hidden smDown>
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

                {seeCourseResources(account) && (
                    <Grid item xs={12} md={4} data-testid="course-resources-panel">
                        <CourseResourcesPanel account={account} history={history} />
                    </Grid>
                )}

                <Grid item xs={12} md={4} data-testid="training-panel">
                    <Training
                        trainingEvents={trainingEvents}
                        trainingEventsLoading={trainingEventsLoading}
                        trainingEventsError={trainingEventsError}
                    />
                </Grid>

                {seeLibraryServices(account) && (
                    <Grid item xs={12} md={4} data-testid="library-services-panel">
                        <LibraryServices account={account} />
                    </Grid>
                )}

                <Grid item xs={12} md={4}>
                    <PromoPanel account={account} accountLoading={accountLoading} />
                </Grid>
            </Grid>
        </StandardPage>
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
};

Index.defaultProps = {};

export default Index;
