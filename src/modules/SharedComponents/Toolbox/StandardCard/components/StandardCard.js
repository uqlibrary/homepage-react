import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';

export const styles = theme => ({
    card: {
        overflow: 'unset',
        fontWeight: theme.typography.fontWeightRegular,
    },
    cardContentNoPadding: {
        paddingTop: '0px !important',
        paddingBottom: '0px !important',
        paddingLeft: '0px !important',
        paddingRight: '0px !important',
    },
    cardHeaderPrimary: {
        color: theme.palette.white.main,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        backgroundColor: theme.palette.primary.light,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
    cardHeaderAccent: {
        color: theme.palette.white.main,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
    fullHeight: {
        height: '100%',
    },
});

export class Cards extends Component {
    static propTypes = {
        title: PropTypes.any,
        primaryHeader: PropTypes.bool,
        accentHeader: PropTypes.bool,
        fullHeight: PropTypes.bool,
        noPadding: PropTypes.bool,
        noHeader: PropTypes.bool,
        children: PropTypes.any,
        classes: PropTypes.object.isRequired,
        customBackgroundColor: PropTypes.any,
        customTitleColor: PropTypes.any,
        customTitleBgColor: PropTypes.any,
        customTextColor: PropTypes.any,
        squareTop: PropTypes.bool,
        smallTitle: PropTypes.bool,
        standardCardId: PropTypes.string,
        subCard: PropTypes.bool,
        style: PropTypes.object,
    };

    render() {
        const {
            classes,
            title,
            children,
            primaryHeader,
            accentHeader,
            smallTitle = false,
            subCard = false,
            style = {},
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
        return (
            <Card
                data-testid={standardCardId}
                id={standardCardId}
                className={`${classes.card} StandardCard`}
                style={{ ...customBG, ...fullHeight, ...style }}
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
                            root:
                                (primaryHeader && classes.cardHeaderPrimary) ||
                                (accentHeader && classes.cardHeaderAccent),
                        }}
                    />
                )}
                <CardContent
                    data-testid={`${standardCardId}-content`}
                    className={`${(this.props.noPadding && classes.cardContentNoPadding) || ''}`}
                    style={{ ...customText }}
                >
                    {children}
                </CardContent>
            </Card>
        );
    }
}

const StyledCard = withStyles(styles, { withTheme: true })(Cards);
export const StandardCard = props => <StyledCard {...props} />;
export default StandardCard;
