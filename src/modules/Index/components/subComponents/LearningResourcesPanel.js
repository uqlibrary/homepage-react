import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { getCampusByCode } from 'helpers/general';
import { fullPath } from 'config/routes';
import { default as locale } from 'modules/Pages/LearningResources/shared/learningResources.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SubjectSearchDropdown } from 'modules/SharedComponents/SubjectSearchDropdown';
import { isLibraryStaff, isLoggedInUser } from 'helpers/access';

const StyledCourseListGridItem = styled('div')(() => ({
    marginLeft: '8px',
    h4: {
        fontSize: '20px',
        fontWeight: 500,
        letterSpacing: '0.2px',
        lineHeight: '160%', // 25.6px
    },
}));
const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.light,
    fontWeight: 500,
    paddingBlock: '2px',
    textDecoration: 'underline',
    transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
    '&:hover': {
        color: '#fff',
        backgroundColor: theme.palette.primary.light,
    },
}));

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
            ? `${prefix}${pageLocation.search}&${learningResourceParams}` // eg include ?user=s1111111
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

    let displayedClasses = [];
    const hasClasses = account =>
        isLoggedInUser(account) && !!account.current_classes && account.current_classes.length > 0;
    if (hasClasses(account)) {
        displayedClasses = account.current_classes;
    } else if (isLibraryStaff(account)) {
        // a list of hopefully permanent subjects so staff can click through to LR page easily
        // (and see the student experience)
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
            style={{
                border: '1px solid hsla(203, 50%, 30%, 0.15)',
                borderRadius: '4px',
            }}
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
            <SubjectSearchDropdown
                displayType="compact"
                elementId={learningResourceId}
                navigateToLearningResourcePage={navigateToLearningResourcePage}
            />

            {!hasClasses(account) && isLibraryStaff(account) && (
                <Typography
                    component={'p'}
                    data-testid="staff-course-prompt"
                    style={{ paddingInline: '21px', marginTop: '10px', fontWeight: 400 }}
                >
                    Students see enrolled courses. Example links below:
                </Typography>
            )}
            {displayedClasses && displayedClasses.length > 0 ? (
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
                    <StyledCourseListGridItem item xs={12}>
                        <Typography component={'h4'}>{locale.homepagePanel.userCourseTitle}</Typography>
                    </StyledCourseListGridItem>
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
                                <StyledLink
                                    to={getUrlForLearningResourceSpecificTab(item, pageLocation)}
                                    data-testid={`learning-resource-panel-course-link-${index}`}
                                >
                                    {item.classnumber}
                                </StyledLink>{' '}
                                {/* because the panel width is driven by window size, show a title
                                    so ellipsis doesn't hide some meaningful difference between course titles */}
                                <Typography component={'span'} style={{ fontWeight: 400 }} title={item.DESCR}>
                                    {item.DESCR}
                                </Typography>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <div style={{ marginLeft: 24, marginTop: -10, fontWeight: 400 }}>{locale.homepagePanel.noCourses}</div>
            )}
        </StandardCard>
    );
};

LearningResourcesPanel.propTypes = {
    account: PropTypes.object,
};

export default LearningResourcesPanel;
