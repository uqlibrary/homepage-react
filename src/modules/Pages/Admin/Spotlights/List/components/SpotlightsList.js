import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import SpotlightsListAsTable from 'modules/Pages/Admin/Spotlights/List/components/SpotlightsListAsTable';
import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import moment from 'moment';

const useStyles = makeStyles(
    theme => ({
        pageLayout: {
            marginBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            minHeight: '10em',
            minWidth: '80%',
        },
        mobileOnly: {
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
            '& p': {
                backgroundColor: theme.palette.warning.light,
                fontWeight: 'bold',
                padding: 6,
                textAlign: 'center',
            },
        },
    }),
    { withTheme: true },
);

export const SpotlightsList = ({ actions, spotlights, spotlightsLoading, spotlightsError, history }) => {
    const classes = useStyles();

    const [currentSpotlights, setCurrentSpotlights] = useState([]);
    const [scheduledSpotlights, setScheduledSpotlights] = useState([]);
    const [pastSpotlights, setPastSpotlights] = useState([]);

    useEffect(() => {
        if (!spotlightsError && !spotlightsLoading && !spotlights) {
            actions.loadAllSpotlights();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!!spotlights && spotlights.length > 0) {
            setPastSpotlights([]);
            setCurrentSpotlights([]);
            setScheduledSpotlights([]);
            spotlights.forEach(spotlight => {
                const pastDateDuringHour = 'ddd D MMM YYYY [\n]h.mma';
                const pastDateOnTheHour = pastDateDuringHour.replace('h.mma', 'ha');
                const currentDateOnTheHour = pastDateOnTheHour.replace(' YYYY', '');
                const currentDateDuringTheHour = pastDateDuringHour.replace(' YYYY', '');
                if (moment(spotlight.end).isBefore(moment())) {
                    spotlight.startDateDisplay = moment(spotlight.start).format(
                        moment(spotlight.start).format('m') === '0' ? pastDateOnTheHour : pastDateDuringHour,
                    );
                    spotlight.endDateDisplay = moment(spotlight.end).format(
                        moment(spotlight.end).format('m') === '0' ? pastDateOnTheHour : pastDateDuringHour,
                    );
                } else {
                    spotlight.startDateDisplay = moment(spotlight.start).format(
                        moment(spotlight.start).format('m') === '0' ? currentDateOnTheHour : currentDateDuringTheHour,
                    );
                    spotlight.endDateDisplay = moment(spotlight.end).format(
                        moment(spotlight.end).format('m') === '0' ? currentDateOnTheHour : currentDateDuringTheHour,
                    );
                }
                // we provide a mousover with the complete data for clarity
                const fullDateFormat = 'dddd D MMMM YYYY h.mma';
                spotlight.startDateLong = moment(spotlight.start).format(fullDateFormat);
                spotlight.endDateLong = moment(spotlight.end).format(fullDateFormat);
                if (moment(spotlight.end).isBefore(moment())) {
                    setPastSpotlights(pastState => [...pastState, spotlight]);
                } else if (moment(spotlight.start).isAfter(moment())) {
                    setScheduledSpotlights(pastState => [...pastState, spotlight]);
                } else {
                    setCurrentSpotlights(pastState => [...pastState, spotlight]);
                }
            });
        }
    }, [spotlights]);

    if (!!spotlightsError) {
        return (
            <StandardPage title="Spotlights Management">
                <section aria-live="assertive">
                    <StandardCard title="System temporarily unavailable" noPadding>
                        <Grid container>
                            <Grid item xs={12} data-testid="admin-spotlights-list-error" className={classes.pageLayout}>
                                <p>
                                    We're working on the issue and will have service restored as soon as possible.
                                    Please try again later.
                                </p>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    }

    const deleteSpotlight = alertID => {
        return actions.deleteSpotlight(alertID);
    };

    const saveSpotlightChange = spotlight => {
        return actions.saveSpotlightChangeWithoutFile(spotlight, 'update');
    };

    // get the current highest weight spotlight so when we create one we can calc the new max
    // and thus put it on the end of the list (without having to load spotlights again)
    const maxWeight =
        !!spotlights && spotlights.length > 0
            ? spotlights.reduce((prev, current) => (prev.weight > current.weight ? prev : current)).weight
            : 0;

    return (
        <StandardPage title="Spotlights Management">
            <section aria-live="assertive">
                <Grid container>
                    <Grid item xs={12} className={classes.mobileOnly}>
                        <p>Mobile? You might want to turn your phone sideways!</p>
                    </Grid>
                </Grid>
                <SpotlightsUtilityArea
                    actions={actions}
                    helpContent={locale.listPage.help}
                    history={history}
                    showAddButton
                    maxWeight={maxWeight}
                />
                <StandardCard title="All spotlights" noPadding>
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            id="admin-spotlights-list"
                            data-testid="admin-spotlights-list"
                            className={classes.pageLayout}
                        >
                            <div
                                id="admin-spotlights-list-current-list"
                                data-testid="admin-spotlights-list-current-list"
                            >
                                <SpotlightsListAsTable
                                    rows={currentSpotlights}
                                    headertag="Current spotlights"
                                    tableType="current"
                                    spotlightsLoading={spotlightsLoading}
                                    history={history}
                                    deleteSpotlight={deleteSpotlight}
                                    saveSpotlightChange={saveSpotlightChange}
                                    canDragRows
                                    canUnpublish
                                />
                            </div>
                            <div
                                id="admin-spotlights-list-scheduled-list"
                                data-testid="admin-spotlights-list-scheduled-list"
                            >
                                <SpotlightsListAsTable
                                    rows={scheduledSpotlights}
                                    headertag="Scheduled spotlights"
                                    tableType="scheduled"
                                    spotlightsLoading={spotlightsLoading}
                                    history={history}
                                    deleteSpotlight={deleteSpotlight}
                                    saveSpotlightChange={saveSpotlightChange}
                                    canUnpublish
                                />
                            </div>
                            <div id="admin-spotlights-list-past-list" data-testid="admin-spotlights-list-past-list">
                                <SpotlightsListAsTable
                                    rows={pastSpotlights}
                                    tableType="past"
                                    headertag="Past spotlights"
                                    spotlightsLoading={spotlightsLoading}
                                    history={history}
                                    deleteSpotlight={deleteSpotlight}
                                    saveSpotlightChange={saveSpotlightChange}
                                    canTextFilter
                                />
                            </div>
                        </Grid>
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

SpotlightsList.propTypes = {
    actions: PropTypes.any,
    spotlights: PropTypes.array,
    spotlightsLoading: PropTypes.any,
    spotlightsError: PropTypes.any,
    history: PropTypes.object,
};

export default React.memo(SpotlightsList);
