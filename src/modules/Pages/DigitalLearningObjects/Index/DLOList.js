import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

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
    icon: {
        width: 20,
        paddingRight: 4,
        '& > path': {
            fill: theme.palette.primary.light,
        },
    },
    panelHeader: {
        marginBottom: 24,
        '& .highlightedText': {
            color: theme.palette.primary.light,
            fontWeight: 400,
        },
    },
    panelFooter: {
        marginTop: 24,
        color: theme.palette.primary.light,
        fontWeight: 400,
        '& > div': {
            display: 'flex',
            alignItems: 'center',
            paddingBlock: 3,
        },
    },
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

export const DLOList = ({ actions, dlorList, dlorListLoading, dlorListError }) => {
    const classes = useStyles();

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // https://mui.com/material-ui/material-icons/?query=note&selected=Description
    const MUI_DESCRIPTION_ICON =
        'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z';
    // https://mui.com/material-ui/material-icons/?query=computer&selected=Laptop
    const MUI_ICON_LAPTOP =
        'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2zM4 6h16v10H4z';
    // https://mui.com/material-ui/material-icons/?query=copyright&selected=Copyright
    const MUI_COPYRIGHT_ICON =
        'M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8';
    const FooterIcon = iconsvg => (
        <svg className={classes.icon} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
            <path d={iconsvg} />
        </svg>
    );

    function showPanel(object) {
        return (
            <Grid item xs={12} md={4} className={classes.panelGap} key={object.object_id}>
                <a className={classes.navigateToDetail} href={`/dlor/view/${object.object_public_uuid}`}>
                    <StandardCard noHeader fullHeight className={classes.dlorEntry}>
                        <section>
                            <header className={classes.panelHeader}>
                                {!!object?.filters?.topic && object.filters.topic.length > 0 && (
                                    <Typography className={classes.highlighted}>
                                        {object.filters.topic.join(', ')}
                                    </Typography>
                                )}
                                <Typography component={'h3'} variant={'h6'}>
                                    {object.object_title}
                                </Typography>
                            </header>
                            {object.object_description}

                            <footer className={classes.panelFooter}>
                                {!!object?.filters?.item_type && object.filters.item_type.length > 0 && (
                                    <div>
                                        {FooterIcon(MUI_ICON_LAPTOP)}
                                        {object.filters.item_type.join(', ')}
                                    </div>
                                )}
                                {!!object?.filters?.media_format && object.filters.media_format.length > 0 && (
                                    <div>
                                        {FooterIcon(MUI_DESCRIPTION_ICON)}
                                        {object.filters.media_format.join(', ')}
                                    </div>
                                )}
                                {!!object?.filters?.licence && object.filters.licence.length > 0 && (
                                    <div>
                                        {FooterIcon(MUI_COPYRIGHT_ICON)}
                                        {object.filters.licence.join(', ')}
                                    </div>
                                )}
                            </footer>
                        </section>
                    </StandardCard>
                </a>
            </Grid>
        );
    }

    if (!!dlorListLoading) {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }
    if (!!dlorListError) {
        return (
            <StandardPage>
                <Typography component={'h1'} variant={'h6'}>
                    Digital learning objects
                </Typography>
                <p>An error occurred: {dlorListError}</p>
            </StandardPage>
        );
    }

    return (
        <StandardPage>
            <Typography component={'h1'} variant={'h6'}>
                Digital learning objects
            </Typography>
            {!dlorList || dlorList.length === 0 ? (
                <p>We did not find any entries in the system - please try again later.</p>
            ) : (
                <Grid container spacing={3} className={classes.panelGrid}>
                    {dlorList.map(object => {
                        return showPanel(object);
                    })}
                </Grid>
            )}
        </StandardPage>
    );
};

DLOList.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
};

export default React.memo(DLOList);
