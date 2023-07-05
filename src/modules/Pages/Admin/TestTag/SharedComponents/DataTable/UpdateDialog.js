import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    action,
    locale,
    isOpen,
    title,
    id = 'action',
    hideActionButton = false,
    hideCancelButton = false,
    onAction,
    onCancelAction,
    onClose,
    noMinContentWidth,
    fields,
    columns,
    row,
    props,
    isBusy = false,
} = {}) => {
    const classes = useStyles();
    const [dataColumns, setDataColumns] = React.useState({});
    const [dataFields, setDataFields] = React.useState({});
    const [editableFields, setEditableFields] = React.useState([]);
    const [data, setData] = React.useState({});
    const isMobileView = useIsMobileView();
    const [isValid, setIsValid] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setDataColumns(columns);
            setDataFields(fields);
            setData(row);
            setEditableFields(
                Object.keys(fields).filter(
                    field =>
                        !!(fields[field]?.fieldParams?.renderInUpdate ?? true) &&
                        !!(fields[field]?.fieldParams?.canEdit ?? false),
                ),
            );
        }
    }, [isOpen, fields, row, columns]);

    React.useEffect(() => {
        setIsValid(editableFields.every(field => !dataFields[field]?.validate?.(data[field], data) ?? true));
    }, [data, dataFields, editableFields]);

    const _onAction = () => {
        onClose?.();
        onAction?.(data);
    };

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
    };

    const handleChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            id={`dialog-${id}`}
            data-testid={`dialog-${id}`}
        >
            <DialogTitle id={`dialog-${id}-title`} data-testid={`dialog-${id}-title`}>
                {title}
            </DialogTitle>
            <DialogContent
                id={`dialog-${id}-content`}
                data-testid={`dialog-${id}-content`}
                style={{ minWidth: !noMinContentWidth ? 300 : 'auto' }}
            >
                <Grid container padding={0} spacing={2}>
                    {isOpen &&
                        !!data &&
                        !!dataFields &&
                        Object.keys(dataFields).map(field => (
                            <React.Fragment key={field}>
                                {((action === 'edit' && !!(dataFields[field]?.fieldParams?.renderInUpdate ?? true)) ||
                                    (action === 'add' && !!(dataFields[field]?.fieldParams?.renderInAdd ?? true))) && (
                                    <Grid item xs={12} sm={6}>
                                        {!!!dataFields[field]?.fieldParams?.canEdit && (
                                            <>
                                                <Typography variant="body2">{dataColumns[field].label}</Typography>
                                                <Typography variant="body1">
                                                    {!!dataFields[field]?.computedValue
                                                        ? dataFields[field].computedValue(
                                                              props[dataFields[field].computedValueProp],
                                                          )
                                                        : dataFields[field]?.valueFormatter?.(data?.[field]) ??
                                                          data?.[field]}
                                                </Typography>
                                            </>
                                        )}
                                        {!!dataFields[field]?.fieldParams?.canEdit && (
                                            <>
                                                {dataFields[field]?.component({
                                                    id: `${field}-input`,
                                                    name: field,
                                                    label: dataColumns[field].label,
                                                    value:
                                                        dataFields[field]?.valueFormatter?.(data?.[field]) ??
                                                        data?.[field],
                                                    error: dataFields[field]?.validate?.(data?.[field], data) ?? false,
                                                    onChange: handleChange,
                                                    InputLabelProps: {
                                                        shrink: true,
                                                    },
                                                    inputProps: {
                                                        ['data-testid']: `${field}-input`,
                                                    },
                                                    fullWidth: true,
                                                    row: data,
                                                })}
                                            </>
                                        )}
                                    </Grid>
                                )}
                            </React.Fragment>
                        ))}
                </Grid>
            </DialogContent>
            {(!hideCancelButton || !hideActionButton) && (
                <DialogActions id={`dialog-${id}-actions`} data-testid={`dialog-${id}-actions`}>
                    <Grid container spacing={3}>
                        {!hideCancelButton && (
                            <Grid item xs={12} sm>
                                <Box justifyContent="flex-start" display={'flex'}>
                                    <Button
                                        variant={'outlined'}
                                        onClick={_onCancelAction}
                                        id={`dialog-${id}-cancel-button`}
                                        data-testid={`dialog-${id}-cancel-button`}
                                        fullWidth={isMobileView}
                                        disabled={isBusy}
                                    >
                                        {locale.cancelButtonLabel}
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
                                        id={`dialog-${id}-confirm-button`}
                                        data-testid={`dialog-${id}-confirm-button`}
                                        fullWidth={isMobileView}
                                        disabled={isBusy || !isValid}
                                    >
                                        {isBusy ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={25}
                                                id={`dialog-${id}-progress`}
                                                data-testid={`dialog-${id}-progress`}
                                            />
                                        ) : (
                                            locale.confirmButtonLabel
                                        )}
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
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    locale: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    confirmationBoxId: PropTypes.string,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
    props: PropTypes.object,
    isBusy: PropTypes.bool,
};

export default React.memo(UpdateDialogue);
