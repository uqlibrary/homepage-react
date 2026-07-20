import React from 'react';
import PropTypes from 'prop-types';

import { Box, Pagination, Stack, Typography, styled } from '@mui/material';

const StyledPagination = styled(Pagination)(() => ({
    width: '100%',
    '& ul': {
        justifyContent: 'center',
    },
}));

const SpacesPagination = ({ page, count, onPageChange, totalItems, itemsPerPage, siblingCount = 1 }) => {
    if (!count || count < 1 || !totalItems) {
        return null;
    }

    return (
        <Stack spacing={1.5} sx={{ mt: 2.5, mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledPagination
                    count={count}
                    page={page}
                    onChange={(_, value) => onPageChange?.(value)}
                    siblingCount={siblingCount}
                    boundaryCount={1}
                    showFirstButton
                    showLastButton
                />
            </Box>
            {!!totalItems && (
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#666' }}>
                    Showing {Math.min((page - 1) * itemsPerPage + 1, totalItems)}-{Math.min(page * itemsPerPage, totalItems)} of {totalItems} spaces
                </Typography>
            )}
        </Stack>
    );
};

SpacesPagination.propTypes = {
    page: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    totalItems: PropTypes.number,
    itemsPerPage: PropTypes.number,
    siblingCount: PropTypes.number,
};

export default SpacesPagination;
