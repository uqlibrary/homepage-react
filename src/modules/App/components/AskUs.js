import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { askUsLocale } from './AskUs.locale';

const useStyles = makeStyles(
    theme => ({
        headerIconButtonLabel: {
            display: 'flex',
            flexDirection: 'column',
        },
        headerIconButton: {
            color: `${theme.palette.primary.main} !important`,
        },
        headerButtonTitle: {
            color: `${theme.palette.primary.main} !important`,
            fontSize: 12,
        },
        menuItem: {
            width: '50%',
            display: 'inline-block',
        },
        hours: {
            fontSize: 12,
        },
        lastLink: {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        menuPaper: {
            width: 350,
        },
    }),
    { withTheme: true },
);

export const AskUs = ({ chatStatus, libHours, libHoursLoading }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = event => {
        console.log(event.currentTarget);
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
        if (!!hours && !!hours.locations && hours.locations.length > 1 && !libHoursLoading) {
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
                id="askus-button"
                data-testid="askus-button"
                onClick={handleClick}
                classes={{ label: classes.headerIconButtonLabel, root: classes.headerIconButton }}
            >
                <QuestionAnswer className={classes.icon} />
                <div className={classes.headerButtonTitle}>{askUsLocale.askUs.title}</div>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    id: 'askus-menulist',
                    'data-testid': 'askus-menulist',
                }}
                PaperProps={{
                    id: 'askus-paper',
                    'data-testid': 'askus-paper',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                id="askus-menu"
                data-testid="askus-menu"
                className={classes.menu}
                classes={{ paper: classes.menuPaper }}
            >
                {askUsLocale.askUs.links.map((item, index) => (
                    <MenuItem
                        className={classes.menuItem}
                        id={`askus-menuitem-${item.title}`}
                        data-testid={`askus-menuitem-${item.title}`}
                        onClick={handleLink(item.url)}
                        disabled={item.title === 'Chat' && !chatStatus}
                        key={index}
                    >
                        {item.icon}
                        {item.title}
                        {item.title === 'Chat' && !!askUsHours ? (
                            <span className={classes.hours}>&nbsp;&nbsp;{askUsHours.chat}</span>
                        ) : (
                            ''
                        )}
                        {item.title === 'Phone' && !!askUsHours ? (
                            <span className={classes.hours}>&nbsp;&nbsp;{askUsHours.phone}</span>
                        ) : (
                            ''
                        )}
                    </MenuItem>
                ))}
                <MenuItem
                    onClick={handleLink(askUsLocale.askUs.lastLink.url)}
                    id={`askus-menuitem-${askUsLocale.askUs.lastLink.title}`}
                    data-testid={`askus-menuitem-${askUsLocale.askUs.lastLink.title}`}
                >
                    <span className={classes.lastLink}>{askUsLocale.askUs.lastLink.title}</span>
                </MenuItem>
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
