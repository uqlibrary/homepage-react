import React from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import GradeIcon from '@mui/icons-material/Grade';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { standardText } from 'helpers/general';

import { spacesAdminLink } from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& div:not([aria-hidden="true"])': {
        backgroundColor: '#fff',
        border: '1px solid #dcdcdd',
        boxShadow: 'none',
    },
    '& li': {
        ...standardText(theme),
    },
    '& span:not(.clickable)': {
        fontWeight: 'bold',
    },
    '& li:hover': {
        backgroundColor: '#fff',
        '& span:not(.clickable)': {
            cursor: 'default',
        },
        '& span.clickable': {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            textDecoration: 'underline',
        },
        '& .MuiTouchRipple-root': {
            display: 'none', // remove mui ripple
        },
    },
}));

export const AdminButton = ({ currentPage }) => {
    const { account } = useAccountContext();
    const [anchorEl, setAnchorEl1] = React.useState(null);
    const setAnchorEl = var1 => {
        setAnchorEl1(var1);
    };
    const open = Boolean(anchorEl);

    const openMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleMenuOpenClose = e => {
        !!open ? closeMenu() : openMenu(e);
    };

    const icon = isCurrent =>
        isCurrent ? (
            <GradeIcon fontSize={'small'} style={{ paddingRight: '0.3rem', marginBottom: '2px' }} />
        ) : (
            <ArrowForwardIcon fontSize={'small'} style={{ paddingRight: '0.3rem' }} />
        );

    return (
        <>
            <IconButton
                color="primary"
                aria-controls={open ? 'admin-spaces-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : 'false'}
                onClick={handleMenuOpenClose}
                onKeyDown={handleMenuOpenClose}
                data-testid="admin-spaces-menu-button"
                id="admin-spaces-menu-button"
                aria-label="Admin menu"
            >
                <MenuIcon />
            </IconButton>
            <StyledMenu
                id="admin-spaces-menu"
                data-testid="admin-spaces-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                placement="bottom-end"
                MenuListProps={{
                    'aria-labelledby': 'admin-spaces-menu-button',
                }}
            >
                <MenuItem
                    component="a"
                    href={spacesAdminLink('/admin/spaces', account)}
                    data-testid="admin-spaces-visit-dashboard-button"
                >
                    {icon(currentPage === 'dashboard')}
                    <span className={`${currentPage !== 'dashboard' ? 'clickable' : ''}`}>Manage Spaces</span>
                </MenuItem>

                <MenuItem
                    component="a"
                    href={spacesAdminLink('/admin/spaces/manage/locations', account)}
                    data-testid="admin-spaces-visit-manage-locations-button"
                >
                    {icon(currentPage === 'manage-locations')}
                    <span className={`${currentPage !== 'manage-locations' ? 'clickable' : ''}`}>Manage Locations</span>
                </MenuItem>

                <MenuItem
                    component="a"
                    href={spacesAdminLink('/admin/spaces/add', account)}
                    data-testid="admin-spaces-visit-add-space-button"
                >
                    {icon(currentPage === 'add-space')}
                    <span className={`${currentPage !== 'add-space' ? 'clickable' : ''}`}>Add new Space</span>
                </MenuItem>

                <MenuItem
                    component="a"
                    href={spacesAdminLink('/admin/spaces/manage/facilitytypes', account)}
                    data-testid="admin-spaces-visit-manage-facilities-button"
                >
                    {icon(currentPage === 'manage-facilities')}
                    <span className={`${currentPage !== 'manage-facilities' ? 'clickable' : ''}`}>
                        Manage Facility types
                    </span>
                </MenuItem>
                <hr />
                <MenuItem
                    component="a"
                    href={spacesAdminLink('/spaces', account)}
                    data-testid="admin-spaces-visit-homepage-button"
                >
                    {icon(false)}
                    <span className="clickable">Visit public Spaces page</span>
                </MenuItem>
            </StyledMenu>
        </>
    );
};

AdminButton.propTypes = {
    pageTitle: PropTypes.string,
    currentPage: PropTypes.string,
};

export default React.memo(AdminButton);
