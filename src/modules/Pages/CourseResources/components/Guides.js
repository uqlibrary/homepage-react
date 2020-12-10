import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseResourcesLocale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

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

    const coursecode = !!guideList && !!guideList.length > 0 && guideList[0].coursecode;
    return (
        <StandardCard fullHeight noHeader standardCardId={`guides-${coursecode}`}>
            <Typography component="h4" variant="h6" style={{ paddingBottom: '15px', fontWeight: 300 }}>
                {locale.myCourses.guides.title}
            </Typography>
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

                {!!guideListError && (
                    /* istanbul ignore next */
                    <Typography>{locale.myCourses.guides.unavailable}</Typography>
                )}

                {!guideListError && !guideListLoading && (!guideList || guideList.length === 0) && (
                    <Grid item xs={12} data-testid="no-guides" className={classes.courseResourceLineItem}>
                        <Typography>{locale.myCourses.guides.none}</Typography>
                    </Grid>
                )}

                {!guideListError &&
                    !guideListLoading &&
                    !!guideList &&
                    guideList.length > 0 &&
                    guideList.slice(0, locale.myCourses.guides.visibleItemsCount).map((guide, index) => {
                        return (
                            <Grid item xs={12} className={classes.courseResourceLineItem} key={`guides-${index}`}>
                                <a
                                    aria-label={`library guide for ${guide.title}`}
                                    className="library-guide-item"
                                    data-title="guideListItem"
                                    href={guide.url}
                                    key={`guide-${index}`}
                                >
                                    {guide.title}
                                </a>
                            </Grid>
                        );
                    })}

                {!!locale.myCourses.guides.footer.links &&
                    locale.myCourses.guides.footer.links.length > 0 &&
                    locale.myCourses.guides.footer.links.map((item, index) => {
                        /* istanbul ignore next */
                        const dataTestId = item.id || null;
                        return (
                            item.linkTo &&
                            item.linkLabel && (
                                <Grid
                                    item
                                    className={classes.courseResourceLineItem}
                                    key={`studylink-${index}`}
                                    xs={12}
                                >
                                    <a data-testid={dataTestId} id={dataTestId} href={item.linkTo}>
                                        {!!item.icon && item.icon}
                                        {item.linkLabel}
                                    </a>
                                </Grid>
                            )
                        );
                    })}
            </Grid>
        </StandardCard>
    );
};

Guides.propTypes = {
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.any,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.any,
    actions: PropTypes.object,
};

export default React.memo(Guides);
