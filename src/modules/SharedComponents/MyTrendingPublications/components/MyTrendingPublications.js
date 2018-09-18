import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {locale} from 'locale';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';

const styles = {
    pubCounts: {
        // color: theme.palette.accent.main,
        '& .citationMetrics': {
            '& .count': {
                fontSize: '1.75rem'
            },
            '& .difference': {
                fontSize: '1rem',
            }
        }
    }
};

export class MyTrendingPublications extends PureComponent {
    static propTypes = {
        trendingPublicationsList: PropTypes.array,
        loadingTrendingPublications: PropTypes.bool,
        actions: PropTypes.object,
        accountAuthorDetailsLoading: PropTypes.bool,
        classes: PropTypes.object
    };

    static defaultProps = {
        trendingPublicationsList: [],
        loadingTrendingPublications: false
    };

    componentDidMount() {
        if (!this.props.accountAuthorDetailsLoading) {
            this.props.actions.searchTrendingPublications(locale.components.myTrendingPublications.recordsPerSource);
        }
    }

    rainbowClass = () => {
        let totalCount = 0;
        this.props.trendingPublicationsList.map((key) => {
            totalCount = totalCount + key.values.length;
        });
        return totalCount;
    };

    render() {
        console.log(this.rainbowClass());
        const txt = locale.components.myTrendingPublications;
        if (this.props.loadingTrendingPublications) {
            return (
                <Grid container alignItems={'center'}>
                    <Grid item>
                        <InlineLoader message={txt.loading}/>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container spacing={24} id={'myTrendingPublications'}>
                <Grid item xs={12}>
                    {
                        this.props.trendingPublicationsList.map(({key, values}, metricIndex) => (
                            <Grid container key={metricIndex} spacing={24}>
                                <Grid item xs>
                                    <Typography variant={'title'}>
                                        <div className={`fez-icon ${key} xxlarge`}/>
                                        {txt.metrics[key].title}
                                    </Typography>
                                    <Typography variant={'subheading'}>{txt.metrics[key].subtitle}</Typography>
                                </Grid>
                                <Grid item>
                                    <HelpIcon {...locale.components.trendingPublicationHelp}/>
                                </Grid>
                                <Grid item xs={12} className={this.props.classes.pubCounts}>
                                    <PublicationsList
                                        publicationsList={values}
                                        showMetrics
                                    />
                                </Grid>
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(MyTrendingPublications);

