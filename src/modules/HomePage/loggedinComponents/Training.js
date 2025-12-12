import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContentLoader from 'react-content-loader';
import moment from 'moment-timezone';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { linkToDrupal } from 'helpers/general';

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
    </ContentLoader>
);
const StyledHeaderGridItem = styled(Grid)(() => ({
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'flex-start',
    '& h3': {
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 500,
        letterSpacing: '0.24px',
        lineHeight: '160%', // 25.6px
        margin: 0,
    },
    '& a': {
        fontSize: '16px',
        fontStyle: 'normal',
        height: '24px',
        lineHeight: '160%', // 25.6px
        paddingBlock: 0,
        marginLeft: '16px',
        marginTop: '7px',
    },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    marginTop: '16px',
    marginBottom: '24px',
    minHeight: '25em',
    '&.missing': {
        minHeight: '5em',
    },
    ['& .linkButton']: {
        backgroundColor: '#fff',
        borderBottom: theme.palette.designSystem.border,
        borderRadius: 0,
        color: theme.palette.secondary.dark,
        display: 'block',
        fontSize: '16px',
        fontWeight: 500,
        letterSpacing: '0.16px',
        padding: '16px 0 16px 4px',
        marginLeft: '-4px',
        minWidth: 0,
        textAlign: 'left',
        textTransform: 'none',
        '& .listEventDate': {
            color: theme.palette.primary.main,
            lineHeight: '100%', // 16px
        },
        '& .listEventItem': {
            lineHeight: '24px',
        },
        ['& .listEventItem:has(> .listEventTitle)']: {
            marginTop: '8px',
        },
        '&:hover .listEventTitle': {
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
        },
        ['& .listEventTitle']: {
            fontSize: '20px',
            lineHeight: 1,
            letterSpacing: '0.16px',
            padding: '2px 0',
        },
        ['& .listEventLocation']: {
            fontWeight: 400,
            lineHeight: '160%', // 25.6px
            marginTop: '4px',
        },
        '&:hover': {
            backgroundColor: theme.palette.designSystem.panelBackgroundColor,
            transition: 'background-color 200ms ease-out',
        },
    },
    ['& .bookActionButton']: {
        backgroundColor: theme.palette.primary.main,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '.25rem',
        color: '#fff',
        display: 'block',
        fontSize: 13,
        fontWeight: 400,
        padding: 6,
        textAlign: 'center',
        textTransform: 'uppercase',
        '&:hover': {
            backgroundColor: '#fff',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            textDecoration: 'underline',
        },
    },
    ['& .detailHeader']: {
        backgroundColor: theme.palette.primary.main,
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
    ['& .row']: {
        padding: '8px 0 0 0',
        marginLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px',
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
    ['& .flexLoader']: {
        flexGrow: 1,
        overflowY: 'hidden',
        overflowX: 'hidden',
    },
}));

const Training = ({ trainingEvents, trainingEventsLoading, trainingEventsError }) => {
    const [eventDetail, setEventDetail] = useState(null);
    const showEventDetail = (event, value = null) => {
        setEventDetail(value ?? event);
        setTimeout(() => {
            const closeButton = document.getElementById('training-event-detail-close-button');
            !!closeButton && closeButton.focus();
        }, 300);
    };
    const closeEvent = entityId => {
        setEventDetail(null);
    };
    moment.tz.setDefault('Australia/Brisbane');
    const eventTimeLong = eventInternals => {
        const calendarOptions = {
            sameDay: '[Today,] dddd D MMMM [at] h.mma',
            nextDay: '[Tomorrow,] dddd D MMMM [at] h.mma',
            nextWeek: 'dddd D MMMM [at] h.mma',
            lastDay: '[Yesterday]  D MMMM [at] h.mma',
            lastWeek: '[Last] dddd  D MMMM [at] h.mma',
            sameElse: 'D MMMM [at] h.mma',
        };
        let dateString = moment(eventInternals.start)
            .calendar(null, calendarOptions)
            .replace('.00', '');
        const startDate = moment(eventInternals.start).format('MMDD');
        const endDate = moment(eventInternals.end).format('MMDD');
        if (startDate !== endDate) {
            dateString +=
                ' - ' +
                moment(eventInternals.end)
                    .calendar(null, calendarOptions)
                    .replace('.00', '');
        }
        return dateString;
    };
    const eventDateRange = eventInternals => {
        let response = moment(eventInternals.start).format('D MMMM');
        const startDate = moment(eventInternals.start).format('MMDD');
        const endDate = moment(eventInternals.end).format('MMDD');
        if (startDate !== endDate) {
            if (moment(eventInternals.start).format('MM') === moment(eventInternals.end).format('MM')) {
                response =
                    moment(eventInternals.start).format('D') + ' - ' + moment(eventInternals.end).format('D MMMM');
            } else {
                response += ' - ' + moment(eventInternals.end).format('D MMMM');
            }
        }
        return response;
    };
    const bookingText = ev => {
        /*
          if bookingSettings is null then bookings are not required
          if bookingSettings has a placesRemaining child *and it is > 0" then there are places still available
          if bookingSettings has a placesRemaining child *and it is zero* then the course is fully booked
         */
        const placesRemainingText = { display: 'Booking is not required', button: 'Log in for more details' };
        if (ev.bookingSettings !== null) {
            if (ev.bookingSettings.placesRemaining > 0) {
                placesRemainingText.display = 'Places still available';
                placesRemainingText.button = 'Log in and book now';
            } else {
                placesRemainingText.display = 'Event is fully booked';
                placesRemainingText.button = 'Log in to join wait list';
            }
        }
        return placesRemainingText;
    };
    // there is something strange happening that sometimes the api sends us an object and sometimes an array
    // convert to an array when it happens
    const filterStandardisedTrainingEvents = () => {
        const list =
            !trainingEventsLoading && !trainingEventsError && !!trainingEvents && typeof trainingEvents === 'object'
                ? Object.keys(trainingEvents).map(key => {
                      return trainingEvents[key];
                  })
                : trainingEvents;
        return !!list && list.length > 0 ? list.slice(0, 3) : [];
    };
    const filteredTrainingEvents = filterStandardisedTrainingEvents();
    return (
        <StandardCard subCard primaryHeader noPadding standardCardId="training-panel-display" noHeader>
            <Grid container padding={3} style={{ paddingBottom: 0 }}>
                <StyledHeaderGridItem item>
                    <h3 data-testid="standard-card-training-header">Training</h3>
                    <a
                        href={linkToDrupal(
                            '/study-and-learning-support/training-and-workshops/online-and-person-workshops',
                        )}
                        id="training-event-detail-more-training-button"
                        data-analyticsid="training-event-detail-more-training-button"
                        data-testid="seeAllTrainingLink"
                    >
                        See all training
                    </a>
                </StyledHeaderGridItem>
            </Grid>
            <StyledWrapper className={'trainingWrapper'}>
                {(() => {
                    if (!!trainingEventsLoading && !eventDetail) {
                        return (
                            <div className={'flexLoader'} aria-label="UQ training Events loading">
                                <MyLoader />
                            </div>
                        );
                    } else if (!!trainingEventsError) {
                        return (
                            <Fade direction="right" timeout={1000} in={!eventDetail} mountOnEnter unmountOnExit>
                                <div className={'flexContent'} role="region">
                                    <Typography style={{ padding: '1rem' }} data-testid="training-api-error">
                                        We can’t load training events right now. Please refresh your browser or try
                                        again later.
                                    </Typography>
                                </div>
                            </Fade>
                        );
                    } else if (trainingEventsLoading === false && filteredTrainingEvents.length === 0 && !eventDetail) {
                        const displayElement = document.querySelector('.trainingWrapper');
                        !!displayElement && displayElement.classList.add('missing');
                        return (
                            <Fade direction="right" timeout={1000} in={!eventDetail} mountOnEnter unmountOnExit>
                                <div className={'flexContent'} role="region">
                                    <Typography
                                        style={{ margin: '1rem 1rem 1rem 26px' }}
                                        data-testid="training-api-error"
                                    >
                                        There are no training sessions available at the moment.
                                    </Typography>
                                    <Typography style={{ margin: '1rem 1rem 1rem 26px' }}>
                                        You can visit{' '}
                                        <a href={linkToDrupal('/study-and-learning-support/training-and-workshops')}>
                                            Training and workshops
                                        </a>{' '}
                                        for other training options or try again later.
                                    </Typography>
                                </div>
                            </Fade>
                        );
                    } else if (
                        filteredTrainingEvents &&
                        filteredTrainingEvents.length > 0 &&
                        !trainingEventsLoading &&
                        !eventDetail
                    ) {
                        return (
                            <Fade direction="right" timeout={1000} in={!eventDetail} mountOnEnter unmountOnExit>
                                <div className={'flexContent'} role="region" aria-label="UQ training Events list">
                                    {filteredTrainingEvents &&
                                        filteredTrainingEvents.length > 0 &&
                                        filteredTrainingEvents?.map?.((event, index) => {
                                            return (
                                                <Grid
                                                    container
                                                    spacing={1}
                                                    className={'row'}
                                                    key={index}
                                                    style={{ paddingBlock: 0, marginBlock: 0 }}
                                                >
                                                    <Grid item xs={12} style={{ marginRight: '24px', paddingTop: 0 }}>
                                                        <Button
                                                            id={`training-event-detail-button-${event.entityId}`}
                                                            data-testid={`training-event-detail-button-${index}`}
                                                            data-analyticsid={`training-event-detail-button-${index}`}
                                                            onClick={() => showEventDetail(event)}
                                                            classes={{ root: 'linkButton' }}
                                                            fullWidth
                                                        >
                                                            <div
                                                                className={'listEventItem listEventDate'}
                                                                data-testid={`training-event-date-range-${index}`}
                                                            >
                                                                {eventDateRange(event)}
                                                            </div>
                                                            <div className={'listEventItem'}>
                                                                <span className={'listEventTitle'}>
                                                                    {event.name}...
                                                                </span>
                                                            </div>
                                                            <div className={'listEventItem listEventLocation'}>
                                                                {event.campus}
                                                            </div>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })}
                                </div>
                            </Fade>
                        );
                    } else {
                        return <></>;
                    }
                })()}
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
                            style={{ marginTop: '8px' }}
                        >
                            <Grid container spacing={1} direction="column">
                                <Grid item xs={12}>
                                    <Grid container spacing={1} className={'detailHeader'}>
                                        <Grid item xs={'auto'} style={{ opacity: 1 }}>
                                            <IconButton
                                                onClick={() => closeEvent(eventDetail.entityId)}
                                                aria-label="Close event detail"
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
                                        <Grid
                                            item
                                            xs={12}
                                            className={'detailSummary'}
                                            data-testid="event-detail-open-summary"
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: eventDetail.summary }} />
                                        </Grid>
                                        <Grid item xs={1} className={'detailMeta'}>
                                            <Tooltip title="Date" placement="right" TransitionProps={{ timeout: 300 }}>
                                                <EventIcon />
                                            </Tooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={10}
                                            className={'detailMeta'}
                                            data-testid={`training-detail-date-range-${eventDetail.entityId}`}
                                        >
                                            {eventTimeLong(eventDetail)}
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
                                            {bookingText(eventDetail).display}
                                        </Grid>
                                    </Grid>
                                    <a
                                        className={'bookActionButton'}
                                        href={`https://studenthub.uq.edu.au/students/events/detail/${eventDetail.entityId}`}
                                        id="training-event-detail-training-login-button"
                                        data-testid="training-event-detail-training-login-button"
                                        data-analyticsid="training-event-detail-training-login-button"
                                    >
                                        {bookingText(eventDetail).button}
                                    </a>
                                </Grid>
                            </Grid>
                        </div>
                    ) : (
                        <div />
                    )}
                </Fade>
            </StyledWrapper>
        </StandardCard>
    );
};

Training.propTypes = {
    trainingEvents: PropTypes.any,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
};

export default Training;
