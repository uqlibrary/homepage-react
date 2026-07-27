import React from 'react';
import PropTypes from 'prop-types';

import { Box, IconButton, Stack, Typography, styled } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const StyledPaginationRow = styled('nav')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    flexWrap: 'wrap',
}));

const StyledPaginationButton = styled('button')(() => ({
    minWidth: '2.75rem',
    height: '2.75rem',
    border: 0,
    borderRadius: '999px',
    background: 'transparent',
    color: '#1f1f1f',
    fontSize: '1.1rem',
    lineHeight: 1,
    cursor: 'pointer',
    paddingInline: '0.45rem',
    transition: 'background-color 160ms ease, color 160ms ease',
    '&:hover, &:focus-visible': {
        backgroundColor: '#efefef',
    },
    '&:focus-visible': {
        outline: '3px solid #2d7ff9',
        outlineOffset: '2px',
    },
    '&[aria-current="page"]': {
        backgroundColor: '#51247a',
        color: '#fff',
        fontWeight: 700,
    },
}));

const StyledArrowButton = styled(IconButton)(() => ({
    width: '2.75rem',
    height: '2.75rem',
    border: '1px solid #51247a',
    color: '#51247a',
    '&:hover, &:focus-visible': {
        backgroundColor: '#efefef',
    },
    '&:focus-visible': {
        outline: '3px solid #2d7ff9',
        outlineOffset: '2px',
    },
}));

const buildVisibleItems = (page, count) => {
    if (count <= 5) {
        return Array.from({ length: count }, (_, idx) => ({ type: 'page', value: idx + 1 }));
    }

    if (page <= 2) {
        return [
            { type: 'page', value: 1 },
            { type: 'page', value: 2 },
            { type: 'page', value: 3 },
            { type: 'page', value: 4 },
            { type: 'ellipsis', direction: 'forward', targetPage: 5 },
            { type: 'page', value: count },
        ];
    }

    if (page >= count - 1) {
        return [
            { type: 'page', value: 1 },
            { type: 'ellipsis', direction: 'backward', targetPage: count - 3 },
            { type: 'page', value: count - 3 },
            { type: 'page', value: count - 2 },
            { type: 'page', value: count - 1 },
            { type: 'page', value: count },
        ];
    }

    return [
        { type: 'page', value: 1 },
        { type: 'ellipsis', direction: 'backward', targetPage: Math.max(2, page - 3) },
        { type: 'page', value: page - 1 },
        { type: 'page', value: page },
        { type: 'page', value: page + 1 },
        { type: 'ellipsis', direction: 'forward', targetPage: Math.min(count - 1, page + 3) },
        { type: 'page', value: count },
    ];
};

const SpacesPagination = ({ page, count, onPageChange, totalItems, itemsPerPage }) => {
    if (!count || count < 1 || !totalItems) {
        return null;
    }

    const visibleItems = buildVisibleItems(page, count);

    const handlePageSelect = nextPage => {
        if (nextPage === page || nextPage < 1 || nextPage > count) {
            return;
        }

        onPageChange?.(nextPage);
    };

    return (
        <Stack spacing={1.5} sx={{ mt: 2.5, mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledPaginationRow aria-label="Spaces results pagination">
                    {page > 1 && (
                        <StyledArrowButton
                            onClick={() => handlePageSelect(page - 1)}
                            aria-label="Previous page"
                        >
                            <KeyboardArrowLeftIcon />
                        </StyledArrowButton>
                    )}

                    {visibleItems.map((item, idx) => {
                        if (item.type === 'page') {
                            return (
                                <StyledPaginationButton
                                    key={`page-${item.value}`}
                                    type="button"
                                    aria-label={`Page ${item.value}`}
                                    aria-current={item.value === page ? 'page' : undefined}
                                    onClick={() => handlePageSelect(item.value)}
                                >
                                    {item.value}
                                </StyledPaginationButton>
                            );
                        }

                        return (
                            <StyledPaginationButton
                                key={`ellipsis-${item.direction}-${idx}`}
                                type="button"
                                aria-label={`Skip to page ${item.targetPage}...`}
                                onClick={() => handlePageSelect(item.targetPage)}
                            >
                                ...
                            </StyledPaginationButton>
                        );
                    })}

                    {page < count && (
                        <StyledArrowButton
                            onClick={() => handlePageSelect(page + 1)}
                            aria-label="Next page"
                        >
                            <KeyboardArrowRightIcon />
                        </StyledArrowButton>
                    )}
                </StyledPaginationRow>
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
};

export default SpacesPagination;
