import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import VisitHomepage from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/VisitHomepage';

import { useConfirmationState } from 'hooks';

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
    details: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
}));

export const DLOSeriesList = ({
    actions,
    dlorSeriesList,
    dlorSeriesListLoading,
    dlorSeriesListError,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorSeriesDeleting,
    dlorSeriesDeleted,
    dlorSeriesDeleteError,
}) => {
    const classes = useStyles();
    console.log('DLOSeriesList l=', dlorSeriesListLoading, '; e=', dlorSeriesListError, '; d=', dlorSeriesList);
    console.log('dlorList l=', dlorListLoading, '; e=', dlorListError, '; d=', dlorList);
    console.log('deleting l=', dlorSeriesDeleting, '; e=', dlorSeriesDeleted, '; d=', dlorSeriesDeleteError);

    const DELETION_STEP_NULL = null;
    const DELETION_STEP_ONE_CONFIRM = 1;
    const DELETION_STEP_TWO_HAPPENING = 2;

    const [seriesToDelete, setObjectToDelete] = React.useState(null);
    const [deleteStep, setDeleteStep] = React.useState(DELETION_STEP_NULL);
    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();

    console.log(
        '###### deleteStep=',
        deleteStep,
        '; l=',
        dlorSeriesDeleting,
        '; dlorSeriesDeleted=',
        dlorSeriesDeleted,
    );

    useEffect(() => {
        if (!dlorSeriesListError && !dlorSeriesListLoading && !dlorSeriesList) {
            actions.loadDlorSeriesList();
        }
    }, [actions, dlorSeriesList, dlorSeriesListError, dlorSeriesListLoading]);

    useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
    }, [dlorList]);

    useEffect(() => {
        if (!!dlorSeriesDeleteError && deleteStep === DELETION_STEP_TWO_HAPPENING) {
            // delete failed
            showDeleteConfirmation();
        } else if (!dlorSeriesDeleting && !!dlorSeriesDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING) {
            // success
            showDeleteConfirmation();
        }
    }, [dlorSeriesDeleting, dlorSeriesDeleted, dlorSeriesDeleteError]);

    const navigateToAddPage = () => {
        window.location.href = dlorAdminLink('/series/add');
    };

    const deleteADlorSeries = seriesId => {
        return actions.deleteDlorSeries(seriesId);
    };
    const requestUserToConfirmDelete = seriesId => {
        setObjectToDelete(seriesId);
        setDeleteStep(DELETION_STEP_ONE_CONFIRM);
        showDeleteConfirmation();
    };
    const deleteSelectedObject = () => {
        setDeleteStep(DELETION_STEP_TWO_HAPPENING);
        !!seriesToDelete &&
            deleteADlorSeries(seriesToDelete)
                .then(() => {
                    setObjectToDelete('');
                    actions.loadDlorSeriesList();
                })
                .catch(() => {
                    console.log('in catch');
                    setObjectToDelete('');
                    showDeleteConfirmation();
                });
    };

    const navigateToSeriesEditPage = seriesId => {
        window.location.href = dlorAdminLink(`/series/edit/${seriesId}`);
    };
    const navigateToDlorEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };
    const deletionConfirmationBoxLocale = {
        confirmItMessage: {
            confirmationTitle: 'Do you want to delete this series?',
            confirmationMessage: '',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
        successMessage: {
            confirmationTitle: 'The series has been deleted.',
            confirmationMessage: '',
            confirmButtonLabel: 'Close',
        },
        errorMessage: {
            confirmationTitle: dlorSeriesDeleteError?.message || dlorSeriesDeleteError,
            confirmationMessage: '',
            confirmButtonLabel: 'Close',
        },
    };

    function getLocale() {
        if (!!dlorSeriesDeleteError) {
            return deletionConfirmationBoxLocale.errorMessage;
        }
        if (!!dlorSeriesDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING) {
            return deletionConfirmationBoxLocale.successMessage;
        }
        return deletionConfirmationBoxLocale.confirmItMessage;
    }

    function localHideDeleteConfirmation() {
        setDeleteStep(null);
        return hideDeleteConfirmation();
    }

    const noSeriesName = 'Not in a series';
    const unSeriedObjectDone = dlorSeriesList?.find(s => s.object_series_name === noSeriesName);
    const unSeriedObjects = dlorList?.filter(o => !!o.object_series_id);
    const unSeriedObjectCount = unSeriedObjects?.length;
    !unSeriedObjectDone &&
        !!dlorSeriesList &&
        dlorSeriesList.length > 0 &&
        dlorSeriesList.push({
            object_series_id: null,
            object_series_name: noSeriesName,
        });

    return (
        <StandardPage title="Digital Learning Hub - Series management">
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-series-delete-confirm"
                onAction={() => {
                    !!dlorSeriesDeleteError || (!!dlorSeriesDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING)
                        ? localHideDeleteConfirmation()
                        : deleteSelectedObject();
                }}
                onClose={hideDeleteConfirmation}
                hideCancelButton={
                    !!dlorSeriesDeleteError || (!!dlorSeriesDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING)
                }
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={getLocale()}
            />
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={6}>
                    <div className={classes.titleBlock}>
                        <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                            <a href={dlorAdminLink()}>Digital Learning Hub admin</a>
                            <ArrowForwardIcon style={{ height: 15 }} />
                            Series management
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                    <Button
                        children="Add series (later)"
                        color="primary"
                        data-testid="admin-dlor-visit-add-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                        disabled // THIS IS CURRENTLY DISABLED
                    />
                </Grid>
                <Grid item xs={1}>
                    <VisitHomepage />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                {(() => {
                    if (!!dlorSeriesListLoading || !!dlorSeriesDeleting) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            </Grid>
                        );
                    } else if (!!dlorSeriesListError) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-serieslist-error">
                                    {dlorSeriesListError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!dlorSeriesList || dlorSeriesList.length === 0) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-serieslist-noresult">
                                    We did not find any entries in the system - please try again later.
                                </Typography>
                            </Grid>
                        );
                    } else {
                        return (
                            <>
                                <Grid item style={{ width: '100%' }} data-testid="dlor-serieslist-list">
                                    {dlorSeriesList?.length > 0 &&
                                        dlorSeriesList.map(series => {
                                            const summarylabelCount = (
                                                <>
                                                    {series?.object_series_id === null
                                                        ? 'other Objects'
                                                        : `${series?.objects_count} Object${
                                                              series?.objects_count > 1 ? 's' : ''
                                                          }`}
                                                </>
                                            );
                                            return (
                                                <div key={`list-series-${series?.object_series_id}`}>
                                                    <Grid container alignItems="center">
                                                        <Grid
                                                            item
                                                            xs={10}
                                                            data-testid={`dlor-serieslist-panel-${series?.object_series_id}`}
                                                        >
                                                            <Typography variant="body1">
                                                                {series?.object_series_name}
                                                            </Typography>{' '}
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            {!series?.objects_count &&
                                                                series?.object_series_id !== null && (
                                                                    <IconButton
                                                                        data-testid={`dlor-serieslist-delete-${series?.object_series_id}`}
                                                                        style={{ height: 40 }}
                                                                        onClick={() =>
                                                                            requestUserToConfirmDelete(
                                                                                series?.object_series_id,
                                                                            )
                                                                        }
                                                                        // disabled={series?.object_status === 'deleted'}
                                                                    >
                                                                        <DeleteForeverIcon />
                                                                    </IconButton>
                                                                )}
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            {series?.object_series_id !== null && (
                                                                <IconButton
                                                                    data-testid={`dlor-serieslist-edit-${series?.object_series_id}`}
                                                                    onClick={() =>
                                                                        navigateToSeriesEditPage(
                                                                            series?.object_series_id,
                                                                        )
                                                                    }
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                    {(series?.objects_count > 0 ||
                                                        series.object_series_id === null) && (
                                                        <Grid container>
                                                            <Grid item xs={12} style={{ marginBottom: 24 }}>
                                                                <details
                                                                    style={{ marginLeft: 20 }}
                                                                    data-testid={`dlor-series-object-list-${series?.object_series_id}`}
                                                                >
                                                                    <summary>{summarylabelCount}</summary>

                                                                    {!!dlorList &&
                                                                        dlorList
                                                                            .filter(
                                                                                o =>
                                                                                    o?.object_series_id ===
                                                                                    series?.object_series_id,
                                                                            )
                                                                            .map(o => (
                                                                                <Grid
                                                                                    container
                                                                                    key={`series-object-${o.object_id}`}
                                                                                >
                                                                                    <Grid item xs={1} />
                                                                                    <Grid
                                                                                        item
                                                                                        xs={9}
                                                                                        // data-testid={`dlor-serieslist-panel-${o?.object_public_uuid}`}
                                                                                    >
                                                                                        <div>
                                                                                            <Typography
                                                                                                component={'h2'}
                                                                                                variant={'h6'}
                                                                                            >
                                                                                                {o?.object_title}
                                                                                                {o?.object_status !==
                                                                                                    'current' && (
                                                                                                    <strong>
                                                                                                        {' '}
                                                                                                        {`(${o?.object_status})`}
                                                                                                    </strong>
                                                                                                )}
                                                                                            </Typography>
                                                                                            <Typography variant={'p'}>
                                                                                                <p>
                                                                                                    {o?.object_summary}
                                                                                                </p>
                                                                                            </Typography>
                                                                                        </div>
                                                                                    </Grid>
                                                                                    <Grid item xs={1}>
                                                                                        <IconButton
                                                                                            data-testid={`dlor-series-object-list-item-${o?.object_id}`}
                                                                                            onClick={() =>
                                                                                                navigateToDlorEditPage(
                                                                                                    o?.object_public_uuid,
                                                                                                )
                                                                                            }
                                                                                            disabled={
                                                                                                o?.object_status ===
                                                                                                'deleted'
                                                                                            }
                                                                                        >
                                                                                            <EditIcon />
                                                                                        </IconButton>
                                                                                    </Grid>
                                                                                    <Grid item xs={1} />
                                                                                </Grid>
                                                                            ))}
                                                                </details>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </Grid>
                            </>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

DLOSeriesList.propTypes = {
    actions: PropTypes.any,
    dlorSeriesList: PropTypes.array,
    dlorSeriesListLoading: PropTypes.bool,
    dlorSeriesListError: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorSeriesDeleted: PropTypes.array,
    dlorSeriesDeleting: PropTypes.bool,
    dlorSeriesDeleteError: PropTypes.any,
};

export default DLOSeriesList;
