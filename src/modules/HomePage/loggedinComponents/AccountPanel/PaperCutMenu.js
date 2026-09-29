import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

import { addClass, linkToDrupal, removeClass } from 'helpers/general';
import { markedPrintBalance, getTopUrl } from './Helpers';
import { dsDiscountDollarDashIcon } from './Icons';

const StyledPrintBalanceButton = styled(Button)(({ theme }) => ({
    '&[aria-expanded="true"] span': {
        // when the menu is open, the button looks hovered
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
    },
    '&:focus-visible': {
        outline: '-webkit-focus-ring-color auto 1px',
    },
    '&.panel-closed::after': {
        backgroundImage:
            // expand more icon
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z%22/%3E%3C/svg%3E')",
    },
    '&.panel-open::after': {
        backgroundImage:
            // expand less icon
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z%22/%3E%3C/svg%3E')",
    },
    '&::after': {
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '18px 26px',
        content: '""',
        display: 'inline-block',
        width: '24px',
        height: '24px',
    },
    '&:hover span': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    '&.panel-open span': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    '&:focus-within span': {
        backgroundColor: theme.palette.primary.main,
    },
    '&.panel-open:focus-within span': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    '&.panel-closed:focus-within span': {
        backgroundColor: 'white',
        color: theme.palette.primary.main,
    },
    '&.panel-closed:focus-within:hover span': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
}));

const StyledMenuList = styled(List)(({ theme }) => ({
    backgroundColor: '#fff',
    zIndex: 2,
    border: theme.palette.designSystem.border,
    paddingBlock: '20px',
    '& li': {
        fontWeight: 400,
        padding: '8px 24px',
        lineHeight: 'normal',
        '& a': {
            color: theme.palette.primary.main,
            textDecoration: 'underline',
            fontWeight: 500,
            outlineOffset: '1px',
            outlineStyle: 'auto',
            outlineWidth: '1px',
            outlineColor: 'transparent',
        },
        '&:focus-visible': {
            backgroundColor: '#fff',
            '& a': {
                outlineColor: 'blue', // '-webkit-focus-ring-color',
            },
        },
        '&:hover': {
            backgroundColor: 'inherit',
            color: 'inherit',
            '& a': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
            },
        },
        '& .MuiTouchRipple-root': {
            display: 'none', // remove mui ripple
        },
    },
    '& .MuiTouchRipple-root': {
        display: 'none', // remove mui ripple
    },
}));

