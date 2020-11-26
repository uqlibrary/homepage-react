import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
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
        backgroundColor: theme.palette.primary.main,
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

const Training = ({ trainingEvents, trainingEventsLoading }) => {
    const classes = useStyles();
    const [eventDetail, setEventDetail] = React.useState(null);
    if (!!trainingEventsLoading) {
        return null;
    }
    const handleEventDetail = event => {
        setEventDetail(event);
    };
    const handleCloseEventDetail = () => {
        setEventDetail(null);
    };
    const openEvent = id => {
        window.location.href = `https://studenthub.uq.edu.au/students/events/detail/${id}`;
    };
    const openMoreTraining = () => {
        window.location.href = 'https://web.library.uq.edu.au/library-services/training';
    };
    return (
        <StandardCard accentHeader title={trainingLocale.title} noPadding>
            <div className={`${classes.flexWrapper} ${classes.componentHeight}`}>
                <Fade direction="right" in={!eventDetail} mountOnEnter unmountOnExit>
                    <div className={classes.flexContent}>
                        {trainingEvents &&
                            trainingEvents.length > 0 &&
                            trainingEvents.map((event, index) => {
                                const time = moment(event.start).calendar(null, {
                                    nextWeek: 'dddd MMMM D [at] LT',
                                    lastDay: '[Yesterday]',
                                    lastWeek: '[Last] dddd',
                                    sameElse: 'DD/MM/YYYY',
                                });
                                return (
                                    <Grid container spacing={0} className={classes.row} key={index}>
                                        <Grid item xs={12}>
                                            <Button
                                                onClick={() => handleEventDetail(event)}
                                                classes={{ root: classes.linkButton }}
                                                fullWidth
                                            >
                                                <Grid container spacing={0} direction="column">
                                                    <Grid item className={classes.linkButtonLabel}>
                                                        {event.name}
                                                    </Grid>
                                                    <Grid item className={classes.eventSummary}>
                                                        {time} - {event.campus}
                                                    </Grid>
                                                </Grid>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                    </div>
                </Fade>
                <Fade
                    direction="left"
                    in={!!eventDetail}
                    mountOnEnter
                    unmountOnExit
                    style={{ transitionDelay: '200ms' }}
                >
                    {!!eventDetail ? (
                        <div className={classes.flexContent}>
                            <Grid container spacing={1} direction="column">
                                <Grid item xs={12}>
                                    <Grid container spacing={1} className={classes.detailHeader}>
                                        <Grid item xs={'auto'}>
                                            <IconButton onClick={() => handleCloseEventDetail()}>
                                                <CloseIcon fontSize="small" className={classes.detailIcon} />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography className={classes.detailTitle} variant={'h6'}>
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
                                            {moment(eventDetail.start).calendar(null, {
                                                nextWeek: 'dddd MMM Do [at] LT',
                                                lastDay: '[Yesterday]',
                                                lastWeek: '[Last] dddd',
                                                sameElse: 'DD/MM/YYYY',
                                            })}
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
};

Training.defaultProps = {};

export default Training;

//     <StandardCard*/}
//         accentHeader
//         title={
//             <Grid container>
//                 <Grid item xs>
//                     Training
//                 </Grid>
//                 <Grid item xs={'auto'}>
//                     <Tooltip
//                         id="auth-button"
//                         title={'More training'}
//                         placement="top"
//                         TransitionProps={{ timeout: 300 }}
//                     >
//                         <IconButton
//                             size={'small'}
//                             variant={'contained'}
//                             style={{ marginRight: 0, color: 'white' }}
//                         >
//                             <OpenInNewIcon />
//                         </IconButton>
//                     </Tooltip>
//                 </Grid>
//             </Grid>
//         }
//         fullHeight
//     >
//         <div
//             style={{
//                 height: 275,
//                 overflowX: 'hidden',
//                 overflowY: 'auto',
//                 marginRight: -16,
//                 marginTop: -16,
//                 marginBottom: -24,
//                 marginLeft: -16,
//                 padding: 8,
//             }}
//         >
//             {locale.Training.map((item, index) => {
//                 return (
//                     <Grid
//                         container
//                         spacing={2}
//                         key={index}
//                         style={{ borderBottom: '1px solid #EEE', padding: '8px 0 0 0' }}
//                         alignContent={'center'}
//                         alignItems={'center'}
//                     >
//                         <Grid item xs={3}>
//                             <Grid
//                                 container
//                                 spacing={0}
//                                 alignContent={'center'}
//                                 alignItems={'center'}
//                                 justify={'center'}
//                             >
//                                 <Grid item xs={12} aria-label={ordinal(item.dayDate)}>
//                                     <div
//                                         style={{
//                                             fontFamily: 'DM Mono',
//                                             color: theme.palette.accent.main,
//                                             width: '2ch',
//                                             textTransform: 'uppercase',
//                                             overflow: 'hidden',
//                                             whiteSpace: 'nowrap',
//                                             margin: '0 auto',
//                                             fontWeight: 300,
//                                             fontSize: '1.2em',
//                                         }}
//                                     >
//                                         {ordinal(item.dayDate)}
//                                     </div>
//                                 </Grid>
//                                 <Grid
//                                     item
//                                     xs={12}
//                                     style={{
//                                         marginTop: -6,
//                                     }}
//                                     aria-label={item.day}
//                                 >
//                                     <div
//                                         style={{
//                                             fontFamily: 'DM Mono',
//                                             color: theme.palette.accent.main,
//                                             width: '3ch',
//                                             textTransform: 'uppercase',
//                                             overflow: 'hidden',
//                                             whiteSpace: 'nowrap',
//                                             margin: '0 auto',
//                                             fontWeight: 300,
//                                             fontSize: '1.1em',
//                                         }}
//                                     >
//                                         {item.day}
//                                     </div>
//                                 </Grid>
//                                 <Grid
//                                     item
//                                     xs={12}
//                                     aria-label={item.monthDate}
//                                     style={{ marginTop: -6 }}
//                                 >
//                                     <div
//                                         style={{
//                                             fontFamily: 'DM Mono',
//                                             color: theme.palette.accent.main,
//                                             width: '3ch',
//                                             textTransform: 'uppercase',
//                                             overflow: 'hidden',
//                                             whiteSpace: 'nowrap',
//                                             margin: '0 auto',
//                                             fontWeight: 300,
//                                             fontSize: '1.1em',
//                                         }}
//                                     >
//                                         {item.monthDate}
//                                     </div>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs>
//                             <a
//                                 href={item.link}
//                                 aria-label={`${item.date} ${item.time}
//                                 ${item.format} - ${item.title}`}
//                             >
//                                 {item.title}
//                             </a>
//                             <br />
//                             <span style={{ fontSize: '0.8rem', color: '#999' }}>
//                                 {item.date} - {item.time}
//                                 <br />
//                                 {item.format}
//                             </span>
//                         </Grid>
//                     </Grid>
//                 );
//             })}
//         </div>
//     </StandardCard>
