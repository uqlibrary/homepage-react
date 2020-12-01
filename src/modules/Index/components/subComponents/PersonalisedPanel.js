import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Badge from '@material-ui/core/Badge';
import PrintIcon from '@material-ui/icons/Print';
import { Location } from '../../../SharedComponents/Location';
const moment = require('moment');
import { ppLocale } from './PersonalisedPanel.locale';

const useStyles = makeStyles(theme => ({
    flexWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            borderLeft: 'none',
            paddingLeft: 0,
        },
    },
    isNextToSpotlights: {
        borderLeft: '1px solid' + theme.palette.secondary.light,
        paddingLeft: 16,
    },
    flexHeader: {
        height: 'auto',
    },
    flexContent: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 12,
        [theme.breakpoints.down('sm')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
            paddingLeft: 0,
        },
    },
    flexFooter: {
        height: 'auto',
        marginBottom: -16,
    },
    greeting: {
        fontSize: '2.25rem',
        lineHeight: 1,
        marginLeft: 16,
    },
    uqidIcon: {
        marginBottom: -2,
        marginRight: 6,
        height: 12,
        width: 12,
    },
    menuItem: {
        marginLeft: -16,
        marginRight: -16,
    },
    menuItemRoot: {
        paddingTop: 2,
        paddingBottom: 1,
    },
    menuItemLabel: {
        fontSize: 14,
        lineHeight: 2,
        color: theme.palette.accent.main,
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    itemButton: {
        border: '1px dashed green',
        padding: 1,
        minWidth: 0,
        backgroundColor: theme.palette.accent.main,
        width: 24,
        height: 24,
        borderRadius: 4,
    },
    icon: {
        padding: 0,
        color: theme.palette.white.main,
        width: 18,
        height: 18,
        margin: 3,
    },
    ppBadgeError: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'red',
        left: -14,
        top: 3,
        padding: 1,
    },
    ppBadgeWarning: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'orange',
        left: -14,
        top: 3,
        padding: 1,
    },
    ppBadgeInfo: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: theme.palette.secondary.dark,
        left: -14,
        top: 3,
        padding: 1,
    },
}));

