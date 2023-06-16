import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Alert from '@material-ui/lab/Alert';
import locale from '../../../testTag.locale';

export const useStyles = makeStyles(theme => ({
    alternateActionButtonClass: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.warning.main,
        '&:hover': {
            backgroundColor: theme.palette.warning.dark,
        },
    },
    alertPanel: {
        marginTop: 10,
    },
    actionButtons: {
        marginTop: 10,
    },
    dialogPaper: {
        minHeight: '30vh',
        maxHeight: '50vh',
    },
}));

export const ActionDialogue = ({
    data,
    row,
    isOpen,
    noMinContentWidth,
    actionDialogueBoxId,
    onCancel,
    onProceed,
    isBusy,
}) => {
    const classes = useStyles();
    const pageLocale = locale.pages.manage.assetTypes.actionDialogue;

    const [selectedAssetType, setSelectedAssetType] = React.useState('');
    React.useEffect(() => {
        setSelectedAssetType('');
    }, [isOpen]);
    const onAssetTypeChange = assetID => {
        setSelectedAssetType(assetID);
    };
    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            data-testid={`dialogbox-${actionDialogueBoxId}`}
        >
            <DialogTitle data-testid="message-title">{pageLocale.confirmationTitle}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 400 : 'auto' }}>
                <Typography component={'p'} data-testid="deleteReassign-target-prompt">
                    {pageLocale.deleteReassignTargetPrompt(row?.asset_type_name)}
                </Typography>
                <InputLabel shrink required>
                    {pageLocale.newAssetTypePrompt}
                </InputLabel>
                <Select
                    fullWidth
                    className={classes.formSelect}
                    id="actionDialogueTypeSelect"
                    data-testid="actionDialogueTypeSelect"
                    value={selectedAssetType}
                    onChange={e => onAssetTypeChange(e.target.value)}
                    required
                >
                    {data.map(item => (
                        <MenuItem
                            value={item.asset_type_id}
                            key={item.asset_type_id}
                            id={`DialogueItem-${item.asset_type_id}`}
                            data-testid={`DialogueItem-${item.asset_type_id}`}
                        >
                            {item.asset_type_name}
                        </MenuItem>
                    ))}
                </Select>
                <Alert className={classes.alertPanel} severity="warning">
                    {pageLocale.deleteReassignWarningPrompt(row?.asset_count)}
                </Alert>
                <Grid container spacing={4} className={classes.actionButtons}>
                    <Grid item xs={12} sm={6} container justifyContent="flex-start">
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            id="actionDialogueCancelButton"
                            data-testid={`actionDialogueCancel-${row.asset_type_id}`}
                            color={'default'}
                            disabled={!!isBusy}
                        >
                            {pageLocale.cancelButtonLabel}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            onClick={() => onProceed(row.asset_type_id, selectedAssetType)}
                            id="actionDialogueConfirmButton"
                            data-testid={`actionDialogueConfirm-${row.asset_type_id}`}
                            color={'default'}
                            disabled={!!isBusy || !!!selectedAssetType || row?.asset_type_id === selectedAssetType}
                        >
                            {pageLocale.confirmButtonLabel}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

ActionDialogue.propTypes = {
    dialogueContent: PropTypes.any,
    data: PropTypes.array,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    noMinContentWidth: PropTypes.bool,
    actionDialogueBoxId: PropTypes.string,
    onCancel: PropTypes.func,
    onProceed: PropTypes.func,
    isBusy: PropTypes.bool,
};

export default React.memo(ActionDialogue);
