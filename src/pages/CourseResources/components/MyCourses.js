import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from '../courseresourceslocale';

import { TabPanel } from './TabPanel';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

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
        <Fragment>
            {!!account.classes && account.classes.length > 0 ? (
                <Fragment>
                    <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
                        <Tabs
                            onChange={handleCourseTabChange}
                            scrollButtons="auto"
                            value={coursemenu}
                            variant="scrollable"
                        >
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
                </Fragment>
            ) : (
                <StandardCard
                    className="noreadingLists"
                    style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }}
                    title={locale.myCourses.none.title}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            {locale.myCourses.none.description}
                        </Grid>
                    </Grid>
                </StandardCard>
            )}
        </Fragment>
    );
};

MyCourses.propTypes = {
    a11yProps: PropTypes.func,
    loadNewSubject: PropTypes.func,
    renderSubjectTabBody: PropTypes.func,
};
