import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';

export const PromoPanelScheduleHeaders = ({}) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell component="th" scope="row" />
                <TableCell component="th" scope="row">
                    <Typography variant="body1">Panel Name</Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="body1">Default</Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="body1">From</Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="body1">To</Typography>
                </TableCell>
                <TableCell component="th" scope="row" align="right" style={{ paddingRight: 25 }}>
                    <Typography variant="body1">Actions</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

PromoPanelScheduleHeaders.propTypes = {
    panelList: PropTypes.array,
    title: PropTypes.string,
    canEdit: PropTypes.bool,
    canClone: PropTypes.bool,
    canDelete: PropTypes.bool,
    isLoading: PropTypes.bool,
    rows: PropTypes.array,
    headertag: PropTypes.string,
    alertsLoading: PropTypes.any,
    history: PropTypes.object,
    actions: PropTypes.any,
    deletePanel: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    alertOrder: PropTypes.any,
    panelError: PropTypes.string,
};

PromoPanelScheduleHeaders.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in? false means unspecified
    panelError: '',
};

export default PromoPanelScheduleHeaders;
