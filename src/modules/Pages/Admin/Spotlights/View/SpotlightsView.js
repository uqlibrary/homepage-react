import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { formatDate, scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

export const SpotlightsView = ({ actions, spotlight, spotlightStatus, history }) => {
    const { spotlightid } = useParams();

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!spotlightid) {
            actions.loadASpotlight(spotlightid);
            scrollToTopOfPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotlightid]);

    if (spotlightStatus === 'loading') {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    /* istanbul ignore next */
    const navigateToListPage = () => {
        actions.clearASpotlight(); // make the form clear for the next use

        history.push('/admin/spotlights');

        scrollToTopOfPage();
    };

    /* istanbul ignore next */
    const navigateToCloneForm = () => {
        history.push(`/admin/spotlights/clone/${spotlightid}`);

        scrollToTopOfPage();
    };

    function setDefaults() {
        const startDateDefault = spotlight?.start ? formatDate(spotlight.start, 'YYYY-MM-DDTHH:mm:ss') : '';
        const endDateDefault = spotlight?.end ? formatDate(spotlight.end, 'YYYY-MM-DDTHH:mm:ss') : '';
        return {
            id: spotlight?.id || '',
            startDateDefault: startDateDefault,
            endDateDefault: endDateDefault,
            title: spotlight?.title || '',
            url: spotlight?.url || '',
            // eslint-disable-next-line camelcase
            img_url: spotlight?.img_url || '',
            // eslint-disable-next-line camelcase
            img_alt: spotlight?.img_alt || '',
            weight: spotlight?.weight || 0,
            active: spotlight?.active || 0,
            type: 'edit',
            // eslint-disable-next-line camelcase
            admin_notes: spotlight?.admin_notes || '',
        };
    }

    const values = setDefaults();

    return (
        <Fragment>
            <StandardPage title="Spotlights Management">
                <section aria-live="assertive">
                    <SpotlightsUtilityArea actions={actions} helpContent={locale.viewPage.help} history={history} />
                    <StandardCard title="View spotlight">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth title={locale.form.tooltips.adminNotesField}>
                                    <InputLabel htmlFor="spotlightAdminNote">
                                        {locale.form.labels.adminNotesField}
                                    </InputLabel>
                                    <Input
                                        id="spotlightAdminNote"
                                        data-testid="admin-spotlights-form-admin-note"
                                        disabled
                                        multiline
                                        rows={2}
                                        style={{ color: '#333' }}
                                        value={values.admin_notes}
                                    />
                                </FormControl>
                            </Grid>
                            <hr />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl
                                    variant="standard"
                                    fullWidth
                                    title={locale.form.tooltips.linkDescAriaField}
                                >
                                    <InputLabel htmlFor="spotlightTitle">
                                        {locale.form.labels.linkDescAriaField}
                                    </InputLabel>
                                    <Input
                                        id="spotlightTitle"
                                        data-testid="admin-spotlights-form-title"
                                        value={values.title}
                                        disabled
                                        style={{ color: '#333' }}
                                        multiline
                                        rows={2}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth title={locale.form.tooltips.imgAltField}>
                                    <InputLabel htmlFor="spotlightTooltip">{locale.form.labels.imgAltField}</InputLabel>
                                    <Input
                                        id="spotlightTooltip"
                                        data-testid="admin-spotlights-form-tooltip"
                                        value={values.img_alt}
                                        disabled
                                        style={{ color: '#333' }}
                                        multiline
                                        rows={2}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth title={locale.form.tooltips.linkField}>
                                    <InputLabel htmlFor="linkUrl">{locale.form.labels.linkField}</InputLabel>
                                    <Input
                                        type="url"
                                        id="linkUrl"
                                        data-testid="admin-spotlights-form-link-url"
                                        value={values.url}
                                        disabled
                                        style={{ color: '#333' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: 12 }}>
                            <Grid item md={5} xs={12}>
                                <FormControl variant="standard" fullWidth title={locale.form.labels.publishDate}>
                                    <InputLabel htmlFor="admin-spotlights-form-start-date">
                                        {locale.form.labels.publishDate}
                                    </InputLabel>
                                    <Input
                                        id="admin-spotlights-form-start-date"
                                        data-testid="admin-spotlights-form-start-date"
                                        disabled
                                        style={{ color: '#333' }}
                                        value={values.startDateDefault}
                                        type="datetime-local"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={5} xs={12}>
                                <FormControl variant="standard" fullWidth title={locale.form.labels.unpublishDate}>
                                    <InputLabel htmlFor="admin-spotlights-form-end-date">
                                        {locale.form.labels.unpublishDate}
                                    </InputLabel>
                                    <Input
                                        id="admin-spotlights-form-end-date"
                                        data-testid="admin-spotlights-form-end-date"
                                        disabled
                                        style={{ color: '#333' }}
                                        value={values.endDateDefault}
                                        type="datetime-local"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                            <Grid item xs={10} align="left">
                                <div>
                                    <img
                                        alt="preview of uploaded spotlight file"
                                        data-testid="admin-spotlights-view-img"
                                        src={values.img_url}
                                        style={{ maxWidth: '100%' }}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                            <Grid item xs={3} align="left">
                                <Button
                                    color="secondary"
                                    children="Cancel"
                                    data-testid="admin-spotlights-form-button-cancel"
                                    onClick={
                                        /* istanbul ignore next */ () => /* istanbul ignore next */ navigateToListPage()
                                    }
                                    variant="contained"
                                />
                            </Grid>
                            <Grid item xs={9} align="right">
                                <Button
                                    color="primary"
                                    data-testid="admin-spotlights-form-button-save"
                                    variant="contained"
                                    children="Clone"
                                    onClick={
                                        /* istanbul ignore next */ () =>
                                            /* istanbul ignore next */ navigateToCloneForm()
                                    }
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

SpotlightsView.propTypes = {
    actions: PropTypes.any,
    spotlight: PropTypes.any,
    spotlightStatus: PropTypes.any,
    history: PropTypes.object,
};

export default SpotlightsView;
