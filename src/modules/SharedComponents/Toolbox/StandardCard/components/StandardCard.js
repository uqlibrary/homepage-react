import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#f3f3f4', // grey-50
    border: '1px solid hsla(203, 50%, 30%, 0.15)',
    borderRadius: '4px',
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 1px 3px 0',
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
        backgroundColor: '#f3f3f4', // grey-50
        color: theme.palette.primary.light,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        borderRadius: '4px 4px 0px 0px',
        padding: '24px 24px 0',
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
    '& a': {
        color: theme.palette.primary.light,
        fontWeight: 500,
        paddingBlock: '2px',
        textDecoration: 'underline',
        transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.light,
        },
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
                            color: '#19151c',
                            fontSize: '1.5rem',
                            fontWeight: 500,
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
