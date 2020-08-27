import React from 'react';
import PropTypes from 'prop-types';
// MUI 1
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

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
        mainMenu: {
            outline: 'none',
            paddingTop: 0,
            [theme.breakpoints.up('lg')]: {
                display: 'flex',
                flexGrow: 1,
            },
            [theme.breakpoints.down('md')]: {
                overflowY: 'auto',
                maxWidth: '20rem',
                backgroundColor: 'white',
                // position: 'absolute',
                // position: 'fixed',
                // opacity: 1,
                // zIndex: 1000,
            },
        },
        ListItemTextPrimary: {
            ...theme.typography.body2,
            whiteSpace: 'nowrap',
            fontWeight: theme.typography.fontWeightMedium,
        },
        ListItemTextSecondary: {
            ...theme.typography.caption,
        },
        // mainMenuFooter: {
        //     paddingLeft: '12px',
        //     paddingBottom: '12px',
        //     fontSize: theme.typography.caption.fontSize,
        //     color: theme.palette.secondary.main,
        // },
        iconButton: {
            color: theme.palette.white.main,
        },
        menuDropdown: {
            // new
            backgroundColor: '#f2f2f2',
            zIndex: 1000,
            position: 'absolute',
            // },
            [theme.breakpoints.down('md')]: {
                width: '100%',
            },
        },
        shiftLeft: {
            marginLeft: '-12rem',
        },
        submenus: {
            [theme.breakpoints.up('lg')]: {
                flexDirection: 'row',
            },
        },
        menuGroups: {
            [theme.breakpoints.up('lg')]: {
                display: 'flex',
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
            },
        },
    };
};

export function Megamenu(props) {
    // an array so we can control each submenu separately
    const { classes, docked, isMobile, menuOpen, menuItems, toggleMenu } = props;
    const initialSubMenus = [];
    menuItems.forEach(item => (initialSubMenus[item.id] = false));
    const [isSubMenuOpen, setSubMenuOpen] = React.useState(initialSubMenus);

    const setParticularSubMenuOpen = (changingId, newOpen) => {
        // array allows us to update one element of the open/closed array, to match one menuitem change
        const newValue = [];
        Object.keys(isSubMenuOpen).forEach(key => {
            newValue[key] = key === changingId ? newOpen : initialSubMenus[key];
        });
        setSubMenuOpen(newValue);
    };

    const focusOnElementId = elementId => {
        if (document.getElementById(elementId)) {
            document.getElementById(elementId).focus();
        }
    };

    const navigateToLink = (url, target = '_top') => {
        if (!!url) {
            if (url.indexOf('http') === -1) {
                // internal link
                props.history.push(url);
            } else {
                // external link
                window.open(url, target);
            }
        }

        // if (!props.docked) {
        //     toggleMenu();
        // }
    };

    function clickMenuItem(menuItem) {
        return !!menuItem.submenuItems && menuItem.submenuItems.length > 0
            ? setParticularSubMenuOpen(menuItem.id, !isSubMenuOpen[menuItem.id])
            : navigateToLink(menuItem.linkTo, menuItem.target);
    }

    const renderMenuChildren = (menuItem, index, classes) => {
        const menuGroups = [];
        menuItem.submenuItems
            // .sort((a, b) => (a.column || null) - (b.column || null))
            .map(submenuItem => {
                const index = submenuItem.column || 1;
                if (!menuGroups[index]) {
                    menuGroups[index] = [];
                }
                menuGroups[index].push(submenuItem);
            });

        return (
            <Collapse
                in={isSubMenuOpen[menuItem.id]}
                timeout="auto"
                unmountOnExit
                className={classNames(!!menuItem.shiftLeft ? classes.shiftLeft : '', classes.menuDropdown)}
            >
                <div className={classes.menuGroups}>
                    {menuGroups.length > 0 &&
                        menuGroups.map((menuGroup, index1) => {
                            return (
                                <List
                                    component="div"
                                    disablePadding
                                    key={`menu-group-${index1}`}
                                    id={`menu-group-${index1}`}
                                    className={classes.verticalMenuList}
                                >
                                    {!!menuGroup &&
                                        menuGroup.length > 0 &&
                                        menuGroup.map((submenuItem, index2) => {
                                            return (
                                                <ListItem
                                                    button
                                                    key={`menu-group-${index1}-item-${index2}`}
                                                    id={`menu-group-${index1}-item-${index2}`}
                                                    onClick={() =>
                                                        navigateToLink(submenuItem.linkTo, submenuItem.target)
                                                    }
                                                    className={classes.menuItem}
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
                        })}
                </div>
            </Collapse>
        );
    };

    const renderMenuItems = items =>
        items.map((menuItem, index) => {
            const hasChildren = !!menuItem.submenuItems && menuItem.submenuItems.length > 0;
            return menuItem.divider ? (
                <Divider key={`menu_item_${index}`} />
            ) : (
                <span className="menu-item-container" key={`menucontainer-item-${index}`}>
                    <ListItem
                        className={classes.submenus}
                        button
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
                        {hasChildren && isSubMenuOpen[menuItem.id] && <ExpandLess />}
                        {hasChildren && !isSubMenuOpen[menuItem.id] && <ExpandMore />}
                    </ListItem>
                    {hasChildren && renderMenuChildren(menuItem, index, classes)}
                </span>
            );
        });

    if (menuOpen && !docked) {
        // set focus on menu on mobile view if menu is opened
        setTimeout(focusOnElementId.bind(this, 'mainMenu'), 0);
    }

    if (!menuOpen && isMobile) {
        return <div className="empty" />;
    }

    return (
        <div className="layout-card">
            <List component="nav" id="mainMenu" className={classes.mainMenu} tabIndex={-1}>
                {renderMenuItems(menuItems)}
                {isMobile && (
                    <ListItem
                        className={classes.submenus}
                        button
                        key={'submenus-item-close'}
                        id={'submenus-item-close'}
                        onClick={() => toggleMenu()}
                    >
                        <ListItemText
                            classes={{
                                primary: classes.ListItemTextPrimary,
                            }}
                            primary="Close"
                        />
                    </ListItem>
                )}
            </List>
            <div id="afterMegamenu" tabIndex={-1} />
        </div>
    );
}

Megamenu.propTypes = {
    menuItems: PropTypes.array.isRequired,
    logoImage: PropTypes.string,
    logoText: PropTypes.string,
    logoLink: PropTypes.string,
    menuOpen: PropTypes.bool,
    docked: PropTypes.bool,
    toggleMenu: PropTypes.func,
    history: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    locale: PropTypes.shape({
        skipNavTitle: PropTypes.string,
        skipNavAriaLabel: PropTypes.string,
        closeMenuLabel: PropTypes.string,
    }),
    classes: PropTypes.object,
};

export function isSame(prevProps, nextProps) {
    return (
        nextProps.logoImage === prevProps.logoImage &&
        nextProps.logoText === prevProps.logoText &&
        nextProps.menuOpen === prevProps.menuOpen &&
        JSON.stringify(nextProps.locale) === JSON.stringify(prevProps.locale) &&
        JSON.stringify(nextProps.menuItems) === JSON.stringify(prevProps.menuItems) &&
        nextProps.docked === prevProps.docked
    );
}

export default React.memo(withStyles(styles, { withTheme: true })(Megamenu), isSame);