const PersonalisedPanel = ({ account, author, authorDetails, loans, printBalance, isNextToSpotlights }) => {
    console.log('PP Account ', account);
    console.log('PP Author ', author);
    console.log('PP Author Details ', authorDetails);
    const classes = useStyles();
    const greeting = () => {
        const time = moment().format('H');
        if (time < 12) {
            return ppLocale.greetings.morning;
        } else if (time >= 12 && time < 18) {
            return ppLocale.greetings.afternoon;
        } else {
            return ppLocale.greetings.evening;
        }
    };
    if (!account) {
        return null;
    }
    const id = tag => `pp${tag ? '-' + tag : ''}`;
    const PaperCut = () => {
        const [anchorEl, setAnchorEl] = React.useState(null);
        const id = tag => `pp-papercut${tag ? '-' + tag : ''}`;
        const handleClick = event => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        const handleNagivationToManage = () => {
            window.location.href = ppLocale.items.papercut.url;
            handleClose();
        };
        const navigatToTopUpUrl = value => {
            window.location.href = ppLocale.items.papercut.topup
                .replace('[id]', account.id)
                .replace('[value]', value)
                .replace('[email]', printBalance.email);
        };
        return (
            <Grid item xs={12} className={classes.menuItem}>
                <Tooltip
                    id={id('tooltip')}
                    title={ppLocale.items.papercut.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <MenuItem
                        classes={{ root: classes.menuItemRoot }}
                        onClick={handleClick}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.papercut.label.replace('[balance]', printBalance.balance || '0.00')}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <PrintIcon className={classes.icon} />
                                </div>
                            </Grid>
                        </Grid>
                    </MenuItem>
                </Tooltip>
                <Menu
                    id={id('menu')}
                    data-testid={id('menu')}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onBlur={handleClose}
                >
                    <MenuItem disabled>Manage your PaperCut account</MenuItem>
                    <MenuItem
                        id={id('item-button-0')}
                        data-testid={id('item-button-0')}
                        onClick={() => handleNagivationToManage()}
                    >
                        Log in and manage your print balance
                    </MenuItem>
                    <MenuItem
                        id={id('item-button-1')}
                        data-testid={id('item-button-1')}
                        onClick={() => navigatToTopUpUrl(5)}
                    >
                        Top up your print balance - $5
                    </MenuItem>
                    <MenuItem
                        id={id('item-button-2')}
                        data-testid={id('item-button-2')}
                        onClick={() => navigatToTopUpUrl(10)}
                    >
                        Top up your print balance - $10
                    </MenuItem>
                    <MenuItem
                        id={id('item-button-3')}
                        data-testid={id('item-button-3')}
                        onClick={() => navigatToTopUpUrl(20)}
                    >
                        Top up your print balance - $20
                    </MenuItem>
                </Menu>
            </Grid>
        );
    };
    const Loans = () => {
        const id = tag => `pp-loans${tag ? '-' + tag : ''}`;
        const navigateToLoans = () => {
            window.location.href = ppLocale.items.loans.url;
        };
        return (
            <Grid item xs={12} className={classes.menuItem}>
                <Tooltip
                    id={id('tooltip')}
                    title={ppLocale.items.loans.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <MenuItem
                        classes={{ root: classes.menuItemRoot }}
                        onClick={() => navigateToLoans()}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.loans.label} {`(${loans.total_loans_count})`}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <Badge
                                        badgeContent={loans.total_loans_count}
                                        color="primary"
                                        classes={{ badge: classes.ppBadgeInfo }}
                                    >
                                        <MenuBookIcon className={classes.icon} />
                                    </Badge>
                                </div>
                            </Grid>
                        </Grid>
                    </MenuItem>
                </Tooltip>
            </Grid>
        );
    };
    const Fines = () => {
        const id = tag => `pp-fines${tag ? '-' + tag : ''}`;
        const navigateToFines = () => {
            window.location.href = ppLocale.items.fines.url;
        };
        return (
            <Grid item xs={12} className={classes.menuItem}>
                <Tooltip
                    id={id('tooltip')}
                    title={ppLocale.items.fines.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <MenuItem
                        classes={{ root: classes.menuItemRoot }}
                        onClick={() => navigateToFines()}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.fines.label.replace('[fines]', loans.total_fines_sum)}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <Badge
                                        badgeContent={loans.total_fines_count}
                                        color="primary"
                                        classes={{ badge: classes.ppBadgeError }}
                                    >
                                        <MonetizationOnIcon className={classes.icon} />
                                    </Badge>
                                </div>
                            </Grid>
                        </Grid>
                    </MenuItem>
                </Tooltip>
            </Grid>
        );
    };
    const RoomBookings = () => {
        const id = tag => `pp-fines${tag ? '-' + tag : ''}`;
        const navigateToRoomBooking = () => {
            window.location.href = ppLocale.items.roomBookings.url;
        };
        return (
            <Grid item xs={12} className={classes.menuItem}>
                <Tooltip
                    id={id('tooltip')}
                    title={ppLocale.items.roomBookings.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <MenuItem
                        classes={{ root: classes.menuItemRoot }}
                        onClick={() => navigateToRoomBooking()}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.roomBookings.label}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <MeetingRoomIcon className={classes.icon} />
                                </div>
                            </Grid>
                        </Grid>
                    </MenuItem>
                </Tooltip>
            </Grid>
        );
    };

    return (
        <div className={`${classes.flexWrapper} ${!!isNextToSpotlights && classes.isNextToSpotlights}`}>
            <div className={classes.flexHeader}>
                <Typography variant={'h5'} component={'h5'} color={'primary'} className={classes.greeting}>
                    {greeting()} {account.firstName || ''}
                </Typography>
            </div>
            <div className={classes.flexContent}>
                <Grid container spacing={0} style={{ marginLeft: 16 }}>
                    {account && account.id && (
                        <Grid item xs="auto">
                            <Tooltip
                                id={id('tooltip')}
                                title={ppLocale.username.replace('[id]', account.id || ppLocale.unavailable)}
                                placement="left"
                                TransitionProps={{ timeout: 300 }}
                            >
                                <Typography component={'span'} color={'secondary'} style={{ fontSize: 14 }}>
                                    <AccountBoxIcon className={classes.uqidIcon} fontSize={'small'} />
                                    {(account && account.id) || ''}
                                </Typography>
                            </Tooltip>
                        </Grid>
                    )}
                    <Location />
                </Grid>
            </div>
            <div className={classes.flexFooter}>
                <Grid container spacing={0} style={{ marginLeft: 16 }}>
                    {!!printBalance && printBalance.balance && <PaperCut />}
                    {!!loans && loans.total_loans_count > 0 && <Loans />}
                    {!!loans && loans.total_fines_count > 0 && <Fines />}
                    <RoomBookings />
                </Grid>
            </div>
        </div>
    );
};

PersonalisedPanel.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    loans: PropTypes.object,
    printBalance: PropTypes.object,
    isNextToSpotlights: PropTypes.bool,
};

PersonalisedPanel.defaultProps = {
    isNextToSpotlights: false,
};

export default PersonalisedPanel;
