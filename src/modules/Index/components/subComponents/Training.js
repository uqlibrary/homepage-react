import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import EventIcon from '@material-ui/icons/Event';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { trainingLocale } from './Training.locale';
const moment = require('moment');
import ContentLoader from 'react-content-loader';

const MyLoader = props => (
    <ContentLoader
        speed={2}
        uniqueKey="training"
        width={'100%'}
        height={'100%'}
        viewBox="0 0 365 300"
        backgroundColor="#f3f3f3"
        foregroundColor="#e2e2e2"
        {...props}
    >
        <rect x="5%" y="15" rx="3" ry="3" width="50%" height="14" />
        <rect x="5%" y="40" rx="3" ry="3" width="40%" height="10" />
        <rect x="0" y="65" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="80" rx="3" ry="3" width="42%" height="14" />
        <rect x="5%" y="110" rx="3" ry="3" width="45%" height="10" />
        <rect x="0" y="135" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="150" rx="3" ry="3" width="75%" height="14" />
        <rect x="5%" y="175" rx="3" ry="3" width="41%" height="10" />
        <rect x="0" y="200" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="215" rx="3" ry="3" width="52%" height="14" />
        <rect x="5%" y="245" rx="3" ry="3" width="25%" height="10" />
        <rect x="0" y="270" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="285" rx="3" ry="3" width="47%" height="14" />
        <rect x="5%" y="310" rx="3" ry="3" width="42%" height="10" />
        <rect x="0" y="325" rx="3" ry="3" width="100%" height="1" />
    </ContentLoader>
);

const useStyles = makeStyles(theme => ({
    scrollArea: {
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        padding: 8,
        color: theme.palette.secondary.dark,
    },
    row: {
        borderBottom: '1px solid #EEE',
        padding: 8,
    },
    linkButton: {
        padding: 4,
        minWidth: 0,
        textTransform: 'none',
    },
    linkButtonLabel: {
        textTransform: 'none',
        textAlign: 'left',
        fontSize: 16,
        color: theme.palette.accent.main,
        fontWeight: 300,
        lineHeight: 1.25,
    },
    flexWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
    },
    flexHeader: {
        height: 'auto',
    },
    flexContent: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('sm')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
        },
    },
    flexLoader: {
        flexGrow: 1,
        overflowX: 'hidden',
        overflowY: 'hidden',
    },
    flexFooter: {
        height: 'auto',
    },
    componentHeight: {
        [theme.breakpoints.down('sm')]: {
            height: '100%',
        },
        [theme.breakpoints.up('md')]: {
            height: 300,
        },
    },
    eventName: {
        fontWeight: 400,
    },
    eventSummary: {
        marginTop: 0,
        fontSize: 14,
        fontWeight: 300,
        textAlign: 'left',
    },
    actionButtons: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    detailHeader: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.white.main,
    },
    detailIcon: {
        color: theme.palette.white.main,
    },
    detailTitle: {
        paddingTop: 12,
        paddingBottom: 8,
        paddingRight: 16,
        lineHeight: 1.2,
    },
    detailSummary: {
        padding: '16px 20px !important',
    },
    detailMeta: {
        padding: '4px 20px !important',
    },
}));

