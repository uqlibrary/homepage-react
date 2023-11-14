import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';

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
