import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

const moment = require('moment');

const StyledHeaderCell = styled(Typography)(() => ({
    fontWeight: 'bold',
}));

export const PromoPanelListActive = ({ panelList, title, isLoading }) => {
    return (
        <React.Fragment>
            <StandardCard title={title} customBackgroundColor="#F7F7F7">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table" id={'admin-promoPanel-current'}>
                        <TableHead>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <StyledHeaderCell variant="body1">Group Name</StyledHeaderCell>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <StyledHeaderCell variant="body1">Panel Name</StyledHeaderCell>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <StyledHeaderCell variant="body1">Default / Scheduled</StyledHeaderCell>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <StyledHeaderCell variant="body1">Ending</StyledHeaderCell>
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
