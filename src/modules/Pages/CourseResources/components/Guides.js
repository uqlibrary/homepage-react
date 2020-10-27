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
        },
    }),
    { withTheme: true },
);

export const Guides = ({ guideList, guideListLoading, guideListError }) => {
    const classes = useStyles();

    console.log('guideList = ', guideList);
    return (
        <Grid container spacing={3} className={'guides'}>
            <Grid item xs={12}>
                <StandardCard style={{ marginBottom: '1rem' }} title={locale.myCourses.guides.title}>
                    <Grid container>
                        {guideListLoading && (
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
                                <CircularProgress color="primary" size={20} id="loading-suggestions" />
                            </Grid>
                        )}

                        {!!guideListError && <Typography>{locale.myCourses.guides.unavailableMessage}</Typography>}

                        {!guideListError && (!guideList || guideList.length === 0) && (
                            <Grid item xs={12} className={classes.courseResourceLineItem}>
                                <Typography>{locale.myCourses.guides.none}</Typography>
                            </Grid>
                        )}

                        {!!guideList &&
                            guideList.length > 0 &&
                            guideList.map((guide, index) => {
                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        className={classes.courseResourceLineItem}
                                        key={`guides-${index}`}
                                    >
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
                                id="allguideLists"
                                href="http://guides.library.uq.edu.au"
                            >
                                <SpacedArrowForwardIcon />
                                {locale.myCourses.guides.linkLabelFooter}
                            </a>
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
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
