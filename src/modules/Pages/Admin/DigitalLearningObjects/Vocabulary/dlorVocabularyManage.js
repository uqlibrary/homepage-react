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

import { useAccountContext } from 'context';


export const DLOVocabularyManage = ({
    actions,
    dlorKeywords,
    dlorKeywordsLoading,
    dlorKeywordsError,
}) => {
    const { account } = useAccountContext();
    console.log("actions", actions)
    useEffect(() => {
        console.log("keywords", dlorKeywords, dlorKeywordsLoading, dlorKeywordsError);
        if (!dlorKeywordsError && !dlorKeywordsLoading && (!dlorKeywords || dlorKeywords?.length === 0)) {
            actions.loadDlorKeywords();
        }
    }, [dlorKeywords, dlorKeywordsLoading, dlorKeywordsError]); 

    const [editBoxOpened, setEditBoxOpened] = useState(false);  
    const [formMode, setFormMode] = useState('edit');  
    const [inputValue, setInputValue] = useState('');
    const [formType, setFormType] = useState('synonym'); // synonym or keyword
    const [parentName, setParentName] = useState(''); 
    const [formValue, setFormValue] = useState('');
    const [keywordId, setKeywordId] = useState('');
    // const [facetTypeName, setFacetTypeName] = useState('');
    // const [facetTypeId, setFacetTypeId] = useState(null);
    // const [facet, setFacet] = useState(null);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    // const [facetShowHelp, setFacetShowHelp] = useState(false);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    
    /* istanbul ignore next */
    // const handleFacetOrderChange = (event) => {
    //     setFacetOrder(event.target.value || 0);
    // };
    // const handleFacetHelpChange = (event) => {
    //     setFacetHelp(event.target.value || /* istanbul ignore next */ '');
    // };

    const updateItem = () => {
        console.log("Update item", formType, inputValue, formValue, keywordId);
        const payload = {
            keyword_type: formType,
            keyword_old_value: formValue,
            keyword_new_value: inputValue,
            keyword_id: keywordId,
        };

        console.log("THE PAYLOAD IS", payload);
        actions.updateDlorKeywords(payload)
        .then(() => {
            actions.loadDlorKeywords();
            handleClose();
        });
    };

    const addNewItem = () => {
        console.log("Add new item", inputValue, keywordId);
         const payload = {
            keyword_type: formType,
            keyword_old_value: formValue,
            keyword_new_value: inputValue,
            keyword_id: keywordId,
        };
        actions.updateDlorKeywords(payload)
        .then(() => {
            actions.loadDlorKeywords();
            handleClose();
        });
    }

    // const handleDeleteFacet = (id) => { 
    //     console.log("delete facet", id);
    //     actions.deleteFacet(id)
    //     .then(
    //         setConfirmDeleteModal(false)
    //     )
    // }

    const handleClose = () => {
        console.log("testing");
        setEditBoxOpened(false);
        setFormMode('edit');
        setInputValue('');
        setFormValue('');
        setFormType('');
        // setFacetOrder(0);
        // setFacetHelp('');
        // setFacetName('');
        // setFacetTypeId(null);
        // setFacet(null);
        // setFacetShowHelp(false);
    };

    const handleEditSynonym = (synonym, keyword_id) => {
        setInputValue(synonym);
        setFormValue(synonym);
        setKeywordId(keyword_id);
        setFormMode('edit');
        setFormType('synonym');
        setEditBoxOpened(true); 
        // setFacetOrder(facet?.facet_order || /* istanbul ignore next */ 0);
        // setFacetHelp(facet?.facet_help ||  /* istanbul ignore next */ '');
        // setFacetName(facet?.facet_name);
        // setFacet(facet);
        // setFacetShowHelp(!!facet?.facet_show_help);
    };

    

    return (
        <StandardPage title="Digital Learning Hub - Keyword Vocabulary Management">
            <DlorAdminBreadcrumbs
                breadCrumbList={[
                    {
                        title: 'Keyword management',
                    },
                ]}
            />
            <Grid container alignItems="center">
                {!!dlorKeywords && dlorKeywords.length > 0 && dlorKeywords.map(keyword => (
                    <React.Fragment key={keyword?.keyword_vocabulary_id}>
                        <Grid item xs={11}>
                            <Typography component='p' sx={{fontWeight: 'bold'}} data-testid={`keyword-${keyword?.keyword_vocabulary_id}-name`}>
                                {keyword?.keyword} - (keyword)
                            </Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton color='primary' onClick={() => {
                                setFormMode('add');
                                setFormType('synonym'); 
                                setParentName(keyword?.keyword);
                                setKeywordId(keyword?.keyword_vocabulary_id);
                                //setFacetTypeId(facetType.facet_type_id);
                                setEditBoxOpened(true)
                            }}
                            data-testid={`add-synonym-${keyword?.keyword_vocabulary_id}-button`}>   
                                <AddIcon />
                            </IconButton>
                        </Grid>
                        {!!keyword?.synonyms && keyword?.synonyms.length > 0 && keyword?.synonyms.map((synonym, index) => (
                            <React.Fragment key={`${keyword?.keyword_vocabulary_id}-${index}`}>
                                 <Grid
                                    container
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}
                                >
                                    <Grid
                                        item
                                        xs={10}
                                        sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
                                    >
                                        <Typography component='p'>
                                            {synonym} - (synonym)
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <IconButton 
                                            color='secondary' 
                                            onClick={() => {
                                                setParentName(keyword?.keyword);
                                                handleEditSynonym(synonym, keyword?.keyword_vocabulary_id);
                                            }}
                                            data-testid={`edit-synonym-${keyword?.keyword_vocabulary_id}-${index}`}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <IconButton color='secondary' onClick={() =>{ 
                                            // console.log('Delete facet'); 
                                            // setFacet(facet);
                                            // setConfirmDeleteModal(true);
                                            // //handleDeleteFacet(facet?.facet_id)
                                        }}
                                            data-testid={`delete-facet-${keyword?.keyword_vocabulary_id}-${index}`}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ))}




                    </React.Fragment>
                )
            )}
            </Grid>
            {/* The modal edit form */}
            <Modal
                open={editBoxOpened}
                onClose={handleClose}
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
                    <Typography variant="h6" id="modal-title">
                        {formMode === "edit" ? `Edit  ` : `Add `}
                        {formType}
                        {` in keyword ${parentName}`}
                    </Typography>
                    {formMode === "edit" &&
                        <Typography variant="p" id="modal-modal-existingName" sx={{ marginBottom: '20px', display: 'block' }}>
                            <>Original {formType}: <b>{formValue}</b></>
                        </Typography>
                    } 
                    
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="vocabulary_name">New {formType} name *</InputLabel>
                        <Input
                            id="vocabulary_name"
                            inputProps={{
                                'data-testid': 'vocabulary-name' 
                            }}
                            required
                            value={inputValue}
                            onChange={handleChange}
                            fullWidth
                        />
                    </FormControl>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <Button
                            color="secondary"
                            data-testid="admin-dlor-filter-cancel-button"
                            data-analyticsid="admin-dlor-filter-cancel-button"
                            variant="contained"
                            children="Cancel"
                            onClick={handleClose}
                        />
                        <Button
                            color="primary"
                            data-testid="admin-dlor-filter-confirm-button"
                            data-analyticsid="admin-dlor-filter-confirm-button"
                            variant="contained"
                            children="Confirm"
                            disabled = {!inputValue}
                            onClick={() => {
                                if (formMode === 'edit') {
                                    updateItem();
                                } else {
                                    addNewItem();
                                }
                            }}
                        />
                    </Box>
                </div>
            </Modal> 
            {/* The modal delete confirmation */}
            {/* <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="alert-edit-save-succeeded"
                onAction={() => handleDeleteFacet(facet.facet_id)}
                onClose={() => setEditBoxOpened(false)}
                onCancelAction={() => setConfirmDeleteModal(false)}
                isOpen={confirmDeleteModal}
                locale={{
                    confirmationTitle: 'Delete facet',
                    confirmationMessage: `Are you sure you want to delete the keyword?`,
                    confirmButtonLabel: 'Delete',
                    cancelButtonLabel: 'Cancel',
                }}
            /> */}
        </StandardPage>
    );
};

DLOVocabularyManage.propTypes = {
    actions: PropTypes.any,
    dlorKeywords: PropTypes.any,
    dlorKeywordsLoading: PropTypes.bool,
    dlorKeywordsError: PropTypes.any,    
    //dlorKeywords,
    //dlorKeywordsLoading,
    //dlorKeywordsError,
};

export default DLOVocabularyManage;
