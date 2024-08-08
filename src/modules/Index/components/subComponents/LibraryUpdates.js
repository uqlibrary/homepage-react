import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const LibraryUpdates = () => {
    return (
        <StandardPage>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography component={'h2'} sx={{ marginTop: '1em', fontSize: '24px', fontWeight: 500 }}>
                        Library updates
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }}>wide item</StandardCard>
                </Grid>
                <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }}>item 2</StandardCard>
                </Grid>
                <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }}>item 3</StandardCard>
                </Grid>
                <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
                    <StandardCard style={{ border: '1px solid #d1d0d2' }}>item 4</StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default LibraryUpdates;
