import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useTheme, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { mui1theme } from 'config';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
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
import CulturalDisclaimer from './CulturalDisclaimer';
import MapTabContent from './MapTabContent';
import { ART_TRAIL_MAP_POIS } from './mapPois';
import { trailPages } from './pages';
import TrailTabContent from './TrailTabContent';
import useDocumentScrollLock from './hooks/useDocumentScrollLock';

const CULTURAL_DISCLAIMER_COOKIE = 'ART_TRAIL_CULTURAL_DISCLAIMER_SEEN';
const FOOTER_TABS_HEIGHT = '56px';
const HEADER_HEIGHT = '64px';

const stripInlineMarkup = value => value?.replace(/<[^>]+>/g, '') ?? '';

const menuArtworkItems = ART_TRAIL_MAP_POIS.filter(
    (poi, index, pois) => pois.findIndex(candidate => candidate.trailStepIndex === poi.trailStepIndex) === index,
).map(poi => ({
    id: poi.id,
    label: `${poi.popupTitle || ''} ${stripInlineMarkup(poi.popupDescription)}`.trim(),
    thumbnailSrc: poi.popupThumbnailSrc,
    thumbnailAlt: poi.popupThumbnailAlt,
    trailStepIndex: poi.trailStepIndex,
}));

const menuItems = [
    {
        id: 'trail-overview',
        label: 'Indigenous art and Library discovery trail',
        trailStepIndex: 0,
    },
    ...menuArtworkItems,
    {
        id: 'continue-your-journey',
        label: 'Continue your journey',
        trailStepIndex: 9,
    },
];

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

