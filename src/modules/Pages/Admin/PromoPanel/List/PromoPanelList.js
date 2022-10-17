// import React, { useEffect, useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/styles';

// import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
// import SpotlightsListAsTable from 'modules/Pages/Admin/Spotlights/List/SpotlightsListAsTable';
// import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
// import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

// import moment from 'moment';
// import {
//     isPastSpotlight,
//     isScheduledSpotlight,
//     scrollToTopOfPage,
// } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
// import SpotlightViewHistory from './SpotlightViewHistory';

// const useStyles = makeStyles(
//     theme => ({
//         pageLayout: {
//             marginBottom: 24,
//             paddingLeft: 24,
//             paddingRight: 24,
//             minHeight: '10em',
//             minWidth: '80%',
//         },
//         mobileOnly: {
//             [theme.breakpoints.up('sm')]: {
//                 display: 'none',
//             },
//             '& p': {
//                 backgroundColor: theme.palette.warning.light,
//                 color: '#000',
//                 fontWeight: 'bold',
//                 padding: 6,
//                 textAlign: 'center',
//             },
//         },
//     }),
//     { withTheme: true },
// );

export const PromoPanelList = (
    {
        // actions, spotlights, spotlightsLoading, spotlightsError, history
    },
) => {
    // const classes = useStyles();

    // const [currentSpotlights, setCurrentSpotlights] = useState([]);
    // const [scheduledSpotlights, setScheduledSpotlights] = useState([]);
    // const [pastSpotlights, setPastSpotlights] = useState([]);

    // const [isViewByHistoryLightboxOpen, setViewByHistoryLightboxOpen] = useState(false);
    // const handleViewByHistoryLightboxOpen = () => setViewByHistoryLightboxOpen(true);
    // const handleViewByHistoryLightboxClose = () => setViewByHistoryLightboxOpen(false);
    // const [viewByHistoryLightBoxFocus, setViewByHistoryLightBoxFocus] = React.useState('');
    // const [viewByHistoryLightBoxRows, setViewByHistoryLightBoxEntries] = React.useState([]);

    // useEffect(() => {
    //     /* istanbul ignore else */
    //     if (!spotlightsError && !spotlightsLoading && !spotlights) {
    //         actions.loadAllSpotlights();
    //         scrollToTopOfPage();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useEffect(() => {
    //     // detect if the supplied date has time component "on the hour"
    //     // (when the time would give eg 7:00am we collapse it down to 7am)
    //     const isTimeOnTheHour = inputDate => moment(inputDate).format('m') === '0';

    //     const pastDateDuringHourFormat = 'ddd D MMM YYYY [\n]h.mma';
    //     const pastDateOnTheHourFormat = pastDateDuringHourFormat.replace('h.mma', 'ha');
    //     const currentDateOnTheHourFormat = pastDateOnTheHourFormat.replace(' YYYY', '');
    //     const currentDateDuringTheHourFormat = pastDateDuringHourFormat.replace(' YYYY', '');
    //     const currentDateFormat = inputDate =>
    //         isTimeOnTheHour(inputDate) ? currentDateOnTheHourFormat : currentDateDuringTheHourFormat;
    //     const pastDateFormat = inputDate =>
    //         isTimeOnTheHour(inputDate) ? pastDateOnTheHourFormat : pastDateDuringHourFormat;

    //     if (!!spotlights && spotlights.length > 0) {
    //         setPastSpotlights([]);
    //         setCurrentSpotlights([]);
    //         setScheduledSpotlights([]);
    //         spotlights.forEach(s => {
    //             // past spotlights have their dates displayed in a different format to current & scheduled spotlights
    //             s.startDateDisplay = moment(s.start).format(
    //                 isPastSpotlight(s) ? pastDateFormat(s.start) : currentDateFormat(s.start),
    //             );
    //             s.endDateDisplay = moment(s.end).format(
    //                 isPastSpotlight(s) ? pastDateFormat(s.end) : currentDateFormat(s.end),
    //             );

    //             const fullDateFormat = 'dddd D MMMM YYYY h.mma';
    //             s.startDateMouseover = moment(s.start).format(fullDateFormat);
    //             s.endDateMouseover = moment(s.end).format(fullDateFormat);
    //             if (isPastSpotlight(s)) {
    //                 setPastSpotlights(pastState => [...pastState, s]);
    //             } else if (isScheduledSpotlight(s)) {
    //                 setScheduledSpotlights(pastState => [...pastState, s]);
    //             } else {
    //                 setCurrentSpotlights(pastState => [...pastState, s]);
    //             }
    //         });
    //     }
    // }, [spotlights]);

    // const deleteSpotlightBulk = slist => {
    //     return actions.deleteSpotlightBatch(slist);
    // };

    // const saveSpotlightChange = spotlight => {
    //     return actions.updateSpotlightWithExistingImage(spotlight);
    // };

    // const showViewByHistoryLightbox = thisSpotlight => {
    //     const filteredRows =
    //         !!thisSpotlight && !!spotlights && [...spotlights].filter(r => r.img_url === thisSpotlight.img_url);
    //     /* istanbul ignore else */
    //     if (filteredRows.length > 0) {
    //         // because its fired by clicking on a spotlight, it should never be 0
    //         setViewByHistoryLightBoxFocus(thisSpotlight);
    //         setViewByHistoryLightBoxEntries(filteredRows);
    //         handleViewByHistoryLightboxOpen();
    //     }
    // };

    // /* istanbul ignore next */
    // if (!!spotlightsError && (!spotlightsError.errorType || spotlightsError.errorType !== 'deletion')) {
    //     return (
    //         <StandardPage title="Spotlights Management">
    //             <section aria-live="assertive">
    //                 <StandardCard title="System temporarily unavailable" noPadding>
    //                     <Grid container>
    //                         <Grid item xs={12} data-testid="admin-spotlights-list-error"
    // className={classes.pageLayout}>
    //                             <p>
    //                                 We're working on the issue and will have service restored as soon as possible.
    //                                 Please try again later.
    //                             </p>
    //                         </Grid>
    //                     </Grid>
    //                 </StandardCard>
    //             </section>
    //         </StandardPage>
    //     );
    // }

    return (
        <StandardPage title="Promo Panel Management">
            <h1>Promo Panel List</h1>
        </StandardPage>
    );
};

PromoPanelList.propTypes = {
    actions: PropTypes.any,
    spotlights: PropTypes.array,
    spotlightsLoading: PropTypes.any,
    spotlightsError: PropTypes.any,
    history: PropTypes.object,
};

export default React.memo(PromoPanelList);
