import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    minimalFooter: {
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '20px',
        margin: '0 auto',
        maxWidth: '1200px',
        padding: '20px',
        textDecoration: 'none',
        '& div': {
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
            },
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
    return (
        <Grid container className={`${classes.minimalFooter}`} data-testid="minimal-footer" spacing={3}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} md={9} className={`${classes.footerContent}`}>
                        <div>&copy; The University of Queensland</div>
                        <div>
                            Enquiries:{' '}
                            <a
                                href="tel:+61733651111"
                                title="UQ Enquiries phone number"
                                data-testid="footer-enquiries-link"
                            >
                                +61 7 3365 1111
                            </a>{' '}
                            &nbsp; | &nbsp;{' '}
                            <a
                                href="http://uq.edu.au/contacts"
                                rel="noopener noreferrer"
                                data-testid="footer-contacts-link"
                            >
                                Contact directory
                            </a>
                        </div>
                        <div>
                            <abbr title="Australian Business Number">ABN</abbr>: 63 942 912 684 &nbsp; | &nbsp;{' '}
                            <abbr title="Commonwealth Register of Institutions and Courses for Overseas Students">
                                CRICOS
                            </abbr>{' '}
                            Provider No:{' '}
                            <a
                                href="https://www.uq.edu.au/about/cricos-link"
                                rel="noopener noreferrer"
                                title="Provider number"
                                data-testid="footer-cricos-link"
                            >
                                00025B
                            </a>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3} className={`${classes.footerLegalDetails}`}>
                        <Typography variant={'h3'}>Emergency</Typography>
                        Phone:{' '}
                        <a
                            href="tel:+61733653333"
                            title="UQ Emergency phone number"
                            data-testid="footer-emergency-link"
                        >
                            3365 3333
                        </a>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={`${classes.siteFooter}`}>
                <div>
                    <a
                        href="https://www.uq.edu.au/terms-of-use/"
                        rel="noopener noreferrer"
                        data-testid="footer-terms-link"
                    >
                        Privacy &amp; Terms of use
                    </a>{' '}
                    &nbsp; | &nbsp;
                    <a
                        href="https://support.my.uq.edu.au/app/library/feedback"
                        rel="noopener noreferrer"
                        data-testid="footer-feedback-link"
                    >
                        Feedback
                    </a>
                </div>
            </Grid>
        </Grid>
    );
}

MinimalFooter.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

MinimalFooter.defaultProps = {
    className: '',
    classes: {},
};

export default withStyles(styles, { withTheme: true })(MinimalFooter);
