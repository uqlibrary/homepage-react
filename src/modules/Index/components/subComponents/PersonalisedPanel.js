import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import LinkIcon from '@material-ui/icons/Link';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Badge from '@material-ui/core/Badge';
import PrintIcon from '@material-ui/icons/Print';
import { Location } from '../../../SharedComponents/Location';
import { ppLocale } from './PersonalisedPanel.locale';
const moment = require('moment');

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
        paddingTop: 0,
        paddingBottom: 0,
        textTransform: 'none',
        textAlign: 'left',
        paddingLeft: 16,
        paddingRight: 0,
        marginTop: 2,
    },
    menuItemLabel: {
        fontSize: 14,
        lineHeight: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap !important',
        paddingRight: 6,
        color: theme.palette.accent.main,
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    itemButton: {
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
        width: 17,
        minWidth: 17,
        height: 17,
        fontSize: 10,
        backgroundColor: 'red',
        left: -14,
        top: 6,
        padding: 5,
        lineHeight: 2,
    },
    ppBadgeWarning: {
        zIndex: 999,
        width: 17,
        minWidth: 17,
        height: 17,
        fontSize: 10,
        backgroundColor: 'orange',
        left: -14,
        top: 6,
        padding: 5,
        lineHeight: 2,
    },
    ppBadgeInfo: {
        zIndex: 999,
        width: 17,
        minWidth: 17,
        height: 17,
        fontSize: 10,
        backgroundColor: theme.palette.primary.dark,
        left: -14,
        top: 6,
        padding: 5,
        lineHeight: 2,
    },
}));

