import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import { AuthButton } from 'modules/SharedComponents/Toolbox/AuthButton';
import SearchIcon from '@material-ui/icons/Search';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import CloseIcon from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Radio from '@material-ui/core/Radio';
const logo = require('../../../../public/images/uq-lockup-landscape--reversed.svg');
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import MailIcon from '@material-ui/icons/Mail';
import ChatIcon from '@material-ui/icons/Chat';
import PhoneIcon from '@material-ui/icons/Phone';
import DescriptionIcon from '@material-ui/icons/Description';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { APP_URL, AUTH_URL_LOGIN, AUTH_URL_LOGOUT } from 'config';

const useStyles = makeStyles(
    theme => ({
        gradient: {
            backgroundImage: 'linear-gradient(90deg,#51247a,87%,#962a8b)',
        },
        topHeader: {
            height: 90,
            maxWidth: 1224,
            marginLeft: 'auto',
            marginRight: 'auto',
            overflow: 'hidden !important',
            transition: 'all 0.3s ease-in-out',
            padding: 24,
        },
        bottomHeaderShow: {
            height: 120,
            maxWidth: 1200,
            marginLeft: 'auto',
            marginRight: 'auto',
            overflow: 'hidden !important',
            transition: 'all 0.3s ease-in-out',
            paddingTop: 12,
            paddingRight: 24,
            paddingBottom: 24,
            paddingLeft: 48,
        },
        bottomHeaderHide: {
            height: 0,
            maxWidth: 1200,
            marginLeft: 'auto',
            marginRight: 'auto',
            overflow: 'hidden !important',
            transition: 'all 0.3s ease-in-out',
            paddingTop: 0,
            paddingRight: 24,
            paddingBottom: 0,
            paddingLeft: 48,
        },
        logo: {
            backgroundImage: 'url(' + logo + ')',
            backgroundSize: 'cover',
            height: 42,
            width: 286,
        },
        icon: {
            color: theme.palette.white.main,
        },
        links: {
            height: 48,
            lineHeight: '48px',
            marginRight: 24,
            color: theme.palette.white.main + '!important',
        },
        link: {
            fontSize: '14px',
            color: theme.palette.white.main + '!important',
            '&:link, :hover, :active, :visted': {
                color: theme.palette.white.main + '!important',
            },
        },
        searchTagline: {
            fontFamily: 'Merriweather, Georgia, serif !important',
            fontSize: 20,
            fontStyle: 'italic',
            color: theme.palette.white.main,
        },
        searchInputBox: {
            paddingTop: 4,
            paddingBottom: 3,
            paddingLeft: 12,
            paddingRight: 12,
            marginTop: 12,
            marginRight: 12,
            backgroundColor: theme.palette.white.main,
            '&:focus': {
                border: '1px solid red',
            },
        },
        searchTypes: {
            fontSize: 13,
            color: theme.palette.white.main,
            marginBottom: -4,
        },
        radioIcon: {
            root: {
                color: 'red',
                '&$checked': {
                    color: 'green',
                },
            },
            checked: {
                color: 'red',
            },
        },
    }),
    { withTheme: true },
);

