import React from 'react';
// import { PropTypes } from 'prop-types';
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
    return (
        <StandardPage>
            <div className="layout-card">
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs>
                        <TextField
                            id="standard-basic"
                            placeholder="Search the UQ Library to find books, articles, databases, conferences and more..."
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
                            <InputLabel id="demo-simple-select-label">Search within</InputLabel>
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

                <Grid container spacing={2}>
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
                    <Grid item xs={4}>
                        <StandardCard title={'Side'} fullHeight>
                            <p>This is a side panel</p>
                        </StandardCard>
                    </Grid>
                </Grid>
            </div>
        </StandardPage>
    );
};

Index.propTypes = {};

Index.defaultProps = {};

export default Index;
