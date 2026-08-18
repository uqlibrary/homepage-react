import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useTheme, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { mui1theme } from 'config';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
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
import { trailPages } from './pages';
import TrailTabContent from './TrailTabContent';
import useDocumentScrollLock from './hooks/useDocumentScrollLock';

const CULTURAL_DISCLAIMER_COOKIE = 'ART_TRAIL_CULTURAL_DISCLAIMER_SEEN';
const FOOTER_TABS_HEIGHT = '56px';

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
        icon: <ParkOutlinedIcon sx={{ fontSize: '1.5rem' }} />,
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
        updateTabState(activeTabConfig.id, currentTabState => ({
            ...currentTabState,
            stepIndex: Math.min(Math.max(currentTabState.stepIndex + direction, 0), stepCount - 1),
        }));
    };

    const handleSelectTrailPage = stepIndex => {
        handleDrawerClose();
        setActiveTab('trail');
        updateTabState('trail', currentTabState => ({
            ...currentTabState,
            stepIndex: Math.min(Math.max(stepIndex, 0), trailPages.length - 1),
        }));
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
                openDrawer={handleOpenDrawer}
                active={tab.id === activeTab}
                onSelectTrailPage={handleSelectTrailPage}
            />
        );
    };

    const DrawerContentComponent = drawerContent;

    return (
        <Box
            data-testid="art-trail-app"
            sx={{
                '--art-trail-header-height': '64px',
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
                }}
            >
                <Toolbar sx={{ minHeight: 'var(--art-trail-header-height)', px: { xs: 1.5, sm: 2.5 } }}>
                    <Grid container wrap="nowrap" alignItems="center" columnSpacing={1}>
                        <Grid>
                            <IconButton
                                color="inherit"
                                edge="start"
                                aria-label="open navigation menu"
                                sx={{ fontSize: '1.5rem' }}
                                onClick={event => setMenuAnchor(event.currentTarget)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid xs>
                            <HeaderLogo />
                        </Grid>
                    </Grid>

                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMenuClose}
                        keepMounted
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={handleMenuClose}>Indigenous art and Library discovery trail</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Punu Tjukurpa' 2013</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Sand Hills' 2007</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Devil Mountain Lizard Dreaming' 1997</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Tingari ceremonies at Wilkinkarra' 2003</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Kunawarritji 1' and 'Kunawarritji 2' 2012</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Pikkuw (Saltwater crocodile)' 2007</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Whispers (Poles)' 2023</MenuItem>
                        <MenuItem onClick={handleMenuClose}>'Warual III (Green Turtle)' 2015</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Continue your journey</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

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
