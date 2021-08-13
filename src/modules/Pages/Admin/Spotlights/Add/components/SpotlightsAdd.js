import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/SpotlightForm';
import { getTimeNowFormatted, getTimeEndOfDayFormatted } from '../../spotlighthelpers';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { default as locale } from '../../spotlightsadmin.locale';

const useStyles = makeStyles(() => ({
    previewWrapper: {
        transition: 'visibility 0s, opacity 10s ease-out',
    },
}));

export const SpotlightsAdd = ({ actions, spotlight, spotlightError, spotlightLoading, spotlightStatus, history }) => {
    const classes = useStyles();

    const defaults = {
        id: '',
        startDateDefault: getTimeNowFormatted(),
        endDateDefault: getTimeEndOfDayFormatted(),
        spotlightTitle: '',
        enteredbody: '',
        linkRequired: false,
        urgent: false,
        permanentAlert: false,
        linkTitle: '',
        linkUrl: '',
        type: 'add',
        minimumDate: getTimeNowFormatted(),
    };
    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" className={classes.previewWrapper} />
            </Grid>
            <StandardPage title="Spotlights Management">
                <section aria-live="assertive">
                    <SpotlightsUtilityArea actions={actions} history={history} helpContent={locale.form.help} />
                    <StandardCard title="Create a new spotlight">
                        <SpotlightForm
                            actions={actions}
                            spotlightResponse={spotlight}
                            spotlightError={spotlightError}
                            spotlightLoading={spotlightLoading}
                            spotlightStatus={spotlightStatus}
                            history={history}
                            defaults={defaults}
                        />
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

SpotlightsAdd.propTypes = {
    actions: PropTypes.any,
    spotlight: PropTypes.any,
    spotlightError: PropTypes.any,
    spotlightLoading: PropTypes.any,
    spotlightStatus: PropTypes.any,
    history: PropTypes.object,
};

export default SpotlightsAdd;
