import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useTheme, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { mui1theme } from 'config';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppBar from '@mui/material/AppBar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';

import uqHeaderLogo from '../../../../../public/images/artTrail/uq-logo--reversed.svg';

import AriaAnnounce from './SharedComponents/AriaAnnounce';
import CulturalDisclaimer from './SharedComponents/CulturalDisclaimer';
import MapTabContent from './MapTabContent';
import { trailPages } from './pages';
import TrailTabContent from './TrailTabContent';
import { stripHtml } from './utils/mapUtils';
import {
    CONTENT_HEIGHT_SX,
    createAppRootSx,
    createDrawerSx,
    createGlobalStyles,
    createMenuItemSx,
    createMenuSlotProps,
    createScrollContainerSx,
    createStepperSx,
    DRAWER_CONTAINER_SX,
    DRAWER_INNER_SX,
    DRAWER_PULLER_SX,
    DRAWER_SCROLL_SX,
    FOOTER_BUTTON_SX,
    FOOTER_CONTENT_SX,
    FOOTER_NAV_SX,
    FOOTER_SX,
    FOOTER_STEPPER_ROW_SX,
    FOOTER_TAB_ACTION_SX,
    FOOTER_TAB_ROW_SX,
    HEADER_LOGO_IMAGE_SX,
    HEADER_LOGO_SX,
    ICON_BUTTON_SX,
    MENU_ITEM_IMAGE_SX,
    MENU_ITEM_LABEL_SX,
    SCROLL_VIEWPORT_SX,
} from './appShellStyles';
import { tabs, menuItems } from './config';
import { useDocumentScrollLock, useGoogleAnalytics } from './hooks';
import { GlobalStyles } from '@mui/material';

const CULTURAL_DISCLAIMER_COOKIE = 'ART_TRAIL_CULTURAL_DISCLAIMER_SEEN';

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

const getTabPages = tab => tab.pages ?? [tab.page];

const buildInitialTabState = () =>
    tabs.reduce((accumulator, tab) => {
        accumulator[tab.id] = {
            stepIndex: 0,
        };
        return accumulator;
    }, {});

const HeaderLogo = () => {
    return (
        <Box
            component="a"
            href="https://www.uq.edu.au"
            className="logo--large"
            sx={HEADER_LOGO_SX}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Box component="img" src={uqHeaderLogo} alt="The University of Queensland" sx={HEADER_LOGO_IMAGE_SX} />
        </Box>
    );
};
const tabContentComponents = {
    trail: TrailTabContent,
    map: MapTabContent,
};

const TabPanel = ({ active, children, id }) => {
    return (
        <Box
            role="tabpanel"
            hidden={!active}
            id={`art-trail-tabpanel-${id}`}
            aria-labelledby={`art-trail-tab-${id}`}
            sx={{ display: active ? 'block' : 'none' }}
        >
            {children}
        </Box>
    );
};

TabPanel.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
};

