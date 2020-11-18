import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { TabPanel } from './TabPanel';

import { CourseResourceSearch } from 'modules/SharedComponents/CourseResourceSearch';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/styles';
import { a11yProps, reverseA11yProps } from '../courseResourcesHelpers';

const useStyles = makeStyles(
    theme => ({
        subjectTabBar: {
            backgroundColor: theme.palette.white.main,
            color: theme.palette.secondary.dark,
            marginTop: '24px',
        },
        tabPanel: {
            margin: 0,
        },
    }),
    { withTheme: true },
);

export const SearchCourseResources = ({
    loadNewSubject,
    renderSubjectTabBody,
    // setDisplayType,
    // setKeywordPresets,
    listSearchedSubjects,
    updateSearchList,
}) => {
    const classes = useStyles();

    const subjectTabLabel = 'searchtab';
    const [searchTab, setCurrentSearchTab] = useState(`${subjectTabLabel}-0`);
    const handleSearchTabChange = (event, newSubjectTabId) => {
        setCurrentSearchTab(newSubjectTabId);
    };

    const renderSearchResults = searchedSubjects => {
        return (
            <Fragment>
                <AppBar position="static" className={classes.subjectTabBar}>
                    <Tabs onChange={handleSearchTabChange} scrollButtons="auto" value={searchTab} variant="scrollable">
                        {searchedSubjects.map((subjectCode, index) => {
                            return (
                                <Tab
                                    data-testid={`classtab-${subjectCode}`}
                                    key={`classtab-${subjectCode}`}
                                    label={subjectCode}
                                    value={`${subjectTabLabel}-${index}`} // must match 'index' in TabPanel
                                    {...a11yProps(index, subjectTabLabel)}
                                />
                            );
                        })}
                    </Tabs>
                </AppBar>
                {searchedSubjects.map((subjectCode, index) => {
                    const subject = {};
                    subject.classnumber = subjectCode;
                    return (
                        <TabPanel
                            data-testid={`classpanel-${index}`}
                            index={`${subjectTabLabel}-${index}`} // must match 'value' in Tabs
                            label="classpanel"
                            key={`classpanel-${index}`}
                            tabId={searchTab}
                            value={searchTab}
                            className={classes.tabPanel}
                            {...reverseA11yProps(index, 'searchtab')}
                        >
                            {renderSubjectTabBody(subject)}
                        </TabPanel>
                    );
                })}
            </Fragment>
        );
    };

    /**
     * find the entry in the suggestions that matches the suggested keyword
     * @param searchKeyword
     * @param suggestions
     */
    // const getPresetData = (searchKeyword, suggestions) => {
    //     const filtered = suggestions.filter(item => {
    //         return item.text === searchKeyword;
    //     });
    //     return (filtered.length > 0 && filtered[0].rest) || {};
    // };

    const searchKeywordSelected = (searchKeyword, suggestions) => {
        console.log('searchKeyword = ', searchKeyword);
        console.log('suggestions = ', suggestions);
        let tabId;
        // setKeywordPresets(getPresetData(searchKeyword, suggestions));

        // setDisplayType('searchresults');
        const thisSuggestion = suggestions.filter(course => (course.text || '') === searchKeyword).pop();
        const campus = (!!thisSuggestion && thisSuggestion.rest?.campus) || '';
        const semester = (!!thisSuggestion && thisSuggestion.rest?.period) || '';
        if (!listSearchedSubjects.includes(searchKeyword)) {
            loadNewSubject(searchKeyword, campus, semester);
            updateSearchList(listSearchedSubjects.concat(searchKeyword));

            tabId = listSearchedSubjects.length;
        } else {
            tabId = listSearchedSubjects.indexOf(searchKeyword);
        }

        setCurrentSearchTab(`${subjectTabLabel}-${tabId}`);
    };

    return (
        <Grid item xs={12} id="courseresource-search">
            <CourseResourceSearch
                displayType="full"
                elementId="full-courseresource"
                history={history}
                searchKeywordSelected={searchKeywordSelected}
            />
            {!!listSearchedSubjects && listSearchedSubjects.length > 0 && renderSearchResults(listSearchedSubjects)}
        </Grid>
    );
};

SearchCourseResources.propTypes = {
    loadNewSubject: PropTypes.func,
    listSearchedSubjects: PropTypes.array,
    renderSubjectTabBody: PropTypes.func,
    // setDisplayType: PropTypes.func,
    // setKeywordPresets: PropTypes.func,
    updateSearchList: PropTypes.func,
};
