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
import moment from 'moment';

import { isEmptyStr } from '../../helpers/helpers';
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
    locale,
    isOpen,
    title,
    updateDialogueBoxId = 'actionDialogBox',
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
            console.log({ columns, fields, row });
            setDataColumns(columns);
            setDataFields(fields);
            setData(row);
            setEditableFields(
                Object.keys(fields).filter(
                    field =>
                        !!(fields[field].fieldParams?.renderInUpdate ?? true) &&
                        !!(fields[field].fieldParams?.canEdit ?? false),
                ),
            );
        }
    }, [isOpen, fields, row, columns]);

    React.useEffect(() => {
        setIsValid(!editableFields.some(entry => isEmptyStr(data[entry])));
    }, [data, editableFields]);

    const _onAction = () => {
        onClose?.();
        onAction?.(data);
    };

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
    };

    const handleChange = event => {
        console.log(event, event.target.type, moment(event.valueAsDate).format('YYYY-MM-DD'));
        setData({
            ...data,
            [event.target.id]: event.target.value,
        });
    };

    return (
        <Dialog
            classes={{ paper: classes.dialogPaper }}
            style={{ padding: 6 }}
            open={isOpen}
            id={`dialogbox-${updateDialogueBoxId}`}
            data-testid={`dialogbox-${updateDialogueBoxId}`}
        >
            <DialogTitle data-testid="message-title">{title}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 300 : 'auto' }}>
                <Grid container padding={0} spacing={2}>
                    {isOpen &&
                        !!data &&
                        !!dataFields &&
                        Object.keys(dataFields).map(field => (
                            <React.Fragment key={field}>
                                {!!(dataFields[field].fieldParams?.renderInUpdate ?? true) && (
                                    <Grid item xs={12} sm={6}>
                                        {!dataFields[field].fieldParams.canEdit && (
                                            <>
                                                <Typography variant="body2">{dataColumns[field].label}</Typography>
                                                <Typography variant="body1">
                                                    {!!dataFields[field]?.computedValue
                                                        ? dataFields[field].computedValue(
                                                              props[dataFields[field].computedValueProp],
                                                          )
                                                        : data?.[field]}
                                                </Typography>
                                            </>
                                        )}
                                        {dataFields[field].fieldParams.canEdit && (
                                            <>
                                                {dataFields[field]?.component({
                                                    id: field,
                                                    name: field,
                                                    label: dataColumns[field].label,
                                                    value: data?.[field],
                                                    error: isEmptyStr(data?.[field]),
                                                    onChange: handleChange,
                                                    InputLabelProps: {
                                                        shrink: true,
                                                    },
                                                    inputProps: {
                                                        ['data-testid']: `${field}-input`,
                                                    },
                                                    fullWidth: true,
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
                <DialogActions>
                    <Grid container spacing={3}>
                        {!hideCancelButton && (
                            <Grid item xs={12} sm>
                                <Box justifyContent="flex-start" display={'flex'}>
                                    <Button
                                        variant={'outlined'}
                                        onClick={_onCancelAction}
                                        id="confirm-cancel-action"
                                        data-testid={`cancel-${confirmationBoxId}`}
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
                                        id="confirm-action"
                                        data-testid={`confirm-${confirmationBoxId}`}
                                        fullWidth={isMobileView}
                                        disabled={isBusy || !isValid}
                                    >
                                        {isBusy ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={25}
                                                id="saveInspectionSpinner"
                                                data-testid="saveInspectionSpinner"
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
    locale: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
    title: PropTypes.string,
    confirmationBoxId: PropTypes.string,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    updateDialogueBoxId: PropTypes.string,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
    props: PropTypes.object,
    isBusy: PropTypes.bool,
};

export default React.memo(UpdateDialogue);
