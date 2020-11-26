import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { withRouter } from 'react-router-dom';

import { getCampusByCode } from 'helpers/general';
import { fullPath } from 'config/routes';
import { courseResourcesLocale as locale } from './CourseResources.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CourseResourceSearch } from 'modules/SharedComponents/CourseResourceSearch';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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

    const navigateToCourseResourcePage = (option, searchKeyword) => {
        if (!!option.text && searchKeyword.toUpperCase().startsWith(option.text.toUpperCase())) {
            const course = {
                classnumber: option.text,
                campus: option.rest.campus,
                semester: option.rest.period,
            };
            setSearchUrl(getUrlForCourseResourceSpecificTab(course, pageLocation, false, true));
        }
    };

    return (
        <StandardCard
            fullHeight
            accentHeader
            noPadding
            standardCardId="course-resources-panel"
            title={
                <Grid container>
                    <Grid item xs>
                        {locale.title}
                    </Grid>
                </Grid>
            }
        >
            <CourseResourceSearch
                displayType="compact"
                elementId="homepage-courseresource"
                navigateToCourseResourcePage={navigateToCourseResourcePage}
            />

            {!!account && !!account.current_classes && account.current_classes.length > 0 && (
                <div
                    style={{
                        height: 275,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        marginRight: -16,
                        marginTop: 4,
                        marginBottom: -24,
                        marginLeft: -16,
                        padding: '0 30px 8px',
                    }}
                >
                    <Grid container spacing={1} style={{ marginTop: 12, marginLeft: 4 }} data-testid="your-courses">
                        <Grid item xs={12}>
                            <Typography color={'secondary'} component={'h4'} variant={'h6'}>
                                {locale.userCourseTitle}
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
                </div>
            )}
        </StandardCard>
    );
};

CourseResourcesPanel.propTypes = {
    account: PropTypes.object,
    history: PropTypes.object,
};

export default withRouter(CourseResourcesPanel);
