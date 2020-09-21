import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import { default as locale } from './locale.js';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    minimalFooter: {
        lineHeight: '20px',
        margin: '0 auto',
        maxWidth: '1200px',
        padding: '20px',
        textDecoration: 'none',
        '& div': {
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
            },
            fontSize: '14px',
        },
        '& li': {
            listStyle: 'none',
            padding: '0 0 4px 0',
        },
        '& ul': {
            listStyle: 'none',
        },
        '& h3': {
            fontSize: '17px',
            fontWeight: '500',
            color: '#fff',
            margin: 0,
        },
        '& a': {
            color: '#fff',
            fontWeight: 'bold',
        },
    },
    siteFooter: {
        borderTop: '1px solid rgba(255,255,255,0.3)',
        marginTop: '1rem',
        paddingTop: '1rem',
    },
    footerContent: {
        '& div': {
            paddingBottom: '4px',
        },
    },
    footerLegalDetails: {
        [theme.breakpoints.down('sm')]: {
            borderTop: '1px solid rgba(255,255,255,0.3)',
            marginTop: '1rem',
            paddingTop: '1rem',
        },
    },
});

export function MinimalFooter(props) {
    const { classes } = props;

    function renderLine(item, index) {
        if (item.type === 'link') {
            return (
                <a
                    href={item.linkTo}
                    key={`bottomBlock-line1-${index}`}
                    rel={!!item.relOpener || 'noopener noreferrer'}
                    target="_blank"
                    title={item.linktitle}
                    data-testid={item.dataTestid}
                >
                    {item.linkLabel}
                </a>
            );
        }
        if (item.type === 'header') {
            return <Typography variant={'h3'}>{item.text}</Typography>;
        }
        if (item.type === 'abbr') {
            return <abbr title={item.abbrTitle}>{item.abbrDisplay}</abbr>;
        }
        if (item.type === 'space') {
            return ' ';
        }
        if (item.type === 'text') {
            return item.text + ' ';
        }
        if (item.type === 'divider') {
            return ReactHtmlParser('&nbsp; | &nbsp;');
        }
        return <Fragment />;
    }

    return (
        <Grid container className={classes.minimalFooter} data-testid="minimal-footer" spacing={3}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} md={9} className={classes.footerContent}>
                        <div>
                            {locale.minimalFooter.leftColumn.line1.map((item, index) => {
                                return renderLine(item, index);
                            })}
                        </div>
                        <div>
                            {locale.minimalFooter.leftColumn.line2.map((item, index) => {
                                return renderLine(item, index);
                            })}
                        </div>
                        <div>
                            {locale.minimalFooter.leftColumn.line3.map((item, index) => {
                                return renderLine(item, index);
                            })}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3} className={classes.footerLegalDetails}>
                        {locale.minimalFooter.rightColumn.line1.map((item, index) => {
                            return renderLine(item, index);
                        })}
                        {locale.minimalFooter.rightColumn.line2.map((item, index) => {
                            return renderLine(item, index);
                        })}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.siteFooter}>
                <div>
                    {locale.minimalFooter.bottomBlock.line1.map((item, index) => {
                        return renderLine(item, index);
                    })}
                </div>
            </Grid>
        </Grid>
    );
}

MinimalFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

MinimalFooter.defaultProps = {
    className: '',
    classes: {},
};

export default withStyles(styles, { withTheme: true })(MinimalFooter);
