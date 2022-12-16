/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const moment = require('moment');

const useStyles = makeStyles(
    theme => ({
        cellGroupRowOdd: {
            backgroundColor: '#eee',
        },
        cellEmpty: {
            borderBottom: 'none',
        },
        cellGroupRowEven: {
            backgroundColor: 'none',
        },
        cellGroupName: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 5,
            paddingBottom: 0,
            fontWeight: 400,
            borderBottom: 'none',
            color: '#FFF',
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
        headerCell: {
            fontWeight: 'bold',
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
        tableRow: {
            borderBottom: '1px solid #bbb',
        },
        tableRowGroup: {
            backgroundColor: '#333',
            color: '#fff',
            borderBottom: 'none',
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
            borderBottom: 'none',
            '& input[type="checkbox"]:checked + svg': {
                fill: '#222',
            },
        },
        removedChip: {
            textDecoration: 'line-through',
        },
    }),
    { withTheme: true },
);
export const PromoPanelListActive = ({ panelList, title, isLoading }) => {
    const classes = useStyles();
    const [previewOpen, setPreviewOpen] = useState(false);
    const handlePreviewClose = () => setPreviewOpen(false);

    return (
        <React.Fragment>
            <StandardCard title={title} customBackgroundColor="#F7F7F7">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table" id={'admin-promoPanel-current'}>
                        <TableHead>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" className={classes.headerCell}>
                                        Group Name
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" className={classes.headerCell}>
                                        Panel Name
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" className={classes.headerCell}>
                                        Default / Scheduled
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" className={classes.headerCell}>
                                        Ending
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!isLoading && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress
                                            id="ListTableSpinner-activePanels"
                                            color="primary"
                                            size={38}
                                            thickness={3}
                                            aria-label="Loading Table Panels"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading &&
                                panelList.map((item, id) => {
                                    return (
                                        <React.Fragment key={id}>
                                            <TableRow>
                                                <TableCell>{item.usergroup_group_name}</TableCell>

                                                <TableCell>{item.active_panel.panel_title}</TableCell>
                                                <TableCell>
                                                    {!!item.active_panel.is_default_panel ? 'Default' : 'Scheduled'}{' '}
                                                    Showing
                                                </TableCell>
                                                <TableCell>
                                                    {(!!!item.active_panel.is_default_panel &&
                                                        moment(item.active_panel.panel_schedule_end_time).format(
                                                            'dddd DD/MM/YYYY HH:mm a',
                                                        )) ||
                                                        '...'}
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </StandardCard>
        </React.Fragment>
    );
};

PromoPanelListActive.propTypes = {
    panelList: PropTypes.array,
    title: PropTypes.string,
    isLoading: PropTypes.bool,
};

PromoPanelListActive.defaultProps = {};

export default PromoPanelListActive;
