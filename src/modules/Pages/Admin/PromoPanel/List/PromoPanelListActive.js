import React from 'react';
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

const useStyles = makeStyles(() => ({
    cellEmpty: {
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
    tableRow: {
        borderBottom: '1px solid #bbb',
    },
    tableRowGroup: {
        backgroundColor: '#333',
        color: '#fff',
        borderBottom: 'none',
    },
}));
export const PromoPanelListActive = ({ panelList, title, isLoading }) => {
    const classes = useStyles();
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
                                                            'ddd D MMM YYYY h:mma',
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
