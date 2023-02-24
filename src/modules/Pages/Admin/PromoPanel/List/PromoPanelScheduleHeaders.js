import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';

export const PromoPanelScheduleHeaders = ({}) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell component="th" scope="col" />
                <TableCell component="th" scope="col">
                    <Typography variant="body1">Panel Name</Typography>
                </TableCell>

                <TableCell component="th" scope="col">
                    <Typography variant="body1">From</Typography>
                </TableCell>
                <TableCell component="th" scope="col">
                    <Typography variant="body1">To</Typography>
                </TableCell>
                <TableCell component="th" scope="col" align="right" style={{ paddingRight: 25 }}>
                    <Typography variant="body1">Actions</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

export default PromoPanelScheduleHeaders;
