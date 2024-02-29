import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import DescriptionIcon from '@mui/icons-material/Description';
import LaptopIcon from '@mui/icons-material/Laptop';
import CopyrightIcon from '@mui/icons-material/Copyright';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { loadAllFilters } from '../../../../data/actions';

const useStyles = makeStyles(theme => ({
    panelGap: {
        [theme.breakpoints.up('md')]: {
            paddingLeft: 16,
        },
        [theme.breakpoints.down('md')]: {
            paddingTop: 16,
        },
    },
    panelGrid: {
        paddingLeft: 12,
        paddingRight: 12,
        marginBlock: 6,
        display: 'flex',
        alignItems: 'stretch',
    },
    // dlorCard: {
    //     border: '1px solid green',
    //     '& > div': {
    //         border: '1px solid blue',
    //     },
    // },
    article: {
        // border: '1px solid red',
        '& header': {
            '& h2': {
                lineHeight: 1.3,
            },
            // backgroundColor: '#ffffd1',
        },
        '& footer': {
            marginTop: 24,
            color: theme.palette.primary.light,
            fontWeight: 400,
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                paddingBlock: 3,
            },
            '& svg': {
                width: 20,
                paddingRight: 4,
                '& > path': {
                    fill: theme.palette.primary.light,
                },
            },
            // backgroundColor: '#dbffd6',
        },
    },
    // articleContents: {
    //     backgroundColor: '#fbe4ff',
    // },
    highlighted: {
        color: theme.palette.primary.light,
    },
    navigateToDetail: {
        '&:hover': {
            textDecoration: 'none',
            '& > div': {
                backgroundColor: '#f2f2f2',
            },
        },
    },
}));

export const DLOList = ({
    actions,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
}) => {
    const classes = useStyles();

    console.log('loading=', dlorFilterListLoading, 'error=', dlorFilterListError, 'list=', dlorFilterList);

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function showPanel(object) {
        return (
            <Grid
                item
                xs={12}
                md={4}
                className={classes.panelGap}
                key={object.object_id}
                data-testid={`dlor-homepage-panel-${object.object_public_uuid}`}
            >
                <a className={classes.navigateToDetail} href={`/dlor/view/${object.object_public_uuid}`}>
                    <StandardCard noHeader fullHeight className={classes.dlorCard}>
                        <article className={classes.article}>
                            <header>
                                {!!object?.filters?.topic && object.filters.topic.length > 0 && (
                                    <Typography className={classes.highlighted}>
                                        {object.filters.topic.join(', ')}
                                    </Typography>
                                )}
                                <Typography component={'h2'} variant={'h6'}>
                                    {object.object_title}
                                </Typography>
                            </header>
                            <div className={classes.articleContents}>
                                <p>{object.object_summary}</p>
                            </div>

                            <footer>
                                {!!object?.filters?.item_type && object.filters.item_type.length > 0 && (
                                    <div data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-type`}>
                                        <LaptopIcon />
                                        {object.filters.item_type.join(', ')}
                                    </div>
                                )}
                                {!!object?.filters?.media_format && object.filters.media_format.length > 0 && (
                                    <div data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-media`}>
                                        <DescriptionIcon />
                                        {object.filters.media_format.join(', ')}
                                    </div>
                                )}
                                {!!object?.filters?.licence && object.filters.licence.length > 0 && (
                                    <div
                                        data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-licence`}
                                    >
                                        <CopyrightIcon />
                                        {object.filters.licence.join(', ')}
                                    </div>
                                )}
                            </footer>
                        </article>
                    </StandardCard>
                </a>
            </Grid>
        );
    }

    return (
        <StandardPage>
            <Typography component={'h1'} variant={'h6'}>
                Digital learning objects
            </Typography>
            {(() => {
                if (!dlorList) {
                    return (
                        <div style={{ minHeight: 600 }}>
                            <InlineLoader message="Loading" />
                        </div>
                    );
                } else if (!!dlorListError) {
                    return (
                        <StandardPage>
                            <Typography component={'h1'} variant={'h6'}>
                                Digital learning objects
                            </Typography>
                            <p>An error occurred: {dlorListError}</p>
                        </StandardPage>
                    );
                } else if (dlorList.length === 0) {
                    return <p>We did not find any entries in the system - please try again later.</p>;
                } else {
                    return (
                        <Grid container spacing={3} className={classes.panelGrid} data-testid="dlor-homepage-list">
                            {dlorList.map(object => showPanel(object))}
                        </Grid>
                    );
                }
            })()}
        </StandardPage>
    );
};

DLOList.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
};

export default React.memo(DLOList);
