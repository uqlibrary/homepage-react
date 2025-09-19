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

    const openMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    function navigateToPage(spacesPath) {
        window.location.href = spacesAdminLink(spacesPath, account);
    }

    return (
        <>
            <IconButton
                color="primary"
                aria-controls={open ? 'admin-spaces-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : 'false'}
                onClick={openMenu}
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
                onClose={closeMenu}
                MenuListProps={{
                    'aria-labelledby': 'admin-spaces-menu-button',
                }}
                sx={{ backgroundColor: 'white' }}
            >
                <MenuItem
                    onClick={() => {
                        currentPage !== 'dashboard' && navigateToPage('');
                        /* istanbul ignore next */
                        currentPage !== 'dashboard' && closeMenu();
                    }}
                    data-testid="admin-spaces-visit-dashboard-button"
                >
                    Dashboard
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        currentPage !== 'manage-locations' && navigateToPage('/manage/locations');
                        /* istanbul ignore next */
                        currentPage !== 'manage-locations' && closeMenu();
                    }}
                    data-testid="admin-spaces-visit-manage-locations-button"
                >
                    Manage Locations
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        currentPage !== 'add-space' && navigateToPage('/add');
                        /* istanbul ignore next */
                        currentPage !== 'add-space' && closeMenu();
                    }}
                    data-testid="admin-spaces-visit-add-space-button"
                >
                    Add new Space
                </MenuItem>
            </Menu>
        </>
    );
};

AdminButton.propTypes = {
    pageTitle: PropTypes.string,
    currentPage: PropTypes.string,
};

export default React.memo(AdminButton);
