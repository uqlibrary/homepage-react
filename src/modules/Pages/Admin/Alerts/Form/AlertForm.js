import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import { default as locale } from '../alertsadmin.locale';
import {
    editConfirmationDetails,
    expandValues,
    isInvalidEndDate,
    isInvalidStartDate,
    postAddCloneDetails,
    postAddConfirmationDetails,
    SYSTEM_PANEL_SHOW,
    SYSTEM_PANEL_HIDE,
    SYSTEM_PANEL_ALL,
} from './helpers';

import {
    getBody,
    getTimeEndOfDayFormatted,
    getTimeNowFormatted,
    isValidUrl,
    makePreviewActionButtonJustNotifyUser,
    manuallyMakeWebComponentBePermanent,
    systemList,
} from '../alerthelpers';
import { formatDate } from 'modules/Pages/Admin/dateTimeHelper';
import { scrollToTopOfPage, StyledPrimaryButton, StyledSecondaryButton, StyledTertiaryButton } from 'helpers/general';
import { useNavigate } from 'react-router';
import { breadcrumbs } from 'config/routes';

function SystemTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`system-tabpanel-${index}`}
            aria-labelledby={`system-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
SystemTabPanel.propTypes = {
    children: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    other: PropTypes.any,
};

function a11yProps(index, slug = 'system') {
    return {
        id: `${slug}-tab-${index}`,
        'aria-controls': `${slug}-tabpanel-${index}`,
    };
}

const StyledCheckBoxes = styled(Grid)(({ theme }) => ({
    // on mobile layouts reverse the order of the checkboxes so the 'add link' appears with the link text fields
    [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexDirection: 'column-reverse',
    },
    '& .checkbox': {
        '& input[type="checkbox"]:checked + svg': {
            fill: '#595959',
        },
    },
    '& .disabledCheckbox': {
        '& input[type="checkbox"]:checked + svg': {
            fill: '#ececec',
        },
    },
    '& .selectPriorityType': {
        minWidth: '6em',
    },
}));

const StyledBox = styled(Grid)(() => ({
    marginTop: '1em',
    paddingBottom: '1em',
}));

const warningIcon =
    'url("data:image/svg+xml,%3csvg viewBox=%270 0 24 24%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M20.127 18.545a1.18 1.18 0 0 1-1.055 1.706H4.929a1.18 1.18 0 0 1-1.055-1.706l7.072-14.143a1.179 1.179 0 0 1 2.109 0l7.072 14.143Z%27 stroke=%27%233b383e%27 stroke-width=%271.5%27%3e%3c/path%3e%3cpath d=%27M12 9v4%27 stroke=%27%233b383e%27 stroke-width=%271.5%27 stroke-linecap=%27round%27%3e%3c/path%3e%3ccircle cx=%2711.9%27 cy=%2716.601%27 r=%271.1%27 fill=%27%233b383e%27%3e%3c/circle%3e%3c/svg%3e")';
const StyledTabWrapperBox = styled(Box)(({ theme }) => ({
    width: '100%',
    marginInline: '1rem',
    '& .tabPanel p.systemWarning': {
        backgroundColor: theme.palette.designSystem.alert.warning,
        padding: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        columnGap: '1rem',
        maxWidth: '46ch',
        '& span.infoBadge': {
            display: 'inline-block',
            width: '24px',
            height: '24px',
            backgroundImage: warningIcon,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            flexShrink: 0,
        },
    },
    [theme.breakpoints.up('uqDsTablet')]: {
        // affordance: on desktop, push each panel over to encourage a visual "what sort of system is this?" enhancement
        '& .tabPanel2': {
            '& > div': {
                marginLeft: '20ch',
            },
        },
        '& .tabPanel3': {
            '& > div': {
                marginLeft: '45ch',
            },
        },
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        '& .tabsHeader div[role="tablist"]': {
            // vertical tabs on tablet and below for visibility
            flexDirection: 'column',
        },
    },
}));

export const AlertForm = ({ actions, alertLoading, alertResponse, alertStatus, defaults, alertError }) => {
    const navigate = useNavigate();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [showPreview, setPreviewOpen] = useState(false); // show hide the preview block

    const [values, setValues] = useState(defaults); // the data displayed in the form
    const [countSuccess, setSuccessCount] = useState(0); // store the number of success saves to display to the user
    const [dateList, setDateList] = useState([
        // list of details for "another date row" button
        {
            startDate: defaults.startDateDefault,
            endDate: defaults.endDateDefault,
        },
    ]);

    const [systemTabValue, setSystemTabValue] = React.useState(SYSTEM_PANEL_ALL);

    const showHidePreview = showThePreview => {
        const alertWrapper = document.getElementById('previewWrapper');
        /* istanbul ignore next */
        if (!alertWrapper) {
            return;
        }

        alertWrapper.parentElement.style.visibility = !!showThePreview ? 'visible' : 'hidden';
        alertWrapper.parentElement.style.opacity = !!showThePreview ? '1' : '0';

        document.getElementById('admin-alerts-form-button-preview')?.blur();

        setPreviewOpen(showThePreview);
    };

    const validateValues = (currentValues, systemTabValueIN = null) => {
        const systemTabValueLocal =
            systemTabValueIN === null ? systemTabValue : /* istanbul ignore next */ systemTabValueIN;
        const isValidSystem = () => {
            if (systemTabValueLocal === SYSTEM_PANEL_SHOW) {
                return currentValues?.systemsShownOn?.length > 0;
            }
            if (systemTabValueLocal === SYSTEM_PANEL_HIDE) {
                return currentValues?.systemsHiddenFrom?.length > 0;
            }
            /* istanbul ignore else */
            if (systemTabValueLocal === SYSTEM_PANEL_ALL) {
                return true;
            }
            /* istanbul ignore next */
            return false;
        };

        const isValid =
            !alertLoading &&
            !isInvalidStartDate(currentValues.startDate, defaults) &&
            !isInvalidEndDate(currentValues.endDate, currentValues.startDate) &&
            currentValues.alertTitle.length > 0 &&
            !!currentValues.enteredbody &&
            currentValues.enteredbody.length > 0 &&
            (!currentValues.linkRequired || currentValues.linkUrl.length > 0) &&
            (!currentValues.linkRequired || isValidUrl(currentValues.linkUrl)) &&
            !!isValidSystem();

        // if we are currently showing the preview and the form becomes invalid, hide it again
        /* istanbul ignore next */
        !isValid && !!showPreview && showHidePreview(false);

        return isValid;
    };

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.alertsadmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.alertsadmin.pathname);

        if (!!defaults && defaults.type === 'clone') {
            setFormValidity(validateValues(defaults));
        }

        if (defaults?.systemsHiddenFrom?.length > 0) {
            setSystemTabValue(SYSTEM_PANEL_HIDE);
        } else if (defaults?.systemsShownOn?.length > 0) {
            setSystemTabValue(SYSTEM_PANEL_SHOW);
        } else {
            setSystemTabValue(SYSTEM_PANEL_ALL);
        }

        return () => {
            setSuccessCount(0);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            !!alertResponse &&
            (!!alertResponse.id || (Array.isArray(alertResponse) && !!alertResponse.length)) &&
            alertStatus === 'saved'
        ) {
            Array.isArray(alertResponse)
                ? setSuccessCount(alertResponse.length)
                : setSuccessCount(prevCount => prevCount + 1);

            showConfirmation();
        }
    }, [showConfirmation, alertResponse, alertStatus]);

    useEffect(() => {
        /* istanbul ignore next */
        if (!!alertError || alertStatus === 'error') {
            showConfirmation();
        }
    }, [showConfirmation, alertError, alertStatus]);

    const handleSystemTabChange = (event, newSystemTabValue) => {
        setSystemTabValue(newSystemTabValue);
        setFormValidity(validateValues(values, newSystemTabValue));
    };

    const clearForm = () => {
        setValues({
            ['alertTitle']: '',
            ['enteredbody']: '',
            ['startDate']: defaults.startDateDefault,
            ['endDate']: defaults.endDateDefault,
            ['priorityType']: 'info',
            ['permanentAlert']: false,
            ['linkRequired']: false,
            ['linkTitle']: '',
            ['linkUrl']: '',
            ['dateList']: [
                {
                    startDate: defaults.startDateDefault,
                    endDate: defaults.endDateDefault,
                },
            ],
            ['systemsShownOn']: [],
            ['systemsHiddenFrom']: [],
        });
    };

    const navigateToListPage = () => {
        clearForm();

        actions.clearAlerts(); // force the list page to reload after save

        actions.clearAnAlert(); // make the form clear for the next use

        navigate('/admin/alerts');
        scrollToTopOfPage();
    };

    const reloadClonePage = () => {
        setValues({
            ...defaults,
            dateList: [
                {
                    startDate: getTimeNowFormatted(),
                    endDate: getTimeEndOfDayFormatted(),
                },
            ],
        });

        scrollToTopOfPage();
    };

    const saveAlerts = () => {
        setSuccessCount(0);
        const expandedValues = expandValues(values, defaults);
        setValues(expandedValues);

        const dateList = expandedValues.dateList;
        const newValues = {
            id: defaults.type !== 'add' ? values.id : null,
            title: values.alertTitle,
            body: expandedValues.body, // unsure why this isn't set into `values` by the Set call above
            priority_type: (!!values && values.priorityType) || /* istanbul ignore next */ 'info',
            start: formatDate(values.startDate),
            end: formatDate(values.endDate),
            systems_shown:
                systemTabValue === SYSTEM_PANEL_SHOW ? values.systemsShownOn || /* istanbul ignore next */ [] : [],
            systems_hidden:
                systemTabValue === SYSTEM_PANEL_HIDE ? values.systemsHiddenFrom || /* istanbul ignore next */ [] : [],
        };

        if (defaults.type === 'edit') {
            const updatedRecord = {
                ...newValues,
                start: formatDate(dateList[0]?.startDate),
                end: formatDate(dateList[0]?.endDate),
            };
            actions.saveAlertChange(updatedRecord);
        } else {
            const saveableValues = [];
            dateList.forEach(dateset => {
                saveableValues.push({
                    ...newValues,
                    start: formatDate(dateset.startDate),
                    end: formatDate(dateset.endDate),
                });
            });

            actions.createAlert(saveableValues);
        }

        const alertWrapper = document.getElementById('previewWrapper');
        !!alertWrapper && (alertWrapper.innerHTML = '');
        showHidePreview(false);

        // force to the top of the page, because otherwise it looks a bit weird
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const displayPreview = () => {
        const alertWrapper = document.getElementById('previewWrapper');
        !!alertWrapper && (alertWrapper.innerHTML = '');
        /* istanbul ignore next */
        if (!!showPreview) {
            showHidePreview(false);
            return;
        }

        showHidePreview(true);
        setValues(expandValues(values, defaults));

        // oddly, hardcoding the alert with attributes tied to values doesnt work, so insert it this way
        const alertWebComponent = document.createElement('uq-alert');
        /* istanbul ignore next */
        if (!alertWebComponent) {
            return;
        }
        alertWebComponent.setAttribute('id', 'alert-preview');
        alertWebComponent.setAttribute('alerttitle', values.alertTitle);
        alertWebComponent.setAttribute('prioritytype', values.priorityType);
        let body = (!!values.body && getBody(values)) || getBody(defaults);
        // when they havent entered all the link details yet, dont display the link in the preview at all
        body = body.replace('[]()', '');
        body = body.replace(`[${values.linkTitle}]()`, '');
        body = body.replace(`[](${values.linkUrl})`, '');
        if (!!values.permanentAlert) {
            manuallyMakeWebComponentBePermanent(alertWebComponent, body);
        } else {
            /* istanbul ignore next */
            alertWebComponent.setAttribute('alertmessage', body);
        }
        if (!!values.linkRequired) {
            makePreviewActionButtonJustNotifyUser(values);
        }
        alertWrapper.appendChild(alertWebComponent);
    };

    const handleChange = prop => event => {
        if (prop === 'system-showon') {
            const systemsShownOnLocal = [...(values.systemsShownOn || /* istanbul ignore next */ [])];
            /* istanbul ignore next */
            if (systemsShownOnLocal?.includes(event.target.name) && !event.target.checked) {
                // system had been selected and the checkbox has been unchecked. Remove.
                const index = systemsShownOnLocal?.indexOf(event.target.name);
                index >= 0 && systemsShownOnLocal?.splice(index, 1);
            } /* istanbul ignore else */ else if (
                !systemsShownOnLocal?.includes(event.target.name) &&
                !!event.target.checked
            ) {
                // system wasn't previously selected and the checkbox has been checked. Add.
                systemsShownOnLocal?.push(event.target.name);
            }
            setValues({
                ...values,
                systemsShownOn: systemsShownOnLocal,
            });
            setFormValidity(
                validateValues({
                    ...values,
                    systemsShownOn: systemsShownOnLocal,
                }),
            );

            return;
        }
        if (prop === 'system-hidefrom') {
            const systemsHiddenFromLocal = [...(values.systemsHiddenFrom || /* istanbul ignore next */ [])];
            /* istanbul ignore next */
            if (systemsHiddenFromLocal?.includes(event.target.name) && !event.target.checked) {
                // system had been selected and the checkbox has been unchecked. Remove.
                const index = systemsHiddenFromLocal?.indexOf(event.target.name);
                index >= 0 && systemsHiddenFromLocal?.splice(index, 1);
            } /* istanbul ignore else */ else if (
                !systemsHiddenFromLocal?.includes(event.target.name) &&
                !!event.target.checked
            ) {
                // system wasn't previously selected and the checkbox has been checked. Add.
                systemsHiddenFromLocal?.push(event.target.name);
            }
            setValues({
                ...values,
                systemsHiddenFrom: systemsHiddenFromLocal,
            });
            setFormValidity(
                validateValues({
                    ...values,
                    systemsHiddenFrom: systemsHiddenFromLocal,
                }),
            );

            return;
        }

        let dateListIndex = null;
        /* istanbul ignore next */
        if (prop === 'startDate') {
            dateListIndex = event?.target?.id.replace('startDate-', '');
        }
        /* istanbul ignore next */
        if (prop === 'endDate') {
            dateListIndex = event?.target?.id.replace('endDate-', '');
        }
        /* istanbul ignore next */
        if (!!dateListIndex) {
            const tempDateEntry = {
                startDate: prop === 'startDate' ? event.target.value : values.dateList[dateListIndex].startDate,
                endDate: prop === 'endDate' ? event.target.value : values.dateList[dateListIndex].endDate,
            };
            const tempDateList = values.dateList;
            tempDateList[dateListIndex] = tempDateEntry;
            setValues({
                ...values,
                dateList: tempDateList,
            });

            setDateList([
                ...dateList,
                {
                    startDate: prop === 'startDate' ? event.target.value : values.dateList[dateListIndex].startDate,
                    endDate: prop === 'endDate' ? event.target.value : values.dateList[dateListIndex].endDate,
                },
            ]);

            setFormValidity(validateValues({ ...values, dateList: tempDateList }));

            return;
        }
        const newValue = event.target.hasOwnProperty('checked') ? event.target.checked : event.target.value;
        setValues({ ...values, [prop]: newValue });

        const newValues = expandValues({ ...values, [prop]: newValue }, defaults);
        setValues(newValues);

        setFormValidity(validateValues({ ...values, [prop]: newValue }));

        // if the form has changed, hide the Preview
        showHidePreview(false);
    };

    const removeDateRow = indexRowToBeRemoved => {
        const filteredDatelist = values.dateList.filter((row, index) => {
            return index !== indexRowToBeRemoved;
        });
        setDateList(filteredDatelist);
        setValues({
            ...values,
            dateList: filteredDatelist,
        });
    };

    const addDateRow = () => {
        const tempValue = values;
        tempValue.dateList = [
            ...tempValue.dateList,
            {
                startDate: getTimeNowFormatted(),
                endDate: getTimeEndOfDayFormatted(),
            },
        ];
        setDateList([
            ...dateList,
            {
                startDate: getTimeNowFormatted(),
                endDate: getTimeEndOfDayFormatted(),
            },
        ]);
    };

    const errorLocale = {
        ...locale.form.add.addAlertError,
        confirmationTitle: `An error occurred: ${JSON.stringify(alertError)}`,
    };

    const handleConfirmation = () => {
        // I hate this sort of fake switch, but the istanbul would not give coverage of the else if :(
        switch (true) {
            case defaults.type !== 'add':
                // the action on edit page is always 'return to list'
                navigateToListPage();
                break;
            /* istanbul ignore next */
            case !!alertError:
                // On error on add, the button just closes the notification dialog,
                // allowing the user to correct and try again
                /* istanbul ignore next */
                hideConfirmation(); // form remains loaded
                break;
            default:
                clearForm();
        }
    };

    const ShowWarningOnEmpty = ({ systems }) => {
        return (
            <>
                {systems?.length === 0 && (
                    <p className={'systemWarning'} data-testid="system-show-empty-warning">
                        <span className="infoBadge" aria-hidden="true" />
                        At least one system must be chosen before saving.
                    </p>
                )}
            </>
        );
    };
    return (
        <Fragment>
            <form>
                {alertStatus === 'error' && (
                    /* istanbul ignore next */ <ConfirmationBox
                        confirmationBoxId="alert-error"
                        onAction={
                            /* istanbul ignore next */ () =>
                                /* istanbul ignore next */
                                alertError === 'The requested page could not be found.' && navigateToListPage()
                        }
                        onClose={hideConfirmation}
                        hideCancelButton
                        isOpen={isOpen}
                        locale={errorLocale}
                    />
                )}
                {alertStatus !== 'error' && defaults.type === 'edit' && (
                    <ConfirmationBox
                        confirmationBoxId="alert-edit-save-succeeded"
                        onAction={handleConfirmation}
                        onClose={hideConfirmation}
                        hideCancelButton
                        isOpen={isOpen}
                        locale={editConfirmationDetails(locale.form.edit.editAlertConfirmation, values, systemTabValue)}
                    />
                )}
                {alertStatus !== 'error' && defaults.type === 'add' && (
                    <ConfirmationBox
                        confirmationBoxId="alert-add-save-succeeded"
                        onAction={handleConfirmation}
                        onClose={hideConfirmation}
                        onCancelAction={() => navigateToListPage()}
                        isOpen={isOpen}
                        locale={postAddConfirmationDetails(
                            locale.form.add.addAlertConfirmation,
                            countSuccess,
                            values,
                            systemTabValue,
                        )}
                    />
                )}
                {alertStatus !== 'error' && defaults.type === 'clone' && (
                    <ConfirmationBox
                        confirmationBoxId="alert-clone-save-succeeded"
                        onClose={hideConfirmation}
                        onAction={() => reloadClonePage()}
                        isOpen={isOpen}
                        locale={postAddCloneDetails(locale.form.clone.cloneAlertConfirmation, countSuccess)}
                        onCancelAction={() => navigateToListPage()}
                    />
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl variant="standard" fullWidth title={locale.form.tooltips.title}>
                            <InputLabel htmlFor="alertTitle">{locale.form.labels.title}</InputLabel>
                            <Input
                                id="alertTitle"
                                data-testid="admin-alerts-form-title"
                                error={!values.alertTitle}
                                value={values.alertTitle}
                                onChange={handleChange('alertTitle')}
                                inputProps={{ maxLength: 100 }}
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
                                data-testid="admin-alerts-form-body"
                                error={!values.enteredbody}
                                value={values.enteredbody}
                                onChange={handleChange('enteredbody')}
                                multiline
                                rows={2}
                                inputProps={{ maxLength: 550 }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                {!!values.dateList &&
                    values.dateList.map((dateset, index) => {
                        return (
                            <Grid
                                data-testid={`admin-alerts-form-row-${index}`}
                                key={`dateset-${index}`}
                                container
                                spacing={2}
                                style={{ marginTop: 12 }}
                            >
                                <Grid item md={5} xs={12}>
                                    <TextField
                                        variant="standard"
                                        id={`startDate-${index}`}
                                        data-testid={`admin-alerts-form-start-date-${index}`}
                                        error={isInvalidStartDate(dateset.startDate, defaults)}
                                        InputLabelProps={{ shrink: true }}
                                        label={locale.form.labels.startdate}
                                        onChange={handleChange('startDate')}
                                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                                        type="datetime-local"
                                        value={values.dateList[index].startDate}
                                        inputProps={{
                                            min: defaults.minimumDate,
                                            required: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item md={5} xs={12}>
                                    <TextField
                                        variant="standard"
                                        id={`endDate-${index}`}
                                        data-testid={`admin-alerts-form-end-date-${index}`}
                                        InputLabelProps={{ shrink: true }}
                                        label={locale.form.labels.enddate}
                                        onChange={handleChange('endDate')}
                                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                                        type="datetime-local"
                                        value={values.dateList[index].endDate}
                                        error={isInvalidEndDate(dateset.endDate, dateset.startDate)}
                                        inputProps={{
                                            min: values.dateList[index].startDate,
                                            required: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item md={2} xs={12} data-testid={`admin-alerts-form-add-remove-buttons-${index}`}>
                                    {['add', 'clone'].includes(defaults.type) &&
                                    index === values.dateList.length - 1 ? (
                                        <IconButton
                                            data-testid={`admin-alerts-form-another-date-button-${index}`}
                                            onClick={addDateRow}
                                            title={locale.form.tooltips.addAnotherDateSet}
                                            style={{ minWidth: 60 }}
                                            aria-label="Add a date set"
                                            size="large"
                                        >
                                            <AddCircleSharpIcon />
                                        </IconButton>
                                    ) : (
                                        <Typography className="MuiButtonBase-root" style={{ minWidth: 60 }}>
                                            &nbsp;
                                        </Typography>
                                    )}
                                    {['add', 'clone'].includes(defaults.type) && values.dateList.length > 1 && (
                                        <IconButton
                                            data-testid={`admin-alerts-form-remove-date-button-${index}`}
                                            onClick={() => removeDateRow(index)}
                                            title={locale.form.tooltips.removeDateSet}
                                            aria-label="Remove this date set"
                                            size="large"
                                        >
                                            <RemoveCircleSharpIcon />
                                        </IconButton>
                                    )}
                                </Grid>
                            </Grid>
                        );
                    })}
                <StyledCheckBoxes container spacing={2} style={{ minHeight: '4rem', paddingTop: '1rem' }}>
                    <Grid item sm={4} xs={12}>
                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.tooltips.link.checkbox}>
                            <Checkbox
                                checked={!!values.linkRequired}
                                data-testid="admin-alerts-form-checkbox-linkrequired"
                                onChange={handleChange('linkRequired')}
                                className={'checkbox'}
                            />
                            {locale.form.labels.link.checkbox}
                        </InputLabel>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.tooltips.permanent}>
                            <Checkbox
                                data-testid="admin-alerts-form-checkbox-permanent"
                                checked={!!values.permanentAlert}
                                onChange={handleChange('permanentAlert')}
                                name="permanentAlert"
                                title={locale.form.permanentTooltip}
                                className={'checkbox'}
                            />
                            {locale.form.labels.permanent}
                        </InputLabel>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <InputLabel
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                            title={locale.form.tooltips.priority.title}
                        >
                            {locale.form.labels.priority.title}
                            <Select
                                variant="standard"
                                data-testid="admin-alerts-form-select-prioritytype"
                                defaultValue={values.priorityType}
                                value={values.priorityType}
                                onChange={handleChange('priorityType')}
                                classes={{ root: 'selectPriorityType' }}
                                inputProps={{
                                    'data-testid': 'admin-alerts-form-prioritytype-input',
                                    'aria-label': locale.form.labels.priority.aria,
                                }}
                            >
                                <MenuItem data-testid="admin-alerts-form-option-info" value={'info'}>
                                    {locale.form.labels.priority.level.info}
                                </MenuItem>
                                <MenuItem data-testid="admin-alerts-form-option-urgent" value={'urgent'}>
                                    {locale.form.labels.priority.level.urgent}
                                </MenuItem>
                                <MenuItem data-testid="admin-alerts-form-option-extreme" value={'extreme'}>
                                    {locale.form.labels.priority.level.extreme}
                                </MenuItem>
                            </Select>
                        </InputLabel>
                    </Grid>
                </StyledCheckBoxes>
                <StyledBox
                    container
                    spacing={2}
                    style={{
                        display: values.linkRequired ? 'flex' : 'none',
                    }}
                >
                    <Grid item md={6} xs={12}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="linkTitle">{locale.form.labels.link.title}</InputLabel>
                            <Input
                                id="linkTitle"
                                data-testid="admin-alerts-form-link-title"
                                value={values.linkTitle}
                                onChange={handleChange('linkTitle')}
                                title={locale.form.tooltips.link.title}
                                inputProps={{
                                    maxLength: 55,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="linkUrl">{locale.form.labels.link.url}</InputLabel>
                            <Input
                                type="url"
                                id="linkUrl"
                                data-testid="admin-alerts-form-link-url"
                                value={values.linkUrl}
                                onChange={handleChange('linkUrl')}
                                error={!isValidUrl(values.linkUrl)}
                                title={locale.form.tooltips.link.url}
                            />
                        </FormControl>
                    </Grid>
                </StyledBox>
                <StyledBox container spacing={2}>
                    <Grid item xs={12}>
                        <p>
                            <strong>System specific alerts:</strong> determine which systems the alert will appear on
                        </p>
                    </Grid>
                    <StyledTabWrapperBox>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                className={'tabsHeader'}
                                value={systemTabValue}
                                onChange={handleSystemTabChange}
                                aria-label="System tabs"
                            >
                                <Tab label="Show on all systems" {...a11yProps(SYSTEM_PANEL_ALL)} />
                                <Tab label="Show on some systems" {...a11yProps(SYSTEM_PANEL_SHOW)} />
                                <Tab label="Hide on some systems" {...a11yProps(SYSTEM_PANEL_HIDE)} />
                            </Tabs>
                        </Box>

                        <SystemTabPanel className="tabPanel tabPanel1" value={systemTabValue} index={SYSTEM_PANEL_ALL}>
                            <p>This alert will show on all systems.</p>
                        </SystemTabPanel>
                        <SystemTabPanel className="tabPanel tabPanel2" value={systemTabValue} index={SYSTEM_PANEL_SHOW}>
                            <Grid item xs={12}>
                                <p>Choose one or more systems that SHOULD show the alerts.</p>
                                {systemList.map(system => {
                                    const isChecked = values?.systemsShownOn?.find(s => s === system.slug) || null;
                                    const displayColor = !!system.removed
                                        ? /* istanbul ignore next */ null
                                        : 'rgba(0, 0, 0, 0.87)';
                                    return (
                                        <InputLabel style={{ color: `${displayColor}` }} key={system.slug}>
                                            <Checkbox
                                                checked={!!isChecked}
                                                data-testid={`admin-alerts-form-checkbox-system-showon-${system.slug}`}
                                                onChange={handleChange('system-showon')}
                                                name={`${system.slug}`}
                                                title={
                                                    `Show on {system.title}` ||
                                                    /* istanbul ignore next */ `Show on {system.slug}` ||
                                                    /* istanbul ignore next */ 'Unknown'
                                                }
                                                className={`${
                                                    !system.removed
                                                        ? 'checkbox'
                                                        : /* istanbul ignore next */ 'disabledCheckbox'
                                                }`}
                                                disabled={!!system.removed}
                                            />
                                            Show on {system.title}
                                        </InputLabel>
                                    );
                                })}
                                <ShowWarningOnEmpty systems={values.systemsShownOn} />
                            </Grid>
                        </SystemTabPanel>
                        <SystemTabPanel className="tabPanel tabPanel3" value={systemTabValue} index={SYSTEM_PANEL_HIDE}>
                            <Grid item xs={12}>
                                <p>Choose one or more systems this alert should be HIDDEN from.</p>
                                {systemList.map(system => {
                                    const isChecked = values?.systemsHiddenFrom?.find(s => s === system.slug) || null;
                                    const displayColor = !!system.removed
                                        ? /* istanbul ignore next */ null
                                        : 'rgba(0, 0, 0, 0.87)';
                                    return (
                                        <InputLabel style={{ color: `${displayColor}` }} key={system.slug}>
                                            <Checkbox
                                                checked={!!isChecked}
                                                data-testid={`admin-alerts-form-checkbox-system-hidefrom-${system.slug}`}
                                                onChange={handleChange('system-hidefrom')}
                                                name={`${system.slug}`}
                                                title={
                                                    `Hide from {system.title}` ||
                                                    /* istanbul ignore next */ `Hide from {system.slug}` ||
                                                    /* istanbul ignore next */ 'Unknown'
                                                }
                                                className={`${
                                                    !system.removed
                                                        ? 'checkbox'
                                                        : /* istanbul ignore next */ 'disabledCheckbox'
                                                }`}
                                                disabled={!!system.removed}
                                            />
                                            Hide from {system.title}
                                        </InputLabel>
                                    );
                                })}
                                <ShowWarningOnEmpty systems={values.systemsHiddenFrom} />
                            </Grid>
                        </SystemTabPanel>
                    </StyledTabWrapperBox>
                </StyledBox>
                {defaults.type === 'edit' && values.createdBy !== '?' && (
                    <Grid
                        container
                        spacing={2}
                        style={{
                            marginTop: '1rem',
                            borderTop: '1px solid rgb(211, 211, 211)',
                        }}
                    >
                        {/* created_by entries before we started recording the creator are marked as '?' */}
                        <Grid item data-testid="admin-alerts-form-created-by">{`Created by: ${values.createdBy}`}</Grid>
                    </Grid>
                )}
                {defaults.type === 'edit' && !!values.updatedBy && (
                    <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                        <Grid
                            item
                            data-testid="admin-alerts-form-updated-by"
                        >{`Last Updated by: ${values.updatedBy}`}</Grid>
                    </Grid>
                )}
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={3} align="left">
                        <StyledSecondaryButton
                            children="Cancel"
                            data-testid="admin-alerts-form-button-cancel"
                            onClick={() => navigateToListPage()}
                        />
                    </Grid>
                    <Grid item xs={9} align="right">
                        <StyledTertiaryButton
                            id="admin-alerts-form-button-preview"
                            data-testid="admin-alerts-form-button-preview"
                            children="Preview"
                            onClick={displayPreview}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <StyledPrimaryButton
                            color="primary"
                            data-testid="admin-alerts-form-button-save"
                            variant="contained"
                            children={defaults.type === 'edit' ? 'Save' : 'Create'}
                            disabled={!isFormValid}
                            onClick={saveAlerts}
                        />
                    </Grid>
                </Grid>
            </form>
        </Fragment>
    );
};

AlertForm.propTypes = {
    actions: PropTypes.any,
    alertResponse: PropTypes.any,
    alertError: PropTypes.any,
    alertLoading: PropTypes.any,
    alertStatus: PropTypes.any,
    defaults: PropTypes.object,
};

export default AlertForm;
