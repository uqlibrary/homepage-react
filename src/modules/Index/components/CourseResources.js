import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

import { getCampusByCode } from 'helpers/general';
import fullPath from 'config/routes';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const CourseResources = ({ account }) => {
    const pageLocation = useLocation();

    const _navigateToCourseResourceSpecificTab = (item, includeFullPath = false) => {
        const campus = getCampusByCode(item.CAMPUS);
        const courseResourceParams = `coursecode=${item.classnumber}&campus=${campus}&semester=${item.semester}`;
        const prefix = `${includeFullPath ? fullPath : ''}/courseresources`;
        const landingUrl =
            !!pageLocation.search && pageLocation.search.indexOf('?') === 0
                ? `${prefix}${pageLocation.search}&${courseResourceParams}` // eg include ?user=s111111
                : `${prefix}?${courseResourceParams}`;
        return landingUrl;
    };

    return (
        <StandardCard
            fullHeight
            accentHeader
            title={
                <Grid container>
                    <Grid item xs>
                        Course resources
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={1}>
                <Grid item xs>
                    <TextField placeholder="Enter a course code to search" fullWidth />
                </Grid>
                <Grid item xs={'auto'}>
                    <Button size={'small'} style={{ width: 30, minWidth: 30 }}>
                        <SearchIcon />
                    </Button>
                </Grid>
            </Grid>
            {!!account && !!account.current_classes && account.current_classes.length > 0 && (
                <Grid container spacing={1} style={{ marginTop: 12 }}>
                    <Grid item xs={12}>
                        <Typography color={'secondary'} variant={'h6'}>
                            Your courses
                        </Typography>
                    </Grid>
                    {account.current_classes.map((item, index) => {
                        return (
                            <Grid item xs={12} key={`hcr-${index}`}>
                                <Link to={_navigateToCourseResourceSpecificTab(item)}>{item.classnumber}</Link>
                                {' - '}
                                {item.DESCR}
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </StandardCard>
    );
};

CourseResources.propTypes = {
    account: PropTypes.object,
};

export default CourseResources;