const PersonalisedPanel = ({
    account,
    author,
    loans,
    printBalance,
    isNextToSpotlights,
    possibleRecords,
    incompleteNTRORecords,
}) => {
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
    const isStaff = account.user_group === 'STAFF';

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
                    data-testid={id('tooltip')}
                    title={ppLocale.items.papercut.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <Button
                        fullWidth
                        classes={{ root: classes.menuItemRoot }}
                        onClick={handleClick}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.papercut.label.replace(
                                    '[balance]',
                                    printBalance.balance !== '0.00' ? `($${printBalance.balance})` : '',
                                )}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <PrintIcon className={classes.icon} />
                                </div>
                            </Grid>
                        </Grid>
                    </Button>
                </Tooltip>
                <Menu
                    id={id('menu')}
                    data-testid={id('menu')}
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={handleClose}
                >
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
                    data-testid={id('tooltip')}
                    title={ppLocale.items.loans.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <Button
                        fullWidth
                        classes={{ root: classes.menuItemRoot }}
                        onClick={() => navigateToLoans()}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.loans.label.replace(
                                    '[loans]',
                                    loans.total_loans_count > 0 ? `(${loans.total_loans_count})` : '',
                                )}
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
                    </Button>
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
                    data-testid={id('tooltip')}
                    title={ppLocale.items.fines.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <Button
                        fullWidth
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
                    </Button>
                </Tooltip>
            </Grid>
        );
    };
    const EspacePossible = () => {
        const id = tag => `pp-espace-possible${tag ? '-' + tag : ''}`;
        const navigateToeSpaceDashboard = () => {
            window.location.href = ppLocale.items.eSpacePossible.url;
        };
        return (
            <Grid item xs={12} className={classes.menuItem}>
                <Tooltip
                    id={id('tooltip')}
                    data-testid={id('tooltip')}
                    title={ppLocale.items.eSpacePossible.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <Button
                        fullWidth
                        classes={{ root: classes.menuItemRoot }}
                        onClick={() => navigateToeSpaceDashboard()}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.eSpacePossible.label.replace('[totalRecords]', possibleRecords)}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <Badge
                                        badgeContent={possibleRecords}
                                        color="primary"
                                        classes={{ badge: classes.ppBadgeInfo }}
                                    >
                                        <AssignmentIndIcon className={classes.icon} />
                                    </Badge>
                                </div>
                            </Grid>
                        </Grid>
                    </Button>
                </Tooltip>
            </Grid>
        );
    };
    const EspaceOrcid = () => {
        const id = tag => `pp-espace-orcid${tag ? '-' + tag : ''}`;
        const navigateToeSpaceDashboard = () => {
            window.location.href = ppLocale.items.eSpaceOrcid.url;
        };
        return (
            <Grid item xs={12} className={classes.menuItem}>
                <Tooltip
                    id={id('tooltip')}
                    data-testid={id('tooltip')}
                    title={ppLocale.items.eSpaceOrcid.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <Button
                        fullWidth
                        classes={{ root: classes.menuItemRoot }}
                        onClick={() => navigateToeSpaceDashboard()}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.eSpaceOrcid.label}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <Badge
                                        badgeContent={'!'}
                                        color="primary"
                                        classes={{ badge: classes.ppBadgeWarning }}
                                    >
                                        <LinkIcon className={classes.icon} />
                                    </Badge>
                                </div>
                            </Grid>
                        </Grid>
                    </Button>
                </Tooltip>
            </Grid>
        );
    };
    const EspaceNTROs = () => {
        const id = tag => `pp-espace-ntro${tag ? '-' + tag : ''}`;
        const navigateToeSpaceDashboard = () => {
            window.location.href = ppLocale.items.eSpaceNTRO.url;
        };
        return (
            <Grid item xs={12} className={classes.menuItem}>
                <Tooltip
                    id={id('tooltip')}
                    data-testid={id('tooltip')}
                    title={ppLocale.items.eSpaceNTRO.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <Button
                        fullWidth
                        classes={{ root: classes.menuItemRoot }}
                        onClick={() => navigateToeSpaceDashboard()}
                        id={id('menu-button')}
                        data-testid={id('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs className={classes.menuItemLabel}>
                                {ppLocale.items.eSpaceNTRO.label.replace('[total]', incompleteNTRORecords.total)}
                            </Grid>
                            <Grid item xs="auto">
                                <div className={classes.itemButton}>
                                    <Badge
                                        badgeContent={incompleteNTRORecords.total}
                                        color="primary"
                                        classes={{ badge: classes.ppBadgeWarning }}
                                    >
                                        <PostAddIcon className={classes.icon} />
                                    </Badge>
                                </div>
                            </Grid>
                        </Grid>
                    </Button>
                </Tooltip>
            </Grid>
        );
    };

    return (
        <div
            className={`${classes.flexWrapper} ${!!isNextToSpotlights && classes.isNextToSpotlights}`}
            id="personalised-panel"
            data-testid="personalised-panel"
        >
            <div className={classes.flexHeader}>
                <Typography variant={'h5'} component={'h5'} color={'primary'} className={classes.greeting}>
                    {greeting()} {account.firstName || ''}
                </Typography>
                <Grid container spacing={1} style={{ marginLeft: 16 }}>
                    {account && account.id && (
                        <Grid item xs={12} lg="auto">
                            <Tooltip
                                id={id('tooltip')}
                                data-testid={id('tooltip')}
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
                    <Grid item xs={12} lg>
                        <Location />
                    </Grid>
                </Grid>
            </div>
            <div className={classes.flexContent} />
            <div className={classes.flexFooter}>
                <Grid container spacing={0} style={{ marginLeft: 16 }}>
                    {!!printBalance && printBalance.balance && !isStaff && <PaperCut />}
                    {!!loans && <Loans />}
                    {!!loans && loans.total_fines_count > 0 && <Fines />}
                    {!!possibleRecords && <EspacePossible />}
                    {!!author && !author.aut_orcid_id && <EspaceOrcid />}
                    {!!author && !!incompleteNTRORecords && !!incompleteNTRORecords.total && <EspaceNTROs />}
                </Grid>
            </div>
        </div>
    );
};

PersonalisedPanel.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    loans: PropTypes.object,
    printBalance: PropTypes.object,
    incompleteNTRORecords: PropTypes.object,
    possibleRecords: PropTypes.number,
    isNextToSpotlights: PropTypes.bool,
};

PersonalisedPanel.defaultProps = {
    isNextToSpotlights: false,
};

export default PersonalisedPanel;