export const PaperCutMenu = ({ account, printBalance, printBalanceLoading, printBalanceError }) => {
    const [menuAnchorElement, setMenuAnchorElement] = useState(null);
    const popperRef = useRef(null);

    const isOpenpapercutMenu = Boolean(menuAnchorElement);
    useEffect(() => {
        if (!!isOpenpapercutMenu) {
            const findLink = setInterval(() => {
                const firstMenuItem = document.querySelector('#papercut-menu li:first-of-type');
                /* istanbul ignore next */
                if (!!firstMenuItem) {
                    clearInterval(findLink);
                    firstMenuItem.focus();
                }
            }, 100);
        }
    }, [isOpenpapercutMenu]);

    const handleClose = () => {
        setMenuAnchorElement(null);

        const openerButton = document.getElementById('papercut-menu-button');
        !!openerButton && removeClass(openerButton, 'panel-open');
        !!openerButton && addClass(openerButton, 'panel-closed');
    };
    const handleToggle = event => {
        if (menuAnchorElement === null) {
            setMenuAnchorElement(event.currentTarget);

            const openerButton = document.getElementById('papercut-menu-button');
            !!openerButton && addClass(openerButton, 'panel-open');
            !!openerButton && removeClass(openerButton, 'panel-closed');
        } else {
            handleClose();
        }
    };
    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        const handleMouseClick = event => {
            if (
                menuAnchorElement &&
                !menuAnchorElement.contains(event.target) &&
                popperRef.current &&
                !popperRef.current.contains(event.target)
            ) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseClick);
        };
    }, [menuAnchorElement]);

    /* istanbul ignore next */
    const handlePapercutTabNextKeyDown = e => {
        if (e?.key !== 'Tab') {
            return;
        }

        e.preventDefault();

        const elementPrefix = 'papercut-item-button-';
        const elementCount = parseInt(e.target.id.replace(elementPrefix, ''), 10);
        const nextElementId = e.shiftKey
            ? `${elementPrefix}${elementCount - 1}`
            : `${elementPrefix}${elementCount + 1}`;

        let tabTo = document.getElementById(nextElementId);
        if (!tabTo) {
            handleClose();
            tabTo = document.querySelector('#papercut-menu-button');
        }
        !!tabTo && tabTo.focus();
    };

    /* istanbul ignore next */
    const handlePapercutTabOutKeyDown = e => {
        if (e?.key !== 'Tab') {
            return;
        }

        e.preventDefault();

        let tabTo;
        if (e.shiftKey) {
            const elementPrefix = 'papercut-item-button-';
            const elementCount = parseInt(e.target.id.replace(elementPrefix, ''), 10);
            const nextElementId = `${elementPrefix}${elementCount - 1}`;
            tabTo = document.getElementById(nextElementId);
        } else {
            handleClose();

            tabTo = document.getElementById('fines-and-charges-link');
            if (!tabTo) {
                tabTo = document.getElementById('training-event-detail-more-training-button');
            }
        }
        !!tabTo && tabTo.focus();
    };

    const topupAmounts = [5, 10, 20];
    return (
        <>
            <StyledPrintBalanceButton
                fullWidth
                classes={{ root: 'menuItemRoot' }}
                className={'panel-closed'}
                onClick={handleToggle}
                id={'papercut-menu-button'}
                data-testid={'papercut-menu-button'}
                data-analyticsid={'pp-papercut-tooltip'}
                title="Click to manage your print balance"
                aria-haspopup="true"
                aria-expanded={menuAnchorElement !== null ? 'true' : 'false'}
                aria-controls="papercut-menu"
                aria-label="Show/hide menu for printing topup choices"
            >
                {dsDiscountDollarDashIcon}{' '}
                <span data-testid="papercut-print-balance" data-analyticsid="papercut-accordion-label">
                    Print balance {markedPrintBalance(printBalance, printBalanceLoading, printBalanceError)}
                </span>
            </StyledPrintBalanceButton>
            <Popper
                id={'papercut-menu'}
                data-testid={'papercut-menu'}
                anchorEl={menuAnchorElement}
                open={!!menuAnchorElement}
                placement="bottom-start"
                disablePortal={false}
                modifiers={[
                    {
                        name: 'flip',
                        enabled: true,
                        options: {
                            altBoundary: true,
                            rootBoundary: 'viewport',
                            padding: 8,
                        },
                    },
                    {
                        name: 'preventOverflow',
                        enabled: true,
                        options: {
                            altAxis: true,
                            altBoundary: true,
                            tether: true,
                            rootBoundary: 'document',
                            padding: 8,
                        },
                    },
                ]}
                ref={popperRef}
            >
                <StyledMenuList>
                    {(() => {
                        if (!!printBalanceLoading) {
                            return <MenuItem>Loading...</MenuItem>;
                        } else if (!!printBalanceError || !printBalance?.email) {
                            return <MenuItem>Top up is currently unavailable - please try again later.</MenuItem>;
                        } else {
                            return topupAmounts.map((topupAmount, index) => {
                                const topUpLabel = topupAmount => 'Top up your print balance - $' + topupAmount;
                                return (
                                    <MenuItem
                                        id={`papercut-item-button-${index + 1}`}
                                        key={`papercut-item-button-${index + 1}`}
                                        data-testid={`papercut-item-button-${index + 1}`}
                                        data-analyticsid={`pp-papercut-item-button-${index + 1}`}
                                        onKeyDown={handlePapercutTabNextKeyDown}
                                    >
                                        <a href={getTopUrl(account.id, topupAmount, printBalance.email)}>
                                            {topUpLabel(topupAmount)}
                                        </a>
                                    </MenuItem>
                                );
                            });
                        }
                    })()}

                    <MenuItem
                        id={`papercut-item-button-${topupAmounts.length + 1}`}
                        data-testid={`papercut-item-button-${topupAmounts.length + 1}`}
                        data-analyticsid={`pp-papercut-item-button-${topupAmounts.length + 1}`}
                        onKeyDown={handlePapercutTabOutKeyDown}
                    >
                        <a
                            href={linkToDrupal(
                                '/library-and-student-it-help/print-scan-and-copy/your-printing-account ',
                            )}
                        >
                            More about your printing account
                        </a>
                    </MenuItem>
                </StyledMenuList>
            </Popper>
        </>
    );
};
PaperCutMenu.propTypes = {
    account: PropTypes.object,
    printBalance: PropTypes.object,
    printBalanceLoading: PropTypes.bool,
    printBalanceError: PropTypes.bool,
};

export default PaperCutMenu;
