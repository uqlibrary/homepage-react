import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { useLocation } from 'react-router';
import { default as locale } from 'modules/Pages/LearningResources/shared/learningResources.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { LearningResourceSearch } from 'modules/SharedComponents/LearningResourceSearch';

import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { getClassNumberFromPieces } from 'data/actions';

const useStyles = makeStyles(() => ({
    myCourses: {
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: -16,
        marginTop: 4,
        marginLeft: -16,
        padding: '0 30px 8px',
    },
    visuallyHidden: {
        position: 'absolute',
        top: 'auto',
        overflow: 'hidden',
        clip: 'rect(1px, 1px, 1px, 1px)',
        width: 1,
        height: 1,
        whiteSpace: 'nowrap',
    },
}));

export const getUrlForLearningResourceSpecificTab = (
    item,
    pageLocation,
    includeFullPath = false,
    isAccurateCampus = false,
) => {
    console.log(includeFullPath, isAccurateCampus);
    return 'http://example.com';
    // const campus = isAccurateCampus ? item.campus : getCampusByCode(item.CAMPUS);
    // const learningResourceParams = `coursecode=${item.classnumber}&campus=${campus}&semester=${item.semester}`;
    // const prefix = `${includeFullPath ? fullPath : ''}/learning-resources`;
    // const url =
    //     !!pageLocation.search && pageLocation.search.indexOf('?') === 0
    //         ? `${prefix}${pageLocation.search}&${learningResourceParams}` // eg include ?user=s111111
    //         : `${prefix}?${learningResourceParams}`;
    // return url;
};

export const LearningResourcesPanel = ({
    account,
    accountTalisList,
    accountTalisListLoading,
    accountTalisListError,
    history,
}) => {
    const pageLocation = useLocation();
    const classes = useStyles();

    const [searchUrl, setSearchUrl] = React.useState('');
    const loadSearchResult = React.useCallback(
        searchUrl => {
            searchUrl !== '' && history.push(searchUrl);
        },
        [history],
    );
    React.useEffect(() => {
        loadSearchResult(searchUrl);
    }, [searchUrl, loadSearchResult]);

    const navigateToLearningResourcePage = option => {
        /* istanbul ignore next */
        if (!option.courseCode) {
            return; // should never happen
        }
        const course = {
            classnumber: option.courseCode,
            campus: option.campus || /* istanbul ignore next */ '',
            semester: option.semester || /* istanbul ignore next */ '',
        };
        setSearchUrl(getUrlForLearningResourceSpecificTab(course, pageLocation, false, true));
    };

    const learningResourceId = 'homepage-learningresource';
    console.log('LearningResourcesPanel accountTalisListLoading=', accountTalisListLoading);
    console.log('LearningResourcesPanel accountTalisList=', accountTalisList);
    console.log('LearningResourcesPanel accountTalisListError=', accountTalisListError);
    console.log('current_classes=', account.current_classes);
    const classDetails =
        !accountTalisListLoading &&
        !accountTalisListError &&
        !!accountTalisList &&
        account.current_classes.map(classInfo => {
            return {
                courseCode: getClassNumberFromPieces(classInfo),
                courseName: classInfo.DESCR,
                talisLink: accountTalisList[classInfo.courseCode] || '',
            };
        });
    console.log('classDetails=', classDetails);
    return (
        <StandardCard
            fullHeight
            primaryHeader
            noPadding
            standardCardId="learning-resources-homepage-panel"
            title={
                <Grid container>
                    <Grid item xs id={`${learningResourceId}-autocomplete2-label`}>
                        {locale.homepagePanel.title}
                    </Grid>
                </Grid>
            }
        >
            <LearningResourceSearch
                displayType="compact"
                elementId={learningResourceId}
                navigateToLearningResourcePage={navigateToLearningResourcePage}
            />

            {!!account && !!account.current_classes && account.current_classes.length > 0 ? (
                <Grid container spacing={1} data-testid="your-courses" className={classes.myCourses}>
                    <Grid item xs={12}>
                        <Typography component={'h3'} variant={'h6'}>
                            {locale.homepagePanel.userCourseTitle}
                        </Typography>
                    </Grid>
                    {!!accountTalisListLoading && <p>loading</p>}
                    {!accountTalisListLoading && !!accountTalisListError && <p>error</p>}
                    {!accountTalisListLoading &&
                        !accountTalisListError &&
                        !!classDetails &&
                        !!classDetails.length > 0 &&
                        classDetails.map(item => {
                            return (
                                <Grid container style={{ marginTop: 8 }}>
                                    <Grid
                                        item
                                        xs={12}
                                        data-testid={`hcr-${item.courseCode}`}
                                        data-analyticsid={`hcr-${item.courseCode}`}
                                        key={`hcr-${item.courseCode}`}
                                    >
                                        {item.courseCode}
                                        <span style={{ marginLeft: 6 }}>{item.courseName}</span>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        data-testid={`hcr-${item.courseCode}`}
                                        data-analyticsid={`hcr-${item.courseCode}`}
                                        key={`hcr-${item.courseCode}`}
                                        style={{
                                            paddingBottom: 8,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Link
                                            to={getUrlForLearningResourceSpecificTab(item, pageLocation)}
                                            data-testid={`learning-resource-panel-course-link-${item.courseCode}`}
                                        >
                                            <span className={classes.visuallyHidden}>{item.courseCode}</span> Reading
                                            list
                                        </Link>{' '}
                                        <Link
                                            to={getUrlForLearningResourceSpecificTab(item, pageLocation)}
                                            data-testid={`learning-resource-panel-course-link-${item.courseCode}`}
                                        >
                                            All Learning resources
                                        </Link>{' '}
                                    </Grid>
                                </Grid>
                            );
                        })}
                </Grid>
            ) : (
                <div style={{ marginLeft: 16 }}>{locale.homepagePanel.noCourses}</div>
            )}
        </StandardCard>
    );
};

LearningResourcesPanel.propTypes = {
    account: PropTypes.object,
    history: PropTypes.object,
    accountTalisList: PropTypes.object,
    accountTalisListLoading: PropTypes.bool,
    accountTalisListError: PropTypes.bool,
};

export default withRouter(LearningResourcesPanel);
