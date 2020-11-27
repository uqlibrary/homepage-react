import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { locale } from './locale';

const useStyles = makeStyles(
    theme => ({
        headerIconButtonLabel: {
            display: 'flex',
            flexDirection: 'column',
        },
        headerIconButton: {
            color: theme.palette.primary.main,
        },
        headerButtonTitle: {
            color: theme.palette.primary.main,
            fontSize: 12,
        },
        menu: {
            maxWidth: 350,
        },
        hours: {
            fontSize: 12,
        },
    }),
    { withTheme: true },
);

export const AskUs = ({ chatStatus, libHours, libHoursLoading }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLink = link => () => {
        if (link.includes('chat')) {
            window.open(link, 'chat', 'toolbar=no, location=no, status=no, width=400, height=400');
        } else {
            location.href = link;
        }
        setAnchorEl(null);
    };
    const cleanHours = hours => {
        let askusHours = null;
        if (!!hours && hours.locations.length > 1 && !libHoursLoading) {
            askusHours = hours.locations.map(item => {
                if (item.abbr === 'AskUs') {
                    return {
                        chat: item.departments[0].rendered,
                        phone: item.departments[1].rendered,
                    };
                }
                return null;
            });
        }
        return askusHours ? askusHours.filter(item => item !== null)[0] : null;
    };
    const askUsHours = cleanHours(libHours);
    return (
        <React.Fragment>
            <IconButton
                id="AskUs-button"
                data-testid="AskUs-button"
                onClick={handleClick}
                classes={{ label: classes.headerIconButtonLabel, root: classes.headerIconButton }}
            >
                <QuestionAnswer className={classes.icon} />
                <div className={classes.headerButtonTitle}>{locale.askUs.title}</div>
            </IconButton>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <Grid container spacing={0} className={classes.menu}>
                    {locale.askUs.links.map((item, index) => (
                        <Grid item xs={6} key={index}>
                            <MenuItem
                                id={`AskUs-menuitem-${item.title}`}
                                data-testid={`AskUs-menuitem-${item.title}`}
                                onClick={handleLink(item.url)}
                                disabled={item.title === 'Chat' && !chatStatus}
                            >
                                {item.icon}
                                {item.title}
                                {item.title === 'Chat' && !!askUsHours ? (
                                    <div className={classes.hours}>&nbsp;&nbsp;{askUsHours.chat}</div>
                                ) : (
                                    ''
                                )}
                                {item.title === 'Phone' && !!askUsHours ? (
                                    <div className={classes.hours}>&nbsp;&nbsp;{askUsHours.phone}</div>
                                ) : (
                                    ''
                                )}
                            </MenuItem>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <MenuItem
                            onClick={handleLink(locale.askUs.lastLink.url)}
                            id={`AskUs-menuitem-${locale.askUs.lastLink.title}`}
                            data-testid={`AskUs-menuitem-${locale.askUs.lastLink.title}`}
                        >
                            <span style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                {locale.askUs.lastLink.title}
                            </span>
                        </MenuItem>
                    </Grid>
                </Grid>
            </Menu>
        </React.Fragment>
    );
};

AskUs.propTypes = {
    chatStatus: PropTypes.bool,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
};

AskUs.defaultProps = {};

export default AskUs;
