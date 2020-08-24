import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ImageGallery from 'react-image-gallery';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/ToolTip';
import Typography from '@material-ui/core/Typography';
import { mui1theme } from 'config';
import PrintIcon from '@material-ui/icons/Print';
import MenuBookIcon from '@material-ui/icons/MenuBook';
const moment = require('moment');
const useStyles = makeStyles(
    theme => ({
        searchPanel: {
            padding: 0,
        },
        selectInput: {
            fontSize: 24,
            fontWeight: 300,
            color: theme.palette.primary.main,
        },
        searchUnderlinks: {
            fontSize: 12,
            '&a:link, a:hover, a:visited, a:active': {
                color: theme.palette.primary.main + ' !important',
            },
        },
    }),
    { withTheme: true },
);

export const Index = ({}) => {
    const classes = useStyles();
    const images = [
        {
            original: 'https://app.library.uq.edu.au/file/public/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
        },
        {
            original: 'https://app.library.uq.edu.au/file/public/8bb2b540-dc32-11ea-9810-53ef2bd221b3.jpg',
        },
        {
            original: 'https://app.library.uq.edu.au/file/public/adaa3870-dad2-11ea-ae85-8b875639d1ad.jpg',
        },
    ];
    const greeting = () => {
        const time = moment().format('H');
        if (time < 12) {
            return 'Good morning';
        } else if (time >= 12 && time < 18) {
            return 'Good afternoon';
        } else {
            return 'Good evening';
        }
    };
    console.log(greeting());
    return (
        <StandardPage>
            <div className="layout-card">
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs>
                        <TextField
                            id="standard-basic"
                            placeholder="Search the UQ Library..."
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.selectInput,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl style={{ minWidth: '100%' }}>
                            <InputLabel id="demo-simple-select-label" autoFocus>
                                Search within
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={10}
                                className={classes.selectInput}
                                // onChange={handleChange}
                            >
                                <MenuItem value={10}>Library</MenuItem>
                                <MenuItem value={20}>Books</MenuItem>
                                <MenuItem value={30}>Journal articles</MenuItem>
                                <MenuItem value={30}>Journal articles</MenuItem>
                                <MenuItem value={30}>Video & Audio</MenuItem>
                                <MenuItem value={30}>Journals</MenuItem>
                                <MenuItem value={30}>Physical items</MenuItem>
                                <MenuItem value={30}>Databases</MenuItem>
                                <MenuItem value={30}>Past exam papers</MenuItem>
                                <MenuItem value={30}>Course reading lists</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button size={'large'} variant="contained" color={'primary'}>
                            <SearchIcon />
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={2} style={{ marginBottom: 24 }}>
                    <Grid item className={classes.searchUnderlinks}>
                        <a href="#">Search help</a>
                    </Grid>
                    <Grid item className={classes.searchUnderlinks}>
                        <a href="#">Browse search</a>
                    </Grid>
                    <Grid item className={classes.searchUnderlinks}>
                        <a href="#">Advanced search</a>
                    </Grid>
                    <Grid item xs />
                </Grid>

                <Grid container spacing={6}>
                    <Grid item xs={8}>
                        <div style={{ boxShadow: '0px 0px 5px rgba(0,0,0,0.2' }}>
                            <ImageGallery
                                items={images}
                                showThumbnails={false}
                                showFullscreenButton={false}
                                showPlayButton={false}
                                autoPlay
                                slideDuration={2500}
                                slideInterval={8000}
                                showBullets
                            />
                        </div>
                    </Grid>
                    <Grid item xs={4} style={{ paddingLeft: 24, paddingTop: 28 }}>
                        <Grid
                            container
                            spacing={1}
                            alignItems={'stretch'}
                            style={{ borderLeft: '1px solid #CCCCCC', paddingLeft: 24, height: '100%' }}
                        >
                            <Grid item>
                                <Typography variant={'h3'} component={'h4'} color={'primary'}>
                                    {greeting()} John
                                </Typography>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs style={{ lineHeight: '30px' }}>
                                    Current print balance <b>$12.50</b>
                                </Grid>
                                <Grid item xs={'auto'}>
                                    <ToolTip
                                        id="auth-button"
                                        title={'Manage your print balance'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <IconButton size={'small'} variant={'contained'} color={'primary'}>
                                            <PrintIcon />
                                        </IconButton>
                                    </ToolTip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs style={{ lineHeight: '30px' }}>
                                    Current/Overdue book loans <b>4 / 1</b>
                                </Grid>
                                <Grid item xs={'auto'}>
                                    <ToolTip
                                        id="auth-button"
                                        title={'Manage your book loans'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <IconButton size={'small'} variant={'contained'} color={'primary'}>
                                            <MenuBookIcon />
                                        </IconButton>
                                    </ToolTip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={3}>
                        <StandardCard
                            title={'Another panel'}
                            fullHeight
                            customTitleBgColor={'#51247A'}
                            customTitleColor={mui1theme.palette.white.main}
                            customTextColor={'rgba(0, 0, 0, 0.87)'}
                        >
                            <p>This is a side panel</p>
                        </StandardCard>
                    </Grid>
                    <Grid item xs={3}>
                        <StandardCard
                            title={'Another panel'}
                            fullHeight
                            customTitleBgColor={'#51247A'}
                            customTitleColor={mui1theme.palette.white.main}
                            customTextColor={'rgba(0, 0, 0, 0.87)'}
                        >
                            <p>This is a side panel</p>
                        </StandardCard>
                    </Grid>
                    <Grid item xs={3}>
                        <StandardCard
                            title={'Another panel'}
                            fullHeight
                            customTitleBgColor={'#51247A'}
                            customTitleColor={mui1theme.palette.white.main}
                            customTextColor={'rgba(0, 0, 0, 0.87)'}
                        >
                            <p>This is a side panel</p>
                        </StandardCard>
                    </Grid>
                    <Grid item xs={3}>
                        <StandardCard
                            title={'Another panel'}
                            fullHeight
                            customTitleBgColor={'#51247A'}
                            customTitleColor={mui1theme.palette.white.main}
                            customTextColor={'rgba(0, 0, 0, 0.87)'}
                        >
                            <p>This is a side panel</p>
                        </StandardCard>
                    </Grid>
                </Grid>
            </div>
        </StandardPage>
    );
};

Index.propTypes = {
    account: PropTypes.object,
};

Index.defaultProps = {};

export default Index;
