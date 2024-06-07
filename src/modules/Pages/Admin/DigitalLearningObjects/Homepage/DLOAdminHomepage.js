import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import { Pagination } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneIcon from '@mui/icons-material/Done';
import SearchIcon from '@mui/icons-material/Search';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import VisitHomepage from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/VisitHomepage';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';

import { useConfirmationState } from 'hooks';

const useStyles = makeStyles(theme => ({
    sidebyside: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.up('lg')]: {
            marginLeft: -50,
            marginRight: 50,
        },
    },
    listItem: {
        paddingTop: 10,
        paddingLeft: 6,
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
    },
    dlorPagination: {
        width: '100%',
        '& ul': {
            justifyContent: 'center',
        },
    },
    keywordSearchPanel: {
        width: 'calc(100%)',
        marginLeft: 20,
        marginRight: 30,
    },
    featuredObject: {
        textTransform: 'uppercase',
        backgroundColor: theme.palette.success.main,
        color: theme.palette.white.main,
        fontSize: '14px',
        padding: 6,
    },
}));

export const DLOAdminHomepage = ({ actions, dlorList, dlorListLoading, dlorListError, dlorItemDeleteError }) => {
    const classes = useStyles();

    const statusTypes = [
        {
            type: 'new',
            label: 'New/ Draft',
            isChecked: false,
        },
        {
            type: 'current',
            label: 'Published',
            isChecked: true,
        },
        {
            type: 'rejected',
            label: 'Rejected',
            isChecked: false,
        },
        {
            type: 'deprecated',
            label: 'Deprecated (unpublished)',
            isChecked: false,
        },
        {
            type: 'deleted',
            label: 'Deleted',
            isChecked: false,
        },
    ];
    const [checkedStatusType, setCheckedStatusType] = useState(statusTypes.map(status => status.isChecked));

    const [objectToDelete, setObjectToDelete] = useState(null);

    const [paginationPage, setPaginationPage] = useState(1);

    const [keywordSearch, setKeywordSearch] = useState('');
    const keyWordSearchRef = useRef('');

    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
    const [
        isDeleteFailureConfirmationOpen,
        showDeleteFailureConfirmation,
        hideDeleteFailureConfirmation,
    ] = useConfirmationState();
    const [
        isDeleteFailureConfirmationConfirmationOpen,
        showDeleteFailureConfirmationConfirmation,
        hideDeleteFailureConfirmationConfirmation,
    ] = useConfirmationState();

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
    }, [dlorList]);

    const navigateToAddPage = () => {
        window.location.href = dlorAdminLink('/add');
    };

    const navigateToTeamsListPage = () => {
        window.location.href = dlorAdminLink('/team/manage');
    };

    const navigateToSeriesListPage = () => {
        window.location.href = dlorAdminLink('/series/manage');
    };

    const navigateToEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };

    const confirmDelete = objectUuid => {
        setObjectToDelete(objectUuid);
        showDeleteConfirmation();
    };

    const deleteSelectedObject = () => {
        console.log('deleteSelectedObject start');
        !!objectToDelete &&
            deleteADlor(objectToDelete)
                .then(() => {
                    console.log('deleteSelectedObject delete success', objectToDelete);
                    setObjectToDelete('');
                    // setAlertNotice(''); // needed?
                    actions.loadAllDLORs();
                })
                .catch(() => {
                    console.log('deleteSelectedObject delete fail', objectToDelete);
                    setObjectToDelete('');
                    showDeleteFailureConfirmation();
                });
    };

    const deleteADlor = dlorId => {
        return actions.deleteDlor(dlorId);
    };

    const handleStatusTypeChange = checkedType => e => {
        const checkedTypeId = statusTypes.findIndex(object => object.type === checkedType);

        const newStatusTypeSet = checkedStatusType.map((itemCurrentCheckedness, index) =>
            index === checkedTypeId ? !itemCurrentCheckedness : itemCurrentCheckedness,
        );
        setCheckedStatusType(newStatusTypeSet);
    };

    const numberItemsPerPage = 10; // value also set in cypress dlorHomepage.spec

    function filterOnKeyword(filteredDlorList) {
        if (!!keywordSearch && !!keywordIsSearchable(keywordSearch)) {
            filteredDlorList = filteredDlorList.filter(t => keywordFoundIn(t, keywordSearch));
        }
        return filteredDlorList;
    }

    const filterDLorList = (dlorlistToFilter, pageloadShown) => {
        const requestedStatuses = statusTypes
            .filter((type, index) => checkedStatusType[index] === true)
            .map(t => t.type);
        let filteredDlorList = dlorlistToFilter.filter(d => requestedStatuses.includes(d.object_status));
        filteredDlorList = filterOnKeyword(filteredDlorList);

        filteredDlorList.sort((a, b) => b.object_is_featured - a.object_is_featured);
        return filteredDlorList;
    };
    const getPaginatedList = (filteredDlorList, pageloadShown) => {
        const paginatedFilteredDlorList = filteredDlorList.filter((_, index) => {
            const startIndex = (pageloadShown - 1) * numberItemsPerPage;
            const endIndex = startIndex + numberItemsPerPage;
            return index >= startIndex && index < endIndex;
        });
        return paginatedFilteredDlorList;
    };

    const numberOfListItemsOfType = (list, statusType) => list.filter(d => d.object_status === statusType)?.length;

    const handlePaginationChange = (e, value) => {
        setPaginationPage(value);
    };

    function keywordIsSearchable(keyword) {
        // don't filter on something terribly short
        return keyword?.length > 1;
    }

    const keywordFoundIn = (object, enteredKeyword) => {
        const enteredKeywordLower = enteredKeyword.toLowerCase();
        if (
            object.object_title.toLowerCase().includes(enteredKeywordLower) ||
            object.object_description.toLowerCase().includes(enteredKeywordLower) ||
            object.object_summary.toLowerCase().includes(enteredKeywordLower)
        ) {
            return true;
        }
        if (
            !!object?.object_keywords?.some(k => {
                return k.toLowerCase().startsWith(enteredKeywordLower);
            })
        ) {
            return true;
        }
        return false;
    };

    const handleKeywordSearch = e => {
        const keyword = e?.target?.value;
        keyWordSearchRef.current.value = keyword;

        if (keywordIsSearchable(keyword)) {
            setKeywordSearch(keyword);
        } else if (keyword.length === 0) {
            clearKeywordField();
        }
    };

    const clearKeywordField = () => {
        setKeywordSearch('');
        keyWordSearchRef.current.value = '';
        setPaginationPage(1);
    };

    return (
        <StandardPage title="Digital Learning Hub Management">
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-item-delete-confirm"
                onAction={() => deleteSelectedObject()}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={{
                    confirmationTitle: 'Do you want to delete this object?',
                    confirmationMessage: '',
                    cancelButtonLabel: 'No',
                    confirmButtonLabel: 'Yes',
                }}
            />

            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-item-delete-failure-notice"
                hideCancelButton
                onAction={hideDeleteFailureConfirmation}
                onClose={hideDeleteFailureConfirmation}
                isOpen={isDeleteFailureConfirmationOpen}
                locale={{
                    confirmationTitle: 'An error occurred deleting the Object',
                    confirmationMessage: dlorItemDeleteError?.message,
                    confirmButtonLabel: 'OK',
                }}
            />
            <Grid container spacing={2} style={{ marginBottom: 25 }}>
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                    <Button
                        children="Manage series"
                        color="primary"
                        data-testid="admin-dlor-visit-manage-series-button"
                        onClick={() => navigateToSeriesListPage()}
                        variant="contained"
                    />{' '}
                    <Button
                        children="Manage teams"
                        color="primary"
                        data-testid="admin-dlor-visit-manage-teams-button"
                        onClick={() => navigateToTeamsListPage()}
                        variant="contained"
                    />{' '}
                    <Button
                        children="Add object"
                        color="primary"
                        data-testid="admin-dlor-visit-add-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                        style={{ marginRight: 6 }}
                    />
                    <VisitHomepage />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {(() => {
                    if (!!dlorListLoading) {
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
                                <Typography variant="body1" data-testid="dlor-homepage-error">
                                    {dlorListError}
                                </Typography>
                            </Grid>
                        );
                    } else if (!dlorList || dlorList.length === 0) {
                        return (
                            <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                                <Typography variant="body1" data-testid="dlor-homepage-noresult">
                                    We did not find any entries in the system - please try again later.
                                </Typography>
                            </Grid>
                        );
                    } else {
                        const filteredListLocal = filterDLorList(dlorList);
                        const paginationCount = Math.ceil(
                            filterOnKeyword(filteredListLocal)?.length / numberItemsPerPage,
                        );
                        const paginatedList = getPaginatedList(filteredListLocal, paginationPage);
                        return (
                            <>
                                <Grid item xs={12}>
                                    {statusTypes?.length > 0 &&
                                        statusTypes.map((objectStatus, index) => {
                                            const checkBoxid = `checkbox-status-${objectStatus.type}`;
                                            return (
                                                <FormControlLabel
                                                    key={`statustype-checkox-${objectStatus.type}`}
                                                    // className={classes.filterSidebarCheckboxControl}
                                                    control={
                                                        <Checkbox
                                                            onChange={handleStatusTypeChange(objectStatus.type)}
                                                            value={objectStatus.type}
                                                            data-testid={`${checkBoxid}`}
                                                            checked={checkedStatusType[index]}
                                                        />
                                                    }
                                                    label={`${objectStatus.label} (${numberOfListItemsOfType(
                                                        dlorList,
                                                        objectStatus.type,
                                                    )})`}
                                                />
                                            );
                                        })}
                                </Grid>
                                <TextField
                                    className={classes.keywordSearchPanel}
                                    data-testid="dlor-homepage-keyword"
                                    label="Search by keyword"
                                    onChange={handleKeywordSearch}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={clearKeywordField}>
                                                    {keyWordSearchRef.current?.value === '' ? (
                                                        <SearchIcon />
                                                    ) : (
                                                        <CloseIcon data-testid="keyword-clear" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    inputRef={keyWordSearchRef}
                                />{' '}
                                <Grid item style={{ width: '100%' }} data-testid="dlor-homepage-list">
                                    {paginatedList?.length > 0 &&
                                        paginatedList.map(o => {
                                            return (
                                                <Grid
                                                    container
                                                    className={classes.listItem}
                                                    key={`list-dlor-${o?.object_id}`}
                                                >
                                                    <Grid item xs={1} style={{ marginTop: 4 }}>
                                                        {o?.object_is_featured === 1 && (
                                                            <DoneIcon
                                                                data-testid={`dlor-homepage-featured-${o?.object_public_uuid}`}
                                                                title="This object is Featured"
                                                                style={{ color: 'green' }}
                                                            />
                                                        )}
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={7}
                                                        className={classes.sidebyside}
                                                        data-testid={`dlor-homepage-panel-${o?.object_public_uuid}`}
                                                    >
                                                        <div>
                                                            <Typography component={'h2'} variant={'h6'}>
                                                                {o?.object_title}
                                                            </Typography>
                                                            <Typography component={'p'}>
                                                                <p>{o?.object_summary}</p>
                                                            </Typography>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Typography component={'p'}>
                                                            {o?.owner?.publishing_user_username}
                                                        </Typography>
                                                        <Typography
                                                            component={'p'}
                                                            style={{ textIndent: -12, paddingLeft: 12 }}
                                                        >
                                                            {o?.owner?.team_name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton
                                                            onClick={() => navigateToEditPage(o?.object_public_uuid)}
                                                            disabled={o?.object_status === 'deleted'}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton
                                                            data-testid={`dlor-homepage-delete-${o?.object_public_uuid}`}
                                                            style={{ height: 40 }}
                                                            onClick={() => confirmDelete(o?.object_public_uuid)}
                                                            disabled={o?.object_status === 'deleted'}
                                                        >
                                                            <DeleteForeverIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })}
                                    {!!paginationCount && paginationCount > 0 && (
                                        <Pagination
                                            count={paginationCount}
                                            showFirstButton
                                            showLastButton
                                            onChange={handlePaginationChange}
                                            page={paginationPage}
                                            className={classes.dlorPagination}
                                        />
                                    )}
                                </Grid>
                            </>
                        );
                    }
                })()}
            </Grid>
        </StandardPage>
    );
};

DLOAdminHomepage.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
};

export default DLOAdminHomepage;
