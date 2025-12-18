import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { AdminButton } from 'modules/Pages/Admin/BookableSpaces/AdminButton';

const StyledGrid = styled(Grid)(({ theme }) => ({
    '& .layoutTitle': {
        color: theme.palette.primary.main,
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
    '&.systemTitle': {
        marginLeft: -58,
        marginBottom: 24,
        [theme.breakpoints.down('md')]: {
            marginLeft: -20,
            marginBottom: 8,
        },
    },
}));
const StyledTableHeadingTypography = styled(Typography)(({ theme }) => ({
    marginTop: '1rem',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        marginLeft: '1rem',
    },
}));
const StyledBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    '& h2': {
        marginTop: 0,
    },
}));

const systemTitle = 'Spaces';

// based on StandardPage.js
export const SpacesAdminPage = ({ pageTitle, currentPageSlug, children, standardPageId }) => {
    return (
        <div className="layout-card" id={standardPageId} data-testid={standardPageId}>
            <Grid
                container
                data-testid="SpacesAdminPage"
                id="SpacesAdminPage"
                justifyContent={'flex-start'}
                spacing={0}
            >
                <StyledGrid item xs className={'systemTitle'}>
                    <Typography
                        className={'layoutTitle'}
                        component={'h1'}
                        data-testid="SpacesAdminPage-systemTitle"
                        variant={'h4'}
                    >
                        {systemTitle}
                    </Typography>
                </StyledGrid>
                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', rowGap: '2.5rem' }}>
                    <StyledBox>
                        <StyledTableHeadingTypography
                            component={'h2'}
                            variant={'p'}
                            id="tableDescriptionElement"
                            data-testid="admin-spaces-page-title"
                        >
                            {pageTitle}
                        </StyledTableHeadingTypography>
                        <AdminButton currentPageSlug={currentPageSlug} />
                    </StyledBox>

                    {children}
                </Grid>
            </Grid>
        </div>
    );
};

SpacesAdminPage.propTypes = {
    help: PropTypes.object,
    children: PropTypes.any,
    standardPageId: PropTypes.string,
    pageTitle: PropTypes.string,
    currentPageSlug: PropTypes.string,
};

export default SpacesAdminPage;
