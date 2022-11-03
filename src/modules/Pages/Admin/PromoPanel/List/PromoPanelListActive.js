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
import { PromoPanelPreview } from '../PromoPanelPreview';
import { Typography } from '@material-ui/core';
import { PromoPanelSplitButton } from './PromoPanelSplitButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

// import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../promoPanelAdmin.locale';
import ReactSeventeenAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import { getClassNumberFromPieces } from 'data/actions';
// import AlertSplitButton from './AlertSplitButton';
import { scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import PromoPanelScheduleHeaders from './PromoPanelScheduleHeaders';
import classNames from 'classnames';

const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

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
export const PromoPanelListActive = ({ panelList, title, isLoading, panelError }) => {
    const classes = useStyles();
    const rowMarker = 0;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewPanel, setPreviewPanel] = useState({});
    const handlePreviewClose = () => setPreviewOpen(false);

    const calculateCurrentPanel = list => {
        console.log('List passed to calculate', list);
        let currentPanel = null;
        let panelType = null;
        let panelEnd = null;
        if (list.scheduled_panels && list.scheduled_panels.length > 0) {
            list.scheduled_panels.map(item => {
                const currentTime = new moment();
                console.log('the item is', item);
                console.log('the panel schedule start time', moment(item.panel_schedule_start_time).toDate());
                console.log('the current time is', moment(currentTime).toDate());
                const startTime = moment(item.panel_schedule_start_time).toDate();
                const endTime = moment(item.panel_schedule_end_time).toDate();
                console.log('AFTER START TIME', startTime < currentTime);
                console.log('BEFORE END TIME', endTime > currentTime);
                if (startTime < currentTime && endTime > currentTime) {
                    currentPanel = item.panel_title;
                    panelType = 'Scheduled';
                    panelEnd = endTime;
                }
            });
        }
        if (!currentPanel && list.default_panel && Object.keys(list.default_panel).length > 0) {
            currentPanel = list.default_panel.panel_title;
            panelType = 'Default';
            panelEnd = null;
        }
        if (!currentPanel) {
            currentPanel = 'THERE IS NO PANEL / DEFAULT PANEL';
            panelType = 'None';
            panelEnd = null;
        }
        return [currentPanel, panelType, panelEnd];
    };

    // const needsPaginator = userows.length > footerDisplayMinLength;
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
                                <TableCell component="th" scope="row" align="right" style={{ paddingRight: 25 }}>
                                    <Typography variant="body1" className={classes.headerCell}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {console.log('Panel List', panelList, isLoading)}
                            {!isLoading &&
                                panelList.map((item, id) => {
                                    const [panelName, panelType, panelEnd] = calculateCurrentPanel(item);
                                    return (
                                        <>
                                            <TableRow>
                                                <TableCell>{item.user_group_name}</TableCell>

                                                <TableCell>{panelName}</TableCell>
                                                <TableCell>{panelType}</TableCell>
                                                <TableCell>
                                                    {(panelEnd && moment(panelEnd).format('dddd DD/MM/YYYY HH:mm a')) ||
                                                        '...'}
                                                </TableCell>
                                                <TableCell>...</TableCell>
                                            </TableRow>
                                        </>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <PromoPanelPreview
                    isPreviewOpen={previewOpen}
                    previewName={previewPanel.name}
                    handlePreviewClose={handlePreviewClose}
                    previewTitle={previewPanel.title}
                    previewContent={previewPanel.content}
                    previewGroup={previewPanel.group}
                    previewScheduled={previewPanel.scheduled}
                    previewStart={previewPanel.start}
                    previewEnd={previewPanel.end}
                />
            </StandardCard>
        </React.Fragment>
    );
};

PromoPanelListActive.propTypes = {
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

PromoPanelListActive.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in? false means unspecified
    panelError: '',
};

export default PromoPanelListActive;
