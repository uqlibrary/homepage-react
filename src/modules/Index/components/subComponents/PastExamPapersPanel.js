import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { fullPath } from 'config/routes';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SubjectSearchDropdown } from 'modules/SharedComponents/SubjectSearchDropdown';
import { isLibraryStaff, isLoggedInUser } from 'helpers/access';

export const getPastExamPaperUrlForSubject = (item, pageLocation, includeFullPath = false) => {
    const examPath = `/${item.classnumber.toLowerCase()}`;
    const prefix = `${includeFullPath ? fullPath : ''}/exams/course`;
    const url =
        !!pageLocation.search && pageLocation.search.indexOf('?') === 0
            ? `${prefix}${examPath}${pageLocation.search}` // eg include ?user=s1111111
            : `${prefix}${examPath}`;
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
        [navigate],
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
        setSearchUrl(getPastExamPaperUrlForSubject(course, pageLocation, false, true));
    };

    const pageId = 'homepage-pastexampapers';

    let displayedClasses = [];
    const hasClasses = account =>
        isLoggedInUser(account) && !!account.current_classes && account.current_classes.length > 0;
    if (hasClasses(account)) {
        displayedClasses = account.current_classes;
    } else if (isLibraryStaff(account)) {
        displayedClasses = [
            {
                DESCR: 'Introductory French 1',
                SUBJECT: 'FREN',
                CATALOG_NBR: '1010',
                classnumber: 'FREN1010',
            },
            {
                DESCR: 'Basic Mathematics',
                SUBJECT: 'MATH',
                CATALOG_NBR: '1040',
                classnumber: 'MATH1040',
            },
            {
                DESCR: 'Mechanics & Thermal Physics I',
                SUBJECT: 'PHYS',
                CATALOG_NBR: '1001',
                classnumber: 'PHYS1001',
            },
        ];
    }
    return (
        <StandardCard
            subCard
            fullHeight
            primaryHeader
            noPadding
            standardCardId="past-exam-papers-homepage-panel"
            title="Past exam papers"
        >
            <SubjectSearchDropdown
                displayType="compact"
                elementId={pageId}
                navigateToLearningResourcePage={navigateToLearningResourcePage}
            />
            {!hasClasses(account) && isLibraryStaff(account) && (
                <Typography
                    component={'p'}
                    data-testid="staff-course-prompt"
                    style={{ paddingInline: '21px', marginTop: '10px' }}
                >
                    Students see enrolled courses. Example links below:
                </Typography>
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
                            Your courses
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
                                    to={getPastExamPaperUrlForSubject(item, pageLocation)}
                                    data-testid={`past-exam-papers-panel-course-link-${index}`}
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
                <div data-testid="no-enrolled-courses" style={{ margin: '-10px 24px 0' }}>
                    <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
                    <p>Search for subjects above.</p>
                </div>
            )}
        </StandardCard>
    );
};

PastExamPapersPanel.propTypes = {
    account: PropTypes.object,
};

export default PastExamPapersPanel;
