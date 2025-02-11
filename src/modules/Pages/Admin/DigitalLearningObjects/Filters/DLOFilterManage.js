import React, { useEffect, useState } from 'react';
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
import { Button, FormControl, Input, InputLabel, Modal } from '@mui/material';
import { set } from 'js-cookie';
import { setIn } from 'immutable';

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

    console.log("actions", actions)
    useEffect(() => {
        console.log(dlorFilterList, dlorFilterListLoading, dlorFilterListError);
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
    }, [dlorFilterList, dlorFilterListLoading, dlorFilterListError]); 

    const [editBoxOpened, setEditBoxOpened] = useState(false);    
    const [inputValue, setInputValue] = useState('');
    const [facetOrder, setFacetOrder] = useState(0);  
    const [facetHelp, setFacetHelp] = useState('');
    const [facetId, setFacetId] = useState(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleFacetOrderChange = (event) => {
        setFacetOrder(event.target.value || 0);
    };
    const handleFacetHelpChange = (event) => {
        setFacetHelp(event.target.value || '');
    };

    const updateFacet = (id) => {
        const payload = {
            facet_name: inputValue,
            facet_order: facetOrder,
            facet_help: facetHelp,
        };
        actions.updateFacet(id, payload)
        .then(
            setEditBoxOpened(false)
        )

    }

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
                                    container
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}
                                >
                                    <Grid
                                        item
                                        xs={8}
                                        sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
                                    >
                                        <Typography component='p'>
                                            {facet?.facet_name ?? 'No facet name'}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
                                    >
                                        <Typography component='p'>
                                            {facet?.facet_use_count || 0} {facet?.facet_use_count === 1 ? 'object' : 'objects'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <IconButton color='secondary' onClick={() => {
                                            setEditBoxOpened(true); 
                                            setInputValue(facet.facet_name);
                                            setFacetOrder(facet.facet_order || 0);
                                            setFacetHelp(facet.facet_help || '');
                                            setFacetId(facet.facet_id);
                                            }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <IconButton color='secondary' onClick={() => console.log('Delete facet')}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </Grid>
            {/* The modal form */}
            <Modal
                open={editBoxOpened}
                onClose={() => setEditBoxOpened(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: 24,
                        width: '400px',
                        margin: 'auto',
                        marginTop: '20vh',
                        height: 'auto',
                    }}
                >
                    <Typography variant="h4" id="modal-modal-title">
                        Edit facet name
                    </Typography>
                    <Typography variant="p" id="modal-modal-existingName" sx={{ marginBottom: '20px', display: 'block' }}>
                        Original Name: <b>{inputValue}</b>
                    </Typography>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="facet_name">New facet name *</InputLabel>
                        <Input
                            id="facet_name"
                            data-testid="facet-name"
                            required
                            value={inputValue}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl variant="standard" fullWidth sx={{ marginTop: '16px' }}>
                        <InputLabel htmlFor="facet_order">Facet Order</InputLabel>
                        <Input
                            id="facet_order"
                            type="number"
                            value={facetOrder}
                            onChange={handleFacetOrderChange}
                            fullWidth
                            inputProps={{ min: 0 }}
                        />
                    </FormControl>
                    <FormControl variant="standard" fullWidth sx={{ marginTop: '16px' }}>
                        <InputLabel htmlFor="facet_order">Facet Help</InputLabel>
                        <Input
                            id="facet_help"
                            value={facetHelp}
                            onChange={handleFacetHelpChange}
                            fullWidth
                            inputProps={{ min: 0 }}
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <Button
                            color="secondary"
                            data-testid="admin-dlor-filter-cancel-button"
                            data-analyticsid="admin-dlor-filter-cancel-button"
                            variant="contained"
                            children="Cancel"
                            onClick={() => { setEditBoxOpened(false); console.log('Cancel') }}
                        />
                        <Button
                            color="primary"
                            data-testid="admin-dlor-filter-confirm-button"
                            data-analyticsid="admin-dlor-filter-confirm-button"
                            variant="contained"
                            children="Confirm"
                            disabled = {!inputValue}
                            onClick={() => { console.log('Confirm'); updateFacet(facetId); }}
                        />
                    </Box>
                </div>
            </Modal>
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
