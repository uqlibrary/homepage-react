import React from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';

import { spacesAdminLink } from './helpers';

export const AdminButton = ({ currentPage }) => {
    const { account } = useAccountContext();
    const [anchorEl, setAnchorEl1] = React.useState(null);
    const setAnchorEl = var1 => {
        setAnchorEl1(var1);
    };
    const open = Boolean(anchorEl);

    const handleMenuClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const navigateToDashboardPage = () => {
        window.location.href = spacesAdminLink('', account);
    };

    const navigateToManageLocationsPage = () => {
        window.location.href = spacesAdminLink('/manage/locations', account);
    };

    return (
        <>
            <IconButton
                color="primary"
                aria-controls={open ? 'admin-spaces-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : 'false'}
                onClick={handleMenuClick}
                data-testid="admin-spaces-menu-button"
                id="admin-spaces-menu-button"
                aria-label="Admin menu"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="admin-spaces-menu"
                data-testid="admin-spaces-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'admin-spaces-menu-button',
                }}
                sx={{ backgroundColor: 'white' }}
            >
                {currentPage !== 'dashboard' && (
                    <MenuItem
                        onClick={() => {
                            navigateToDashboardPage();
                            /* istanbul ignore next */
                            handleMenuClose();
                        }}
                        data-testid="admin-spaces-visit-dashboard-button"
                    >
                        Dashboard
                    </MenuItem>
                )}

                {currentPage !== 'manage-locations' && (
                    <MenuItem
                        onClick={() => {
                            navigateToManageLocationsPage();
                            /* istanbul ignore next */
                            handleMenuClose();
                        }}
                        data-testid="admin-spaces-visit-manage-locations-button"
                    >
                        Manage Locations
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

AdminButton.propTypes = {
    pageTitle: PropTypes.string,
    currentPage: PropTypes.string,
};

export default React.memo(AdminButton);
