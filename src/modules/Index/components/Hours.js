import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { default as locale } from './locale';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
    scrollArea: {
        height: 275,
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: -16,
        marginTop: -16,
        marginBottom: -24,
        marginLeft: -16,
        padding: 8,
        color: theme.palette.secondary.dark,
    },
}));

const Hours = ({ libHours, libHoursLoading }) => {
    console.log(libHours, libHoursLoading);
    const classes = useStyles();
    if (!!libHoursLoading) {
        return null;
    }
    return (
        <StandardCard accentHeader title="Library hours" fullHeight>
            <div className={classes.scrollArea}>
                {locale.Hours.map((item, index) => {
                    return (
                        <Grid
                            container
                            spacing={2}
                            key={index}
                            style={{ borderBottom: '1px solid #EEE', padding: '8px 0 0 0' }}
                        >
                            <Grid item xs={5}>
                                {!!item.iconInfo ? (
                                    <Tooltip
                                        title={item.iconInfo || null}
                                        placement="right"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <a href={item.link} style={{ marginLeft: 8 }}>
                                            {item.title}
                                        </a>
                                    </Tooltip>
                                ) : (
                                    <a href={item.link} style={{ marginLeft: 8 }}>
                                        {item.title}
                                    </a>
                                )}
                            </Grid>
                            <Grid item xs>
                                {item.hours}
                            </Grid>
                            <Grid item xs={'auto'}>
                                {!!item.iconInfo ? (
                                    <Tooltip title={item.iconInfo} placement="left" TransitionProps={{ timeout: 300 }}>
                                        {item.icon}
                                    </Tooltip>
                                ) : (
                                    item.icon
                                )}
                            </Grid>
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
