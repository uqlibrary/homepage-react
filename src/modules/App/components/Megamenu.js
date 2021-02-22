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
        megamenublock: {
            backgroundColor: theme.palette.white.main,
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
                paddingLeft: 0,
                '& > span > div': {
                    paddingRight: 6,
                    paddingLeft: 0,
                },
                '& > span > div > div': {
                    paddingLeft: 6,
                },
                // remove the flash to grey when we mouse over a top menu
                '& span > div[role="button"]:hover': {
                    backgroundColor: 'initial',
                },
                '& > div > div': {
                    paddingLeft: 8,
                    paddingRight: 8,
                },
                // first menu item should be lined up with Library title
                '& > div:first-child > div': {
                    paddingLeft: 0,
                },
            },
        },
        submenuheader: {
            '& hover': {
                backgroundColor: 'rgba(0, 0, 0, 0)',
            },
        },
        menuItem: {
            '&:hover': {
                textDecoration: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '& a': {
                color: '#000',
                display: 'block',
            },
            [theme.breakpoints.down('md')]: {
                paddingBottom: 5,
            },
            [theme.breakpoints.up('lg')]: {
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: 16,
                letterSpacing: '0.15008px',
                lineHeight: '24px',
                paddingTop: 0,
                paddingBottom: 3,
                '& a': {
                    minHeight: 45,
                    '&:focus': {
                        textDecoration: 'none',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        outlineColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '&:hover': {
                        textDecoration: 'none',
                    },
                },
            },
        },
        ListItemTextPrimary: {
            display: 'block',
            whiteSpace: 'nowrap',
            fontWeight: 400,
            paddingLeft: 16,
            marginTop: 0,
            [theme.breakpoints.down('md')]: {
                borderBottom: '1px solid #e2e2e2',
                padding: '0.7rem 1.5rem 0.7rem 2.5rem',
            },
        },
        ListItemTextSecondary: {
            display: 'block',
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 0,
            ...theme.typography.caption,
        },
        menuDropdown: {
            backgroundColor: theme.palette.secondary.light,
            [theme.breakpoints.up('lg')]: {
                // apply this to mobile as well and the submenu goes over the other menu headers
                zIndex: 1000,
                position: 'absolute',
            },
        },
        shiftLeft: {
            marginLeft: '-20rem',
        },
        submenus: {
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
                borderLeft: '1px solid #ccc',
            },
            '& div:first-child': {
                borderLeft: 'none',
            },
        },
        currentPage: {
            borderBottom: '2px solid #51247a',
        },
        menuItemContainer: {
            [theme.breakpoints.up('lg')]: {
                paddingLeft: 12,
                marginLeft: -8,
                '& > div': {
                    paddingLeft: 6,
                    paddingRight: 6,
                    marginLeft: -6,
                },
                '& > div > div > span': {
                    paddingLeft: 0,
                },
                '& svg': {
                    paddingLeft: 6,
                },
            },
            [theme.breakpoints.down('md')]: {
                '& div': {
                    margin: 0,
                    padding: 0,
                },
                '& > div > div:first-child > span': {
                    // top level of menu under hamburger
                    border: '1px solid #e2e2e2',
                    padding: '1rem 1.5rem',
                },
                '& svg': {
                    border: '1px solid #e2e2e2',
                    padding: '1rem',
                },
            },
        },
        anchorHolder: {
            '& a': {
                color: '#000',
            },
            [theme.breakpoints.down('md')]: {
                // top level of menu under hamburger
                border: '1px solid #e2e2e2',
                '& span': {
                    padding: '1rem 1.5rem',
                },
            },
            [theme.breakpoints.up('lg')]: {
                transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                paddingTop: 8,
                paddingBottom: 8,
                '& a': {
                    '&:hover': {
                        textDecoration: 'none',
                    },
                },
                '& span': {
                    paddingLeft: '0 !important',
                },
                '&:hover': {
                    textDecoration: 'none',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            },
        },
    };
};

