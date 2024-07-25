import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    border: '1px solid #d1d0d2' /* grey-300 */,
    '&.card': {
        overflow: 'unset',
        fontWeight: theme.typography.fontWeightRegular,
    },
    '& .cardContentNoPadding': {
        paddingTop: '0px !important',
        paddingBottom: '0px !important',
        paddingLeft: '0px !important',
        paddingRight: '0px !important',
    },
    '& .cardHeaderPrimary': {
        color: theme.palette.white.main,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        backgroundColor: theme.palette.primary.light,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
    '& .cardHeaderAccent': {
        color: theme.palette.white.main,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
}));

export class StandardCard extends Component {
    static propTypes = {
        title: PropTypes.any,
        primaryHeader: PropTypes.bool,
        accentHeader: PropTypes.bool,
        fullHeight: PropTypes.bool,
        noPadding: PropTypes.bool,
        noHeader: PropTypes.bool,
        children: PropTypes.any,
        customBackgroundColor: PropTypes.any,
        customTitleColor: PropTypes.any,
        customTitleBgColor: PropTypes.any,
        customTextColor: PropTypes.any,
        squareTop: PropTypes.bool,
        smallTitle: PropTypes.bool,
        standardCardId: PropTypes.string,
        subCard: PropTypes.bool,
        style: PropTypes.object,
        headerAction: PropTypes.any,
        headerProps: PropTypes.object,
        contentProps: PropTypes.object,
        variant: PropTypes.string,
        className: PropTypes.string,
    };

    render() {
        const {
            title,
            children,
            primaryHeader,
            accentHeader,
            smallTitle = false,
            subCard = false,
            style = {},
            headerAction,
            variant,
            className = '',
        } = this.props;
        const customBG = !!this.props.customBackgroundColor
            ? { backgroundColor: this.props.customBackgroundColor }
            : null;
        const customTitleBG = !!this.props.customTitleBgColor
            ? { backgroundColor: this.props.customTitleBgColor }
            : null;
        const customTitle = !!this.props.customTitleColor ? { color: this.props.customTitleColor } : null;
        const customText = !!this.props.customTextColor ? { color: `${this.props.customTextColor} !important` } : null;
        const fullHeight = !!this.props.fullHeight ? { height: '100%' } : null;
        const squareTop = !!this.props.squareTop
            ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 }
            : { borderTopLeftRadius: 4, borderTopRightRadius: 4 };
        const standardCardId = !!this.props.standardCardId
            ? this.props.standardCardId
            : `standard-card${
                  typeof title === 'string'
                      ? `-${title
                            .replace(/ /g, '-')
                            .replace(/"/g, "'")
                            .toLowerCase()}`
                      : /* istanbul ignore next */ ''
              }`;
        const cardHeaderAction = !!headerAction ? headerAction : <></>;
        return (
            <StyledCard
                data-testid={standardCardId}
                data-analyticsid={standardCardId}
                id={standardCardId}
                className={`card StandardCard ${className}`}
                sx={{ ...customBG, ...fullHeight, ...style }}
                variant={variant ?? 'elevation'}
            >
                {!this.props.noHeader && (
                    <CardHeader
                        style={{ ...squareTop, ...customTitleBG, ...customTitle }}
                        title={title}
                        titleTypographyProps={{
                            variant: smallTitle ? 'h6' : 'h5',
                            component: subCard ? 'h3' : 'h2',
                            color: 'inherit',
                            'data-testid': `${standardCardId}-header`,
                        }}
                        classes={{
                            root: (primaryHeader && 'cardHeaderPrimary') || (accentHeader && 'cardHeaderAccent'),
                        }}
                        action={cardHeaderAction}
                        {...this.props.headerProps}
                    />
                )}
                <CardContent
                    data-testid={`${standardCardId}-content`}
                    className={`${(this.props.noPadding && 'cardContentNoPadding') || ''}${
                        this.props?.contentProps?.className ? ` ${this.props?.contentProps?.className}` : ''
                    }`}
                    style={{ ...customText }}
                >
                    {children}
                </CardContent>
            </StyledCard>
        );
    }
}

export default StandardCard;
