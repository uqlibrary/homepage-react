import React from 'react';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import { AuthButton } from 'modules/SharedComponents/Toolbox/AuthButton';
import SearchIcon from '@material-ui/icons/Search';
const logo = require('../../../../public/images/uq-lockup-landscape--reversed.svg');
const useStyles = makeStyles(
    theme => ({
        gradient: {
            backgroundImage: 'linear-gradient(90deg,#51247a,87%,#962a8b)',
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
    }),
    { withTheme: true },
);

export const Header = ({ isAuthorizedUser }) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.gradient}>
            <Grid item xs={12} style={{ height: 90 }}>
                <Grid
                    container
                    alignItems={'center'}
                    style={{ paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 44 }}
                >
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
                            Library
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
                        <IconButton>
                            <SearchIcon className={classes.icon} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <AuthButton
                            isAuthorizedUser={isAuthorizedUser}
                            signInTooltipText={'login'}
                            signOutTooltipText={'logout'}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ height: 0, overflow: 'hidden' }}>
                test
            </Grid>
        </Grid>
    );
};

Header.propTypes = {
    isAuthorizedUser: PropTypes.bool,
};

Header.defaultProps = {
    isAuthorizedUser: false,
};

export default Header;
