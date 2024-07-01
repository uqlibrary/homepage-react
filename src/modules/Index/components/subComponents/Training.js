import React from 'react';
import { PropTypes } from 'prop-types';
import ContentLoader from 'react-content-loader';
import moment from 'moment-timezone';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { trainingLocale } from './Training.locale';
import { styled } from '@mui/material/styles';

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

const StyledWrapper = styled('div')(({ theme }) => ({
    ['&.flexWrapper']: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
    },
    ['&.componentHeight']: {
        [theme.breakpoints.down('md')]: {
            height: '100%',
        },
        [theme.breakpoints.up('md')]: {
            height: 300,
        },
    },
    ['& .linkButton']: {
        padding: 4,
        minWidth: 0,
        textTransform: 'none',
    },
    ['& .linkButtonLabel']: {
        textTransform: 'none',
        textAlign: 'left',
        fontSize: 16,
        color: '#3872a8',
        fontWeight: 300,
        lineHeight: 1.25,
    },
    ['& .eventName']: {
        fontWeight: 400,
    },
    ['& .eventSummary']: {
        marginTop: 0,
        fontSize: 14,
        fontWeight: 300,
        textAlign: 'left',
    },
    ['& .actionButtons']: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        width: '100%',
    },
    ['& .actionButtonBlock']: {
        '& a': {
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            color: '#fff',
            display: 'block',
            fontSize: 13,
            fontWeight: 400,
            padding: 6,
            textAlign: 'center',
            textTransform: 'uppercase',
            width: '100%',
            '&:hover': {
                textDecoration: 'none',
                boxShadow: 'none',
            },
        },
    },
    ['& .moreActionButton']: {
        backgroundColor: theme.palette.secondary.light,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        },
    },
    ['& .bookActionButton']: {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    ['& .detailHeader']: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.white.main,
    },
    ['& .detailIcon']: {
        color: theme.palette.white.main,
    },
    ['& .detailTitle']: {
        paddingTop: 12,
        paddingBottom: 8,
        paddingRight: 16,
        lineHeight: 1.2,
    },
    ['& .detailSummary']: {
        padding: '16px 20px !important',
    },
    ['& .detailMeta']: {
        padding: '4px 20px !important',
    },
    ['& .scrollArea']: {
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        padding: 8,
        color: theme.palette.secondary.dark,
        height: '100%',
    },
    ['& .row']: {
        borderBottom: '1px solid #EEE',
        padding: '8px 0 0 0',
    },
    ['& .flexHeader']: {
        height: 'auto',
        whiteSpace: 'nowrap',
    },
    ['& .flexContent']: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('md')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
        },
    },
    ['& .flexFooter']: {
        height: 'auto',
    },
    ['& .flexLoader']: {
        flexGrow: 1,
        overflowY: 'hidden',
        overflowX: 'hidden',
    },
}));

