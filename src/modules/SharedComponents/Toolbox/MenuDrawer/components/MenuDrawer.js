import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as menuLocale } from 'locale/menu';
// MUI 1
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
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
        mainMenu: {
            outline: 'none',
            flexGrow: 1,
            paddingTop: 0,
        },
        ListItemTextPrimary: {
            ...theme.typography.body2,
            whiteSpace: 'nowrap',
            fontWeight: theme.typography.fontWeightMedium,
        },
        ListItemTextSecondary: {
            ...theme.typography.caption,
        },
        mainMenuFooter: {
            paddingLeft: '12px',
            paddingBottom: '12px',
            fontSize: theme.typography.caption.fontSize,
            color: theme.palette.secondary.main,
        },
        iconButton: {
            color: theme.palette.white.main,
        },
    };
};

export function MenuDrawer(props) {
    // an array so we can control each submenu separately
    const initialSubMenus = [];
    props.menuItems.forEach(item => (initialSubMenus[item.id] = false));
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

    const skipMenuItems = () => {
        focusOnElementId('afterMenuDrawer');
    };

    const navigateToLink = (url, target = '_blank') => {
        if (!!url) {
            if (url.indexOf('http') === -1) {
                // internal link
                props.history.push(url);
            } else {
                // external link
                window.open(url, target);
            }
        }

        if (!props.docked) {
            props.onToggleDrawer();
        }
    };

    function clickMenuItem(menuItem) {
        return !!menuItem.submenuItems && menuItem.submenuItems.length > 0
            ? setParticularSubMenuOpen(menuItem.id, !isSubMenuOpen[menuItem.id])
            : navigateToLink(menuItem.linkTo, menuItem.target);
    }

    const renderMenuItems = items =>
        items.map((menuItem, index) => {
            const hasChildren = !!menuItem.submenuItems && menuItem.submenuItems.length > 0;
            return menuItem.divider ? (
                <Divider key={`menu_item_${index}`} />
            ) : (
                <span className="menu-item-container" key={`menu-item-${index}`}>
                    <ListItem button onClick={() => clickMenuItem(menuItem)} id={`menu-item-${index}`}>
                        <ListItemText
                            classes={{
                                primary: props.classes.ListItemTextPrimary,
                                secondary: props.classes.ListItemTextSecondary,
                            }}
                            primary={menuItem.primaryText}
                            secondary={menuItem.secondaryText}
                        />
                        {hasChildren && isSubMenuOpen[menuItem.id] && <ExpandLess />}
                        {hasChildren && !isSubMenuOpen[menuItem.id] && <ExpandMore />}
                    </ListItem>
                    {hasChildren && (
                        <Collapse in={isSubMenuOpen[menuItem.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {!!menuItem.submenuItems &&
                                    menuItem.submenuItems.length > 0 &&
                                    menuItem.submenuItems.map(submenuItem => {
                                        return (
                                            <ListItem
                                                button
                                                onClick={() => navigateToLink(submenuItem.linkTo, submenuItem.target)}
                                                id={`menu-item-${index}`}
                                            >
                                                <ListItemText
                                                    classes={{
                                                        primary: props.classes.ListItemTextPrimary,
                                                        secondary: props.classes.ListItemTextSecondary,
                                                    }}
                                                    primary={submenuItem.primaryText}
                                                    secondary={submenuItem.secondaryText}
                                                />
                                            </ListItem>
                                        );
                                    })}
                            </List>
                        </Collapse>
                    )}
                </span>
            );
        });

    const { classes } = props;
    const txt = menuLocale.footer;
    const { menuItems, onToggleDrawer, drawerOpen, docked, logoImage, logoText, logoLink, locale } = props;
    if (drawerOpen && !docked) {
        // set focus on menu on mobile view if menu is opened
        setTimeout(focusOnElementId.bind(this, 'mainMenu'), 0);
    }
    return (
        <Drawer
            classes={{
                docked: classes.docked,
                paper: classes.paper,
                paperAnchorDockedLeft: classes.paperAnchorDockedLeft,
            }}
            id="menudrawer"
            variant={docked ? 'permanent' : 'temporary'}
            open={drawerOpen}
            anchor="left"
            onClose={onToggleDrawer}
        >
            {drawerOpen && (
                <Fragment>
                    <List component="nav" id="mainMenu" className={classes.mainMenu} tabIndex={-1}>
                        <Grid
                            container
                            spacing={0}
                            wrap={'nowrap'}
                            alignContent={'center'}
                            alignItems={'center'}
                            classes={{ container: classes.header }}
                        >
                            <Grid item xs={10} sm={12} zeroMinWidth>
                                {logoImage && logoLink && logoText && (
                                    <ExternalLink
                                        href={logoLink}
                                        title={logoText}
                                        openInNewIcon={false}
                                        className="noHover"
                                    >
                                        <div
                                            className={logoImage}
                                            style={{ height: 50, width: 160, margin: '8px auto' }}
                                        >
                                            {logoText}
                                        </div>
                                    </ExternalLink>
                                )}
                            </Grid>
                            <Hidden smUp>
                                <Grid item xs={2}>
                                    <IconButton onClick={onToggleDrawer} aria-label={locale.closeMenuLabel}>
                                        <KeyboardArrowLeft className={classes.iconButton} />
                                    </IconButton>
                                </Grid>
                            </Hidden>
                        </Grid>
                        {// Skip nav section
                        docked && (
                            <div
                                type="button"
                                className={classes.skipNav}
                                id="skipNav"
                                onClick={skipMenuItems}
                                onKeyPress={skipMenuItems}
                                tabIndex={1}
                                aria-label={locale.skipNavAriaLabel}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={skipMenuItems}
                                    className="skipNavButton"
                                    children={locale.skipNavTitle}
                                    tabIndex={-1}
                                />
                            </div>
                        )}
                        {renderMenuItems(menuItems)}
                    </List>
                    <div id="afterMenuDrawer" tabIndex={-1} />
                    <div className={classes.mainMenuFooter}>
                        {txt.cricos.prefix}
                        <ExternalLink href={txt.cricos.link} title={txt.cricos.prefix} openInNewIcon={false}>
                            {txt.cricos.number}
                        </ExternalLink>
                    </div>
                </Fragment>
            )}
        </Drawer>
    );
}

MenuDrawer.propTypes = {
    menuItems: PropTypes.array.isRequired,
    logoImage: PropTypes.string,
    logoText: PropTypes.string,
    logoLink: PropTypes.string,
    drawerOpen: PropTypes.bool,
    docked: PropTypes.bool,
    onToggleDrawer: PropTypes.func,
    history: PropTypes.object.isRequired,
    locale: PropTypes.shape({
        skipNavTitle: PropTypes.string,
        skipNavAriaLabel: PropTypes.string,
        closeMenuLabel: PropTypes.string,
    }),
    classes: PropTypes.object,
    hasIncompleteWorks: PropTypes.bool,
};

export function isSame(prevProps, nextProps) {
    return (
        nextProps.logoImage !== prevProps.logoImage ||
        nextProps.logoText !== prevProps.logoText ||
        nextProps.drawerOpen !== prevProps.drawerOpen ||
        JSON.stringify(nextProps.locale) !== JSON.stringify(prevProps.locale) ||
        JSON.stringify(nextProps.menuItems) !== JSON.stringify(prevProps.menuItems) ||
        nextProps.docked !== prevProps.docked
    );
}

export default React.memo(withStyles(styles, { withTheme: true })(MenuDrawer), isSame);
