import React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

const StyledWrapper = styled('div')(({ theme }) => ({
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
}));

export function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = event => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = event => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = event => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = event => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <StyledWrapper>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page" size="large">
                {theme.direction === 'rtl' ? /* istanbul ignore next */ <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page" size="large">
                {theme.direction === 'rtl' ? /* istanbul ignore next */ <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                size="large"
            >
                {theme.direction === 'rtl' ? /* istanbul ignore next */ <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
                size="large"
            >
                {theme.direction === 'rtl' ? /* istanbul ignore next */ <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </StyledWrapper>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
