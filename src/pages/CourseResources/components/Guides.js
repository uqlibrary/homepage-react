import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseresourceslocale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export const Guides = ({ guideList, guideListLoading, guideListError }) => {
    return (
        <StandardCard
            className="Guides"
            style={{ width: '100%', marginBottom: '1rem' }}
            title={locale.subject.guides.title}
        >
            <Grid>
                {guideListLoading && (
                    <Grid
                        item
                        xs={'auto'}
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

                {!!guideListError && <Typography>Library guides list currently unavailable</Typography>}

                {!guideListError && !!guideList && guideList.length === 0 && (
                    <Typography>{locale.subject.guides.unavailableMessage}</Typography>
                )}

                {!!guideList &&
                    guideList.length > 0 &&
                    guideList.map((guide, index) => {
                        return (
                            <Grid
                                container
                                key={`guides-${index}`}
                                style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
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

                <Grid container style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                    <a
                        // on-tap="linkClicked"
                        id="allguideLists"
                        href="http://guides.library.uq.edu.au"
                    >
                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                        {locale.subject.guides.allLibraryGuidesLabel}
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