const Training = ({ trainingEvents, trainingEventsLoading, trainingEventsError }) => {
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
    moment.tz.setDefault('Australia/Brisbane');
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
    const bookingText = ev => {
        let placesRemainingText = 'Booking is not required';
        if (ev.bookingSettings !== null) {
            placesRemainingText = 'Event is fully booked';

            if (ev.bookingSettings.placesRemaining > 0) {
                placesRemainingText = 'Places still available';
            }
        }
        return placesRemainingText;
    };
    // there is something strange happening that sometimes the api sends us an object
    // convert to an array when it happens
    const standardisedTrainingEvents =
        !!trainingEvents && typeof trainingEvents === 'object'
            ? Object.keys(trainingEvents).map(key => {
                  return trainingEvents[key];
              })
            : trainingEvents;
    return (
        <StandardCard primaryHeader title={trainingLocale.title} noPadding>
            <StyledWrapper className={'flexWrapper componentHeight'}>
                {!!trainingEventsError && (
                    /* istanbul ignore next */ <Fade
                        direction="right"
                        timeout={1000}
                        in={!eventDetail}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div className={'flexContent'} role="region">
                            <Typography style={{ padding: '1rem' }}>{trainingLocale.unavailable}</Typography>
                        </div>
                    </Fade>
                )}
                {!trainingEventsError &&
                    standardisedTrainingEvents &&
                    standardisedTrainingEvents.length > 0 &&
                    !trainingEventsLoading &&
                    !eventDetail && (
                        <Fade direction="right" timeout={1000} in={!eventDetail} mountOnEnter unmountOnExit>
                            <div className={'flexContent'} role="region" aria-label="UQ training Events list">
                                {standardisedTrainingEvents &&
                                    standardisedTrainingEvents.length > 0 &&
                                    standardisedTrainingEvents.map((event, index) => {
                                        return (
                                            <Grid container spacing={0} className={'row'} key={index}>
                                                <Grid item xs={12}>
                                                    <Button
                                                        id={`training-event-detail-button-${event.entityId}`}
                                                        data-testid={`training-event-detail-button-${index}`}
                                                        data-analyticsid={`training-event-detail-button-${index}`}
                                                        onClick={() => handleEventDetail(event)}
                                                        classes={{ root: 'linkButton' }}
                                                        fullWidth
                                                    >
                                                        <Grid container spacing={0} direction="column">
                                                            <Grid item className={'linkButtonLabel'}>
                                                                {event.name}
                                                            </Grid>
                                                            <Grid item className={'eventSummary'}>
                                                                {eventTime(event.start)}
                                                                {event.campus
                                                                    ? ` - ${event.campus}`
                                                                    : /* istanbul ignore next */ ''}
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
                    <div className={'flexLoader'} aria-label="UQ training Events loading">
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
                            className={'flexContent'}
                            role="region"
                            aria-label={`UQ Library training event detail for ${eventDetail.name}`}
                            autoFocus
                            data-testid={`training-events-detail-${eventDetail.entityId}`}
                        >
                            <Grid container spacing={1} direction="column">
                                <Grid item xs={12}>
                                    <Grid container spacing={1} className={'detailHeader'}>
                                        <Grid item xs={'auto'}>
                                            <IconButton
                                                onClick={() => closeEvent(eventDetail.entityId)}
                                                aria-label={trainingLocale.closeEvent}
                                                id="training-event-detail-close-button"
                                                data-testid="training-event-detail-close-button"
                                                size="large"
                                            >
                                                <CloseIcon fontSize="small" className={'detailIcon'} />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography className={'detailTitle'} variant={'h6'} component={'h3'}>
                                                {eventDetail.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} className={'detailSummary'}>
                                            <div dangerouslySetInnerHTML={{ __html: eventDetail.summary }} />
                                        </Grid>
                                        <Grid item xs={1} className={'detailMeta'}>
                                            <Tooltip title="Date" placement="right" TransitionProps={{ timeout: 300 }}>
                                                <EventIcon />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={10} className={'detailMeta'}>
                                            {eventTime(eventDetail.start)}
                                        </Grid>
                                        <Grid item xs={1} className={'detailMeta'}>
                                            <Tooltip
                                                title="Location"
                                                placement="right"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <LocationOnIcon />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={10} className={'detailMeta'}>
                                            {eventDetail.location ||
                                                eventDetail.venue ||
                                                /* istanbul ignore next */ eventDetail.offCampusVenue}
                                        </Grid>
                                        <Grid item xs={1} className={'detailMeta'}>
                                            <Tooltip
                                                title="Location"
                                                placement="right"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <EventAvailableIcon />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={10} className={'detailMeta'}>
                                            {bookingText(eventDetail)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    ) : (
                        <div />
                    )}
                </Fade>
                <div className={'flexFooter'}>
                    {/* Buttons */}
                    <Grid container spacing={0}>
                        <Grid item xs={12} className={'actionButtonBlock'}>
                            {!eventDetail ? (
                                <a
                                    className={'moreActionButton'}
                                    href="https://web.library.uq.edu.au/library-services/training"
                                    id="training-event-detail-more-training-button"
                                    data-testid="training-event-detail-more-training-button"
                                    data-analyticsid="training-event-detail-more-training-button"
                                >
                                    More training events
                                </a>
                            ) : (
                                <a
                                    className={'bookActionButton'}
                                    href={`https://studenthub.uq.edu.au/students/events/detail/${eventDetail.entityId}`}
                                    id="training-event-detail-training-login-button"
                                    data-testid="training-event-detail-training-login-button"
                                    data-analyticsid="training-event-detail-training-login-button"
                                >
                                    Log in and book now
                                </a>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </StyledWrapper>
        </StandardCard>
    );
};

Training.propTypes = {
    trainingEvents: PropTypes.any,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
};

Training.defaultProps = {};

export default Training;
