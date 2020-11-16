import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    scrollArea: {
        height: 300,
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        padding: 8,
        color: theme.palette.secondary.dark,
        // fontSize: 14,
    },
}));

const Hours = ({ libHours, libHoursLoading }) => {
    console.log(libHours);
    const classes = useStyles();
    if (!!libHoursLoading) {
        return null;
    }
    return (
        <StandardCard accentHeader title="Library hours" fullHeight noPadding>
            <Grid
                container
                spacing={1}
                style={{
                    backgroundColor: '#EEE',
                    width: '100%',
                    margin: 0,
                    paddingLeft: 8,
                    paddingRight: 24,
                    fontSize: 14,
                    fontWeight: 500,
                }}
            >
                <Grid item xs={4}>
                    Location
                </Grid>
                <Grid item xs={4}>
                    Study space
                </Grid>
                <Grid item xs={4}>
                    Service hours
                </Grid>
            </Grid>
            <div className={classes.scrollArea}>
                {!!libHours &&
                    libHours.locations.length > 1 &&
                    libHours.locations.map((item, index) => {
                        return (
                            <Grid
                                container
                                spacing={1}
                                key={index}
                                style={{ borderBottom: '1px solid #EEE', padding: '8px 0 0 0' }}
                                alignItems={'flex-start'}
                            >
                                <Grid item xs={4}>
                                    <a href={item.url} style={{ marginLeft: 8 }}>
                                        {item.abbr}
                                    </a>
                                </Grid>
                                {/* Study space Hours */}
                                {item.departments.length > 1 &&
                                    item.departments.map((item, index) => {
                                        console.log('departments:', item);
                                        if (item.name === 'Study space') {
                                            console.log('STUDY SPACE!');
                                            return (
                                                <Grid item xs={4} key={index} style={{ fontSize: 14 }}>
                                                    {item.rendered.replace(' - ', '-') || ''}
                                                </Grid>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                {/* Service Hours */}
                                {item.departments.length > 1 &&
                                    item.departments.map((item, index) => {
                                        if (item.name === 'Service') {
                                            console.log('SERVICE!');
                                            return (
                                                <Grid item xs={4} key={index} style={{ fontSize: 14 }}>
                                                    {item.rendered || ''}
                                                </Grid>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                            </Grid>
                        );
                    })}
            </div>
        </StandardCard>
    );
};

Hours.propTypes = {
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
};

Hours.defaultProps = {};

export default Hours;
