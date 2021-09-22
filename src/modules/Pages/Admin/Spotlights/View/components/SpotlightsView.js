import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { formatDate } from '../../spotlighthelpers';

export const SpotlightsView = ({ actions, spotlight, spotlightError, spotlightStatus, history }) => {
    console.log('SpotlightsView: spotlight =  ', spotlight);
    console.log('SpotlightsView: spotlightStatus =  ', spotlightStatus);
    console.log('SpotlightsView: spotlightError =  ', spotlightError);

    const { spotlightid } = useParams();

    React.useEffect(() => {
        if (!!spotlightid) {
            actions.loadASpotlight(spotlightid);
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

    const navigateToListPage = () => {
        actions.clearASpotlight(); // make the form clear for the next use

        history.push('/admin/spotlights');

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    // const navigateToCloneForm = spotlightid => {
    //     history.push(`/admin/spotlights/clone/${spotlightid}`);
    //
    //     const topOfPage = document.getElementById('StandardPage');
    //     !!topOfPage && topOfPage.scrollIntoView();
    // };

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
                                <FormControl fullWidth title={locale.form.tooltips.linkDescAriaField}>
                                    <InputLabel htmlFor="spotlightTitle">
                                        {locale.form.labels.linkDescAriaField}
                                    </InputLabel>
                                    <Input
                                        id="spotlightTitle"
                                        data-testid="admin-spotlights-form-title"
                                        value={values.title}
                                        disabled
                                        style={{ color: '#333' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth title={locale.form.tooltips.imgAltField}>
                                    <InputLabel htmlFor="spotlightTooltip">{locale.form.labels.imgAltField}</InputLabel>
                                    <Input
                                        id="spotlightTooltip"
                                        data-testid="admin-spotlights-form-tooltip"
                                        value={values.img_alt}
                                        disabled
                                        style={{ color: '#333' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth title={locale.form.tooltips.linkField}>
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
                                <FormControl fullWidth title={locale.form.labels.publishDate}>
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
                                <FormControl fullWidth title={locale.form.labels.unpublishDate}>
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
                                    onClick={() => navigateToListPage()}
                                    variant="contained"
                                />
                            </Grid>
                            {/* <Grid item xs={9} align="right">*/}
                            {/*    <Button*/}
                            {/*        color="primary"*/}
                            {/*        data-testid="admin-spotlights-form-button-save"*/}
                            {/*        variant="contained"*/}
                            {/*        children="Clone"*/}
                            {/*        onClick={() => navigateToCloneForm()}*/}
                            {/*    />*/}
                            {/* </Grid>*/}
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
    spotlightError: PropTypes.any,
    spotlightStatus: PropTypes.any,
    history: PropTypes.object,
};

export default SpotlightsView;
