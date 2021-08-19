import React, { useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

// import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import SpotlightsListAsTable from './SpotlightsListAsTable';
import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { default as locale } from '../../spotlightsadmin.locale';

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
    const [pastSpotlights, setPastSpotlights] = useState([]);

    React.useEffect(() => {
        if (!spotlightsError && !spotlightsLoading && !spotlights) {
            actions.loadAllSpotlights();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!!spotlights && spotlights.length > 0) {
            setPastSpotlights([]);
            setCurrentSpotlights([]);
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
                // // Strip markdown from the body
                // const linkRegex = spotlight.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
                // spotlight.message = spotlight.body;
                // if (!!linkRegex && linkRegex.length === 3) {
                //     spotlight.message = spotlight.message.replace(linkRegex[0], '').replace('  ', ' ');
                // }
                if (moment(spotlight.end).isBefore(moment())) {
                    setPastSpotlights(pastSpotlights => [...pastSpotlights, spotlight]);
                } else {
                    setCurrentSpotlights(currentSpotlights => [...currentSpotlights, spotlight]);
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

    const deleteAlert = alertID => {
        return actions.deleteAlert(alertID);
    };

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
                            <div data-testid="admin-spotlights-list-current-list">
                                <SpotlightsListAsTable
                                    rows={currentSpotlights}
                                    headertag="Current and scheduled spotlights"
                                    tableType="curent"
                                    spotlightsLoading={spotlightsLoading}
                                    history={history}
                                    actions={actions}
                                    deleteAlert={deleteAlert}
                                    alertOrder="forwardEnd"
                                    allowFilter
                                />
                            </div>
                            <div data-testid="admin-spotlights-list-past-list">
                                <SpotlightsListAsTable
                                    rows={pastSpotlights}
                                    tableType="past"
                                    headertag="Past spotlights"
                                    spotlightsLoading={spotlightsLoading}
                                    history={history}
                                    actions={actions}
                                    deleteAlert={deleteAlert}
                                    alertOrder="reverseEnd"
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
