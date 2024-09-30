import React from 'react';
import PropTypes from 'prop-types';

import locale from '../shared/learningResources.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledItem = styled(Grid)(() => ({
    borderTop: '1px solid #e8e8e8',
    padding: '15px 0',
    '& a': {
        display: 'flex',
        alignItems: 'center',
    },
}));

export const Guides = ({ headingLevel, guideList, guideListLoading, guideListError }) => {
    const coursecode = !!guideList && !!guideList.length > 0 && guideList[0].coursecode;
    return (
        <StandardCard fullHeight noHeader standardCardId={`guides-${coursecode}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 300 }}>
                {locale.myCourses.guides.title}
            </Typography>
            <Grid container className={'guides'}>
                {!!guideListError && (
                    /* istanbul ignore next */
                    <Typography>{locale.myCourses.guides.unavailable}</Typography>
                )}
                {!guideListError && !!guideListLoading && (
                    <Grid item xs={12} style={{ width: 80, opacity: 0.3 }}>
                        <CircularProgress
                            color="primary"
                            size={20}
                            data-testid="loading-guide-suggestions"
                            aria-label="Loading guides"
                        />
                    </Grid>
                )}
                {!guideListError && !guideListLoading && (!guideList || guideList.length === 0) && (
                    <StyledItem item xs={12} data-testid="no-guides">
                        <Typography>{locale.myCourses.guides.none}</Typography>
                    </StyledItem>
                )}
                {!guideListError &&
                    !guideListLoading &&
                    !!guideList &&
                    guideList.length > 0 &&
                    guideList.slice(0, locale.myCourses.guides.visibleItemsCount).map((guide, index) => {
                        return (
                            <StyledItem item xs={12} key={`guides-${index}`}>
                                <a
                                    aria-label={`library guide for ${guide.title}`}
                                    className="library-guide-item"
                                    data-title="guideListItem"
                                    data-testid={`guide-${index}`}
                                    href={guide.url}
                                    key={`guide-${index}`}
                                >
                                    {guide.title}
                                </a>
                            </StyledItem>
                        );
                    })}
                {/* guides doesnt display a 'view N more' link because Guides doesnt have a search-by-course-code fn*/}
                {!!locale.myCourses.guides.footer.links &&
                    locale.myCourses.guides.footer.links.length > 0 &&
                    locale.myCourses.guides.footer.links.map((item, index) => {
                        const dataTestId = item.id || /* istanbul ignore next */ null;
                        return (
                            item.linkTo &&
                            item.linkLabel && (
                                <StyledItem item key={`studylink-${index}`} xs={12}>
                                    <a data-testid={dataTestId} id={dataTestId} href={item.linkTo}>
                                        {!!item.icon && item.icon}
                                        {item.linkLabel}
                                    </a>
                                </StyledItem>
                            )
                        );
                    })}
            </Grid>
        </StandardCard>
    );
};

Guides.propTypes = {
    actions: PropTypes.object,
    headingLevel: PropTypes.string,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.any,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.any,
};

export default React.memo(Guides);
