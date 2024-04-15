import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { getUserPostfix } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { fullPath } from 'config/routes';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { useConfirmationState } from 'hooks';

const useStyles = makeStyles(theme => ({
    sidebyside: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    hoverEffect: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
    },
}));

export const DLOAdminHomepage = ({
    actions,
    dlorList,
    dlorListLoading,
    dlorListError,
    // dlorItemDeleting,
    dlorItemDeleteError,
    // dlorItem,
    account,
}) => {
    console.log('DLOAdminHomepage dlorItemDeleteError=', dlorItemDeleteError);
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
    console.log('statusTypes=', statusTypes);
    // const checkBoxArrayRef = React.useRef([
    //     statusTypes.filter(t => {
    //         t.type, t.isChecked;
    //     }),
    // ]);
    const [checkedStatusType, setCheckedStatusType] = useState(statusTypes.map(status => status.isChecked));

    const [objectToDelete, setObjectToDelete] = useState(null);

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
        const userString = getUserPostfix();
        window.location.href = `${fullPath}/admin/dlor/add${userString}`;
    };

    const navigateToEditPage = uuid => {
        const userString = getUserPostfix();
        window.location.href = `${fullPath}/admin/dlor/edit/${uuid}${userString}`;
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

    const mapOverRequestedTypes = dlorlistToFilter => {
        const requestedStatuses = statusTypes
            .filter((type, index) => checkedStatusType[index] === true)
            .map(t => t.type);
        return dlorlistToFilter.filter(d => requestedStatuses.includes(d.object_status));
    };

    const numberOfListItemsOfType = (list, statusType) => list.filter(d => d.object_status === statusType)?.length;

    return (
        <StandardPage title="Digital learning hub Management">
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
                        children="Add object"
                        color="primary"
                        data-testid="admin-dlor-visit-add-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} data-testid="dlor-homepage-list">
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
                        return (
                            <>
                                <Grid item xs={12}>
                                    {statusTypes?.length > 0 &&
                                        statusTypes.map((objectStatus, index) => {
                                            const checkBoxid = `checkbox-status-${objectStatus.type}`;
                                            return (
                                                <FormControlLabel
                                                    key={`${objectStatus.type}`}
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
                                {dlorList?.length > 0 &&
                                    mapOverRequestedTypes(dlorList).map((o, index) => {
                                        return (
                                            <>
                                                <Grid
                                                    item
                                                    xs={10}
                                                    className={`${classes.sidebyside} + ${classes.hoverEffect}`}
                                                    key={o?.object_id}
                                                    data-testid={`dlor-homepage-panel-${o?.object_public_uuid}`}
                                                >
                                                    <div>
                                                        <Typography component={'h2'} variant={'h6'}>
                                                            {o?.object_title}
                                                        </Typography>
                                                        <Typography variant={'p'}>
                                                            <p>{o?.object_summary}</p>
                                                        </Typography>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={1} className={classes.hoverEffect}>
                                                    <IconButton
                                                        onClick={() => navigateToEditPage(o?.object_public_uuid)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item xs={1} className={classes.hoverEffect}>
                                                    <IconButton
                                                        data-testid={`dlor-homepage-delete-${o?.object_public_uuid}`}
                                                        style={{ height: 40 }}
                                                        onClick={() => confirmDelete(o?.object_public_uuid)}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </IconButton>
                                                </Grid>
                                            </>
                                        );
                                    })}
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
    account: PropTypes.object,
};

export default DLOAdminHomepage;
