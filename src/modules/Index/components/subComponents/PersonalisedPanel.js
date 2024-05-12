import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LinkIcon from '@mui/icons-material/Link';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Badge from '@mui/material/Badge';
import PrintIcon from '@mui/icons-material/Print';
import { Location } from 'modules/SharedComponents/Location';
import { ppLocale } from './PersonalisedPanel.locale';
import { isEspaceAuthor, canSeeLoans, canSeePrintBalance } from 'helpers/access';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
const moment = require('moment');

const useStyles = makeStyles(theme => ({
    flexWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        [theme.breakpoints.down('md')]: {
            borderRight: 'none',
            paddingLeft: 0,
        },
    },
    locationWrapper: {
        [theme.breakpoints.down('lg')]: {
            marginLeft: -6,
        },
    },
    isNextToSpotlights: {
        borderRight: '1px solid' + theme.palette.secondary.light,
        paddingRight: 16,
    },
    flexHeader: {
        height: 'auto',
    },
    flexContent: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 12,
        [theme.breakpoints.down('md')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
            paddingLeft: 0,
        },
    },
    flexFooter: {
        height: 'auto',
    },
    greeting: {
        color: theme.palette.primary.light,
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
    menuItemAnchor: {
        marginRight: -16,
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    },
    anchorBadge: {
        marginLeft: -42,
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
    menuItemRootAnchor: {
        paddingTop: 0,
        paddingBottom: 0,
        textTransform: 'none',
        textAlign: 'left',
        paddingRight: 0,
        marginTop: 2,
        width: '100%',
        '& > span > div': {
            fontWeight: 400,
        },
    },
    menuItemLabel: {
        fontSize: 14,
        minHeight: 28,
        paddingRight: 48,
        paddingBottom: 6,
        color: theme.palette.accent.dark,
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    itemButton: {
        padding: 1,
        minWidth: 0,
        backgroundColor: theme.palette.primary.main,
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
        zIndex: 998,
        width: 17,
        minWidth: 17,
        height: 17,
        fontSize: 10,
        backgroundColor: '#a00000',
        left: -14,
        top: 6,
        padding: 5,
        lineHeight: 2,
    },
    ppBadgeWarning: {
        zIndex: 998,
        width: 17,
        minWidth: 17,
        height: 17,
        fontSize: 10,
        backgroundColor: '#a15700',
        left: -14,
        top: 6,
        padding: 5,
        lineHeight: 2,
    },
    ppBadgeInfo: {
        zIndex: 998,
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

export const greeting = (currentTime = null) => {
    const time = currentTime ?? moment().format('H');
    if (time < 12) {
        return ppLocale.greetings.morning;
    } else if (time >= 12 && time < 18) {
        return ppLocale.greetings.afternoon;
    } else {
        return ppLocale.greetings.evening;
    }
};

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
    const topLevelTagId = tag => `pp${tag ? '-' + tag : /* istanbul ignore next */ ''}`;

    const PaperCut = () => {
        const [anchorEl, setAnchorEl] = React.useState(null);
        const getPapercutId = tag => `pp-papercut${tag ? '-' + tag : /* istanbul ignore next */ ''}`;
        const handleClick = event => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        const handleNavigationToManage = () => {
            window.location.href =
                'https://web.library.uq.edu.au/library-services/it/print-scan-copy/your-printing-account';
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
                    id={getPapercutId('tooltip')}
                    data-testid={getPapercutId('tooltip')}
                    data-analyticsid={getPapercutId('tooltip')}
                    title={ppLocale.items.papercut.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <Button
                        fullWidth
                        classes={{ root: classes.menuItemRoot }}
                        onClick={handleClick}
                        id={getPapercutId('menu-button')}
                        data-testid={getPapercutId('menu-button')}
                    >
                        <Grid container spacing={0}>
                            <Grid
                                item
                                xs
                                className={classes.menuItemLabel}
                                style={{ lineHeight: 1.2, paddingRight: 0 }}
                            >
                                {ppLocale.items.papercut.label.replace(
                                    '[balance]',
                                    printBalance && printBalance.balance ? `($${printBalance.balance})` : '',
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
                    id={getPapercutId('menu')}
                    data-testid={getPapercutId('menu')}
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={handleClose}
                    PaperProps={{
                        id: 'papercut-paper',
                        'data-testid': 'papercut-paper',
                    }}
                >
                    {[5, 10, 20].map((topupAmount, index) => (
                        <MenuItem
                            id={getPapercutId(`item-button-${index + 1}`)}
                            key={getPapercutId(`item-button-${index + 1}`)}
                            data-testid={getPapercutId(`item-button-${index + 1}`)}
                            onClick={() => navigatToTopUpUrl(topupAmount)}
                        >
                            Top up your print balance - ${topupAmount}
                        </MenuItem>
                    ))}
                    <MenuItem
                        id={getPapercutId('item-button-0')}
                        data-testid={getPapercutId('item-button-0')}
                        data-analyticsid={getPapercutId('item-button-0')}
                        onClick={() => handleNavigationToManage()}
                    >
                        More about your printing account
                    </MenuItem>
                </Menu>
            </Grid>
        );
    };
    const Loans = () => {
        const getElementIdentifier = tag => `pp-loans${tag ? '-' + tag : /* istanbul ignore next */ ''}`;
        return (
            <Grid item xs={12} className={classes.menuItemAnchor}>
                <Tooltip
                    id={getElementIdentifier('tooltip')}
                    data-testid={getElementIdentifier('tooltip')}
                    data-analyticsid={getElementIdentifier('tooltip')}
                    title={ppLocale.items.loans.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <a
                        className={classes.menuItemRootAnchor}
                        href={ppLocale.items.loans.url}
                        id={getElementIdentifier('menu-button')}
                        data-testid={getElementIdentifier('menu-button')}
                    >
                        <span className="MuiButton-label">
                            <Grid container spacing={0}>
                                <Grid item xs className={classes.menuItemLabel}>
                                    {ppLocale.items.loans.label.replace(
                                        '[loans]',
                                        loans && loans.total_loans_count > 0 ? `(${loans.total_loans_count})` : '',
                                    )}
                                </Grid>
                                <Grid item xs="auto" className={classes.anchorBadge}>
                                    <div className={classes.itemButton}>
                                        <Badge
                                            badgeContent={loans && loans.total_loans_count}
                                            color="primary"
                                            classes={{ badge: classes.ppBadgeInfo }}
                                        >
                                            <MenuBookIcon className={classes.icon} />
                                        </Badge>
                                    </div>
                                </Grid>
                            </Grid>
                        </span>
                    </a>
                </Tooltip>
            </Grid>
        );
    };
    const Fines = () => {
        const getElementIdentifier = tag => `pp-fines${tag ? '-' + tag : /* istanbul ignore next */ ''}`;
        return (
            <Grid item xs={12} className={classes.menuItemAnchor}>
                <Tooltip
                    id={getElementIdentifier('tooltip')}
                    data-testid={getElementIdentifier('tooltip')}
                    data-analyticsid={getElementIdentifier('tooltip')}
                    title={ppLocale.items.fines.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <a
                        className={classes.menuItemRootAnchor}
                        href={ppLocale.items.fines.url}
                        id={getElementIdentifier('menu-button')}
                        data-testid={getElementIdentifier('menu-button')}
                    >
                        <span className="MuiButton-label">
                            <Grid container spacing={0}>
                                <Grid item xs className={classes.menuItemLabel}>
                                    {ppLocale.items.fines.label.replace('[fines]', loans && loans.total_fines_sum)}
                                </Grid>
                                <Grid item xs="auto" className={classes.anchorBadge}>
                                    <div className={classes.itemButton}>
                                        <Badge
                                            badgeContent={loans && loans.total_fines_count}
                                            color="primary"
                                            classes={{ badge: classes.ppBadgeError }}
                                        >
                                            <MonetizationOnIcon className={classes.icon} />
                                        </Badge>
                                    </div>
                                </Grid>
                            </Grid>
                        </span>
                    </a>
                </Tooltip>
            </Grid>
        );
    };
    const EspacePossible = () => {
        const getElementIdentifier = tag => `pp-espace-possible${tag ? '-' + tag : /* istanbul ignore next */ ''}`;
        return (
            <Grid item xs={12} className={classes.menuItemAnchor}>
                <Tooltip
                    id={getElementIdentifier('tooltip')}
                    data-testid={getElementIdentifier('tooltip')}
                    data-analyticsid={getElementIdentifier('tooltip')}
                    title={ppLocale.items.eSpacePossible.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <a
                        className={classes.menuItemRootAnchor}
                        href={ppLocale.items.eSpacePossible.url}
                        id={getElementIdentifier('menu-button')}
                        data-testid={getElementIdentifier('menu-button')}
                    >
                        <span className="MuiButton-label">
                            <Grid container spacing={0}>
                                <Grid item xs className={classes.menuItemLabel}>
                                    {ppLocale.items.eSpacePossible.label.replace('[totalRecords]', possibleRecords)}
                                </Grid>
                                <Grid item xs="auto" className={classes.anchorBadge}>
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
                        </span>
                    </a>
                </Tooltip>
            </Grid>
        );
    };
    const EspaceOrcid = () => {
        const getElementIdentifier = tag => `pp-espace-orcid${tag ? '-' + tag : /* istanbul ignore next */ ''}`;
        return (
            <Grid item xs={12} className={classes.menuItemAnchor}>
                <Tooltip
                    id={getElementIdentifier('tooltip')}
                    data-testid={getElementIdentifier('tooltip')}
                    data-analyticsid={getElementIdentifier('tooltip')}
                    title={ppLocale.items.eSpaceOrcid.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <a
                        className={classes.menuItemRootAnchor}
                        href={ppLocale.items.eSpaceOrcid.url}
                        id={getElementIdentifier('menu-button')}
                        data-testid={getElementIdentifier('menu-button')}
                    >
                        <span className="MuiButton-label">
                            <Grid container spacing={0}>
                                <Grid item xs className={classes.menuItemLabel}>
                                    {ppLocale.items.eSpaceOrcid.label}
                                </Grid>
                                <Grid item xs="auto" className={classes.anchorBadge}>
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
                        </span>
                    </a>
                </Tooltip>
            </Grid>
        );
    };
    const EspaceNTROs = () => {
        const getElementIdentifier = tag => `pp-espace-ntro${tag ? '-' + tag : /* istanbul ignore next */ ''}`;
        return (
            <Grid item xs={12} className={classes.menuItemAnchor}>
                <Tooltip
                    id={getElementIdentifier('tooltip')}
                    data-testid={getElementIdentifier('tooltip')}
                    data-analyticsid={getElementIdentifier('tooltip')}
                    title={ppLocale.items.eSpaceNTRO.tooltip}
                    placement="left"
                    TransitionProps={{ timeout: 300 }}
                >
                    <a
                        className={classes.menuItemRootAnchor}
                        href={ppLocale.items.eSpaceNTRO.url}
                        id={getElementIdentifier('menu-button')}
                        data-testid={getElementIdentifier('menu-button')}
                    >
                        <span className="MuiButton-label">
                            <Grid container spacing={0}>
                                <Grid item xs className={classes.menuItemLabel}>
                                    {incompleteNTRORecords &&
                                        incompleteNTRORecords.total &&
                                        ppLocale.items.eSpaceNTRO.label.replace('[total]', incompleteNTRORecords.total)}
                                </Grid>
                                <Grid item xs="auto" className={classes.anchorBadge}>
                                    <div className={classes.itemButton}>
                                        <Badge
                                            badgeContent={incompleteNTRORecords && incompleteNTRORecords.total}
                                            color="primary"
                                            classes={{ badge: classes.ppBadgeWarning }}
                                        >
                                            <PostAddIcon className={classes.icon} />
                                        </Badge>
                                    </div>
                                </Grid>
                            </Grid>
                        </span>
                    </a>
                </Tooltip>
            </Grid>
        );
    };

    return (
        <Fade in={!!account}>
            <div
                className={`${classes.flexWrapper} ${!!isNextToSpotlights && classes.isNextToSpotlights}`}
                id="personalised-panel"
                data-testid="personalised-panel"
            >
                <div className={classes.flexHeader}>
                    <Typography variant={'h5'} component={'h2'} className={classes.greeting}>
                        {greeting()} {account.firstName || /* istanbul ignore next */ ''}
                    </Typography>
                    <Grid container spacing={1} style={{ marginLeft: 16, marginTop: 6 }}>
                        {account && account.id && (
                            <Grid item xs={12} lg="auto">
                                <Tooltip
                                    id={topLevelTagId('tooltip')}
                                    data-testid={topLevelTagId('tooltip')}
                                    title={ppLocale.username.replace(
                                        '[id]',
                                        account.id || /* istanbul ignore next */ ppLocale.unavailable,
                                    )}
                                    placement="left"
                                    TransitionProps={{ timeout: 300 }}
                                >
                                    <Typography component={'span'} style={{ fontSize: 14, color: '#595959' }}>
                                        <AccountBoxIcon className={classes.uqidIcon} fontSize={'small'} />
                                        {(account && account.id) || /* istanbul ignore next */ ''}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                        )}
                        <Grid item xs={12} lg className={classes.locationWrapper}>
                            <Location account={account} />
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.flexContent} />
                <div className={classes.flexFooter}>
                    <Grid container spacing={0} style={{ marginLeft: 16 }}>
                        <Collapse
                            style={{ width: '100%' }}
                            in={!!(canSeePrintBalance(account) && !!printBalance && printBalance.balance)}
                        >
                            <PaperCut />
                        </Collapse>
                        <Collapse style={{ width: '100%' }} in={!!(canSeeLoans(account) && !!loans)}>
                            <Loans />
                        </Collapse>
                        <Collapse
                            style={{ width: '100%' }}
                            in={!!(canSeeLoans(account) && !!loans && loans.total_fines_count > 0)}
                        >
                            <Fines />
                        </Collapse>
                        <Collapse
                            style={{ width: '100%' }}
                            in={!!(isEspaceAuthor(account, author) && !!possibleRecords)}
                        >
                            <EspacePossible />
                        </Collapse>
                        <Collapse
                            style={{ width: '100%' }}
                            in={!!(isEspaceAuthor(account, author) && !author.aut_orcid_id)}
                        >
                            <EspaceOrcid />
                        </Collapse>
                        <Collapse
                            style={{ width: '100%' }}
                            in={
                                !!(
                                    isEspaceAuthor(account, author) &&
                                    !!incompleteNTRORecords &&
                                    !!incompleteNTRORecords.total
                                )
                            }
                        >
                            <EspaceNTROs />
                        </Collapse>
                    </Grid>
                </div>
            </div>
        </Fade>
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
