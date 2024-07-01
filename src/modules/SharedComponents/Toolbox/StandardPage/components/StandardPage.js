import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledGrid = styled(Grid)(({ theme }) => ({
    '& .layoutTitle': {
        color: '#51247A',
        overflowWrap: 'break-word !important',
        maxWidth: 1200,
        width: '90%',
        marginTop: 12,
        marginBottom: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 0,
        [theme.breakpoints.down('md')]: {
            margin: '0 auto 12px auto',
        },
    },
    '&.title': {
        marginLeft: -58,
        marginBottom: 24,
        [theme.breakpoints.down('md')]: {
            marginLeft: -20,
            marginBottom: 8,
        },
    },
}));

export const StandardPage = ({ title, children }) => {
    return (
        <div className="layout-card">
            <Grid justifyContent={'flex-start'} container spacing={0} data-testid="StandardPage" id="StandardPage">
                {title && (
                    <StyledGrid item xs className={'title'}>
                        <Typography
                            className={'layoutTitle'}
                            component={'h1'}
                            data-testid="StandardPage-title"
                            variant={'h4'}
                        >
                            {title}
                        </Typography>
                    </StyledGrid>
                )}
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </div>
    );
};

StandardPage.propTypes = {
    title: PropTypes.any,
    help: PropTypes.object,
    children: PropTypes.any,
};

export default StandardPage;
