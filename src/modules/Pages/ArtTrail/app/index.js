import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { mui1theme } from 'config';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import AppBar from '@mui/material/AppBar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';

import uqHeaderLogo from './assets/images/uq-logo--reversed.svg';
import FeedbackTabContent from './FeedbackTabContent';
import MapTabContent from './MapTabContent';
import { trailPages } from './pages';
import TrailTabContent from './TrailTabContent';

const tabs = [
    {
        id: 'trail',
        label: 'Trail',
        icon: <ParkOutlinedIcon />,
        subtitle: 'Walk-up overview and welcome notes',
        pages: trailPages,
    },
    {
        id: 'map',
        label: 'Map',
        icon: <MapOutlinedIcon />,
        subtitle: 'Orientation and wayfinding placeholders',
        page: {
            title: 'Map overview',
            body: 'Placeholder map copy can describe the route, entry points, and the sequence of artworks.',
            highlights: ['Route overview', 'Entrances', 'Landmarks'],
        },
    },
    {
        id: 'feedback',
        label: 'Feedback',
        icon: <FeedbackOutlinedIcon />,
        subtitle: 'Mocked responses and review prompts',
        page: {
            title: 'Quick response',
            body: 'Placeholder feedback content can ask visitors about clarity, wayfinding, and overall experience.',
            highlights: ['Quick poll', 'Comment prompt', 'Follow-up link'],
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
        <Box className="uq-header__logo">
            <Box
                component="a"
                href="https://www.uq.edu.au"
                className="logo--large"
                sx={{ display: 'grid', padding: '1rem' }}
            >
                <Box component="img" src={uqHeaderLogo} alt="The University of Queensland" sx={{ height: '40px' }} />
            </Box>
        </Box>
    );
};
const tabContentComponents = {
    trail: TrailTabContent,
    map: MapTabContent,
    feedback: FeedbackTabContent,
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
    const [activeTab, setActiveTab] = useState('trail');
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [tabState, setTabState] = useState(buildInitialTabState);

    useEffect(() => {
        document.title = 'Art Trail App';
    }, []);

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

    const updateTabState = (tabId, updater) => {
        setTabState(currentState => ({
            ...currentState,
            [tabId]: updater(currentState[tabId]),
        }));
    };

    const handleStepChange = direction => {
        updateTabState(activeTabConfig.id, currentTabState => ({
            ...currentTabState,
            stepIndex: Math.min(Math.max(currentTabState.stepIndex + direction, 0), stepCount - 1),
        }));
    };

    const renderTabContent = tab => {
        const panelState = tabState[tab.id];
        const panelPages = getTabPages(tab);
        const panelPage = panelPages[panelState.stepIndex] ?? panelPages[0];
        const TabContentComponent = tabContentComponents[tab.id];

        return <TabContentComponent tab={tab} page={panelPage} />;
    };

    return (
        <Box
            data-testid="art-trail-app"
            sx={{
                '--art-trail-header-height': '64px',
                '--art-trail-footer-height': footerHeight,
                '--art-trail-font-size': '16px',
                minHeight: '100vh',
                height: '100dvh',
                bgcolor: '#fff',
                color: mui1theme.palette.designSystem.bodyCopy,
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
                        <MenuItem onClick={handleMenuClose}>Trail overview</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Map and stops</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Visitor feedback</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    mt: 'var(--art-trail-header-height)',
                    height: 'calc(100% - var(--art-trail-header-height))',
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
                        pb: 'calc(var(--art-trail-footer-height) + env(safe-area-inset-bottom, 0px))',
                    }}
                >
                    <Grid sx={{ width: '100%', maxWidth: 1100, mx: 'auto' }}>
                        <Grid container direction="column" rowSpacing={2.5}>
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

                <Grid container sx={{ px: { xs: 0.5, sm: 1.5 }, py: 0.25 }}>
                    <Grid xs={12} sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
                        <BottomNavigation
                            showLabels
                            value={activeTab}
                            onChange={(event, nextTab) => setActiveTab(nextTab)}
                        >
                            {tabs.map(tab => (
                                <BottomNavigationAction
                                    key={tab.id}
                                    value={tab.id}
                                    label={tab.label}
                                    icon={tab.icon}
                                    id={`art-trail-tab-${tab.id}`}
                                    aria-controls={`art-trail-tabpanel-${tab.id}`}
                                />
                            ))}
                        </BottomNavigation>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ArtTrailApp;
