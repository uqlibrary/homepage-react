import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import locale from '../../../testTag.locale';

const rootId = 'action_dialogue';

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

export const ActionDialogue = ({ id, data, row, isOpen, noMinContentWidth, onCancel, onProceed, isBusy }) => {
    const componentId = `${rootId}-${id}`;

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
            id={`${componentId}`}
            data-testid={`${componentId}`}
        >
            <DialogTitle id={`${componentId}-title`} data-testid={`${componentId}-title`}>
                {pageLocale.confirmationTitle}
            </DialogTitle>
            <DialogContent
                style={{ minWidth: !noMinContentWidth ? 400 : 'auto' }}
                id={`${componentId}-content`}
                data-testid={`${componentId}-content`}
            >
                <Typography component={'p'}>{pageLocale.deleteReassignTargetPrompt(row?.asset_type_name)}</Typography>
                <FormControl fullWidth>
                    <InputLabel
                        shrink
                        required
                        id={`${componentId}-reassign-label`}
                        data-testid={`${componentId}-reassign-label`}
                    >
                        {pageLocale.newAssetTypePrompt}
                    </InputLabel>
                    <Select
                        id={`${componentId}-reassign`}
                        data-testid={`${componentId}-reassign`}
                        MenuProps={{
                            id: `${componentId}-reassign-options`,
                            'data-testid': `${componentId}-reassign-options`,
                        }}
                        inputProps={{
                            id: `${componentId}-reassign-input`,
                            ['data-testid']: `${componentId}-reassign-input`,
                        }}
                        SelectDisplayProps={{
                            id: `${componentId}-reassign-select`,
                            'data-testid': `${componentId}-reassign-select`,
                        }}
                        fullWidth
                        className={classes.formSelect}
                        value={selectedAssetType}
                        onChange={e => onAssetTypeChange(e.target.value)}
                        required
                    >
                        {data.map((item, index) => (
                            <MenuItem
                                value={item.asset_type_id}
                                key={item.asset_type_id}
                                id={`${componentId}-reassign-option-${index}`}
                                data-testid={`${componentId}-reassign-option-${index}`}
                            >
                                {item.asset_type_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Alert
                    className={classes.alertPanel}
                    severity="warning"
                    id={`${componentId}-alert`}
                    data-testid={`${componentId}-alert`}
                >
                    {pageLocale.deleteReassignWarningPrompt(row?.asset_count)}
                </Alert>
                <Grid container spacing={4} className={classes.actionButtons}>
                    <Grid item xs={12} sm={6} container justifyContent="flex-start">
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            id={`${componentId}-cancel-button`}
                            data-testid={`${componentId}-cancel-button`}
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
                            id={`${componentId}-action-button`}
                            data-testid={`${componentId}-action-button`}
                            color={'default'}
                            disabled={!!isBusy || !!!selectedAssetType || row?.asset_type_id === selectedAssetType}
                        >
                            {isBusy ? (
                                <CircularProgress
                                    color="inherit"
                                    size={25}
                                    id={`${componentId}-progress`}
                                    data-testid={`${componentId}-progress`}
                                />
                            ) : (
                                pageLocale.confirmButtonLabel
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

ActionDialogue.propTypes = {
    id: PropTypes.string.isRequired,
    dialogueContent: PropTypes.any,
    data: PropTypes.array,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    noMinContentWidth: PropTypes.bool,
    onCancel: PropTypes.func,
    onProceed: PropTypes.func,
    isBusy: PropTypes.bool,
};

export default React.memo(ActionDialogue);
