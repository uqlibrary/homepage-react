import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { ObjectListItem } from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/ObjectListItem';

import { useConfirmationState } from 'hooks';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs';
import { pluralise } from 'helpers/general';
import { breadcrumbs } from 'config/routes';
import { Button } from '@mui/material';

const StyledObjectDetails = styled('details')(() => ({
    marginLeft: '20px',
}));



export const DLOFilterManage = ({
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
    dlorFilterListLoading,
    dlorFilterListError,
    dlorFilterList,
}) => {

    useEffect(() => {
        console.log(dlorFilterList, dlorFilterListLoading, dlorFilterListError);
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
    }, [dlorFilterList, dlorFilterListLoading, dlorFilterListError]); 

    // const DELETION_STEP_NULL = null;
    // const DELETION_STEP_ONE_CONFIRM = 1;
    // const DELETION_STEP_TWO_HAPPENING = 2;

    // const [seriesToDelete, setObjectToDelete] = React.useState(null);
    // const [deleteStep, setDeleteStep] = React.useState(DELETION_STEP_NULL);
    // const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
      
    // React.useEffect(() => {
    //     const siteHeader = document.querySelector('uq-site-header');
    //     !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.dloradmin.title);
    //     !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.dloradmin.pathname);
    // }, []);

    // useEffect(() => {
    //     if (!dlorSeriesListError && !dlorSeriesListLoading && !dlorSeriesList) {
    //         actions.loadDlorSeriesList();
    //     }
    // }, [actions, dlorSeriesList, dlorSeriesListError, dlorSeriesListLoading]);

    // useEffect(() => {
    //     if (!dlorListError && !dlorListLoading && !dlorList) {
    //         actions.loadAllDLORs();
    //     }
    // }, [actions, dlorList, dlorListError, dlorListLoading]);

    // useEffect(() => {
    //     if (!!dlorSeriesDeleteError && deleteStep === DELETION_STEP_TWO_HAPPENING) {
    //         // delete failed
    //         showDeleteConfirmation();
    //     } else if (!dlorSeriesDeleting && !!dlorSeriesDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING) {
    //         // success
    //         showDeleteConfirmation();
    //     }
    // }, [dlorSeriesDeleting, dlorSeriesDeleted, dlorSeriesDeleteError, deleteStep, showDeleteConfirmation]);

    // const deleteADlorSeries = seriesId => {
    //     return actions.deleteDlorSeries(seriesId);
    // };
    // const requestUserToConfirmDelete = seriesId => {
    //     setObjectToDelete(seriesId);
    //     setDeleteStep(DELETION_STEP_ONE_CONFIRM);
    //     showDeleteConfirmation();
    // };
    // const deleteSelectedObject = () => {
    //     setDeleteStep(DELETION_STEP_TWO_HAPPENING);
    //     !!seriesToDelete &&
    //         deleteADlorSeries(seriesToDelete)
    //             .then(() => {
    //                 setObjectToDelete('');
    //                 actions.loadDlorSeriesList();
    //             })
    //             .catch(() => {
    //                 setObjectToDelete('');
    //                 showDeleteConfirmation();
    //             });
    // };

    // const navigateToSeriesEditPage = seriesId => {
    //     window.location.href = dlorAdminLink(`/series/edit/${seriesId}`);
    // };
    // const deletionConfirmationBoxLocale = {
    //     confirmItMessage: {
    //         confirmationTitle: 'Do you want to delete this series?',
    //         confirmationMessage: '',
    //         cancelButtonLabel: 'No',
    //         confirmButtonLabel: 'Yes',
    //     },
    //     successMessage: {
    //         confirmationTitle: 'The series has been deleted.',
    //         confirmationMessage: '',
    //         confirmButtonLabel: 'Close',
    //     },
    //     errorMessage: {
    //         confirmationTitle: dlorSeriesDeleteError?.message || dlorSeriesDeleteError,
    //         confirmationMessage: '',
    //         confirmButtonLabel: 'Close',
    //     },
    // };

    // function getLocale() {
    //     if (!!dlorSeriesDeleteError) {
    //         return deletionConfirmationBoxLocale.errorMessage;
    //     }
    //     if (!!dlorSeriesDeleted && deleteStep === DELETION_STEP_TWO_HAPPENING) {
    //         return deletionConfirmationBoxLocale.successMessage;
    //     }
    //     return deletionConfirmationBoxLocale.confirmItMessage;
    // }

    // function localHideDeleteConfirmation() {
    //     setDeleteStep(null);
    //     return hideDeleteConfirmation();
    // }

    // const noSeriesName = 'Not in a series';
    // const unSeriedObjectDone = dlorSeriesList?.find(s => s.series_name === noSeriesName);
    // !unSeriedObjectDone &&
    //     !!dlorSeriesList &&
    //     dlorSeriesList.length > 0 &&
    //     dlorSeriesList.push({
    //         series_id: null,
    //         series_name: noSeriesName,
    //     });

    return (
        <StandardPage title="Digital Learning Hub - Facet Management">
            <DlorAdminBreadcrumbs
                breadCrumbList={[
                    {
                        title: 'Facet management',
                    },
                ]}
            />
            <Grid container alignItems="center">
                {!!dlorFilterList && dlorFilterList.length > 0 && dlorFilterList.map(facetType => (
                    <React.Fragment key={facetType.facet_type_name}>
                        <Grid item xs={11}>
                            <Typography component='h3' sx={{fontWeight: 'bold'}}>
                                {facetType?.facet_type_name ?? 'No facet type name'}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton color='primary' onClick={() => console.log('Add facet')}>
                                <AddIcon />
                            </IconButton>
                        </Grid>
                       
                        {!!facetType.facet_list && facetType.facet_list.length > 0 && facetType.facet_list.map((facet, index) => (
                            <React.Fragment key={facet.facet_name}>
                                <Grid
                                    item
                                    xs={10}
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}
                                >
                                    <Typography component='p'>
                                        {facet?.facet_name ?? 'No facet name'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <IconButton color='primary' onClick={() => console.log('Edit facet')}>
                                        <EditIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <IconButton color='secondary' onClick={() => console.log('Delete facet')}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </Grid>
        </StandardPage>
    );
};

DLOFilterManage.propTypes = {
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

export default DLOFilterManage;
