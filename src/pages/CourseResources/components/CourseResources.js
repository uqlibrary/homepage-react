import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from './courseresourceslocale';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import PrimoSearch from '../../../modules/reusable/PrimoSearch/containers/PrimoSearch';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

function TabPanel(props) {
    const { children, value, tabId, index, ...other } = props;

    console.log('tab ', tabId, index, ': ', children);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={tabId || `tabpanel-${index}`}
            aria-labelledby={tabId || `tabpanel-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    tabId: PropTypes.string,
};

function a11yProps(index, classname = null) {
    const label = classname || index;
    return {
        id: `${label}-${index}`,
        'aria-controls': `${label}panel-${index}`,
    };
}

export const CourseResources = () => {
    const { account } = useAccountContext();

    const [topmenu, setCurrentTopTab] = useState(
        !!account.currentclasses && account.currentclasses.length ? 'top0' : 'top1',
    );
    const handleTopTabChange = (event, newValue) => {
        setCurrentTopTab(newValue);
    };

    const [coursemenu, setCurrentMenuTab] = useState('class-0');
    const handleCourseTabChange = (event, newValue) => {
        setCurrentMenuTab(newValue);
    };

    const renderNoListedCourses = (
        <Fragment>
            <Typography component={'h2'} variant={'h6'}>
                No listed courses
            </Typography>
            <p>Courses will be shown 3 weeks prior to the start of semester</p>
            <p>Please check back closer to the next enrollment period</p>
            <p>You can search for information on courses using the &quot;Search&quot; tab, above</p>
        </Fragment>
    );

    const renderStudyHelpLinks = (
        <Fragment>
            {!!locale.studyHelpLinks &&
                locale.studyHelpLinks.length > 0 &&
                locale.studyHelpLinks.map((item, index) => {
                    console.log('studylink: ', index);
                    return item.linkTo && item.linkLabel ? (
                        <Grid item xs={12} style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                            <a
                                // on-tap="linkClicked"
                                id={item.id || null}
                                href={item.linkTo}
                                key={`studylink-${index}`}
                            >
                                {!!item.icon && item.icon}
                                {item.linkLabel}
                            </a>
                        </Grid>
                    ) : (
                        <Typography>No resources right now</Typography>
                    );
                })}
        </Fragment>
    );

    const renderCurrentCourses = (
        <Fragment>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
                <Tabs onChange={handleCourseTabChange} scrollButtons="auto" value={coursemenu} variant="scrollable">
                    {account.currentclasses.map((item, index) => {
                        return (
                            <Tab
                                {...a11yProps(index, 'classtab')}
                                data-testid={`classtab-${index}`}
                                key={`classtab-${index}`}
                                label={item.classnumber}
                                value={`class-${index}`}
                            />
                        );
                    })}
                </Tabs>
            </AppBar>
            {account.currentclasses.map((item, index) => {
                return (
                    <TabPanel
                        data-testid={`classpanel-${index}`}
                        index={`class-${index}`}
                        key={`classpanel-${index}`}
                        tabId="coursemenu"
                        value={coursemenu}
                    >
                        <Grid>
                            <span>{item.classnumber}</span>
                        </Grid>
                    </TabPanel>
                );
            })}
        </Fragment>
    );

    return (
        <StandardPage>
            <div className="layout-card" style={{ margin: '-8px auto 16px' }}>
                <StandardCard noPadding noHeader>
                    <Grid
                        // alignItems={'flex-end'}
                        container
                        spacing={1}
                        style={{ paddingTop: 12, paddingRight: 30, paddingBottom: 12, paddingLeft: 30 }}
                    >
                        <Grid item xs={12} md={'auto'} id="courseresources">
                            <InputLabel id="courseresources-label">Course Resources</InputLabel>
                        </Grid>
                        <Grid item xs={12} id="courseresource-search">
                            <AppBar position="static">
                                <Tabs centered onChange={handleTopTabChange} value={topmenu}>
                                    <Tab value="top0" label="My courses" {...a11yProps('top0')} />
                                    <Tab value="top1" label="Course Search" {...a11yProps('top1')} />
                                    <Tab value="top2" label="Study help" {...a11yProps('top2')} />
                                </Tabs>
                            </AppBar>

                            <TabPanel value={topmenu} index="top0" tabId="topmenu">
                                {!!account.currentclasses && account.currentclasses.length > 0 ? (
                                    <Grid>{renderCurrentCourses}</Grid>
                                ) : (
                                    <Grid>{renderNoListedCourses}</Grid>
                                )}
                            </TabPanel>
                            <TabPanel value={topmenu} index="top1" tabId="topmenu">
                                <Grid item xs={12} id="courseresource-search">
                                    <PrimoSearch displayType="courseresources" />
                                </Grid>
                            </TabPanel>
                            <TabPanel value={topmenu} index="top2" tabId="topmenu">
                                <Grid
                                    alignContent={'space-between'}
                                    container
                                    style={{ minHeight: '10rem', borderBottom: '1px solid #e8e8e8' }}
                                >
                                    {renderStudyHelpLinks}
                                </Grid>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardPage>
    );
};

export default React.memo(CourseResources);
