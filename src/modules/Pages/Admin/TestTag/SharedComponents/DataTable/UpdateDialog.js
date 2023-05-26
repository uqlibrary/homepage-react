import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { useIsMobileView } from 'hooks';

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

export const UpdateDialogue = ({
    confirmationBoxId = 'dialogBox',
    confirmationTitle = '',
    cancelButtonLabel = '',
    confirmButtonLabel = '',
    isOpen,
    updateDialogueBoxId = 'actionDialogBox',
    hideActionButton = false,
    hideCancelButton = false,
    onAction,
    onCancelAction,
    onClose,
    noMinContentWidth,
    fields,
    row,
} = {}) => {
    const classes = useStyles();
    const [dataFields, setDataFields] = React.useState({});
    const [data, setData] = React.useState({});
    const isMobileView = useIsMobileView();

    React.useEffect(() => {
        if (isOpen) {
            setDataFields(fields);
            setData(row);
        }
    }, [isOpen, fields, row]);

    const _onAction = () => {
        onClose?.();
        onAction?.(data);
    };

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
    };

    const handleChange = event => {
        console.log(event);
        setData({ ...data, [event.target.id]: event.target.value });
    };

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            id={`dialogbox-${updateDialogueBoxId}`}
            data-testid={`dialogbox-${updateDialogueBoxId}`}
        >
            <DialogTitle data-testid="message-title">{confirmationTitle}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 300 : 'auto' }}>
                <Grid container padding={0} spacing={2}>
                    {isOpen &&
                        !!data &&
                        !!dataFields &&
                        Object.keys(dataFields).map(field => (
                            <Grid item xs={12} sm={6} key={field}>
                                {!dataFields[field].fieldParams.canEdit &&
                                    (dataFields[field].fieldParams?.shouldRender ?? true) && (
                                        <>
                                            <Typography variant="body2">{dataFields[field].label}</Typography>
                                            <Typography variant="body1">{data?.[field]}</Typography>
                                        </>
                                    )}
                                {dataFields[field].fieldParams.canEdit && (
                                    <>
                                        {dataFields[field]?.component({
                                            id: field,
                                            'data-testid': field,
                                            InputLabelProps: { shrink: true },
                                            label: dataFields[field].label,
                                            value: data?.[field],
                                            fullWidth: true,
                                            onChange: handleChange,
                                        })}
                                    </>
                                )}
                            </Grid>
                        ))}
                </Grid>
            </DialogContent>
            {(!hideCancelButton || !hideActionButton) && (
                <DialogActions>
                    <Grid container spacing={1}>
                        {!hideCancelButton && (
                            <Grid item xs={12} sm>
                                <Box justifyContent="flex-start" display={'flex'}>
                                    <Button
                                        variant={'outlined'}
                                        onClick={_onCancelAction}
                                        id="confirm-cancel-action"
                                        data-testid={`cancel-${confirmationBoxId}`}
                                        fullWidth={isMobileView}
                                    >
                                        {cancelButtonLabel}
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                        {!hideActionButton && (
                            <Grid item xs={12} sm>
                                <Box justifyContent="flex-end" display={'flex'}>
                                    <Button
                                        variant="contained"
                                        autoFocus
                                        color={'primary'}
                                        onClick={_onAction}
                                        id="confirm-action"
                                        data-testid={`confirm-${confirmationBoxId}`}
                                        fullWidth={isMobileView}
                                    >
                                        {confirmButtonLabel}
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DialogActions>
            )}
        </Dialog>
    );
};

UpdateDialogue.propTypes = {
    confirmationBoxId: PropTypes.string,
    confirmationTitle: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    confirmButtonLabel: PropTypes.string,
    fields: PropTypes.object,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    updateDialogueBoxId: PropTypes.string,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
};

export default React.memo(UpdateDialogue);
