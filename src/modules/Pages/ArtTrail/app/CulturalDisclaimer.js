import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

const CulturalDisclaimer = ({ onClose }) => {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: theme.palette.designSystem.warningYellow,
                p: { xs: 'var(--art-trail-spacing)', sm: 2.5 },
            }}
            data-testid="culturalDisclaimer"
        >
            <Grid container wrap="nowrap" alignItems="flex-start">
                <Grid xs sx={{ pt: 'var(--art-trail-spacing)' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Aboriginal and Torres Strait Islander visitors are advised that the description of the following
                        artwork may contain names of people who are deceased. Permission has been granted from the
                        family for the artwork to be shown as part of the UQ Art Collection.
                    </Typography>
                </Grid>

                <Grid sx={{ alignSelf: 'flex-start' }}>
                    <IconButton
                        aria-label="Dismiss cultural disclaimer"
                        size="large"
                        onClick={onClose}
                        sx={{
                            fontSize: '1.5rem',
                        }}
                        id="culturalDisclaimerCloseButton"
                        data-testid="culturalDisclaimerCloseButton"
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    );
};

CulturalDisclaimer.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default CulturalDisclaimer;
