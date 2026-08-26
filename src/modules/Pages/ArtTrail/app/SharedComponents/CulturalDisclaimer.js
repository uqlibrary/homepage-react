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
                <Grid xs>
                    <IconButton
                        aria-label="Dismiss cultural disclaimer"
                        size="medium"
                        onClick={onClose}
                        sx={{
                            fontSize: '1.5rem',
                            float: 'right',
                            pt: 0,
                            pr: 0,
                            mt: '-5px',
                            mr: '-5px',
                        }}
                        id="culturalDisclaimerCloseButton"
                        data-testid="culturalDisclaimerCloseButton"
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Aboriginal and Torres Strait Islander peoples are advised that the following may contain images,
                        voices or names of deceased persons in photographs, film, audio recordings or printed material.
                        <br />
                        <br />
                        Aboriginal and Torres Strait Islander material and information accessed through UQ Library may
                        be culturally sensitive for some individuals.
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

CulturalDisclaimer.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default CulturalDisclaimer;
