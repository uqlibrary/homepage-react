import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { loadSpotlights, loadPrintBalance, loadLoans } from 'actions';
import PrimoSearch from 'modules/SharedComponents/PrimoSearch/containers/PrimoSearch';
import { default as locale } from './locale';
import { seeCourseResources, seeLibraryServices, seeTraining } from 'helpers/access';
import Spotlights from './subComponents/Spotlights';
import { makeStyles } from '@material-ui/styles';
import Hours from './subComponents/Hours';
import { default as Computers } from './subComponents/Computers';
import { default as Training } from './subComponents/Training';
import { default as PersonalisedPanel } from './subComponents/PersonalisedPanel';

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
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    // Load homepage data requirements
    useEffect(() => {
        if (spotlightsLoading === null) {
            dispatch(loadSpotlights());
        }
        if (!!account && printBalanceLoading === null) {
            dispatch(loadPrintBalance());
        }
        if (!!account && loansLoading === null) {
            dispatch(loadLoans());
        }
    }, [printBalanceLoading, printBalance, spotlightsLoading, spotlights, dispatch, account, loans, loansLoading]);
    return (
        <StandardPage>
            <div className="layout-card">
                <Grid container spacing={6}>
                    {/* Search */}
                    <Grid item xs={12}>
                        <PrimoSearch />
                    </Grid>
                    {/* Spotlights */}
                    <Grid item xs={12} lg={8} id="spotlights" data-testid="spotlights">
                        <Spotlights spotlights={spotlights} spotlightsLoading={spotlightsLoading} account={account} />
                    </Grid>

                    {/* Personalisation panel or hours */}
                    {!!account ? (
                        <Hidden smDown>
                            <Grid item xs={12} lg={4} id="personalisedPanel" data-testid="personalisedPanel">
                                <PersonalisedPanel account={account} loans={loans} printBalance={printBalance} />
                            </Grid>
                        </Hidden>
                    ) : (
                        <Grid item xs={12} md={4}>
                            <Hours libHours={libHours} libHoursLoading={libHoursLoading} account={account} />
                        </Grid>
                    )}

                    <Grid item xs={12} md={4} data-testid="computer-availability-panel">
                        <Computers
                            computerAvailability={computerAvailability}
                            computerAvailabilityLoading={computerAvailabilityLoading}
                            height={classes.computersAvailHeight}
                        />
                    </Grid>

                    {!!account && (
                        <Grid item xs={12} md={4} data-testid="library-hours-panel">
                            <Hours libHours={libHours} libHoursLoading={libHoursLoading} account={account} />
                        </Grid>
                    )}

                    {!!seeCourseResources(account) && (
                        <Grid item xs={12} md={4} data-testid="course-resources-panel">
                            <StandardCard
                                fullHeight
                                accentHeader
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Course resources
                                        </Grid>
                                    </Grid>
                                }
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs>
                                        <TextField placeholder="Enter a course code to search" fullWidth />
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Button size={'small'} style={{ width: 30, minWidth: 30 }}>
                                            <SearchIcon />
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} style={{ marginTop: 12 }}>
                                    <Grid item xs={12}>
                                        <Typography color={'secondary'} variant={'h6'}>
                                            Your courses
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <a href="#">PH101</a> - Applied psychology
                                    </Grid>
                                    <Grid item xs={12}>
                                        <a href="#">PH102</a> - More applied psychology
                                    </Grid>
                                    <Grid item xs={12}>
                                        <a href="#">PH103</a> - Even more applied psychology
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    )}

                    {seeTraining && (
                        <Grid item xs={12} md={4} data-testid="training-panel">
                            <Training trainingEvents={trainingEvents} trainingEventsLoading={trainingEventsLoading} />
                        </Grid>
                    )}

                    {seeLibraryServices && (
                        <Grid item xs={12} md={4} data-testid="library-services-panel">
                            <StandardCard
                                fullHeight
                                accentHeader
                                squareTop={false}
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Library services
                                        </Grid>
                                    </Grid>
                                }
                                fullHeight
                            >
                                <Grid container spacing={1}>
                                    {locale.LibraryServices.links.map((item, index) => {
                                        return (
                                            <Grid item xs={12} sm={12} key={index}>
                                                <a href={item.url}>{item.title}</a>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </StandardCard>
                        </Grid>
                    )}
                </Grid>
            </div>
        </StandardPage>
    );
};

Index.propTypes = {
    account: PropTypes.object,
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
};

Index.defaultProps = {};

export default Index;
