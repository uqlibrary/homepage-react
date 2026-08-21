import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
// import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import { StyedButtonDS } from './app/SharedComponents';

import artwork from '../../../../public/images/artTrail/iphone.png';

const openSubfolder = () => {
    // Ensure current path ends with a slash so the browser treats it as a directory
    const currentDir = window.location.href.endsWith('/') ? window.location.href : `${window.location.href}/`;

    const targetUrl = new URL('app', currentDir).href;
    console.log('Opening subfolder URL:', targetUrl);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

export const ArtTrail = () => {
    return (
        <StandardPage>
            <Grid container spacing={2}>
                <Grid
                    xs={12}
                    alignContent="space-between"
                    display="flex"
                    flexDirection="row"
                    p={{ xs: 0, sm: 2, md: 4 }}
                    gap={2}
                >
                    <Box
                        component="img"
                        src={artwork}
                        alt="Indigenous Art and Library Discovery Trail "
                        sx={{
                            width: '20%',
                            height: 'auto',
                            justifySelf: 'flex-start',
                            aspectRatio: '456 / 914',
                            display: { xs: 'none', sm: 'block' },
                        }}
                    />
                    <Box sx={{ justifySelf: 'flex-end', px: 2, py: { xs: 4, sm: 1 } }}>
                        <Box component="h1" sx={{ mt: 0 }}>
                            Welcome to the Indigenous Art and Library Discovery Trail at the University of Queensland
                            Library.
                        </Box>
                        <p>
                            This self-guided trail invites you to explore Indigenous artworks located at Duhig Library
                            and Central Library on UQ's St Lucia campus. In addition to learning more about the artists
                            and their works, you'll also discover related Aboriginal and Torres Strait Islander stories
                            held and cared for within the library.
                        </p>
                        <StyedButtonDS
                            onClick={openSubfolder}
                            data-testid="launch-webapp-button"
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Launch Web App
                        </StyedButtonDS>
                    </Box>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default ArtTrail;
