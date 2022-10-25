// import React, { useEffect, useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { PromoPanelListTable } from './PromoPanelListTable';
import { PromoPanelListPanels } from './PromoPanelListPanels';
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

    const groupPanels = [
        {
            user_type: 'public',
            user_type_name: 'Public (Not logged in}',
            panels: [
                {
                    id: 1,
                    admin_notes: 'Public Panel 1 admin notes',
                    panel_name: 'Public Panel 1 name',
                    panel_title: 'Public Panel 1 Title',
                    panel_content: 'Public Panel 1 Content',
                    panel_start: null,
                    panel_end: null,
                    is_default: true,
                },
                {
                    id: 2,
                    admin_notes: 'Public Panel 2 admin notes',
                    panel_name: 'Public Panel 2 name',
                    panel_title: 'Public Panel 2 Title',
                    panel_content: 'Public Panel 2 Content',
                    panel_start: '2022-11-06T23:59',
                    panel_end: '2022-06-14T23:59',
                    is_default: false,
                },
                {
                    id: 3,
                    admin_notes: 'Public Panel 3 admin notes',
                    panel_name: 'Public Panel 3 name',
                    panel_title: 'Public Panel 3 Title',
                    panel_content: 'Public Panel 3 Content',
                    panel_start: '2022-08-06T23:59',
                    panel_end: '2022-11-06T23:59',
                    is_default: false,
                },
            ],
        },
        {
            user_type: 'REMUG',
            user_type_name: 'REMUG Group',
            panels: [
                {
                    id: 1,
                    admin_notes: 'REMUG Panel 1 admin notes',
                    panel_name: 'REMUG Panel 1 name',
                    panel_title: 'REMUG Panel 1 Title',
                    panel_content: 'REMUG Panel 1 Content',
                    panel_start: null,
                    panel_end: null,
                    is_default: true,
                },
                {
                    id: 2,
                    admin_notes: 'REMUG Panel 2 admin notes',
                    panel_name: 'REMUG Panel 2 name',
                    panel_title: 'REMUG Panel 2 Title',
                    panel_content: 'REMUG Panel 2 Content',
                    panel_start: '2022-11-06T23:59',
                    panel_end: '2022-12-06T23:59',
                    is_default: false,
                },
            ],
        },
        {
            user_type: 'UNDERGRAD',
            user_type_name: 'UNDERGRAD Group',
            panels: [
                {
                    id: 1,
                    admin_notes: 'UNDERGRAD Panel 1 admin notes',
                    panel_name: 'UNDERGRAD Panel 1 name',
                    panel_title: 'UNDERGRAD Panel 1 Title',
                    panel_content: 'UNDERGRAD Panel 1 Content',
                    panel_start: null,
                    panel_end: null,
                    is_default: true,
                },
                {
                    id: 2,
                    admin_notes: 'REMUG Panel 2 admin notes',
                    panel_name: 'UNDERGRAD Panel 2 name',
                    panel_title: 'UNDERGRAD Panel 2 Title',
                    panel_content: 'REUNDERGRADMUG Panel 2 Content',
                    panel_start: '2022-11-06T23:59',
                    panel_end: '2022-12-06T23:59',
                    is_default: false,
                },
                {
                    id: 3,
                    admin_notes: 'REMUG Panel 3 admin notes',
                    panel_name: 'UNDERGRAD Panel 3 name',
                    panel_title: 'UNDERGRAD Panel 3 Title',
                    panel_content: 'REUNDERGRADMUG Panel 3 Content',
                    panel_start: '2022-11-06T23:59',
                    panel_end: '2022-12-06T23:59',
                    is_default: false,
                },
            ],
        },
    ];

    const currentPanels = [
        {
            panel_id: 1,
            admin_notes: 'Xmas',
            panel_title: 'Christmas break',
            panel_content: '<div>xmas break</div>',
            user_types: [
                {
                    user_type: 'REMUG',
                    user_type_name: 'Remote Undergraduate',
                    display_type: 'current',
                    is_default_panel: 'N',
                },
                {
                    user_type: 'UNDERGRAD',
                    user_type_name: 'Local Undergraduate',
                    display_type: 'current',
                    is_default_panel: 'N',
                },
            ],
        },
        {
            panel_id: 2,
            admin_notes: 'Other',
            panel_title: 'Other break',
            panel_content: '<div>not break</div>',
            user_types: [
                {
                    user_type: 'UNDERGRAD',
                    user_type_name: 'Local Undergraduate',
                    display_type: 'current',
                    is_default_panel: 'N',
                },
            ],
        },
        {
            panel_id: 3,
            admin_notes: 'Check12',
            panel_title: 'Check break',
            panel_content: '<div>not break <b>test</b></div>',
            user_types: [
                {
                    user_type: 'UNDERGRAD',
                    user_type_name: 'Local Undergraduate',
                    display_type: 'current',
                    is_default_panel: 'N',
                },
                {
                    user_type: 'UNDERGRAD2',
                    user_type_name: 'Local Undergraduate 2',
                    display_type: 'current',
                    is_default_panel: 'N',
                },
                {
                    user_type: 'UNDERGRAD3',
                    user_type_name: 'Local Undergraduate 3',
                    display_type: 'current',
                    is_default_panel: 'N',
                },
                {
                    user_type: 'UNDERGRAD4',
                    user_type_name: 'Local Undergraduate 4',
                    display_type: 'current',
                    is_default_panel: 'N',
                },
            ],
        },
    ];

    return (
        <StandardPage title="Promo Panel Management">
            <PromoPanelListTable panelList={groupPanels} title="Current Panels" canEdit canClone canDelete />
            <PromoPanelListPanels panelList={currentPanels} title="Panel List" canEdit canClone canDelete />
            {/* <PromoPanelListTable />

            <PromoPanelListTable /> */}
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
