import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import { default as locale } from '../footerLocale.js';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    minimalFooter: {
        lineHeight: '20px',
        margin: '0 auto',
        maxWidth: '1200px',
        padding: '20px 0',
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
            color: theme.palette.white.main,
            margin: 0,
        },
        '& a': {
            color: theme.palette.white.main,
            fontWeight: 'bold',
        },
    },
    siteFooter: {
        borderTop: '1px solid rgba(255,255,255,0.3)',
        marginTop: '1rem',
        paddingTop: '1rem',
    },
    footerContent: {
        paddingBottom: '4px',
    },
    footerLegalDetails: {
        textAlign: 'right',
        [theme.breakpoints.down('sm')]: {
            borderTop: '1px solid rgba(255,255,255,0.3)',
            marginTop: '1rem',
            paddingTop: '1rem',
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: 'auto',
            minWidth: '10rem',
        },
    },
    fullWidth: {
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    },
});

export function MinimalFooter(props) {
    const { classes } = props;

    function renderItem(item, index, key) {
        if (item.type === 'link') {
            return (
                <a
                    href={item.linkTo}
                    key={`${key}-${index}`}
                    rel={!!item.target && item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    target={!!item.target ? item.target : undefined}
                    title={!!item.linkMouseOver ? item.linkMouseOver : undefined}
                    data-testid={item.dataTestid}
                >
                    {item.linkLabel}
                </a>
            );
        }
        if (item.type === 'header') {
            return (
                <Typography variant={'h3'} key={`${key}-${index}`}>
                    {item.text}
                </Typography>
            );
        }
        if (item.type === 'abbr') {
            return (
                <abbr title={item.abbrMouseoverText} key={`${key}-${index}`}>
                    {item.abbrDisplay}
                </abbr>
            );
        }
        if (item.type === 'space') {
            return ' ';
        }
        if (item.type === 'text') {
            return item.text;
        }
        if (item.type === 'divider') {
            return ReactHtmlParser('&nbsp; | &nbsp;');
        }
        return <Fragment />;
    }

    return (
        <Grid container className={classes.minimalFooter} data-testid="minimal-footer">
            <Grid item xs={12} className={classes.fullWidth}>
                <Grid container>
                    <Grid item xs={12} md={10} className={classes.footerContent}>
                        {locale.minimalFooter.leftColumn.line1.map((item, index) => {
                            return renderItem(item, index, 'leftColumn-line1');
                        })}
                    </Grid>
                    <Grid item xs={12} md={10} className={classes.footerContent}>
                        {locale.minimalFooter.leftColumn.line2.map((item, index) => {
                            return renderItem(item, index, 'leftColumn-line2');
                        })}
                    </Grid>
                    <Grid item xs={12} md={10} className={classes.footerContent}>
                        {locale.minimalFooter.leftColumn.line3.map((item, index) => {
                            return renderItem(item, index, 'leftColumn-line3');
                        })}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={2} className={classes.footerLegalDetails}>
                        {locale.minimalFooter.rightColumn.line1.map((item, index) => {
                            return renderItem(item, index, 'rightColumn-line1');
                        })}
                        {locale.minimalFooter.rightColumn.line2.map((item, index) => {
                            return renderItem(item, index, 'rightColumn-line2');
                        })}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.siteFooter}>
                {locale.minimalFooter.bottomBlock.line1.map((item, index) => {
                    return renderItem(item, index, 'bottomBlock-line1');
                })}
            </Grid>
        </Grid>
    );
}

MinimalFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

MinimalFooter.defaultProps = {
    classes: {},
};

export default withStyles(styles, { withTheme: true })(MinimalFooter);
