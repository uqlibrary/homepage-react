import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { fullPath } from 'config/routes';
import { default as locale } from 'modules/Pages/LearningResources/shared/learningResources.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SubjectSearchDropdown } from 'modules/SharedComponents/SubjectSearchDropdown';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { isStaff } from '../../../../helpers/access';

export const getUrlForLearningResourceSpecificTab = (item, pageLocation, includeFullPath = false) => {
    const learningResourceParams = `/${item.classnumber.toLowerCase()}`;
    const prefix = `${includeFullPath ? fullPath : ''}/exams/course`;
    const url =
        !!pageLocation.search && pageLocation.search.indexOf('?') === 0
            ? `${prefix}${learningResourceParams}${pageLocation.search}` // eg include ?user=s1111111
            : `${prefix}${learningResourceParams}`;
    return url;
};

export const PastExamPapersPanel = ({ account }) => {
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

    let displayedClasses;
    if (account?.current_classes) {
        displayedClasses = account?.current_classes;
    } else if (isStaff(account)) {
        displayedClasses = [
            {
                DESCR: 'Introductory French 1',
                SUBJECT: 'FREN',
                CATALOG_NBR: '1010',
                classnumber: 'FREN1010',
            },
            {
                DESCR: 'The Australian Experience',
                SUBJECT: 'HIST',
                CATALOG_NBR: '1201',
                classnumber: 'HIST1201',
            },
            {
                DESCR: 'Introduction to Philosophy: What is Philosophy?',
                SUBJECT: 'PHIL',
                CATALOG_NBR: '1002',
                classnumber: 'PHIL1002',
            },
        ];
    }
    return (
        <StandardCard
            subCard
            style={{ border: '1px solid #d1d0d2' }}
            fullHeight
            primaryHeader
            noPadding
            standardCardId="learning-resources-homepage-panel"
            title="Past exam papers"
            // customTitleBgColor="white"
            // customTitleColor="#51247A"
        >
            <SubjectSearchDropdown
                displayType="compact"
                elementId={learningResourceId}
                navigateToLearningResourcePage={navigateToLearningResourcePage}
            />
            {!account?.current_classes && isStaff(account) && (
                <p style={{ paddingInline: '21px', marginTop: '10px' }}>
                    Students see enrolled courses. Example links below:
                </p>
            )}

            {!!displayedClasses && displayedClasses.length > 0 ? (
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
                    <Grid item xs={12} style={{ marginTop: '-8px' }}>
                        <Typography component={'h4'} variant={'h6'}>
                            {locale.homepagePanel.userCourseTitle}
                        </Typography>
                    </Grid>
                    {displayedClasses.map((item, index) => {
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
                <div style={{ marginLeft: 16 }}>
                    <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
                    <p>Search for learning resources above.</p>
                </div>
            )}
        </StandardCard>
    );
};

PastExamPapersPanel.propTypes = {
    account: PropTypes.object,
};

export default PastExamPapersPanel;
