import React, { createRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { default as menuLocale } from 'locale/menu';
import classNames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => {
    return {
        paper: {
            width: 260,
        },
        docked: {
            '& $paper': {
                '-webkit-box-shadow': '5px 0 5px -2px rgba(0,0,0,0.15)',
                'box-shadow': '5px 0 5px -2px rgba(0,0,0,0.15)',
            },
        },
        paperAnchorDockedLeft: {
            border: 'none',
        },
        header: {
            backgroundColor: theme.palette.primary.main,
            height: '70px',
            boxShadow:
                '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), ' +
                '0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
            textAlign: 'center',
            '& img': {
                maxHeight: '45px',
            },
        },
        skipNav: {
            width: '100%',
            height: '90%',
            position: 'absolute',
            zIndex: 998,
            left: '-2000px',
            outline: 'none',
            background:
                'linear-gradient(to bottom, rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.75) 78%,' +
                'rgba(255,255,255,0) 100%)',
            filter:
                'progid:DXImageTransform.Microsoft.gradient( startColorstr="#bfffffff", ' +
                'endColorstr="#00ffffff",GradientType=0 )',
            '&:focus': {
                left: 0,
            },
            '& .skipNavButton': {
                position: 'absolute',
                top: '25%',
                left: 'calc(50% - 90px)',
                textAlign: 'center',
                width: '160px',
                whiteSpace: 'normal',
                overflow: 'visible',
                zIndex: 999,
            },
        },
        megamenu: {
            backgroundColor: theme.palette.white.main,
            margin: 0,
            maxWidth: 'initial',
            padding: 0,
            width: '100%',
        },
        mainMenu: {
            outline: 'none',
            paddingTop: 0,
            [theme.breakpoints.up('lg')]: {
                display: 'flex',
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 32,
                '& > span > div': {
                    paddingRight: 12,
                    paddingLeft: 0,
                },
                '& > span > div > div': {
                    paddingLeft: 6,
                },
                // remove the flash to grey when we mouse over a top menu
                '& span > div[role="button"]:hover': {
                    backgroundColor: 'initial',
                },
            },
            [theme.breakpoints.down('md')]: {
                backgroundColor: theme.palette.white.main,
                height: 'auto',
                overflowY: 'auto',
                paddingLeft: '1rem',
                position: 'absolute',
                width: '100%',
                zIndex: 1000,
            },
        },
        ListItemTextPrimary: {
            whiteSpace: 'nowrap',
            fontWeight: 400,
        },
        ListItemTextSecondary: {
            ...theme.typography.caption,
        },
        iconButton: {
            color: theme.palette.white.main,
        },
        menuDropdown: {
            backgroundColor: theme.palette.secondary.light,
            zIndex: 1000,
            position: 'absolute',
            [theme.breakpoints.down('md')]: {
                width: '96%',
            },
        },
        shiftLeft: {
            marginLeft: '-20rem',
        },
        submenus: {
            paddingBottom: '8px',
            paddingTop: '10px',
            [theme.breakpoints.up('lg')]: {
                flexDirection: 'row',
            },
        },
        menuColumns: {
            [theme.breakpoints.up('lg')]: {
                display: 'flex',
            },
            '& > div': {
                marginTop: '6px',
                borderLeft: 'thin solid #ccc',
            },
            '& div:first-child': {
                borderLeft: 'none',
            },
        },
        verticalMenuList: {
            [theme.breakpoints.up('lg')]: {
                display: 'flex',
                flexDirection: 'column',
            },
        },
        menuItem: {
            [theme.breakpoints.up('lg')]: {
                alignItems: 'flex-start',
                paddingTop: 0,
            },
            paddingBottom: 0,
            minHeight: '51px',
            verticalAlign: 'top',
            [theme.breakpoints.down('lg')]: {
                paddingLeft: '2rem',
                paddingTop: '0',
            },
        },
    };
};

export function Megamenu(props) {
    const { classes, docked, menuOpen, menuItems, toggleMenu, history, ...rest } = props;

    // from https://usehooks.com/useOnClickOutside/
    function useOnClickOutside(ref, handler) {
        useEffect(
            () => {
                const listener = event => {
                    // Do nothing if clicking ref's element or descendent elements
                    if (!ref.current || ref.current.contains(event.target)) {
                        return;
                    }

                    handler(event);
                };

                document.addEventListener('mousedown', listener);
                document.addEventListener('touchstart', listener);

                return () => {
                    document.removeEventListener('mousedown', listener);
                    document.removeEventListener('touchstart', listener);
                };
            },
            // Add ref and handler to effect dependencies
            // It's worth noting that because passed in handler is a new ...
            // ... function on every render that will cause this effect ...
            // ... callback/cleanup to run every render. It's not a big deal ...
            // ... but to optimize you can wrap handler in useCallback before ...
            // ... passing it into this hook.
            [ref, handler],
        );
    }

    const menuRef = createRef();

    // an array so we can control each submenu separately
    const initialSubMenus = [];
    const defaultMenuPosition = false;
    menuItems.forEach(item => (initialSubMenus[item.id] = defaultMenuPosition));
    const [isSubMenuOpen, setSubMenuOpen] = React.useState(initialSubMenus);

    function setBackGroundColourOfMenuHeader(id, color) {
        document.getElementById(id).style.backgroundColor = color;
    }

    const setParticularSubMenuOpen = (changingId, newOpen) => {
        // using an array allows us to update one element of the open/closed array, to match one menuitem change
        const newValues = [];
        Object.keys(isSubMenuOpen).forEach(key => {
            newValues[key] = key === changingId ? newOpen : initialSubMenus[key];

            // set the menu label to match background colour
            setBackGroundColourOfMenuHeader(key, newOpen && key === changingId ? '#f2f2f2' : '#fff');
        });
        setSubMenuOpen(newValues);
    };

    const isAnyMenuOpen = () => {
        return !!Object.values(isSubMenuOpen).find(item => {
            return item === true;
        });
    };

    const closeAllSubMenus = () => {
        if (!isAnyMenuOpen()) {
            return false;
        }
        const newValues = [];
        Object.keys(isSubMenuOpen).forEach(key => {
            newValues[key] = defaultMenuPosition;
            // set the menu header back to default colour
            setBackGroundColourOfMenuHeader(key, '#fff');
        });
        setSubMenuOpen(newValues);
        return true;
    };

    useOnClickOutside(menuRef, () => closeAllSubMenus(false));

    // from https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it/46123962
    const catchKeyClick = event => {
        // close menu when escape key pressed
        const escapeKeyCode = 27;
        if (event.keyCode === escapeKeyCode) {
            closeAllSubMenus(false);
        }

        const tabKeyCode = 9;
        // if they tab out the end of a submenu, close the menu
        if (event.keyCode === tabKeyCode) {
            const focusedItem = document.activeElement;
            if (
                !!document.getElementById(focusedItem.id) &&
                !!document.getElementById(focusedItem.id).classList &&
                document.getElementById(focusedItem.id).classList.contains('endmenuItem')
            ) {
                closeAllSubMenus(false);
            }
        }

        // if they shift-tab back out of a menu, close the menu
        if (event.shiftKey && event.keyCode === tabKeyCode) {
            const focusedItem = document.activeElement;
            if (
                !!document.getElementById(focusedItem.id) &&
                !!document.getElementById(focusedItem.id).classList &&
                document.getElementById(focusedItem.id).classList.contains('submenuheader')
            ) {
                closeAllSubMenus(false);
            }
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', catchKeyClick, false);

        return () => {
            document.removeEventListener('keydown', catchKeyClick, false);
        };
    });

    const focusOnElementId = elementId => {
        if (document.getElementById(elementId)) {
            document.getElementById(elementId).focus();
        }
    };

    const navigateToLink = (url, target = null) => {
        const isInternaLink = url => url.indexOf('http') === -1;
        if (!!url) {
            if (isInternaLink(url)) {
                history.push(url);
            } else if (target !== null) {
                // external link
                window.open(url, target);
            } else {
                window.location.assign(url);
            }
        }
    };

    function clickMenuItem(menuItem) {
        return !!menuItem.submenuItems && menuItem.submenuItems.length > 0
            ? setParticularSubMenuOpen(menuItem.id, !isSubMenuOpen[menuItem.id])
            : navigateToLink(menuItem.linkTo, menuItem.target || null);
    }

    function renderSingleColumn(index, classes, menuColumn, isLastColumn) {
        return (
            <List
                component="div"
                disablePadding
                key={`menu-group-${index}`}
                data-testid={`menu-group-${index}`}
                id={`menu-group-${index}`}
                className={classes.verticalMenuList}
            >
                {!!menuColumn &&
                    menuColumn.length > 0 &&
                    menuColumn.map((submenuItem, index2) => {
                        const endItemClass = isLastColumn && index2 === menuColumn.length - 1 ? 'endmenuItem' : '';
                        return (
                            <ListItem
                                button
                                data-testid={`menu-group-${index}-item-${index2}`}
                                key={`menu-group-${index}-item-${index2}`}
                                id={`menu-group-${index}-item-${index2}`}
                                onClick={() => navigateToLink(submenuItem.linkTo, submenuItem.target || null)}
                                className={`classes.menuItem ${endItemClass}`}
                            >
                                <ListItemText
                                    classes={{
                                        primary: classes.ListItemTextPrimary,
                                        secondary: classes.ListItemTextSecondary,
                                    }}
                                    primary={submenuItem.primaryText}
                                    secondary={submenuItem.secondaryText}
                                />
                            </ListItem>
                        );
                    })}
            </List>
        );
    }

    const renderSubMenu = (menuItem, index, classes) => {
        const menuColumns = [];
        menuItem.submenuItems.map(submenuItem => {
            const index = submenuItem.column || 1;
            if (!menuColumns[index]) {
                menuColumns[index] = [];
            }
            menuColumns[index].push(submenuItem);
        });

        return (
            <Collapse
                in={isSubMenuOpen[menuItem.id]}
                timeout="auto"
                unmountOnExit
                className={classNames(!!menuItem.shiftLeft ? classes.shiftLeft : '', classes.menuDropdown)}
            >
                <div className={classes.menuColumns} data-testid={`submenu-${index}`}>
                    {menuColumns.length > 0 &&
                        menuColumns.map((menuColumn, index1) => {
                            return renderSingleColumn(index1, classes, menuColumn, index1 === menuColumns.length - 1);
                        })}
                </div>
            </Collapse>
        );
    };

    const renderSingleMenu = (menuItem, index) => {
        const hasChildren = !!menuItem.submenuItems && menuItem.submenuItems.length > 0;
        return (
            <span className="menu-item-container" key={`menucontainer-item-${index}`} id={menuItem.id}>
                <ListItem
                    button
                    className="submenuheader"
                    data-testid={`submenus-item-${index}`}
                    key={`submenus-item-${index}`}
                    id={`submenus-item-${index}`}
                    onClick={() => clickMenuItem(menuItem)}
                >
                    <ListItemText
                        classes={{
                            primary: classes.ListItemTextPrimary,
                            secondary: classes.ListItemTextSecondary,
                        }}
                        primary={menuItem.primaryText}
                        secondary={menuItem.secondaryText}
                    />
                    {hasChildren && isSubMenuOpen[menuItem.id] && <ExpandLess fontSize="small" color="disabled" />}
                    {hasChildren && !isSubMenuOpen[menuItem.id] && <ExpandMore fontSize="small" color="disabled" />}
                </ListItem>
                {hasChildren && renderSubMenu(menuItem, index, classes)}
            </span>
        );
    };

    if (menuOpen && !docked) {
        // set focus on menu on mobile view if menu is opened
        setTimeout(focusOnElementId.bind(this, 'mainMenu'), 0);
    }

    if (!menuOpen) {
        return <div className="megamenu empty" />;
    }

    const renderHomePageItem = () => {
        return (
            <ListItem
                button
                className={classes.submenus}
                data-testid={menuLocale.menuhome.dataTestid}
                key={menuLocale.menuhome.dataTestid}
                id={menuLocale.menuhome.dataTestid}
                onClick={() => navigateToLink(menuLocale.menuhome.linkTo || null)}
            >
                <ListItemText
                    classes={{
                        primary: classes.ListItemTextPrimary,
                    }}
                    primary={menuLocale.menuhome.primaryText}
                />
            </ListItem>
        );
    };

    function renderCloseItem() {
        return (
            <ListItem
                button
                className={classes.submenus}
                data-testid={menuLocale.responsiveClose.dataTestid}
                key={menuLocale.responsiveClose.dataTestid}
                id={menuLocale.responsiveClose.dataTestid}
                onClick={() => toggleMenu}
            >
                <ListItemText
                    classes={{
                        primary: classes.ListItemTextPrimary,
                    }}
                    primary={menuLocale.responsiveClose.primaryText}
                />
            </ListItem>
        );
    }

    return (
        <div className={classes.megamenu} id={rest.id || 'megamenu'}>
            <List component="nav" data-testid="main-menu" id="mainMenu" className={classes.mainMenu} ref={menuRef}>
                {props.hasHomePageItem && renderHomePageItem()}
                {menuItems.map((menuItem, index) => {
                    return renderSingleMenu(menuItem, index);
                })}
                {props.hasCloseItem && renderCloseItem()}
            </List>
            <div id="afterMegamenu" />
        </div>
    );
}

Megamenu.propTypes = {
    hasCloseItem: PropTypes.bool,
    hasHomePageItem: PropTypes.bool,
    logoLink: PropTypes.string,
    menuItems: PropTypes.array.isRequired,
    menuOpen: PropTypes.bool,
    docked: PropTypes.bool,
    toggleMenu: PropTypes.func,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object,
};

Megamenu.defaultProps = {
    hasCloseItem: false,
    hasHomePageItem: false,
    menuOpen: true,
};

export function isSame(prevProps, nextProps) {
    return (
        nextProps.menuOpen === prevProps.menuOpen &&
        JSON.stringify(nextProps.menuItems) === JSON.stringify(prevProps.menuItems) &&
        nextProps.docked === prevProps.docked
    );
}

export default React.memo(withStyles(styles, { withTheme: true })(Megamenu), isSame);
