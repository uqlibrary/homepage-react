import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import { TabPanel } from './TabPanel';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

export const MyCourses = ({ a11yProps, loadNewSubject, renderSubjectTabBody }) => {
    const { account } = useAccountContext();

    const courseTabLabel = 'subjecttab';
    const [coursemenu, setCurrentMenuTab] = useState(`${courseTabLabel}-0`);
    const handleCourseTabChange = (event, subjectTabId) => {
        !!event.target.innerText && loadNewSubject(event.target.innerText);
        setCurrentMenuTab(subjectTabId);
    };

    return (
        <Grid>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
                <Tabs onChange={handleCourseTabChange} scrollButtons="auto" value={coursemenu} variant="scrollable">
                    {account.classes.map((item, index) => {
                        return (
                            <Tab
                                {...a11yProps(index, 'classtab')}
                                data-testid={`classtab-${index}`}
                                key={`classtab-${index}`}
                                id={`classtab-${index}`}
                                label={item.classnumber}
                                value={`${courseTabLabel}-${index}`} // must match 'index' in TabPanel
                            />
                        );
                    })}
                </Tabs>
            </AppBar>
            {account.classes.map((item, index) => {
                return (
                    <TabPanel
                        data-testid={`classpanel-${index}`}
                        index={`${courseTabLabel}-${index}`} // must match 'value' in Tab
                        key={`classpanel-${index}`}
                        tabId="coursemenu"
                        value={coursemenu}
                        style={{ margin: 0 }}
                    >
                        {renderSubjectTabBody(item)}
                    </TabPanel>
                );
            })}
        </Grid>
    );
};

MyCourses.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    a11yProps: PropTypes.func,
    loadNewSubject: PropTypes.func,
    renderSubjectTabBody: PropTypes.func,
};