export const Header = ({ isAuthorizedUser, account }) => {
    const classes = useStyles();
    const [expandHeader, setExpandHeader] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [searchType, setSearchType] = useState('1');
    const toggleHeader = () => {
        setExpandHeader(!expandHeader);
    };

    const handleSearchTypeChange = event => {
        setSearchType(event.target.value);
    };

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const UQRadio = withStyles({
        root: {
            color: 'white',
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 4,
            paddingLeft: 0,
            '&$checked': {
                color: 'white',
            },
        },
        checked: {},
    })(props => <Radio color="default" {...props} />);
    const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };

    return (
        <Grid container className={classes.gradient}>
            <Grid item xs={12} className={classes.topHeader}>
                <Grid container alignItems={'center'}>
                    <Grid item xs={'auto'}>
                        <a href="#">
                            <div className={classes.logo} />
                        </a>
                    </Grid>
                    <Grid item xs />
                    {/* LINKS*/}
                    <Grid item xs={'auto'} className={classes.links}>
                        <a href="#" className={classes.link}>
                            Contacts
                        </a>
                    </Grid>
                    <Grid item xs={'auto'} className={classes.links}>
                        <a href="#" className={classes.link}>
                            Study
                        </a>
                    </Grid>
                    <Grid item xs={'auto'} className={classes.links}>
                        <a href="#" className={classes.link}>
                            Maps
                        </a>
                    </Grid>
                    <Grid item xs={'auto'} className={classes.links}>
                        <a href="#" className={classes.link}>
                            News
                        </a>
                    </Grid>
                    <Grid item xs={'auto'} className={classes.links}>
                        <a href="#" className={classes.link}>
                            Events
                        </a>
                    </Grid>
                    <Grid item xs={'auto'} className={classes.links}>
                        <a href="#" className={classes.link}>
                            Give now
                        </a>
                    </Grid>
                    <Grid item xs={'auto'} className={classes.links}>
                        <a href="#" className={classes.link}>
                            my.UQ
                        </a>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Tooltip
                            id="auth-button"
                            title={'Search UQ'}
                            placement="bottom-start"
                            TransitionProps={{ timeout: 300 }}
                        >
                            <IconButton onClick={toggleHeader}>
                                {!expandHeader ? (
                                    <SearchIcon className={classes.icon} />
                                ) : (
                                    <CloseIcon className={classes.icon} />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Tooltip
                            id="auth-button"
                            title={'Ask us'}
                            placement="bottom-start"
                            TransitionProps={{ timeout: 300 }}
                        >
                            <IconButton onClick={handleClick}>
                                <QuestionAnswer className={classes.icon} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <Grid container spacing={0} style={{ width: 320 }}>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <ImportContactsIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        FAQ
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <ChatIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Chat
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <MailIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Email us
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <PhoneIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Phone us
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <DescriptionIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Contact form
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={6}>
                                    <MenuItem onClick={handleClose}>
                                        <SupervisorAccountIcon color={'secondary'} style={{ marginRight: 6 }} />
                                        Exam support
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={12}>
                                    <MenuItem onClick={handleClose}>
                                        <span style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            More ways to contact us
                                        </span>
                                    </MenuItem>
                                </Grid>
                            </Grid>
                        </Menu>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <AuthButton
                            isAuthorizedUser={isAuthorizedUser}
                            signInTooltipText={'Login to UQ'}
                            signOutTooltipText={`${(account && account.firstName) || ''} ${(account &&
                                account &&
                                account.lastName) ||
                                ''} - Log out of UQ`}
                            onClick={redirectUserToLogin(isAuthorizedUser, true)}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={expandHeader ? classes.bottomHeaderShow : classes.bottomHeaderHide}>
                <Grid container spacing={2} alignItems={'flex-end'}>
                    <Grid item xs={'auto'} className={classes.searchTagline}>
                        What are you looking for?
                    </Grid>
                    <Grid item xs>
                        <Grid container spacing={2}>
                            <Grid item xs={'auto'} className={classes.searchTypes}>
                                <UQRadio onChange={handleSearchTypeChange} value={'1'} checked={searchType === '1'} />
                                Search all UQ websites
                            </Grid>
                            <Grid item xs={'auto'} className={classes.searchTypes}>
                                <UQRadio onChange={handleSearchTypeChange} value={'2'} checked={searchType === '2'} />
                                Search this site (library.uq.edu.au)
                            </Grid>
                            <Grid item xs />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container className={classes.searchInputBox} alignItems={'center'}>
                    <Grid item xs>
                        <Input fullWidth disableUnderline placeholder={'Enter your search terms'} />
                    </Grid>
                    <Grid item xs={'auto'}>
                        <IconButton size={'small'}>
                            <SearchIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

Header.propTypes = {
    account: PropTypes.object,
    isAuthorizedUser: PropTypes.bool,
    isAdmin: PropTypes.bool,
    headerExpand: PropTypes.bool,
};

Header.defaultProps = {
    account: {},
    isAdmin: false,
    isAuthorizedUser: false,
    headerExpand: false,
};

export default Header;
