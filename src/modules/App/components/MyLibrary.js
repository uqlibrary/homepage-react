import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import AppsIcon from '@material-ui/icons/Apps';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { myLibraryLocale } from './MyLibrary.locale';

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
        menuItem: {
            width: '50%',
            display: 'inline-block',
            color: 'rbga(0,0,0,0.87)',
        },
        hours: {
            fontSize: 12,
            color: 'rbga(0,0,0,0.87)',
        },
        lastLink: {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        menuPaper: {
            width: 400,
        },
    }),
    { withTheme: true },
);

export const MyLibrary = ({ account, author, history }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLink = link => () => {
        if (link.includes('http')) {
            window.location.href = link;
        } else {
            history.push(link);
        }
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <IconButton
                id="mylibrary-button"
                data-testid="mylibrary-button"
                onClick={handleClick}
                classes={{ label: classes.headerIconButtonLabel, root: classes.headerIconButton }}
            >
                <AppsIcon className={classes.icon} />
                <div className={classes.headerButtonTitle}>{myLibraryLocale.title}</div>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    id: 'mylibrary-menulist',
                    'data-testid': 'mylibrary-menulist',
                }}
                PaperProps={{
                    id: 'mylibrary-paper',
                    'data-testid': 'mylibrary-paper',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                id="mylibrary-menu"
                data-testid="mylibrary-menu"
                className={classes.menu}
                classes={{ paper: classes.menuPaper }}
            >
                {myLibraryLocale.items.map((item, index) => {
                    const conditionFunc = item.condition;
                    if (conditionFunc(account, author)) {
                        return (
                            <MenuItem
                                className={classes.menuItem}
                                id={`mylibrary-menuitem-${index}`}
                                data-testid={`mylibrary-menuitem-${item.dataTestid}`}
                                onClick={handleLink(item.link)}
                                key={index}
                                aria-label={item.ariaLabel}
                            >
                                {item.icon}
                                {item.label}
                            </MenuItem>
                        );
                    } else {
                        return null;
                    }
                })}
            </Menu>
        </React.Fragment>
    );
};

MyLibrary.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    history: PropTypes.object,
};

MyLibrary.defaultProps = {};

export default MyLibrary;