const ArtTrailApp = () => {
    const theme = useTheme();
    const appTheme = theme?.palette?.designSystem ? theme : mui1theme;
    const scrollContainerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('trail');
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [trailNavigationDirection, setTrailNavigationDirection] = useState('forward');
    const [tabState, setTabState] = useState(buildInitialTabState);
    const [drawerContent, setDrawerContent] = useState(null);
    const [showCulturalDisclaimer, setShowCulturalDisclaimer] = useState(
        () => Cookies.get(CULTURAL_DISCLAIMER_COOKIE) !== 'true',
    );

    useEffect(() => {
        document.title = 'The University of Queensland Indigenous Art and Library Discovery Trail';
    }, []);

    useDocumentScrollLock();

    const activeTabConfig = useMemo(() => tabs.find(tab => tab.id === activeTab) ?? tabs[0], [activeTab]);
    const activeTabPages = getTabPages(activeTabConfig);
    const activeState = tabState[activeTabConfig.id];
    const stepCount = activeTabPages.length;
    const showStepper = stepCount > 1;
    const isTrailTab = activeTabConfig.id === 'trail';
    const isTrailWelcomeStep = isTrailTab && activeState.stepIndex === 0;
    const visibleStepperSteps = isTrailTab && activeState.stepIndex > 0 ? stepCount - 1 : stepCount;
    const visibleActiveStep =
        isTrailTab && activeState.stepIndex > 0 ? activeState.stepIndex - 1 : activeState.stepIndex;
    const footerHeight = showStepper ? '112px' : '64px';
    const activePageTitle = activeTabPages[activeState.stepIndex].pageTitle;
    const announcement = stripHtml(activePageTitle);

    const { trackPageView } = useGoogleAnalytics();
    const lastTrackedPageRef = useRef(null);
    const pageKey = `${activeTabConfig.id}-${activeState.stepIndex}`;

    useEffect(() => {
        if (lastTrackedPageRef.current === pageKey) {
            return;
        }

        lastTrackedPageRef.current = pageKey;

        trackPageView({
            page_title: activeTabPages[activeState.stepIndex].pageTitle,
        });
    }, [activeState.stepIndex, activeTabConfig.id, activeTabPages, pageKey, trackPageView]);

    const handleMenuClose = () => setMenuAnchor(null);

    const handleDrawerClose = () => setDrawerContent(null);

    const handleOpenDrawer = DrawerContentComponent => {
        setDrawerContent(() => DrawerContentComponent);
    };

    const handleDisclaimerClose = () => {
        Cookies.set(CULTURAL_DISCLAIMER_COOKIE, 'true', { path: '/' });
        setShowCulturalDisclaimer(false);
    };

    const updateTabState = (tabId, updater) => {
        setTabState(currentState => ({
            ...currentState,
            [tabId]: updater(currentState[tabId]),
        }));
    };

    const resetScrollPosition = () => {
        const scrollContainer = scrollContainerRef.current;

        if (!scrollContainer) {
            return;
        }

        scrollContainer.scrollTop = 0;

        if (typeof scrollContainer.scrollTo === 'function') {
            scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    };

    const clearActiveControlFocus = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    const handleStepChange = direction => {
        clearActiveControlFocus();
        handleDrawerClose();
        resetScrollPosition();

        if (activeTabConfig.id === 'trail') {
            setTrailNavigationDirection(direction < 0 ? 'backward' : 'forward');
        }

        updateTabState(activeTabConfig.id, currentTabState => ({
            ...currentTabState,
            stepIndex: Math.min(Math.max(currentTabState.stepIndex + direction, 0), stepCount - 1),
        }));
    };

    const handleSelectTrailPage = stepIndex => {
        clearActiveControlFocus();
        handleDrawerClose();
        resetScrollPosition();
        setTrailNavigationDirection(stepIndex < tabState.trail.stepIndex ? 'backward' : 'forward');
        setActiveTab('trail');
        updateTabState('trail', currentTabState => ({
            ...currentTabState,
            stepIndex: Math.min(Math.max(stepIndex, 0), trailPages.length - 1),
        }));
    };

    const handleMenuItemClick = menuItem => {
        handleMenuClose();

        if (typeof menuItem.trailStepIndex === 'number') {
            handleSelectTrailPage(menuItem.trailStepIndex);
        }
    };

    const renderTabContent = tab => {
        const panelState = tabState[tab.id];
        const panelPages = getTabPages(tab);
        const panelPage = panelPages[panelState.stepIndex] ?? panelPages[0];
        const PanelPageComponent = panelPage.component;
        const TabContentComponent = tabContentComponents[tab.id];
        const mediaStopSignal = `${activeTab}:${tabState.trail.stepIndex}`;

        return (
            <TabContentComponent
                tab={tab}
                page={PanelPageComponent}
                pageKey={`${tab.id}-${panelState.stepIndex}`}
                openDrawer={handleOpenDrawer}
                active={tab.id === activeTab}
                navigationDirection={tab.id === 'trail' ? trailNavigationDirection : 'forward'}
                mediaStopSignal={mediaStopSignal}
                onSelectTrailPage={handleSelectTrailPage}
            />
        );
    };

    const DrawerContentComponent = drawerContent;

    return (
        <Box data-testid="art-trail-app" sx={createAppRootSx(appTheme, footerHeight)}>
            <AriaAnnounce message={announcement} />
            <GlobalStyles styles={createGlobalStyles(appTheme)} />
            <AppBar
                position="fixed"
                color="primary"
                sx={{
                    height: 'var(--art-trail-header-height)',
                    justifyContent: 'center',
                    boxShadow: 3,
                    zIndex: currentTheme => currentTheme.zIndex.modal + 1,
                }}
            >
                <Toolbar sx={{ minHeight: 'var(--art-trail-header-height)', px: { xs: 1.5, sm: 2.5 } }}>
                    <Grid container wrap="nowrap" alignItems="center" columnSpacing={1}>
                        <Grid ml={1}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                aria-label="open navigation menu"
                                sx={ICON_BUTTON_SX}
                                onClick={event =>
                                    setMenuAnchor(currentAnchor => (currentAnchor ? null : event.currentTarget))
                                }
                            >
                                {menuAnchor ? <CloseIcon /> : <MenuIcon />}
                            </IconButton>
                        </Grid>
                        <Grid xs>
                            <HeaderLogo />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                keepMounted
                disableScrollLock
                marginThreshold={0}
                anchorReference="none"
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={createMenuSlotProps()}
            >
                {menuItems.map(menuItem => (
                    <MenuItem
                        key={menuItem.id}
                        aria-label={menuItem.ariaLabel || menuItem.label}
                        onClick={() => handleMenuItemClick(menuItem)}
                        sx={createMenuItemSx(Boolean(menuItem.thumbnailSrc))}
                    >
                        {menuItem.thumbnailSrc ? (
                            <Box
                                component="img"
                                src={menuItem.thumbnailSrc}
                                alt={menuItem.thumbnailAlt || ''}
                                sx={MENU_ITEM_IMAGE_SX}
                            />
                        ) : null}
                        <Box sx={MENU_ITEM_LABEL_SX} dangerouslySetInnerHTML={{ __html: menuItem.label }} />
                    </MenuItem>
                ))}
            </Menu>

            <Box sx={SCROLL_VIEWPORT_SX}>
                <Grid
                    container
                    direction="column"
                    wrap="nowrap"
                    ref={scrollContainerRef}
                    data-testid="art-trail-scroll-container"
                    sx={createScrollContainerSx(showStepper)}
                >
                    <Grid sx={CONTENT_HEIGHT_SX}>
                        <Grid container direction="column" rowSpacing={2.5}>
                            {showCulturalDisclaimer && (
                                <Grid>
                                    <CulturalDisclaimer onClose={handleDisclaimerClose} />
                                </Grid>
                            )}
                            <Grid>
                                <Grid container direction="column" rowSpacing={2.5}>
                                    {tabs.map(tab => (
                                        <Grid key={tab.id}>
                                            <TabPanel id={tab.id} active={tab.id === activeTab}>
                                                {renderTabContent(tab)}
                                            </TabPanel>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <Paper
                component="footer"
                square
                elevation={8}
                sx={{
                    ...FOOTER_SX,
                }}
            >
                {showStepper && (
                    <>
                        <Grid container sx={FOOTER_STEPPER_ROW_SX}>
                            <Grid xs={12} sx={FOOTER_CONTENT_SX}>
                                <MobileStepper
                                    variant={isTrailWelcomeStep ? 'dots' : 'text'}
                                    position="static"
                                    steps={visibleStepperSteps}
                                    activeStep={visibleActiveStep}
                                    sx={createStepperSx(isTrailWelcomeStep)}
                                    backButton={
                                        isTrailWelcomeStep ? (
                                            <Box />
                                        ) : (
                                            <Button
                                                size="small"
                                                startIcon={<ChevronLeftIcon />}
                                                onClick={() => handleStepChange(-1)}
                                                disabled={activeState.stepIndex === 0}
                                                aria-label="Previous page"
                                                sx={FOOTER_BUTTON_SX}
                                            >
                                                Prev
                                            </Button>
                                        )
                                    }
                                    nextButton={
                                        <Button
                                            key={isTrailWelcomeStep ? 'start-trail' : 'next-page'}
                                            size="small"
                                            endIcon={isTrailWelcomeStep ? null : <ChevronRightIcon />}
                                            onClick={() => handleStepChange(1)}
                                            disabled={activeState.stepIndex === stepCount - 1}
                                            aria-label={isTrailWelcomeStep ? 'Start the trail' : 'Next page'}
                                            sx={FOOTER_BUTTON_SX}
                                        >
                                            {isTrailWelcomeStep ? 'Start the trail' : 'Next'}
                                        </Button>
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Divider />
                    </>
                )}

                <Grid container sx={FOOTER_TAB_ROW_SX}>
                    <Grid xs={12} sx={FOOTER_CONTENT_SX}>
                        <BottomNavigation
                            showLabels
                            value={activeTab}
                            onChange={(event, nextTab) => {
                                handleDrawerClose();
                                setActiveTab(nextTab);
                            }}
                            sx={FOOTER_NAV_SX}
                        >
                            {tabs.map(tab => (
                                <BottomNavigationAction
                                    key={tab.id}
                                    value={tab.id}
                                    label={tab.label}
                                    icon={tab.icon}
                                    id={`art-trail-tab-${tab.id}`}
                                    data-testid={`art-trail-tab-${tab.id}`}
                                    aria-controls={`art-trail-tabpanel-${tab.id}`}
                                    aria-label={tab.ariaLabel}
                                    sx={FOOTER_TAB_ACTION_SX}
                                />
                            ))}
                        </BottomNavigation>
                    </Grid>
                </Grid>
            </Paper>

            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(DrawerContentComponent)}
                onClose={handleDrawerClose}
                onOpen={() => {}}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={createDrawerSx(appTheme)}
            >
                <Box data-testid="art-trail-drawer-puller" sx={DRAWER_PULLER_SX}>
                    <Puller />
                </Box>
                <Box sx={DRAWER_INNER_SX}>
                    <Grid container direction="column" wrap="nowrap" sx={DRAWER_CONTAINER_SX}>
                        <Grid sx={DRAWER_SCROLL_SX}>{DrawerContentComponent ? <DrawerContentComponent /> : null}</Grid>
                    </Grid>
                </Box>
            </SwipeableDrawer>
        </Box>
    );
};

export default ArtTrailApp;
