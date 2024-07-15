import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { AlertsUtilityArea } from 'modules/Pages/Admin/Alerts/AlertsUtilityArea';
import { default as locale } from '../alertsadmin.locale';
import {
    getTimeNowFormatted,
    extractFieldsFromBody,
    getBody,
    makePreviewActionButtonJustNotifyUser,
    manuallyMakeWebComponentBePermanent,
    systemList,
} from '../alerthelpers';
import { formatDate } from 'modules/Pages/Admin/dateTimeHelper';
import { scrollToTopOfPage } from 'helpers/general';

export const AlertsView = ({ actions, alert, alertStatus, history }) => {
    const { alertid } = useParams();

    const displayPreview = thisAlert => {
        const alertWrapper = document.getElementById('previewWrapper');
        !!alertWrapper && (alertWrapper.innerHTML = '');

        // oddly, hardcoding the alert with attributes tied to values doesnt work, so insert it this way
        const alertWebComponent = document.createElement('uq-alert');
        /* istanbul ignore next */
        if (!alertWebComponent) {
            return null;
        }

        const { isPermanent, linkRequired, linkTitle, linkUrl, message } = extractFieldsFromBody(alert?.body);

        alertWebComponent.setAttribute('id', 'alert-preview');
        alertWebComponent.setAttribute('alerttitle', thisAlert.title);
        alertWebComponent.setAttribute('priorityType', thisAlert.priority_type);
        const body =
            !!thisAlert.body &&
            getBody({
                permanentAlert: isPermanent,
                linkRequired: linkRequired,
                linkTitle: linkTitle,
                linkUrl: linkUrl,
                enteredbody: message,
            });
        if (!!isPermanent) {
            manuallyMakeWebComponentBePermanent(alertWebComponent, body);
        } else {
            alertWebComponent.setAttribute('alertmessage', body);
        }
        if (!!linkRequired) {
            makePreviewActionButtonJustNotifyUser({ ...thisAlert, linkUrl: linkUrl });
        }
        alertWrapper.appendChild(alertWebComponent);

        return null;
    };

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!alertid) {
            actions.loadAnAlert(alertid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertid]);

    React.useEffect(() => {
        if (!!alert) {
            displayPreview(alert);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert]);

    if (alertStatus === 'loading') {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    const navigateToCloneForm = () => {
        history.push(`/admin/alerts/clone/${alertid}`);
        scrollToTopOfPage();
    };

    const navigateToListPage = () => {
        history.push('/admin/alerts');
        scrollToTopOfPage();
    };

    // Strip markdown from the body
    const linkRegex = !!alert?.body && alert.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let message2 = alert?.body || '';
    if (!!linkRegex && linkRegex.length === 3) {
        message2 = alert.body.replace(linkRegex[0], '').replace('  ', ' ');
        message2 = message2.replace(linkRegex[0], '').replace('  ', ' ');
    }

    const isPermanent2 = message2.includes('[permanent]');
    if (!!isPermanent2) {
        message2 = message2.replace('[permanent]', '');
    }

    const values = {
        id: alert?.id || '',
        startDate: alert?.start ? formatDate(alert.start, 'YYYY-MM-DDTHH:mm:ss') : '',
        endDate: alert?.end ? formatDate(alert.end, 'YYYY-MM-DDTHH:mm:ss') : '',
        alertTitle: alert?.title || '',
        enteredbody: message2 || '',
        linkRequired: linkRegex?.length === 3,
        priorityType: (!!alert && alert.priority_type) || 'info',
        permanentAlert: isPermanent2 || false,
        linkTitle: !!linkRegex && linkRegex.length === 3 ? linkRegex[1] : '',
        linkUrl: !!linkRegex && linkRegex.length === 3 ? linkRegex[2] : '',
        type: 'view',
        minimumDate: getTimeNowFormatted(),
        systems: alert?.systems || [],
        updatedBy: (!!alert && alert.updated_by) || null,
        createdBy: (!!alert && alert.created_by) || '?',
    };

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" sx={{ transition: 'visibility 0s, opacity 10s ease-out' }} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertsUtilityArea actions={actions} helpContent={locale.view.help} history={history} />
                    <StandardCard title="View alert" squash>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth title={locale.form.tooltips.title}>
                                    <InputLabel htmlFor="alertTitle">{locale.form.labels.title}</InputLabel>
                                    <Input
                                        id="alertTitle"
                                        data-testid="admin-alerts-view-title"
                                        value={values.alertTitle}
                                        disabled
                                        style={{ color: '#333' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth title={locale.form.tooltips.message}>
                                    <InputLabel htmlFor="alertBody" style={{ minHeight: '1.1em' }}>
                                        {locale.form.labels.message}
                                    </InputLabel>
                                    <Input
                                        id="alertBody"
                                        data-testid="admin-alerts-view-body"
                                        value={values.enteredbody}
                                        multiline
                                        rows={2}
                                        disabled
                                        style={{ color: '#333' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: 12 }}>
                            <Grid item md={6} xs={12}>
                                <InputLabel htmlFor="startDate">{locale.form.labels.startdate}</InputLabel>
                                <Input
                                    id="startDate"
                                    data-testid="admin-alerts-view-start-date"
                                    disabled
                                    style={{ color: '#333' }}
                                    value={values.startDate}
                                    type="datetime-local"
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <InputLabel htmlFor="endDate">{locale.form.labels.startdate}</InputLabel>
                                <Input
                                    id="endDate"
                                    data-testid="admin-alerts-view-end-date"
                                    disabled
                                    style={{ color: '#333' }}
                                    value={values.endDate}
                                    type="datetime-local"
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            style={{ minHeight: '4rem', paddingTop: '1rem' }}
                            className={'checkboxes'}
                        >
                            <Grid item sm={4} xs={12}>
                                <InputLabel style={{ color: '#333' }} title={locale.form.tooltips.link.checkbox}>
                                    <Checkbox
                                        checked={values.linkRequired}
                                        data-testid="admin-alerts-view-checkbox-linkrequired"
                                        className={'checkbox'}
                                        disabled
                                    />
                                    {locale.form.labels.link.checkbox}
                                </InputLabel>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <InputLabel style={{ color: '#333' }} title={locale.form.tooltips.permanent}>
                                    <Checkbox
                                        data-testid="admin-alerts-view-checkbox-permanent"
                                        checked={values.permanentAlert}
                                        name="permanentAlert"
                                        className={'checkbox'}
                                        disabled
                                    />
                                    {locale.form.labels.permanent}
                                </InputLabel>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <InputLabel style={{ color: '#333' }} title={locale.form.tooltips.priority.title}>
                                    {locale.form.labels.priority.title}
                                    <Select
                                        variant="standard"
                                        data-testid="admin-alerts-view-select-priority-type"
                                        // defaultValue={values.priority_type}
                                        value={values.priorityType}
                                        disabled
                                        classes={{ root: 'selectPriorityType' }}
                                        inputProps={{
                                            'aria-label': locale.form.labels.priority.aria,
                                        }}
                                    >
                                        <MenuItem value={'info'}>{locale.form.labels.priority.level.info}</MenuItem>
                                        <MenuItem value={'urgent'}>{locale.form.labels.priority.level.urgent}</MenuItem>
                                        <MenuItem value={'extreme'}>
                                            {locale.form.labels.priority.level.extreme}
                                        </MenuItem>
                                    </Select>
                                    {locale.form.labels.urgent}
                                </InputLabel>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            className={'linkTitleWrapper'}
                            style={{
                                display: values.linkRequired ? 'flex' : 'none',
                            }}
                        >
                            <Grid item md={6} xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="linkTitle">{locale.form.labels.link.title}</InputLabel>
                                    <Input
                                        id="linkTitle"
                                        data-testid="admin-alerts-view-link-title"
                                        value={values.linkTitle}
                                        title={locale.form.tooltips.linktitle}
                                        disabled
                                        style={{ color: '#333' }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="linkUrl">{locale.form.labels.link.url}</InputLabel>
                                    <Input
                                        type="url"
                                        id="linkUrl"
                                        data-testid="admin-alerts-view-link-url"
                                        title={locale.form.tooltips.url}
                                        value={values.linkUrl}
                                        disabled
                                        style={{ color: '#333' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} data-testid="admin-alerts-view-systems">
                            {values?.systems?.length > 0 ? (
                                <Fragment>
                                    <Grid item xs={12}>
                                        <p>This alert only appeared on...</p>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {values.systems.map(system => {
                                            const thisSystem = systemList.find(s => s.slug === system);
                                            return (
                                                <InputLabel
                                                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                                    key={thisSystem.slug}
                                                    data-testid={`admin-alerts-view-checkbox-system-${thisSystem.slug}`}
                                                >
                                                    <Checkbox
                                                        checked
                                                        name={system.slug}
                                                        title={system.title}
                                                        className={'checkbox'}
                                                        disabled
                                                    />
                                                    {thisSystem.title}
                                                </InputLabel>
                                            );
                                        })}
                                    </Grid>
                                </Fragment>
                            ) : (
                                <Grid item xs={12}>
                                    <p>This alert appeared on all systems</p>
                                </Grid>
                            )}
                        </Grid>
                        {values.createdBy !== '?' && (
                            <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                                {/* created_by entries before we started recording the creator are marked as '?' */}
                                <Grid
                                    item
                                    data-testid="admin-alerts-view-created-by"
                                >{`Created by: ${values.createdBy}`}</Grid>
                            </Grid>
                        )}
                        {!!values.updatedBy && (
                            <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                                <Grid
                                    item
                                    data-testid="admin-alerts-view-updated-by"
                                >{`Last Updated by: ${values.updatedBy}`}</Grid>
                            </Grid>
                        )}
                        <Grid
                            container
                            data-testid="admin-alerts-view-button-block"
                            spacing={2}
                            style={{ marginTop: '1rem' }}
                        >
                            <Grid item xs={3} align="left">
                                <Button
                                    color="secondary"
                                    children="Cancel"
                                    data-testid="admin-alerts-view-button-cancel"
                                    onClick={() => navigateToListPage()}
                                    variant="contained"
                                />
                            </Grid>
                            <Grid item xs={9} align="right">
                                <Button
                                    color="primary"
                                    data-testid="admin-alerts-view-button-save"
                                    variant="contained"
                                    children="Clone"
                                    onClick={() => navigateToCloneForm()}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

AlertsView.propTypes = {
    actions: PropTypes.any,
    alert: PropTypes.any,
    alertError: PropTypes.any,
    alertStatus: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsView;
