import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { withRouter } from 'react-router-dom';

import { getCampusByCode } from 'helpers/general';
import { fullPath } from 'config/routes';
import { default as locale } from 'modules/Pages/CourseResources/courseResources.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CourseResourceSearch } from 'modules/SharedComponents/CourseResourceSearch';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
    myCourses: {
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: -16,
        marginTop: 4,
        marginBottom: -24,
        marginLeft: -16,
        padding: '0 30px 8px',
    },
}));

export const getUrlForCourseResourceSpecificTab = (
    item,
    pageLocation,
    includeFullPath = false,
    isAccurateCampus = false,
) => {
    const campus = isAccurateCampus ? item.campus : getCampusByCode(item.CAMPUS);
    const courseResourceParams = `coursecode=${item.classnumber}&campus=${campus}&semester=${item.semester}`;
    const prefix = `${includeFullPath ? fullPath : ''}/courseresources`;
    return !!pageLocation.search && pageLocation.search.indexOf('?') === 0
        ? `${prefix}${pageLocation.search}&${courseResourceParams}` // eg include ?user=s111111
        : `${prefix}?${courseResourceParams}`;
};

export const CourseResourcesPanel = ({ account, history }) => {
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

    const navigateToCourseResourcePage = option => {
        if (!option.text || !option.rest || !option.rest.campus || !option.rest.period) {
            return; // should never happen
        }
        const course = {
            classnumber: option.text,
            campus: option.rest.campus,
            semester: option.rest.period,
        };
        setSearchUrl(getUrlForCourseResourceSpecificTab(course, pageLocation, false, true));
    };

    const courseResourceId = 'homepage-courseresource';

    return (
        <StandardCard
            fullHeight
            primaryHeader
            noPadding
            standardCardId="course-resources-panel"
            title={
                <Grid container>
                    <Grid item xs id={`${courseResourceId}-autocomplete-label`}>
                        {locale.homepagePanel.title}
                    </Grid>
                </Grid>
            }
        >
            <CourseResourceSearch
                displayType="compact"
                elementId={courseResourceId}
                navigateToCourseResourcePage={navigateToCourseResourcePage}
            />

            {!!account && !!account.current_classes && account.current_classes.length > 0 ? (
                <Grid container spacing={1} data-testid="your-courses" className={classes.myCourses}>
                    <Grid item xs={12}>
                        <Typography component={'h4'} variant={'h6'}>
                            {locale.homepagePanel.userCourseTitle}
                        </Typography>
                    </Grid>
                    {account.current_classes.map((item, index) => {
                        return (
                            <Grid
                                item
                                xs={12}
                                data-testid={`hcr-${index}`}
                                key={`hcr-${index}`}
                                style={{ textIndent: '-5rem', marginLeft: '5rem', paddingBottom: 8 }}
                            >
                                <Link to={getUrlForCourseResourceSpecificTab(item, pageLocation)}>
                                    {item.classnumber}
                                </Link>
                                {' - '}
                                {item.DESCR}
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

CourseResourcesPanel.propTypes = {
    account: PropTypes.object,
    history: PropTypes.object,
};

export default withRouter(CourseResourcesPanel);
