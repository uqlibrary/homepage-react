import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/DlorAdminBreadcrumbs';

import { scrollToTopOfPage } from 'helpers/general';
import { getDlorViewPageUrl, toTitleCase } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

const useStyles = makeStyles(theme => ({
    titleBlock: {
        '& p:first-child': {
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            fontSize: 16,
            '& a': {
                color: 'rgba(0, 0, 0, 0.87)',
                textDecoration: 'underline',
            },
        },
    },
    errorMessage: {
        color: theme.palette.error.light,
        fontSize: '0.8em',
        marginTop: 2,
    },
    draggableItem: {
        minHeight: '2em',
        backgroundColor: '#e7f0fa', // $utility-50
        marginBottom: '0.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: '1.5em',
    },
}));

export const DLOSeriesEdit = ({
    actions,
    // saving changes
    dlorItemUpdating,
    dlorUpdatedItemError,
    dlorUpdatedItem,
    // get object-child-of-series data
    dlorList,
    dlorListLoading,
    dlorListError,
}) => {
    const { dlorSeriesId } = useParams();
    const classes = useStyles();
    const [cookies, setCookie] = useCookies();

    const [originalSeriesDetails, setOriginalSeriesDetails] = useState({
        series_id: '',
        series_name: '',
    });
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        series_name: '',
        object_list_linked: [],
        object_list_unassigned: [],
    });

    useEffect(() => {
        setConfirmationOpen(!dlorItemUpdating && (!!dlorUpdatedItemError || !!dlorUpdatedItem));
    }, [dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem]);

    const isValidSeriesName = seriesName => {
        return seriesName?.trim() !== '';
    };

    const isValidForm = currentValues => {
        return isValidSeriesName(currentValues?.series_name);
    };

    useEffect(() => {
        /* istanbul ignore else */
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dlorListLoading && !dlorListError && !!dlorList) {
            setConfirmationOpen(false);

            const seriesDetail = dlorList.find(s => s.object_series_id === Number(dlorSeriesId));
            setOriginalSeriesDetails({
                series_id: seriesDetail?.object_series_id,
                series_name: seriesDetail?.object_series_name,
            });
            setFormValues({
                series_name: seriesDetail?.object_series_name,
                object_list_linked:
                    dlorList?.length > 0
                        ? dlorList?.filter(o => {
                              return o.object_series_id === Number(dlorSeriesId);
                          })
                        : /* istanbul ignore next */ [],
                object_list_unassigned:
                    dlorList?.length > 0
                        ? dlorList?.filter(d => {
                              return !(d?.object_series_id > 0);
                          })
                        : /* istanbul ignore next */ [],
            });
        }
    }, [dlorSeriesId, dlorList, dlorListError, dlorListLoading, actions]);

    function closeConfirmationBox() {
        setConfirmationOpen(false);
    }

    const navigateToSeriesManagementHomePage = () => {
        closeConfirmationBox();
        window.location.href = dlorAdminLink('/series/manage');
        scrollToTopOfPage();
    };
    const navigateToPreviousPage = () => {
        window.location.href = dlorAdminLink('/series/manage');
    };

    const clearForm = () => {
        closeConfirmationBox();
        window.location.reload(false);
    };

    const locale = {
        successMessage: {
            confirmationTitle: 'Changes have been saved',
            confirmationMessage: '',
            cancelButtonLabel: 'Re-edit Series',
            confirmButtonLabel: 'Return to Admin Series page',
        },
        errorMessage: {
            confirmationTitle: dlorUpdatedItemError,
            confirmationMessage: '',
            confirmButtonLabel: 'Close',
        },
    };

    const handleChange = prop => e => {
        const theNewValue = e.target.value;

        let newValues;
        let linked = formValues.object_list_linked;
        let unassigned = formValues.object_list_unassigned;
        /* istanbul ignore next */
        if (prop.startsWith('linked_object_series_order-')) {
            const uuid = prop.replace('linked_object_series_order-', '');
            const thisdlor = linked.find(d => d.object_public_uuid === uuid);
            thisdlor.object_series_order = e.target.value;

            if (e.target.value === 0) {
                // remove thisdlor from linked group
                linked = linked.filter(d => d.object_public_uuid !== uuid);
                // add thisdlor to unassigned group
                unassigned.push(thisdlor);
            } else {
                // move within linked group
                linked.map(d => d.object_public_uuid === uuid && (d.object_series_order = e.target.value));
            }
            linked = linked.sort((a, b) => a.object_series_order - b.object_series_order);
            unassigned = unassigned.sort((a, b) => a.object_series_order - b.object_series_order);

            newValues = {
                series_name: formValues.series_name,
                object_list_linked: linked,
                object_list_unassigned: unassigned,
            };
        } else if (prop.startsWith('unassigned_object_series_order-')) {
            const uuid = prop.replace('unassigned_object_series_order-', '');
            const thisdlor = unassigned.find(d => d.object_public_uuid === uuid);
            thisdlor.object_series_order = e.target.value;

            if (e.target.value !== 0) {
                // remove thisdlor from unassigned group
                unassigned = unassigned.filter(d => d.object_public_uuid !== uuid);
                // add thisdlor to linked group
                linked.push(thisdlor);
            }
            linked = linked.sort((a, b) => a.object_series_order - b.object_series_order);
            unassigned = unassigned.sort((a, b) => a.object_series_order - b.object_series_order);
            newValues = {
                series_name: formValues.series_name,
                object_list_linked: linked,
                object_list_unassigned: unassigned,
            };
        } else {
            // series name edited
            newValues = { ...formValues, [prop]: theNewValue };
        }

        setFormValues(newValues);
    };

    const saveChanges = () => {
        const valuesToSend = {
            series_name: formValues.series_name,
            series_list: formValues.object_list_linked
                .filter(item => Number(item.object_series_order) > 0)
                .map(item => ({
                    object_public_uuid: item.object_public_uuid,
                    object_series_order: Number(item.object_series_order),
                })),
        };

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        actions.updateDlorSeries(dlorSeriesId, valuesToSend);
    };

    return (
        <StandardPage title="Digital Learning Hub - Edit Series">
            <DlorAdminBreadcrumbs
                breadCrumbList={[
                    {
                        link: dlorAdminLink('/series/manage'),
                        title: 'Series management',
                    },
                    {
                        title: `Edit series: ${originalSeriesDetails.series_name || ''}`,
                        id: 'edit-series',
                    },
                ]}
            />
            <Grid container spacing={2}>
                {(() => {
                    /* istanbul ignore else */
                    if (!!dlorItemUpdating || !!dlorListLoading) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            </Grid>
                        );
                    } else if (!!dlorListError) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-seriesItem-error">
                                    {dlorListError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!!originalSeriesDetails) {
                        return (
                            <>
                                <Grid item xs={12} data-testid="dlor-series-item-list">
                                    <Grid container key={`list-series-${originalSeriesDetails.series_id}`}>
                                        <ConfirmationBox
                                            actionButtonColor="primary"
                                            actionButtonVariant="contained"
                                            confirmationBoxId="dlor-series-save-outcome"
                                            onAction={() => {
                                                !!dlorUpdatedItemError
                                                    ? closeConfirmationBox()
                                                    : navigateToSeriesManagementHomePage();
                                            }}
                                            hideCancelButton={
                                                !!dlorUpdatedItemError || !locale.successMessage.cancelButtonLabel
                                            }
                                            cancelButtonLabel={locale.successMessage.cancelButtonLabel}
                                            onCancelAction={() => clearForm()}
                                            onClose={closeConfirmationBox}
                                            isOpen={confirmationOpen}
                                            locale={
                                                !!dlorUpdatedItemError ? locale.errorMessage : locale.successMessage
                                            }
                                        />

                                        <form id="dlor-editSeries-form" style={{ width: '100%' }}>
                                            <Grid item xs={12}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="series_name">Series name *</InputLabel>
                                                    <Input
                                                        id="series_name"
                                                        data-testid="series_name"
                                                        required
                                                        value={formValues?.series_name}
                                                        onChange={handleChange('series_name')}
                                                        error={!isValidSeriesName(formValues?.series_name)}
                                                    />
                                                </FormControl>
                                                {/* dlorList to stop it flashing an error */}
                                                {!!dlorList && !isValidSeriesName(formValues?.series_name) && (
                                                    <div
                                                        className={classes.errorMessage}
                                                        data-testid="error-message-series_name"
                                                    >
                                                        This series name is not valid.
                                                    </div>
                                                )}
                                            </Grid>
                                        </form>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <h2>Objects in this series</h2>
                                    <div id="dragLandingAarea">
                                        {formValues?.object_list_linked?.length === 0 && <p>(None yet)</p>}
                                        <ul style={{ listStyleType: 'none' }}>
                                            {formValues?.object_list_linked
                                                ?.sort((a, b) => a.object_series_order - b.object_series_order)
                                                .map(f => {
                                                    return (
                                                        <li key={f.object_id} className={classes.draggableItem}>
                                                            <span
                                                                data-testid={`dlor-series-edit-draggable-title-${f?.object_public_uuid}`}
                                                            >
                                                                {f.object_title}{' '}
                                                                {f.object_status !== 'current' && (
                                                                    <b>{`(${toTitleCase(f.object_status)})`}</b>
                                                                )}
                                                            </span>

                                                            <div>
                                                                <Input
                                                                    id={`object_series_order-${f.object_public_uuid}`}
                                                                    data-testid={`object_series_order-${f.object_public_uuid}`}
                                                                    required
                                                                    value={f.object_series_order}
                                                                    onChange={handleChange(
                                                                        `linked_object_series_order-${f.object_public_uuid}`,
                                                                    )}
                                                                    style={{ marginRight: 10 }}
                                                                />
                                                                <a
                                                                    href={getDlorViewPageUrl(f?.object_public_uuid)}
                                                                    data-testid={`dlor-series-edit-view-${f.object_id}`}
                                                                    target="_blank"
                                                                >
                                                                    <VisibilityIcon style={{ color: 'black' }} />
                                                                </a>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </div>
                                </Grid>

                                <Grid item xs={12}>
                                    <details>
                                        <Typography
                                            component={'summary'}
                                            style={{
                                                fontSize: '1.3em',
                                                fontWeight: 'bold',
                                            }}
                                            data-testid="admin-dlor-series-summary-button"
                                        >
                                            Objects available to add to this series
                                        </Typography>
                                        <ul style={{ listStyleType: 'none' }}>
                                            {formValues?.object_list_unassigned?.map(f => {
                                                // console.log('dragLandingAarea 2 f=', f);
                                                return (
                                                    <li key={f.object_id} className={classes.draggableItem}>
                                                        <span
                                                            data-testid={`dlor-series-edit-draggable-title-${f?.object_public_uuid}`}
                                                        >
                                                            {f.object_title}{' '}
                                                            {f.object_status !== 'current' && (
                                                                <b>{`(${toTitleCase(f.object_status)})`}</b>
                                                            )}
                                                        </span>
                                                        <div>
                                                            <Input
                                                                id={`object_series_order-${f.object_public_uuid}`}
                                                                data-testid={`object_series_order-${f.object_public_uuid}`}
                                                                required
                                                                value={f.object_series_order}
                                                                onChange={handleChange(
                                                                    `unassigned_object_series_order-${f.object_public_uuid}`,
                                                                )}
                                                                style={{ marginRight: 10 }}
                                                            />
                                                            <a href={getDlorViewPageUrl(f?.object_public_uuid)}>
                                                                <VisibilityIcon style={{ color: 'black' }} />
                                                            </a>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </details>
                                </Grid>

                                <Grid item xs={3} align="left">
                                    <Button
                                        color="secondary"
                                        children="Cancel"
                                        data-testid="admin-dlor-series-form-button-cancel"
                                        onClick={() => navigateToPreviousPage()}
                                        variant="contained"
                                    />
                                </Grid>
                                <Grid item xs={9} align="right">
                                    <Button
                                        color="primary"
                                        data-testid="admin-dlor-series-form-save-button"
                                        variant="contained"
                                        children="Save"
                                        disabled={!isValidForm(formValues)}
                                        onClick={saveChanges}
                                        // className={classes.saveButton}
                                    />
                                </Grid>
                            </>
                        );
                    }
                    /* istanbul ignore next */
                    return <></>;
                })()}
            </Grid>
        </StandardPage>
    );
};

DLOSeriesEdit.propTypes = {
    actions: PropTypes.any,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    dlorUpdatedItem: PropTypes.object,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
};

export default DLOSeriesEdit;