export function Megamenu(props) {
    const { classes, docked, menuOpen, menuItems, toggleMenu, history, isMobile, ...rest } = props;

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

        // scroll up when they change menus, otherwise we often end with the menu off screen :(
        if (isMobile) {
            const topHeight = document.getElementById('uqheader').offsetHeight;
            document.getElementById('content-container').scrollTop = topHeight;
        }
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

        /* istanbul ignore next */
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
        /* istanbul ignore next */
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

    function renderSingleColumn(index, classes, menuColumn, isLastColumn) {
        return (
            <List
                component="div"
                disablePadding
                key={`megamenu-group-${index}`}
                data-testid={`megamenu-group-${index}`}
                id={`megamenu-group-${index}`}
            >
                {!!menuColumn &&
                    menuColumn.length > 0 &&
                    menuColumn.map((submenuItem, index2) => {
                        const endItemClass = isLastColumn && index2 === menuColumn.length - 1 ? 'endmenuItem' : '';
                        return (
                            <div
                                data-testid={`megamenu-group-${index}-item-${index2}`}
                                key={`megamenu-group-${index}-item-${index2}`}
                                id={`megamenu-group-${index}-item-${index2}`}
                                className={classNames(classes.menuItem, `${endItemClass}`)}
                            >
                                <a href={submenuItem.linkTo || null} target={submenuItem.target || null}>
                                    <span className={classes.ListItemTextPrimary}>{submenuItem.primaryText}</span>
                                    {!isMobile && (
                                        <span className={classes.ListItemTextSecondary}>
                                            {submenuItem.secondaryText}
                                        </span>
                                    )}
                                </a>
                            </div>
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
        const iconSize = isMobile ? 'default' : 'small';
        return (
            <div className={classes.menuItemContainer} key={`menucontainer-item-${index}`} id={menuItem.id}>
                {!!menuItem.submenuItems && menuItem.submenuItems.length > 0 ? (
                    <React.Fragment>
                        <ListItem
                            button
                            className={classNames(
                                menuItem.linkTo === window.location.href ? classes.currentPage : '',
                                'submenuheader',
                            )}
                            data-testid={`megamenu-submenus-item-${index}`}
                            key={`megamenu-submenus-item-${index}`}
                            id={`megamenu-submenus-item-${index}`}
                            onClick={() => setParticularSubMenuOpen(menuItem.id, !isSubMenuOpen[menuItem.id])}
                        >
                            <ListItemText
                                classes={{
                                    primary: classes.ListItemTextPrimary,
                                    secondary: classes.ListItemTextSecondary,
                                }}
                                primary={menuItem.primaryText}
                                secondary={menuItem.secondaryText}
                            />
                            hasChildren && isSubMenuOpen[menuItem.id] && <ExpandLess size={iconSize} color="primary" />
                            hasChildren && !isSubMenuOpen[menuItem.id] && <ExpandMore size={iconSize} color="primary" />
                        </ListItem>
                        {hasChildren && renderSubMenu(menuItem, index, classes)}
                    </React.Fragment>
                ) : (
                    <div className={classes.anchorHolder}>
                        <a
                            className={classNames(
                                menuItem.linkTo === window.location.href ? classes.currentPage : '',
                                'submenuheader',
                            )}
                            data-testid={`megamenu-submenus-item-${index}`}
                            key={`megamenu-submenus-item-${index}`}
                            id={`megamenu-submenus-item-${index}`}
                            href={menuItem.linkTo || null}
                        >
                            <ListItemText
                                classes={{
                                    primary: classes.ListItemTextPrimary,
                                    secondary: classes.ListItemTextSecondary,
                                }}
                                primary={menuItem.primaryText}
                                secondary={menuItem.secondaryText}
                            />
                        </a>
                    </div>
                )}
            </div>
        );
    };

    if (menuOpen && !docked) {
        // set focus on menu on mobile view if menu is opened
        setTimeout(focusOnElementId.bind(this, 'mainMenu'), 0);
    }

    if (!menuOpen) {
        return <div data-testid="mega-menu-empty" className="megamenu empty" />;
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
        <div className={classes.megamenublock} data-testid="mega-menu" id={rest.id || 'megamenu'}>
            <List component="nav" data-testid="main-menu" id="mainMenu" className={classes.mainMenu} ref={menuRef}>
                {props.hasHomePageItem && renderHomePageItem()}
                {menuItems.map((menuItem, index) => {
                    return renderSingleMenu(menuItem, index);
                })}
                {props.hasCloseItem && renderCloseItem()}
            </List>
        </div>
    );
}

Megamenu.propTypes = {
    hasCloseItem: PropTypes.bool,
    hasHomePageItem: PropTypes.bool,
    logoLink: PropTypes.string,
    menuItems: PropTypes.array.isRequired,
    menuOpen: PropTypes.bool,
    isMobile: PropTypes.bool,
    docked: PropTypes.bool,
    toggleMenu: PropTypes.func,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object,
};

Megamenu.defaultProps = {
    hasCloseItem: false,
    hasHomePageItem: false,
    menuOpen: true,
    isMobile: false,
};

export function isSame(prevProps, nextProps) {
    return (
        nextProps.menuOpen === prevProps.menuOpen &&
        JSON.stringify(nextProps.menuItems) === JSON.stringify(prevProps.menuItems) &&
        nextProps.docked === prevProps.docked
    );
}

export default React.memo(withStyles(styles, { withTheme: true })(Megamenu), isSame);
