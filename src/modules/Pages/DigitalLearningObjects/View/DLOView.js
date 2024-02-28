import React from 'react';
// import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const useStyles = makeStyles(theme => ({
    filterDisplayList: {
        listStyleType: 'none',
        paddingLeft: 0,
        '& li': {
            listStyleType: 'none',
            paddingBottom: 6,
        },
    },
    uqActionButton: {
        marginBlock: 32,
        '& a': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white.main,
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 6,
            padding: '8px 12px',
            fontWeight: 400,
            '&:hover': {
                backgroundColor: theme.palette.white.main,
                color: theme.palette.primary.main,
                textDecoration: 'none',
            },
        },
    },
    metaHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 12,
        '& > svg': {
            width: 30,
            paddingRight: 6,
        },
    },
    highlighted: {
        color: theme.palette.primary.light,
    },
}));

export const DLOView = ({ actions, dlorItem, dlorItemLoading, dlorItemError }) => {
    const { dlorId } = useParams();
    const classes = useStyles();

    React.useEffect(() => {
        if (!dlorItemError && !dlorItemLoading && !dlorItem) {
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!!dlorItemLoading) {
        return <p>loading</p>;
    }

    if (!!dlorItemError) {
        return <p>An error occurred: {dlorItemError}</p>;
    }

    if (!dlorItem || dlorItem.length === 0) {
        return <p>no objects</p>;
    }

    const cleanedFilters = [];
    !!dlorItem?.filters &&
        Object.entries(dlorItem.filters).map(([filterType, filterTypeList], index) => {
            const filterItem = {
                type: filterType,
                list: filterTypeList,
            };
            cleanedFilters.push(filterItem);
        });

    const deslugify = slug => {
        const words = slug.replace(/_/g, ' ');
        return words.charAt(0).toUpperCase() + words.slice(1);
    };

    // https://mui.com/material-ui/material-icons/?query=computer&selected=Laptop
    const MUI_ICON_LAPTOP =
        'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2zM4 6h16v10H4z';

    return (
        <React.Suspense
        // fallback={<ContentLoader message="Loading" />}
        >
            <StandardPage>
                <StandardCard className={classes.dlorEntry} title="Digital learning objects">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Typography className={classes.highlighted} component={'h1'} variant={'h4'}>
                                {dlorItem.object_title}
                            </Typography>
                            <p>{dlorItem.object_description}</p>
                            {dlorItem?.object_embed_type === 'link' && (
                                <div className={classes.uqActionButton}>
                                    <a href={dlorItem.object_link}>Access the module</a>
                                </div>
                            )}
                            {!!dlorItem.object_download_instructions && (
                                <React.Fragment>
                                    <Typography component={'h3'} variant={'h6'}>
                                        How to use this module
                                    </Typography>
                                    <p>{dlorItem.object_download_instructions}</p>
                                </React.Fragment>
                            )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography component={'h2'} variant={'h6'} className={classes.metaHeader}>
                                <svg
                                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i"
                                    focusable="false"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                >
                                    <path d={MUI_ICON_LAPTOP}></path>
                                </svg>
                                Details
                            </Typography>
                            {!!cleanedFilters && cleanedFilters.length > 0 ? (
                                <div>
                                    {cleanedFilters.map(filter => {
                                        return (
                                            <div key={filter.type}>
                                                <Typography
                                                    className={classes.highlighted}
                                                    component={'h3'}
                                                    variant={'h6'}
                                                >
                                                    {deslugify(filter.type)}
                                                </Typography>
                                                <ul className={classes.filterDisplayList}>
                                                    {!!filter.list &&
                                                        filter.list.map((value, subIndex) => {
                                                            return <li key={subIndex}>{value}</li>;
                                                        })}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>no filters</p>
                            )}
                        </Grid>
                    </Grid>
                </StandardCard>
            </StandardPage>
        </React.Suspense>
    );
};

DLOView.propTypes = {
    actions: PropTypes.any,
    dlorItem: PropTypes.object,
    dlorItemLoading: PropTypes.bool,
    dlorItemError: PropTypes.any,
};

export default React.memo(DLOView);
