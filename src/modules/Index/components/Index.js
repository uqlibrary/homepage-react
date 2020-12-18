import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { useDispatch } from 'react-redux';
import {
    loadSpotlights,
    loadPrintBalance,
    loadLoans,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
} from 'actions';
import SearchPanel from 'modules/Index/components/SearchPanel/containers/SearchPanel';
import {
    seeCourseResources,
    seeComputerAvailability,
    seeLibraryServices,
    seeOpeningHours,
    seePromoPanel,
    seeTraining,
} from 'helpers/access';
import LibraryServices from './subComponents/LibraryServices';
import Spotlights from './subComponents/Spotlights';
import { makeStyles } from '@material-ui/styles';
import Hours from './subComponents/Hours';
import { default as Computers } from './subComponents/Computers';
import { default as Training } from './subComponents/Training';
import { default as PersonalisedPanel } from './subComponents/PersonalisedPanel';
import CourseResourcesPanel from './subComponents/CourseResourcesPanel';
import PromoPanel from './subComponents/PromoPanel';
import { loggedInConfirmed, loggedOutConfirmed } from 'helpers/general';

const useStyles = makeStyles(theme => ({
    ppButton: {
        width: 24,
        minWidth: 24,
        height: 24,
        padding: 8,
        margin: 2,
        backgroundColor: theme.palette.accent.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark,
        },
        '& svg': {
            width: 18,
            height: 18,
            padding: 4,
            color: theme.palette.white.main,
        },
    },
    ppBadgeError: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'red',
        left: -8,
        top: 8,
        padding: 1,
    },
    ppBadgeWarning: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'orange',
        left: -8,
        top: 8,
        padding: 1,
    },
    ppBadgeInfo: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: '#656565',
        left: -8,
        top: 8,
        padding: 1,
    },
}));

export const Index = ({
    account,
    author,
    spotlights,
    spotlightsLoading,
    libHours,
    libHoursLoading,
    computerAvailability,
    computerAvailabilityLoading,
    trainingEvents,
    trainingEventsLoading,
    printBalance,
    printBalanceLoading,
    loans,
    loansLoading,
    possibleRecords,
    possibleRecordsLoading,
    incompleteNTRO,
    incompleteNTROLoading,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    // Load homepage data requirements
    useEffect(() => {
        if (!spotlights && spotlightsLoading === null) {
            dispatch(loadSpotlights());
        }
    }, [spotlights, spotlightsLoading, dispatch]);
    useEffect(() => {
        if (loggedInConfirmed(account) && !printBalance && printBalanceLoading === null) {
            dispatch(loadPrintBalance());
        }
    }, [account, printBalance, printBalanceLoading, dispatch]);
    useEffect(() => {
        if (loggedInConfirmed(account) && !loans && loansLoading === null) {
            dispatch(loadLoans());
        }
    }, [account, loans, loansLoading, dispatch]);
    useEffect(() => {
        if (loggedInConfirmed(account) && !!author && !possibleRecords && possibleRecordsLoading === null) {
            dispatch(searcheSpacePossiblePublications());
        }
    }, [account, author, possibleRecords, possibleRecordsLoading, dispatch]);
    useEffect(() => {
        if (loggedInConfirmed(account) && !!author && !incompleteNTRO && incompleteNTROLoading === null) {
            dispatch(searcheSpaceIncompleteNTROPublications());
        }
    }, [account, author, incompleteNTRO, incompleteNTROLoading, dispatch]);
    return (
        <StandardPage>
            <div className="layout-card">
                <Grid container spacing={6}>
                    {/* Search */}
                    <Grid item xs={12}>
                        <SearchPanel />
                    </Grid>
                    {loggedInConfirmed(account) && (
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
                    {!!spotlights && spotlights.length > 0 && (
                        <Grid item xs={12} md={8} id="spotlights" data-testid="spotlights">
                            <Spotlights
                                spotlights={spotlights}
                                spotlightsLoading={spotlightsLoading}
                                account={account}
                            />
                        </Grid>
                    )}

                    {/* Personalisation panel or hours */}
                    {loggedInConfirmed(account) && (
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

                    {loggedOutConfirmed(account) && (
                        <Grid item xs={12} md={4} data-testid="library-hours-panel">
                            <Hours libHours={libHours} libHoursLoading={libHoursLoading} account={account} />
                        </Grid>
                    )}

                    {!!computerAvailability && seeComputerAvailability(account) && (
                        <Grid item xs={12} md={4} data-testid="computer-availability-panel">
                            <Computers
                                computerAvailability={computerAvailability}
                                computerAvailabilityLoading={computerAvailabilityLoading}
                                height={classes.computersAvailHeight}
                            />
                        </Grid>
                    )}

                    {loggedInConfirmed(account) && !!libHours && seeOpeningHours(account) && (
                        <Grid item xs={12} md={4} data-testid="library-hours-panel">
                            <Hours libHours={libHours} libHoursLoading={libHoursLoading} account={account} />
                        </Grid>
                    )}

                    {!!seeCourseResources(account) && (
                        <Grid item xs={12} md={4} data-testid="course-resources-panel">
                            <CourseResourcesPanel account={account} history={history} />
                        </Grid>
                    )}

                    {seeTraining(account) && (
                        <Grid item xs={12} md={4} data-testid="training-panel">
                            <Training trainingEvents={trainingEvents} trainingEventsLoading={trainingEventsLoading} />
                        </Grid>
                    )}

                    {seeLibraryServices(account) && (
                        <Grid item xs={12} md={4} data-testid="library-services-panel">
                            <LibraryServices account={account} />
                        </Grid>
                    )}

                    {seePromoPanel(account) && (
                        <Grid item xs={12} md={4}>
                            <PromoPanel account={account} />
                        </Grid>
                    )}
                </Grid>
            </div>
        </StandardPage>
    );
};

Index.propTypes = {
    account: PropTypes.any,
    author: PropTypes.object,
    actions: PropTypes.any,
    spotlights: PropTypes.any,
    spotlightsError: PropTypes.any,
    spotlightsLoading: PropTypes.bool,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
    trainingEvents: PropTypes.array,
    trainingEventsLoading: PropTypes.bool,
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
