import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { AdminButton } from 'modules/Pages/Admin/BookableSpaces/AdminButton';

const StyledTableHeadingTypography = styled(Typography)(({ theme }) => ({
    marginLeft: '1.5rem',
    marginTop: '1rem',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        marginLeft: '1rem',
    },
}));
const StyledBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '1rem',
    paddingBottom: '1rem',
}));

export const HeaderBar = ({ pageTitle, currentPage }) => {
    return (
        <StyledBox>
            <StyledTableHeadingTypography
                component={'h2'}
                variant={'p'}
                id="tableDescriptionElement"
                data-testid="admin-spaces-page-title"
            >
                {pageTitle}
            </StyledTableHeadingTypography>
            <AdminButton currentPage={currentPage} />
        </StyledBox>
    );
};

HeaderBar.propTypes = {
    pageTitle: PropTypes.string,
    currentPage: PropTypes.string,
};

export default React.memo(HeaderBar);
