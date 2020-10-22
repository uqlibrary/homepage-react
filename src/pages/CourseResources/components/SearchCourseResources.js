import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { TabPanel } from './TabPanel';

import PrimoSearch from 'modules/reusable/PrimoSearch/containers/PrimoSearch';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

export const SearchCourseResources = ({
    a11yProps,
    loadNewSubject,
    renderSubjectTabBody,
    setDisplayType,
    setKeywordPresets,
    listSearchedSubjects,
    updateSearchList,
}) => {
    const subjectTabLabel = 'searchtab';
    const [searchTab, setCurrentSearchTab] = useState(`${subjectTabLabel}-0`);
    const handleSearchTabChange = (event, subjectTabId) => {
        !!event.target.innerText && loadNewSubject(event.target.innerText);
        setCurrentSearchTab(subjectTabId);
    };

    const renderSearchResults = searchedSubjects => {
        return (
            <Fragment>
                <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
                    <Tabs onChange={handleSearchTabChange} scrollButtons="auto" value={searchTab} variant="scrollable">
                        {searchedSubjects.map((item, index) => {
                            return (
                                <Tab
                                    {...a11yProps(index, 'classtab')}
                                    data-testid={`classtab-${index}`}
                                    key={`classtab-${index}`}
                                    id={`classtab-${index}`}
                                    label={item}
                                    value={`${subjectTabLabel}-${index}`} // must match 'index' in TabPanel
                                />
                            );
                        })}
                    </Tabs>
                </AppBar>
                {searchedSubjects.map((item, index) => {
                    const subject = {};
                    subject.classnumber = item;
                    return (
                        <TabPanel
                            data-testid={`classpanel-${index}`}
                            index={`${subjectTabLabel}-${index}`} // must match 'value' in Tabs
                            key={`classpanel-${index}`}
                            tabId="searchTab"
                            value={searchTab}
                            style={{ margin: 0 }}
                        >
                            {renderSubjectTabBody(subject)}
                            {/* {item}*/}
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
    const getPresetData = (searchKeyword, suggestions) => {
        const filtered = suggestions.filter(item => {
            return item.text === searchKeyword;
        });
        return (filtered.length > 0 && filtered[0].rest) || {};
    };

    const searchKeywordSelected = (searchKeyword, suggestions) => {
        setKeywordPresets(getPresetData(searchKeyword, suggestions));

        setDisplayType('searchresults');
        if (!listSearchedSubjects.searchKeyword) {
            loadNewSubject(searchKeyword);
        }
        updateSearchList(listSearchedSubjects.concat(searchKeyword));
        // updateSearchList(listSearchedSubjects => Object.assign({}, ...listSearchedSubjects, ...newGuidesList));
    };

    // React.useEffect(() => {
    //     if (listSearchedSubjects.length > 0) {
    //         console.log('listSearchedSubjects has changed: ', listSearchedSubjects);
    //     }
    // }, [listSearchedSubjects]);

    return (
        <Grid item xs={12} id="courseresource-search">
            <PrimoSearch displayType="courseresources" searchKeywordSelected={searchKeywordSelected} />
            {listSearchedSubjects.length > 0 && <Grid>{renderSearchResults(listSearchedSubjects)}</Grid>}
        </Grid>
    );
};

SearchCourseResources.propTypes = {
    a11yProps: PropTypes.func,
    loadNewSubject: PropTypes.func,
    listSearchedSubjects: PropTypes.array,
    renderSubjectTabBody: PropTypes.func,
    setDisplayType: PropTypes.func,
    setKeywordPresets: PropTypes.func,
    updateSearchList: PropTypes.func,
};
