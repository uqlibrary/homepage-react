/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { PromoPanelSplitButton } from './PromoPanelSplitButton';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

// import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../promoPanelAdmin.locale';
import ReactSeventeenAdapter from '@wojtekmaj/enzyme-adapter-react-17';
// import AlertSplitButton from './AlertSplitButton';
// import { scrollToTopOfPage, systemList } from '../alerthelpers';

const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

const useStyles2 = makeStyles(
    theme => ({
        cellGroupRow: {},
        cellGroupName: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 5,
            paddingBottom: 0,
            fontWeight: 400,
            borderBottom: 'none',
            borderTop: '1px solid #aaa',
        },
        cellGroupDetails: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 5,
            fontWeight: 400,
            borderBottom: 'none',
        },
        cellGroupDetailsLast: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 20,
            fontWeight: 400,
            borderBottom: 'none',
        },
        table: {
            minWidth: 500,
        },
        startDate: {
            whiteSpace: 'pre', // makes moment format able to take a carriage return
        },
        endDate: {
            whiteSpace: 'pre',
        },
        headerRow: {
            display: 'flex',
            padding: '0 0.5rem',
        },
        headerRowHighlighted: {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
        },
        iconHighlighted: {
            color: '#fff',
        },
        chipblock: {
            '&>div': {
                marginBottom: 4,
            },
            '&>div>div': {
                marginBottom: 4,
            },
        },
        urgent: {
            backgroundColor: theme.palette.warning.light,
            color: '#000',
        },
        extreme: {
            backgroundColor: theme.palette.error.main,
            color: '#fff',
        },
        system: {
            backgroundColor: '#666666',
            color: '#fff',
        },
        checkboxCell: {
            '& input[type="checkbox"]:checked + svg': {
                fill: '#595959',
            },
        },
        removedChip: {
            textDecoration: 'line-through',
        },
    }),
    { withTheme: true },
);
export const PromoPanelListTable = ({
    panelList,
    title,
    canEdit,
    canClone,
    canDelete,
    rows,
    headertag,
    alertsLoading,
    history,
    actions,
    deleteAlert,
    footerDisplayMinLength,
    alertOrder,
}) => {
    const classes = useStyles2();

    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('alerts', numberOfCheckedBoxes === 1 ? 'alert' : 'alerts'),
        };
    };

    // const needsPaginator = userows.length > footerDisplayMinLength;

    return (
        <StandardCard title={title} customBackgroundColor="#F7F7F7">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Group
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Panel Name
                            </TableCell>
                            <TableCell component="th" scope="row">
                                From
                            </TableCell>
                            <TableCell component="th" scope="row">
                                To
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Start of a Group and it's Panels */}
                        {console.log('panelList', panelList)}
                        {panelList.map((item, id) => {
                            return (
                                <React.Fragment key={id}>
                                    <TableRow className={classes.cellGroupRow}>
                                        <TableCell component="td" scope="row" className={classes.cellGroupName}>
                                            {item.user_type_name}
                                        </TableCell>
                                        <TableCell component="td" scope="row" className={classes.cellGroupName} />
                                        <TableCell component="td" scope="row" className={classes.cellGroupName} />
                                        <TableCell component="td" scope="row" className={classes.cellGroupName} />
                                        <TableCell component="td" scope="row" className={classes.cellGroupName} />
                                    </TableRow>
                                    {item.panels.map((row, id) => {
                                        return (
                                            <TableRow className={classes.cellGroupRow} key={id}>
                                                <TableCell className={classes.cellGroupDetails} />
                                                <TableCell className={classes.cellGroupDetails}>
                                                    {row.panel_name}
                                                </TableCell>
                                                <TableCell className={classes.cellGroupDetails}>
                                                    {row.panel_start && row.panel_start !== ''
                                                        ? row.panel_start
                                                        : 'Default'}
                                                </TableCell>
                                                <TableCell className={classes.cellGroupDetails}>
                                                    {row.panel_end && row.panel_end !== '' ? row.panel_end : ''}
                                                </TableCell>
                                                <TableCell className={classes.cellGroupDetails}>
                                                    <PromoPanelSplitButton
                                                        alertId={alert.id}
                                                        canEdit={canEdit}
                                                        canClone={canClone}
                                                        canDelete={canDelete}
                                                        // deleteAlertById={deleteAlertById}
                                                        mainButtonLabel={'Edit'}
                                                        // navigateToCloneForm={navigateToCloneForm}
                                                        // navigateToEditForm={navigateToEditForm}
                                                        // navigateToView={navigateToView}
                                                        confirmDeleteLocale={confirmDeleteLocale}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </StandardCard>
    );
};

PromoPanelListTable.propTypes = {
    panelList: PropTypes.array,
    title: PropTypes.string,
    canEdit: PropTypes.bool,
    canClone: PropTypes.bool,
    canDelete: PropTypes.bool,
    rows: PropTypes.array,
    headertag: PropTypes.string,
    alertsLoading: PropTypes.any,
    history: PropTypes.object,
    actions: PropTypes.any,
    deleteAlert: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    alertOrder: PropTypes.any,
};

PromoPanelListTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in? false means unspecified
};

export default PromoPanelListTable;
