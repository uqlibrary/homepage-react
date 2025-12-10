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

const StyledHeadingGridItem = styled('div')(() => ({
    marginLeft: '8px',
    h4: {
        fontSize: '20px',
        fontWeight: 500,
        letterSpacing: '0.2px',
        lineHeight: '160%', // 25.6px
    },
}));
const StyledGridListItem = styled(Grid)(({ theme }) => ({
    paddingBottom: 8,
    marginLeft: '10px',
    listStyleType: 'disc',
    '& a': {
        marginLeft: '-5px',
        color: theme.palette.primary.main,
        fontWeight: 500,
        paddingBlock: '2px',
        textDecoration: 'none',
        transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
        '& .link': {
            textDecoration: 'underline',
            fontWeight: 500,
        },
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.main,
            textDecoration: 'none',
        },
    },
    '& .descriptor': {
        marginLeft: '95px',
        display: 'block',
        marginTop: '-25px',
        fontWeight: 400,
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
    const MAXIMUM_NUMBER_DISPLAYED_ENROLLED_COURSES = 5;

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
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        displayedClasses = [
            {
                DESCR: 'Introductory French 1',
                SUBJECT: 'FREN',
                CATALOG_NBR: '1010',
                classnumber: 'FREN1010',
                CAMPUS: 'STLUC',
                semester: `Semester 1 ${currentYear}`,
            },
            {
                DESCR: 'Basic Mathematics',
                SUBJECT: 'MATH',
                CATALOG_NBR: '1040',
                classnumber: 'MATH1040',
                CAMPUS: 'STLUC',
                semester: `Semester 1 ${currentYear}`,
            },
            {
                DESCR: 'Mechanics & Thermal Physics I',
                SUBJECT: 'PHYS',
                CATALOG_NBR: '1001',
                classnumber: 'PHYS1001',
                CAMPUS: 'STLUC',
                semester: `Semester 1 ${currentYear}`,
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
                    style={{ paddingInline: '21px', fontWeight: 400 }}
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
                        marginTop: 0,
                        marginLeft: -16,
                        padding: '0 30px',
                        marginBottom: '8px',
                    }}
                >
                    <StyledHeadingGridItem item xs={12}>
                        <Typography component={'h4'}>{locale.homepagePanel.userCourseTitle}</Typography>
                    </StyledHeadingGridItem>
                    {displayedClasses.length > 0 && (
                        <ul style={{ margin: '16px 0 0 24px', padding: 0, width: '100%' }}>
                            {displayedClasses.slice(0, MAXIMUM_NUMBER_DISPLAYED_ENROLLED_COURSES).map((item, index) => {
                                return (
                                    <StyledGridListItem
                                        item
                                        component={'li'}
                                        xs={12}
                                        data-testid={`hcr-${index}`}
                                        data-analyticsid={`hcr-${index}`}
                                        key={`hcr-${index}`}
                                    >
                                        <Link
                                            to={getUrlForLearningResourceSpecificTab(item, pageLocation)}
                                            data-testid={`learning-resource-panel-course-link-${index}`}
                                        >
                                            <Typography className={'link'} component={'span'}>
                                                {item.classnumber}
                                            </Typography>
                                        </Link>{' '}
                                        <Typography className={'descriptor'} component={'span'} title={item.DESCR}>
                                            {item.DESCR}
                                        </Typography>
                                    </StyledGridListItem>
                                );
                            })}
                        </ul>
                    )}
                    {displayedClasses.length > MAXIMUM_NUMBER_DISPLAYED_ENROLLED_COURSES && (
                        <Grid
                            item
                            xs={12}
                            style={{ marginTop: '8px', marginBottom: '22px', paddingLeft: '12px' }}
                            data-testid={'learning-resource-panel-course-multi-footer'}
                        >
                            <Link to={'/learning-resources'}>{`See all ${displayedClasses.length} classes`}</Link>
                        </Grid>
                    )}
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
