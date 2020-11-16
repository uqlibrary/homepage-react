import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseResourcesLocale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/styles';

import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';

const useStyles = makeStyles(
    () => ({
        courseResourceLineItem: {
            borderTop: '1px solid #e8e8e8',
            padding: '15px 0',
            '& a': {
                display: 'flex',
                alignItems: 'center',
            },
        },
    }),
    { withTheme: true },
);

export const Guides = ({ guideList, guideListLoading, guideListError }) => {
    const classes = useStyles();

    return (
        <StandardCard fullHeight title={locale.myCourses.guides.title}>
            <Grid container className={'guides'}>
                {!!guideListLoading && (
                    <Grid
                        item
                        xs={12}
                        style={{
                            width: 80,
                            marginRight: 20,
                            marginBottom: 6,
                            opacity: 0.3,
                        }}
                    >
                        <CircularProgress color="primary" size={20} data-testid="loading-guide-suggestions" />
                    </Grid>
                )}

                {!!guideListError && <Typography>{locale.myCourses.guides.unavailable}</Typography>}

                {!guideListError && !guideListLoading && (!guideList || guideList.length === 0) && (
                    <Grid item xs={12} data-testid="no-guides" className={classes.courseResourceLineItem}>
                        <Typography>{locale.myCourses.guides.none}</Typography>
                    </Grid>
                )}

                {!guideListError &&
                    !guideListLoading &&
                    !!guideList &&
                    guideList.length > 0 &&
                    guideList.slice(0, locale.visibleItemsCount.libGuides).map((guide, index) => {
                        return (
                            <Grid item xs={12} className={classes.courseResourceLineItem} key={`guides-${index}`}>
                                <a
                                    aria-label={`library guide for ${guide.title}`}
                                    className="library-guide-item"
                                    data-title="guideListItem"
                                    href={guide.url}
                                    key={`guide-${index}`}
                                    // on-click="linkClicked"
                                >
                                    {guide.title}
                                </a>
                            </Grid>
                        );
                    })}

                <Grid item xs={12} className={classes.courseResourceLineItem}>
                    <a
                        // on-tap="linkClicked"
                        data-testid="all-guides"
                        href={locale.myCourses.guides.footer.linkOut}
                    >
                        <SpacedArrowForwardIcon />
                        {locale.myCourses.guides.footer.linkLabel}
                    </a>
                </Grid>
            </Grid>
        </StandardCard>
    );
};

Guides.propTypes = {
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
    learningResourcesList: PropTypes.any,
    learningResourcesListLoading: PropTypes.bool,
    learningResourcesListError: PropTypes.string,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.string,
    actions: PropTypes.object,
};

export default React.memo(Guides);
