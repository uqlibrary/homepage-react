import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StyedButtonDS } from './app/SharedComponents';

import artwork from '../../../../public/images/artTrail/iphone.png';

const launchApp = () => {
    // Ensure current path ends with a slash so the browser treats it as a directory
    const currentDir = window.location.href.endsWith('/') ? window.location.href : `${window.location.href}/`;
    const width = screen.availWidth;
    const height = screen.availHeight;

    const features = `width=${width},height=${height},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,noopener,noreferrer`;
    const targetUrl = new URL('app', currentDir).href;
    window.open(targetUrl, '_blank', features);
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
                        alt="An illustration of the Indigenous Art and Library Discovery Trail on a mobile device"
                        sx={{
                            width: '20%',
                            height: 'auto',
                            justifySelf: 'flex-start',
                            aspectRatio: '456 / 914',
                            display: { xs: 'none', md: 'block' },
                        }}
                    />
                    <Box sx={{ justifySelf: 'flex-end', px: 2, py: { xs: 4, sm: 1 } }}>
                        <Box
                            component="h1"
                            sx={{
                                mt: 0,
                                fontWeight: 300,
                                color: '#51247A',
                                overflowWrap: 'break-word!important',
                                maxWidth: '1200px',
                                width: '90%',
                                marginTop: '12px',
                                marginBottom: '0',
                                padding: '0',
                                fontSize: '2.125rem',
                                lineHeight: 1.235,
                                letterSpacing: '0.00735em',
                            }}
                        >
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
                            onClick={launchApp}
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

export default React.memo(ArtTrail);
