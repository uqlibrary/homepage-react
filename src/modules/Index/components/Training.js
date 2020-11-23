import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import { trainingLocale } from './Training.locale';
// const ordinal = require('ordinal');
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
        padding: '8px 0 0 0',
    },
    linkButton: {
        padding: 0,
        minWidth: 0,
        marginTop: -2,
        marginBottom: -2,
    },
    linkButtonLabel: {
        textTransform: 'capitalize',
        textAlign: 'left',
        fontSize: 16,
        color: '#3872a8', // theme.palette.accent.dark,
        fontWeight: 300,
    },
    flexWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
    dateMonth: {
        fontFamily: 'DM Mono',
        color: theme.palette.accent.main,
        width: '3ch',
        textTransform: 'uppercase',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        margin: '0 auto',
        fontWeight: 300,
        fontSize: '0.8em',
        lineHeight: '0.95em',
    },
    dateDay: {
        fontFamily: 'DM Mono',
        color: theme.palette.accent.main,
        width: '3ch',
        textTransform: 'uppercase',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        margin: '0 auto',
        fontWeight: 300,
        fontSize: '0.8em',
        lineHeight: '0.9em',
    },
    date: {
        fontFamily: 'DM Mono',
        color: theme.palette.accent.main,
        width: '2ch',
        textTransform: 'uppercase',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        margin: '0 auto',
        fontWeight: 300,
        fontSize: '1.3em',
        lineHeight: '0.95em',
    },
    eventName: {
        fontWeight: 400,
    },
    eventSummary: {
        fontSize: 14,
    },
}));

const Training = ({ trainingEvents, trainingEventsLoading }) => {
    const classes = useStyles();
    if (!!trainingEventsLoading) {
        return null;
    }
    return (
        <StandardCard accentHeader title={trainingLocale.title} noPadding>
            <div className={`${classes.flexWrapper} ${classes.componentHeight}`}>
                <div className={classes.flexContent}>
                    {trainingEvents &&
                        trainingEvents.length > 0 &&
                        trainingEvents.map((event, index) => {
                            const day = moment(event.start).format('dddd');
                            const date = moment(event.start).format('Do');
                            const month = moment(event.start).format('MMMM');
                            const time = moment(event.start).format('LT');
                            return (
                                <Grid
                                    container
                                    spacing={1}
                                    justify="center"
                                    alignItems="center"
                                    className={classes.row}
                                >
                                    <Grid item key={index} xs={2} data-testid={`training-event-${index}`}>
                                        <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item aria-label={day} className={classes.dateDay}>
                                                {day}
                                            </Grid>
                                            <Grid item aria-label={date} className={classes.date}>
                                                {date}
                                            </Grid>
                                            <Grid item aria-label={month} className={classes.dateMonth}>
                                                <abbr title={month}>{month}</abbr>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Grid container spacing={0} direction="column">
                                            <Grid item className={classes.eventName}>
                                                {event.name}
                                            </Grid>
                                            <Grid item className={classes.eventSummary}>
                                                {time} - {event.campus}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        })}
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
