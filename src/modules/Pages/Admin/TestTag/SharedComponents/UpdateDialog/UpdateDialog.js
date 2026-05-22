import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { filterComponentProps } from './utils';

const rootId = 'update_dialog';

const StyledDialog = styled(Dialog, {
    shouldForwardProp: prop => prop !== 'styles',
})(({ styles, fullScreen, theme }) => ({
    padding: '6px',
    '& .MuiDialog-paper': { minHeight: '30vh', maxHeight: fullScreen ? '100%' : '50vh' },
    '& .footerActions': {
        padding: '8px 16px',
    },
    '& .footerMobileMargin': {
        [theme.breakpoints.only('xs')]: {
            marginTop: theme.spacing(2),
        },
    },
    ...styles,
}));

export const UpdateDialogue = ({
    action,
    locale,
    isOpen,
    title,
    id,
    hideActionButton = false,
    hideAccessoryButton = true,
    hideCancelButton = false,
    onAction,
    onAccessoryAction,
    onCancelAction,
    onClose,
    noMinContentWidth,
    fields,
    columns,
    row,
    rows,
    props,
    isBusy = false,
    styles,
    disabledState = { actionButton: false, accessoryButton: false, cancelButton: false },
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

    const componentId = `${rootId}-${id}`;

    const [dataColumns, setDataColumns] = React.useState({});
    const [dataFields, setDataFields] = React.useState({});
    const [editableFields, setEditableFields] = React.useState([]);
    const [data, setData] = React.useState({});
    const [fieldsValid, setFieldsValid] = React.useState({});

    React.useEffect(() => {
        /* istanbul ignore else */
        if (isOpen) {
            setDataColumns(columns);
            setDataFields(fields);
            setData(row);
            setEditableFields(
                Object.keys(fields).filter(
                    field =>
                        (action === 'edit' && !!(fields[field]?.fieldParams?.renderInUpdate ?? true)) ||
                        (action === 'add' && !!(fields[field]?.fieldParams?.renderInAdd ?? true)),
                ),
            );
        }
    }, [isOpen, fields, row, rows, columns, action]);

    React.useEffect(() => {
        setFieldsValid(() => {
            const newFieldsValid = {};
            editableFields.forEach(field => {
                newFieldsValid[field] =
                    !dataFields[field]?.validate?.(data[field], data, rows) ?? /* istanbul ignore next */ true;
            });
            return newFieldsValid;
        });
    }, [data, dataFields, editableFields, rows]);

    const _onAction = () => {
        onClose?.();
        onAction?.(data);
    };

    const _onAccessoryAction = () => {
        onClose?.();
        onAccessoryAction?.(data);
    };

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
    };

    const _onClickAction = e => {
        e.stopPropagation();
    };

    const handleChange = field => (event, value) => {
        const isCheckbox = event?.target?.type === 'checkbox';
        const newValue = isCheckbox ? event.target.checked : value || event.target.value;

        setData(prevState => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const isInvalidForm = Object.values(fieldsValid).some(valid => !valid);
    return (
        <StyledDialog
            open={isOpen}
            id={`${componentId}`}
            data-testid={`${componentId}`}
            styles={styles}
            fullScreen={isMobileView}
        >
            <DialogTitle id={`${componentId}-title`} data-testid={`${componentId}-title`}>
                {title}
            </DialogTitle>
            <DialogContent
                id={`${componentId}-content`}
                data-testid={`${componentId}-content`}
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
                                    <Grid item xs={12}>
                                        {((action === 'edit' && !!!(dataFields[field]?.fieldParams?.canEdit ?? true)) ||
                                            (action === 'add' &&
                                                !!!(dataFields[field]?.fieldParams?.canAdd ?? true))) && (
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
                                        {((action === 'edit' && !!(dataFields[field]?.fieldParams?.canEdit ?? true)) ||
                                            (action === 'add' &&
                                                !!(dataFields[field]?.fieldParams?.canAdd ?? true))) && (
                                            <>
                                                {dataFields[field]?.component(
                                                    filterComponentProps({
                                                        id: `${field}-input`,
                                                        name: field,
                                                        label: dataColumns[field].label,
                                                        error: !fieldsValid[field],
                                                        checked: !!data?.[field],
                                                        onChange: handleChange(field),
                                                        onClick: _onClickAction,
                                                        InputLabelProps: {
                                                            shrink: true,
                                                            htmlFor: `${field}-input`,
                                                            id: `${field}-label`,
                                                            ['data-testid']: `${field}-label`,
                                                        },
                                                        inputProps: {
                                                            ['data-testid']: `${field}-input`,
                                                        },
                                                        fullWidth: true,
                                                        type: dataFields[field]?.fieldParams?.type ?? undefined,
                                                        value:
                                                            dataFields[field]?.valueFormatter?.(data?.[field]) ??
                                                            data?.[field] ??
                                                            '',
                                                        ...(props?.fieldProps?.[field] ? props.fieldProps[field] : {}),
                                                    }),
                                                    data,
                                                    row,
                                                    action,
                                                )}
                                            </>
                                        )}
                                    </Grid>
                                )}
                            </React.Fragment>
                        ))}
                </Grid>
            </DialogContent>
            {(!hideCancelButton || !hideAccessoryButton || !hideActionButton) && (
                <DialogActions id={`${rootId}-actions`} data-testid={`${rootId}-actions`}>
                    <Grid container className={'footerActions'}>
                        <Grid
                            item
                            xs={12}
                            display={'flex'}
                            justifyContent={'space-between'}
                            flexWrap={'wrap'}
                            gap={1}
                            className={'footerMobileMargin'}
                        >
                            {!hideCancelButton && (
                                <Button
                                    variant={'outlined'}
                                    onClick={_onCancelAction}
                                    id={`${rootId}-cancel-button`}
                                    data-testid={`${rootId}-cancel-button`}
                                    disabled={isBusy || disabledState?.cancelButton}
                                    sx={{ justifySelf: 'flex-start', display: 'flex' }}
                                    fullWidth={isMobileView}
                                >
                                    {locale.cancelButtonLabel}
                                </Button>
                            )}
                            {!hideAccessoryButton && (
                                <Button
                                    variant="contained"
                                    color={'secondary'}
                                    fullWidth={isMobileView}
                                    sx={{ justifySelf: 'flex-center', display: 'flex' }}
                                    onClick={_onAccessoryAction}
                                    disabled={isBusy || isInvalidForm || disabledState?.accessoryButton}
                                >
                                    {locale.accessoryButtonLabel}
                                </Button>
                            )}
                            {!hideActionButton && (
                                <Button
                                    variant="contained"
                                    autoFocus
                                    color={'primary'}
                                    onClick={_onAction}
                                    id={`${rootId}-action-button`}
                                    data-testid={`${rootId}-action-button`}
                                    fullWidth={isMobileView}
                                    disabled={isBusy || isInvalidForm || disabledState?.actionButton}
                                    sx={{ justifySelf: 'flex-end', display: 'flex' }}
                                >
                                    {isBusy ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={25}
                                            id={`${rootId}-progress`}
                                            data-testid={`${rootId}-progress`}
                                        />
                                    ) : (
                                        locale.confirmButtonLabel
                                    )}
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </DialogActions>
            )}
        </StyledDialog>
    );
};

UpdateDialogue.propTypes = {
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    locale: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    row: PropTypes.object,
    rows: PropTypes.array,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    hideActionButton: PropTypes.bool,
    hideAccessoryButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.func,
    onAccessoryAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
    props: PropTypes.object,
    fieldProps: PropTypes.object,
    isBusy: PropTypes.bool,
    styles: PropTypes.object,
    disabledState: PropTypes.shape({
        actionButton: PropTypes.bool,
        accessoryButton: PropTypes.bool,
        cancelButton: PropTypes.bool,
    }),
};

export default React.memo(UpdateDialogue);
