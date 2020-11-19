import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

import { getCampusByCode } from 'helpers/general';
import { fullPath } from 'config/routes';

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

export const CourseResourcesPanel = ({ account }) => {
    const pageLocation = useLocation();

    const searchKeywordSelected = (searchKeyword, suggestions) => {
        console.log('searchKeywordSelected: ', searchKeyword, ': ', suggestions);
    };

    return (
        <StandardCard
            fullHeight
            accentHeader
            noPadding
            title={
                <Grid container>
                    <Grid item xs>
                        Course resources
                    </Grid>
                </Grid>
            }
        >
            <CourseResourceSearch
                displayType="compact"
                elementId="homepage-courseresource"
                searchKeywordSelected={searchKeywordSelected}
                history={history}
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
                    <Grid container spacing={1} style={{ marginTop: 12, marginLeft: 4 }}>
                        <Grid item xs={12}>
                            <Typography color={'secondary'} variant={'h6'}>
                                Your courses
                            </Typography>
                        </Grid>
                        {account.current_classes.map((item, index) => {
                            return (
                                <Grid
                                    item
                                    xs={12}
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
};

export default CourseResourcesPanel;
