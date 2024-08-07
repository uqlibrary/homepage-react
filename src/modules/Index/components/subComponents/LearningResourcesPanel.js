import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getCampusByCode } from 'helpers/general';
import { fullPath } from 'config/routes';
import { default as locale } from 'modules/Pages/LearningResources/shared/learningResources.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { LearningResourceSearch } from 'modules/SharedComponents/LearningResourceSearch';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const getUrlForLearningResourceSpecificTab = (
    item,
    pageLocation,
    includeFullPath = false,
    isAccurateCampus = false,
) => {
    const campus = isAccurateCampus ? item.campus : getCampusByCode(item.CAMPUS);
    const learningResourceParams = `coursecode=${item.classnumber}&campus=${campus}&semester=${item.semester}`;
    const prefix = `${includeFullPath ? fullPath : ''}/learning-resources`;
    const url =
        !!pageLocation.search && pageLocation.search.indexOf('?') === 0
            ? `${prefix}${pageLocation.search}&${learningResourceParams}` // eg include ?user=s111111
            : `${prefix}?${learningResourceParams}`;
    return url;
};

export const LearningResourcesPanel = ({ account }) => {
    const pageLocation = useLocation();
    const navigate = useNavigate();

    const [searchUrl, setSearchUrl] = React.useState('');
    const loadSearchResult = React.useCallback(
        searchUrl => {
            searchUrl !== '' && navigate(searchUrl);
        },
        [pageLocation],
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
                <Grid
                    container
                    spacing={1}
                    data-testid="your-courses"
                    style={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        marginRight: -16,
                        marginTop: 4,
                        marginLeft: -16,
                        padding: '0 30px 8px',
                    }}
                >
                    <Grid item xs={12}>
                        <Typography component={'h3'} variant={'h6'}>
                            {locale.homepagePanel.userCourseTitle}
                        </Typography>
                    </Grid>
                    {account.current_classes.map((item, index) => {
                        return (
                            <Grid
                                item
                                xs={12}
                                data-testid={`hcr-${index}`}
                                data-analyticsid={`hcr-${index}`}
                                key={`hcr-${index}`}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    paddingBottom: 8,
                                }}
                            >
                                <Link
                                    to={getUrlForLearningResourceSpecificTab(item, pageLocation)}
                                    data-testid={`learning-resource-panel-course-link-${index}`}
                                >
                                    {item.classnumber}
                                </Link>{' '}
                                {/* because the panel width is driven by window size, show a title
                                    so ellipsis doesn't hide some meaningful difference between course titles */}
                                <span title={item.DESCR}>{item.DESCR}</span>
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
};

export default LearningResourcesPanel;
