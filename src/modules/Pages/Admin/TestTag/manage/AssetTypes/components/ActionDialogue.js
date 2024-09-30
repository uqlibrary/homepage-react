import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import locale from '../../../testTag.locale';

const rootId = 'action_dialogue';

const StyledDialog = styled(Dialog)(() => ({
    '& .MuiDialog-paper': { minHeight: '30vh', maxHeight: '50vh' },
}));

export const ActionDialogue = ({ id, data, row, isOpen, noMinContentWidth, onCancel, onProceed, isBusy }) => {
    const componentId = `${rootId}-${id}`;

    const pageLocale = locale.pages.manage.assetTypes.actionDialogue;

    const [selectedAssetType, setSelectedAssetType] = React.useState('');
    React.useEffect(() => {
        setSelectedAssetType('');
    }, [isOpen]);
    const onAssetTypeChange = assetID => {
        setSelectedAssetType(assetID);
    };
    return (
        <StyledDialog open={isOpen} id={`${componentId}`} data-testid={`${componentId}`}>
            <DialogTitle id={`${componentId}-title`} data-testid={`${componentId}-title`}>
                {pageLocale.confirmationTitle}
            </DialogTitle>
            <DialogContent
                style={{ minWidth: !noMinContentWidth ? 400 : 'auto' }}
                id={`${componentId}-content`}
                data-testid={`${componentId}-content`}
            >
                <Typography component={'p'}>{pageLocale.deleteReassignTargetPrompt(row?.asset_type_name)}</Typography>
                <FormControl variant="standard" fullWidth>
                    <InputLabel
                        shrink
                        required
                        id={`${componentId}-reassign-label`}
                        data-testid={`${componentId}-reassign-label`}
                    >
                        {pageLocale.newAssetTypePrompt}
                    </InputLabel>
                    <Select
                        variant="standard"
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
                        className={'formSelect'}
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
                    sx={{ marginTop: '10px' }}
                    severity="warning"
                    id={`${componentId}-alert`}
                    data-testid={`${componentId}-alert`}
                >
                    {pageLocale.deleteReassignWarningPrompt(row?.asset_count)}
                </Alert>
                <Grid container spacing={4} sx={{ marginTop: '10px' }}>
                    <Grid item xs={12} sm={6} container justifyContent="flex-start">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={onCancel}
                            id={`${componentId}-cancel-button`}
                            data-testid={`${componentId}-cancel-button`}
                            disabled={!!isBusy}
                        >
                            {pageLocale.cancelButtonLabel}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} container justifyContent="flex-end">
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => onProceed(row.asset_type_id, selectedAssetType)}
                            id={`${componentId}-action-button`}
                            data-testid={`${componentId}-action-button`}
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
        </StyledDialog>
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