const Training = ({ trainingEvents, trainingEventsLoading, trainingEventsError }) => {
    const classes = useStyles();
    const [eventDetail, setEventDetail] = React.useState(null);
    const handleEventDetail = event => {
        setEventDetail(event);
        setTimeout(() => {
            document.getElementById('training-event-detail-close-button').focus();
        }, 300);
    };
    const closeEvent = entityId => {
        setTimeout(() => {
            document.getElementById(`training-event-detail-button-${entityId}`).focus();
        }, 300);
        setEventDetail(null);
    };
    const openEvent = id => {
        window.location.href = `https://studenthub.uq.edu.au/students/events/detail/${id}`;
    };
    const openMoreTraining = () => {
        window.location.href = 'https://web.library.uq.edu.au/library-services/training';
    };
    const eventTime = eventTime =>
        moment(eventTime)
            .calendar(null, {
                sameDay: '[Today,] dddd D MMMM [at] h.mma',
                nextDay: '[Tomorrow,] dddd D MMMM [at] h.mma',
                nextWeek: 'dddd D MMMM [at] h.mma',
                lastDay: '[Yesterday]  D MMMM [at] h.mma',
                lastWeek: '[Last] dddd  D MMMM [at] h.mma',
                sameElse: 'D MMMM [at] h.mma',
            })
            .replace('.00', '');
    return (
        <StandardCard primaryHeader title={trainingLocale.title} noPadding>
            <div className={`${classes.flexWrapper} ${classes.componentHeight}`}>
                {!!trainingEventsError && (
                    <Fade direction="right" timeout={1000} in={!eventDetail} mountOnEnter unmountOnExit>
                        <div className={classes.flexContent} role="region">
                            <Typography style={{ padding: '1rem' }}>{trainingLocale.unavailable}</Typography>
                        </div>
                    </Fade>
                )}
                {!trainingEventsError &&
                    trainingEvents &&
                    trainingEvents.length > 0 &&
                    !trainingEventsLoading &&
                    !eventDetail && (
                        <Fade direction="right" timeout={1000} in={!eventDetail} mountOnEnter unmountOnExit>
                            <div
                                className={classes.flexContent}
                                role="region"
                                aria-live="assertive"
                                aria-label="UQ training Events list"
                            >
                                {trainingEvents &&
                                    trainingEvents.length > 0 &&
                                    trainingEvents.map((event, index) => {
                                        return (
                                            <Grid container spacing={0} className={classes.row} key={index}>
                                                <Grid item xs={12}>
                                                    <Button
                                                        id={`training-event-detail-button-${event.entityId}`}
                                                        data-testid={`training-event-detail-button-${index}`}
                                                        onClick={() => handleEventDetail(event)}
                                                        classes={{ root: classes.linkButton }}
                                                        fullWidth
                                                    >
                                                        <Grid container spacing={0} direction="column">
                                                            <Grid item className={classes.linkButtonLabel}>
                                                                {event.name}
                                                            </Grid>
                                                            <Grid item className={classes.eventSummary}>
                                                                {eventTime(event.start)}
                                                                {event.campus ? ` - ${event.campus}` : ''}
                                                            </Grid>
                                                        </Grid>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                            </div>
                        </Fade>
                    )}
                {!trainingEventsError && (!trainingEvents || trainingEventsLoading) && !eventDetail && (
                    <div className={classes.flexLoader} aria-label="UQ training Events loading">
                        <MyLoader />
                    </div>
                )}
                <Fade
                    direction="left"
                    in={!!eventDetail}
                    mountOnEnter
                    unmountOnExit
                    style={{ transitionDelay: '200ms' }}
                >
                    {!!eventDetail ? (
                        <div
                            className={classes.flexContent}
                            role="region"
                            aria-label={`UQ Library training event detail for ${eventDetail.name}`}
                            autoFocus
                        >
                            <Grid container spacing={1} direction="column">
                                <Grid item xs={12}>
                                    <Grid container spacing={1} className={classes.detailHeader}>
                                        <Grid item xs={'auto'}>
                                            <IconButton
                                                onClick={() => closeEvent(eventDetail.entityId)}
                                                aria-label={trainingLocale.closeEvent}
                                                id="training-event-detail-close-button"
                                                data-testid="training-event-detail-close-button"
                                            >
                                                <CloseIcon fontSize="small" className={classes.detailIcon} />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography className={classes.detailTitle} variant={'h6'} component={'h4'}>
                                                {eventDetail.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} className={classes.detailSummary}>
                                            <div dangerouslySetInnerHTML={{ __html: eventDetail.summary }} />
                                        </Grid>
                                        <Grid item xs={1} className={classes.detailMeta}>
                                            <Tooltip title="Date" placement="right" TransitionProps={{ timeout: 300 }}>
                                                <EventIcon />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={10} className={classes.detailMeta}>
                                            {eventTime(eventDetail.start)}
                                        </Grid>
                                        <Grid item xs={1} className={classes.detailMeta}>
                                            <Tooltip
                                                title="Location"
                                                placement="right"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <LocationOnIcon />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={10} className={classes.detailMeta}>
                                            {eventDetail.location || eventDetail.venue || eventDetail.offCampusVenue}
                                        </Grid>
                                        <Grid item xs={1} className={classes.detailMeta}>
                                            <Tooltip
                                                title="Location"
                                                placement="right"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <EventAvailableIcon />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={10} className={classes.detailMeta}>
                                            {eventDetail.bookingSettings.placesRemaining > 0
                                                ? 'Places still available'
                                                : 'Event is fully booked'}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    ) : (
                        <div />
                    )}
                </Fade>
                <div className={classes.flexFooter}>
                    {/* Buttons */}
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            {!eventDetail ? (
                                <Button
                                    classes={{ root: classes.actionButtons }}
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    disableElevation
                                    fullWidth
                                    onClick={() => openMoreTraining()}
                                    id="training-event-detail-more-training-button"
                                    data-testid="training-event-detail-more-training-button"
                                >
                                    More training events
                                </Button>
                            ) : (
                                <Button
                                    classes={{ root: classes.actionButtons }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    fullWidth
                                    onClick={() => openEvent(eventDetail.entityId)}
                                    id="training-event-detail-training-login-button"
                                    data-testid="training-event-detail-training-login-button"
                                >
                                    Log in and book now
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </div>
        </StandardCard>
    );
};

Training.propTypes = {
    trainingEvents: PropTypes.array,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
};

Training.defaultProps = {};

export default Training;
