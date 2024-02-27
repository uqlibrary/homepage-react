import React from 'react';
// import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const useStyles = makeStyles(
    theme => ({
        panelGap: {
            [theme.breakpoints.up('md')]: {
                paddingLeft: 16,
            },
            [theme.breakpoints.down('md')]: {
                paddingTop: 16,
            },
        },
        contentBlock1: {
            paddingLeft: 12,
            paddingRight: 12,
            marginBlock: 6,
            display: 'flex',
            alignItems: 'stretch',
        },
        // dlorEntry: {
        //     // border: 'thin solid black',
        //     backgroundColor: 'white',
        //     borderRadius: 4,
        //     boxShadow:
        //         '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        //     padding: 10,
        // },
        panelHeading: {
            color: '#2b2a29',
            paddingLeft: 12,
        },
        contentBlock2: {
            paddingLeft: 12,
            paddingRight: 12,
            marginBlock: 6,
        },
    }),
    { withTheme: true },
);

export const DLOView = ({ actions, dlorItem, dlorItemLoading, dlorItemError }) => {
    const params = useParams();
    const objectId = params.dlorid;
    console.log(
        'DLOView: objectId=',
        objectId,
        '; loading=',
        dlorItemLoading,
        '; error=',
        dlorItemError,
        '; item=',
        dlorItem,
    );
    const classes = useStyles();

    React.useEffect(() => {
        if (!dlorItemError && !dlorItemLoading && !dlorItem) {
            actions.loadADLOR(objectId);
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
    console.log('dlorItem.filters=', dlorItem.filters);
    // console.log('dlorItem.filters.length=', dlorItem.filters.length);
    !!dlorItem?.filters &&
        // dlorItem.filters.length > 0 &&
        Object.entries(dlorItem.filters).map(([filterType, filterTypeList], index) => {
            // dlorItem.filters.map((filterTypeList, filterType) => {
            const filterItem = {
                type: filterType,
                list: filterTypeList,
                // className: `chip_${filterType}`,
            };
            // console.log('filterType=', index, filterType);
            // console.log('filterTypeList=', filterTypeList);
            // console.log('filterItem=', filterItem);
            // console.log('----------');
            cleanedFilters.push(filterItem);
        });
    console.log('cleanedFilters=', cleanedFilters);

    // cleanedFilters.map((filter, index) => {
    //     console.log('filter.type=', index, filter.type);
    //     console.log('filter.list=', index, filter.list);
    // });

    console.log('dlorItem=', dlorItem);

    const deslugify = slug => {
        const words = slug.replace('_', ' ');
        return words.charAt(0).toUpperCase() + words.slice(1);
    };

    return (
        <React.Suspense
        // fallback={<ContentLoader message="Loading" />}
        >
            <StandardPage style={{ backgroundColor: '#f7f7f7', borderWidth: 0, borderRadius: 0 }}>
                <StandardCard className={classes.dlorEntry} title={dlorItem.object_title}>
                    <p>{dlorItem.object_description}</p>
                    <p>{dlorItem.object_download_instructions}</p>
                    <p>Supplied by: {dlorItem.owner.team_name}</p>
                    {!!dlorItem.object_embed_type && dlorItem.object_embed_type === 'link' && (
                        <a href={dlorItem.object_link}>View now</a>
                    )}
                    {!!cleanedFilters && cleanedFilters.length > 0 ? (
                        <div>
                            {cleanedFilters.map(filter => {
                                return (
                                    <div key={filter.type}>
                                        <Typography component={'h3'} variant={'h6'}>
                                            {deslugify(filter.type)}
                                        </Typography>
                                        <ul>
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