const tabs = [
    {
        id: 'trail',
        label: 'Trail',
        icon: <RouteOutlinedIcon sx={{ fontSize: '1.5rem' }} />,
        pages: trailPages,
    },
    {
        id: 'map',
        label: 'Map',
        icon: <MapOutlinedIcon sx={{ fontSize: '1.5rem' }} />,
        page: {
            title: 'Map overview',
            body: 'Placeholder map copy can describe the route, entry points, and the sequence of artworks.',
            highlights: ['Route overview', 'Entrances', 'Landmarks'],
        },
    },
];

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
            sx={{ display: 'grid', padding: '1rem' }}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Box component="img" src={uqHeaderLogo} alt="The University of Queensland" sx={{ height: '40px' }} />
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
    const [activeTab, setActiveTab] = useState('trail');
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [trailNavigationDirection, setTrailNavigationDirection] = useState('forward');
    const [tabState, setTabState] = useState(buildInitialTabState);
    const [drawerContent, setDrawerContent] = useState(null);
    const [showCulturalDisclaimer, setShowCulturalDisclaimer] = useState(
        () => Cookies.get(CULTURAL_DISCLAIMER_COOKIE) !== 'true',
    );

    useEffect(() => {
        document.title = 'Art Trail App';
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

    const handleStepChange = direction => {
        handleDrawerClose();

        if (activeTabConfig.id === 'trail') {
            setTrailNavigationDirection(direction < 0 ? 'backward' : 'forward');
        }

        updateTabState(activeTabConfig.id, currentTabState => ({
            ...currentTabState,
            stepIndex: Math.min(Math.max(currentTabState.stepIndex + direction, 0), stepCount - 1),
        }));
    };

    const handleSelectTrailPage = stepIndex => {
        handleDrawerClose();
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
        const TabContentComponent = tabContentComponents[tab.id];

        return (
            <TabContentComponent
                tab={tab}
                page={panelPage}
                pageKey={`${tab.id}-${panelState.stepIndex}`}
                openDrawer={handleOpenDrawer}
                active={tab.id === activeTab}
                navigationDirection={tab.id === 'trail' ? trailNavigationDirection : 'forward'}
                onSelectTrailPage={handleSelectTrailPage}
            />
        );
    };

    const DrawerContentComponent = drawerContent;

    return (
        <Box
            data-testid="art-trail-app"
            sx={{
                '--art-trail-header-height': HEADER_HEIGHT,
                '--art-trail-footer-height': footerHeight,
                '--art-trail-footer-tabs-height': FOOTER_TABS_HEIGHT,
                '--art-trail-font-size': `${appTheme.typography.fontSize}px`,
                '--art-trail-font-family': appTheme.typography.bodyFontFamily,
                '--art-trail-spacing': `${appTheme.typography.fontSize}px`,
                '--art-trail-content-bottom-padding': `${appTheme.typography.fontSize * 3}px`,
                minHeight: '100vh',
                height: '100dvh',
                bgcolor: '#fff',
                color: appTheme.palette.designSystem.bodyCopy,
                overflow: 'hidden',
                fontSize: 'var(--art-trail-font-size)',
            }}
        >
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
                                sx={{ fontSize: '1.5rem' }}
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
                slotProps={{
                    root: {
                        sx: {
                            zIndex: currentTheme => currentTheme.zIndex.modal,
                        },
                    },
                    paper: {
                        sx: {
                            position: 'fixed',
                            top: {
                                xs: `${HEADER_HEIGHT} !important`,
                                sm: `${HEADER_HEIGHT} !important`,
                            },
                            bottom: {
                                xs: '0 !important',
                                sm: '16px !important',
                            },
                            left: '0 !important',
                            right: { xs: '0 !important', sm: 'auto !important' },
                            width: { xs: '100%', sm: 'min(420px, calc(100vw - 32px))' },
                            maxWidth: { xs: '100%', sm: 420 },
                            height: 'auto',
                            maxHeight: {
                                xs: 'none',
                                sm: `min(720px, calc(100dvh - ${HEADER_HEIGHT} - 32px))`,
                            },
                            mt: '0 !important',
                            borderRadius: 0,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            boxShadow: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            transform: 'none !important',
                            overflow: 'hidden',
                            '& .MuiMenu-list': {
                                boxSizing: 'border-box',
                                flex: 1,
                                minHeight: 0,
                                height: '100%',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                overscrollBehavior: 'contain',
                                WebkitOverflowScrolling: 'touch',
                                paddingTop: 0,
                                paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
                            },
                        },
                    },
                    list: {
                        sx: {
                            p: 0,
                        },
                    },
                }}
            >
                {menuItems.map(menuItem => (
                    <MenuItem
                        key={menuItem.id}
                        onClick={() => handleMenuItemClick(menuItem)}
                        sx={{
                            alignItems: 'flex-start',
                            columnGap: menuItem.thumbnailSrc ? 1.5 : 0,
                            px: { xs: 2, sm: 2.5 },
                            py: 1.5,
                            whiteSpace: 'normal',
                            color: 'inherit',
                            '&:not(:last-of-type)': {
                                borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
                            },
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                            },
                        }}
                    >
                        {menuItem.thumbnailSrc ? (
                            <Box
                                component="img"
                                src={menuItem.thumbnailSrc}
                                alt={menuItem.thumbnailAlt || ''}
                                sx={{
                                    width: 56,
                                    height: 56,
                                    objectFit: 'cover',
                                    borderRadius: 1.5,
                                    flexShrink: 0,
                                }}
                            />
                        ) : null}
                        <Box
                            sx={{
                                minWidth: 0,
                                display: 'grid',
                                alignContent: 'center',
                            }}
                        >
                            {menuItem.label}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>

            <Box
                sx={{
                    mt: 'var(--art-trail-header-height)',
                    height: 'calc(100% - var(--art-trail-header-height) - var(--art-trail-footer-height))',
                    overflow: 'hidden',
                }}
            >
                <Grid
                    container
                    direction="column"
                    wrap="nowrap"
                    sx={{
                        height: '100%',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                        pb: showStepper
                            ? 'calc(var(--art-trail-content-bottom-padding) + env(safe-area-inset-bottom, 0px))'
                            : 0,
                    }}
                >
                    <Grid sx={{ width: '100%', maxWidth: 1100, mx: 'auto', height: '100%' }}>
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
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 'var(--art-trail-footer-height)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                }}
            >
                {showStepper && (
                    <>
                        <Grid container sx={{ px: { xs: 1.5, sm: 2.5 }, py: 1.25, pt: 0, pb: 0 }}>
                            <Grid xs={12} sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
                                <MobileStepper
                                    variant={isTrailWelcomeStep ? 'dots' : 'text'}
                                    position="static"
                                    steps={visibleStepperSteps}
                                    activeStep={visibleActiveStep}
                                    sx={{
                                        bgcolor: 'transparent',
                                        px: 0,
                                        '& .MuiMobileStepper-dots': {
                                            display: isTrailWelcomeStep ? 'none' : undefined,
                                        },
                                        '& .MuiMobileStepper-dot': {
                                            mx: 0.35,
                                        },
                                        '& .MuiMobileStepper-dotActive': {
                                            bgcolor: 'primary.main',
                                        },
                                    }}
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
                                                sx={{ fontSize: '1rem' }}
                                            >
                                                Prev
                                            </Button>
                                        )
                                    }
                                    nextButton={
                                        <Button
                                            size="small"
                                            endIcon={isTrailWelcomeStep ? null : <ChevronRightIcon />}
                                            onClick={() => handleStepChange(1)}
                                            disabled={activeState.stepIndex === stepCount - 1}
                                            aria-label={isTrailWelcomeStep ? 'Start the trail' : 'Next page'}
                                            sx={{ fontSize: '1rem' }}
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

                <Grid
                    container
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        px: { xs: 0.5, sm: 1.5 },
                        py: 0.25,
                    }}
                >
                    <Grid xs={12} sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
                        <BottomNavigation
                            showLabels
                            value={activeTab}
                            onChange={(event, nextTab) => {
                                handleDrawerClose();
                                setActiveTab(nextTab);
                            }}
                            sx={{ height: 'var(--art-trail-footer-tabs-height)' }}
                        >
                            {tabs.map(tab => (
                                <BottomNavigationAction
                                    key={tab.id}
                                    value={tab.id}
                                    label={tab.label}
                                    icon={tab.icon}
                                    id={`art-trail-tab-${tab.id}`}
                                    aria-controls={`art-trail-tabpanel-${tab.id}`}
                                    sx={{ fontSize: 'var(--art-trail-font-size)' }}
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
                sx={{
                    '& .MuiPaper-root': {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    },
                }}
            >
                <Box
                    data-testid="art-trail-drawer-puller"
                    sx={{
                        position: 'absolute',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                >
                    <Puller />
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 1100,
                        mx: 'auto',
                        pt: 2,
                    }}
                >
                    <Grid container direction="column" wrap="nowrap" sx={{ maxHeight: '50vh' }}>
                        <Grid sx={{ px: { xs: 2, sm: 2.5 }, py: 2, overflowY: 'auto' }}>
                            {DrawerContentComponent ? <DrawerContentComponent /> : null}
                        </Grid>
                    </Grid>
                </Box>
            </SwipeableDrawer>
        </Box>
    );
};

export default ArtTrailApp;
